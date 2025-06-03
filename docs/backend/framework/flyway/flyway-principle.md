# Flyway 原理

Flyway 其实就调用了 `Flyway#migrate()` 方法来执行数据库脚本。在本节，我们来看看这个方法到底干了啥。

- `Flyway.java`

```java
public int migrate() throws FlywayException {
    return execute(new Command<Integer>() {
        public Integer execute(MigrationResolver migrationResolver,
                                SchemaHistory schemaHistory, Database database, Schema[] schemas, CallbackExecutor callbackExecutor
        ) {
            if (configuration.isValidateOnMigrate()) {
                doValidate(database, migrationResolver, schemaHistory, schemas, callbackExecutor,
                        true // Always ignore pending migrations when validating before migrating
                );
            }

            // 判断迁移历史表是否存在，不存在的话就会根据当前的数据库方言创建
            // 创建脚本在 org/flywaydb/core/internal/database/${dbType}/createMetaDataTable.sql
            new DbSchemas(database, schemas, schemaHistory).create();

            if (!schemaHistory.exists()) {
                List<Schema> nonEmptySchemas = new ArrayList<>();
                for (Schema schema : schemas) {
                    if (!schema.empty()) {
                        nonEmptySchemas.add(schema);
                    }
                }

                if (!nonEmptySchemas.isEmpty()) {
                    if (configuration.isBaselineOnMigrate()) {
                        doBaseline(schemaHistory, database, schemas, callbackExecutor);
                    } else {
                        // Second check for MySQL which is sometimes flaky otherwise
                        if (!schemaHistory.exists()) {
                            throw new FlywayException("Found non-empty schema(s) "
                                    + StringUtils.collectionToCommaDelimitedString(nonEmptySchemas)
                                    + " without schema history table! Use baseline()"
                                    + " or set baselineOnMigrate to true to initialize the schema history table.");
                        }
                    }
                }
            }

            // 进行迁移
            return new DbMigrate(database, schemaHistory, schemas[0], migrationResolver, configuration, callbackExecutor).migrate();
        }
    }, true);
}

<T> T execute(Command<T> command, boolean scannerRequired) {
    T result;

    // 打印 flyway 版本信息
    VersionPrinter.printVersion();

    if (configuration.getDataSource() == null) {
        throw new FlywayException("Unable to connect to the database. Configure the url, user and password!");
    }

    Database database = null;
    try {
        // 根据配置创建数据库实例（里面会判断应该使用哪个数据库方言）
        database = DatabaseFactory.createDatabase(configuration, !dbConnectionInfoPrinted);

        dbConnectionInfoPrinted = true;
        LOG.debug("DDL Transactions Supported: " + database.supportsDdlTransactions());

        // 获取 flyway.url 使用的 schema 
        Schema[] schemas = prepareSchemas(database);

        ResourceProvider resourceProvider;
        ClassProvider classProvider;
        if (!scannerRequired && configuration.isSkipDefaultResolvers() && configuration.isSkipDefaultCallbacks()) {
            resourceProvider = NoopResourceProvider.INSTANCE;
            classProvider = NoopClassProvider.INSTANCE;
        } else {
            // 根据配置的 locations 创建资源扫描器
            Scanner scanner = new Scanner(
                    Arrays.asList(configuration.getLocations()),
                    configuration.getClassLoader(),
                    configuration.getEncoding()
            );
            resourceProvider = scanner;
            classProvider = scanner;
        }

        // 根据数据库方言创建 SqlStatementBuilderFactory
        SqlStatementBuilderFactory sqlStatementBuilderFactory = database.createSqlStatementBuilderFactory();

        // 判断是否配置了 callbacks
        CallbackExecutor callbackExecutor = new DefaultCallbackExecutor(configuration, database, schemas[0],
                prepareCallbacks(database, resourceProvider， sqlStatementBuilderFactory)
        );

        // 进行迁移
        result = command.execute(
                // 创建 SQL 脚本解析器
                createMigrationResolver(database, resourceProvider, classProvider, sqlStatementBuilderFactory),
                // 创建 SchemaHistory 实例，用于操作迁移历史表
                SchemaHistoryFactory.getSchemaHistory(configuration, database, schemas[0]),
                database,
                schemas,
                callbackExecutor
        );
    } finally {
        if (database != null) {
            database.close();
        }
        showMemoryUsage();
    }
    return result;
}

/**
 * 获取当前使用的 schema
 */
private Schema[] prepareSchemas(Database database) {
    String[] schemaNames = configuration.getSchemas();
    if (schemaNames.length == 0) {
        Schema currentSchema = database.getMainConnection().getCurrentSchema();
        if (currentSchema == null) {
            throw new FlywayException("Unable to determine schema for the schema history table." +
                    " Set a default schema for the connection or specify one using the schemas property!");
        }
        schemaNames = new String[]{currentSchema.getName()};
    }

    if (schemaNames.length == 1) {
        LOG.debug("Schema: " + schemaNames[0]);
    } else {
        LOG.debug("Schemas: " + StringUtils.arrayToCommaDelimitedString(schemaNames));
    }

    Schema[] schemas = new Schema[schemaNames.length];
    for (int i = 0; i < schemaNames.length; i++) {
        schemas[i] = database.getMainConnection().getSchema(schemaNames[i]);
    }
    return schemas;
}
```

- `DbMigrate.java`

```java
/**
 * 执行迁移
 */
public int migrate() throws FlywayException {
    // 执行迁移前的回调
    callbackExecutor.onMigrateOrUndoEvent(Event.BEFORE_MIGRATE);

    int count;
    try {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        // 尝试创建迁移历史表，前面已经创建过了，这里其实什么都不会干
        schemaHistory.create();

        // 判断是否启用了 group 模式，如果是的话，则所有的 SQL 脚本都在一个事务中执行，否则每个 SQL 脚本单独在一个事务中执行
        count = configuration.isGroup() ?
                // When group is active, start the transaction boundary early to
                // ensure that all changes to the schema history table are either committed or rolled back atomically.
                schemaHistory.lock(new Callable<Integer>() {
                    @Override
                    public Integer call() {
                        return migrateAll();
                    }
                }) :
                // For all regular cases, proceed with the migration as usual.
                // 执行迁移
                migrateAll();

        stopWatch.stop();

        logSummary(count, stopWatch.getTotalTimeMillis());
    } catch (FlywayException e) {
        callbackExecutor.onMigrateOrUndoEvent(Event.AFTER_MIGRATE_ERROR);
        throw e;
    }

    callbackExecutor.onMigrateOrUndoEvent(Event.AFTER_MIGRATE);
    return count;
}

/**
 * 迁移所有脚本
 */
private int migrateAll() {
    int total = 0;
    while (true) {
        final boolean firstRun = total == 0;
        // 判断是否启用了 group 模式，如果启用了，就不加锁了（因为组模式会在迁移之前就加排他锁），否则加排他锁执行迁移。
        int count = configuration.isGroup()
                // With group active a lock on the schema history table has already been acquired.
                ? migrateGroup(firstRun)
                // Otherwise acquire the lock now. The lock will be released at the end of each migration.
                : schemaHistory.lock(new Callable<Integer>() {
            @Override
            public Integer call() {
                return migrateGroup(firstRun);
            }
        });
        total += count;
        if (count == 0) {
            // No further migrations available
            break;
        }
    }
    return total;
}

/**
 * 迁移单个 SQL 脚本
 */
private Integer migrateGroup(boolean firstRun) {
    MigrationInfoServiceImpl infoService = new MigrationInfoServiceImpl(
        migrationResolver, schemaHistory, configuration, configuration.getTarget(), 
        configuration.isOutOfOrder(), true, true, true, true
    );
    // 找出 locations 目录及其所有子目录下的脚本，依次解析每个脚本的内容，把每个文件的内容解析成多条 SQL 语句，然后按照文件的版本号进行升序排序     
    infoService.refresh();

    // 获取迁移历史表中版本号最大的记录
    MigrationInfo current = infoService.current();
    // 得到迁移历史表中最大的版本号
    MigrationVersion currentSchemaVersion = current == null ? MigrationVersion.EMPTY : current.getVersion();
    if (firstRun) {
        LOG.info("Current version of schema " + schema + ": " + currentSchemaVersion);

        if (configuration.isOutOfOrder()) {
            LOG.warn("outOfOrder mode is active. Migration of schema " + schema + " may not be reproducible.");
        }
    }

    MigrationInfo[] future = infoService.future();
    if (future.length > 0) {
        List<MigrationInfo> resolved = Arrays.asList(infoService.resolved());
        Collections.reverse(resolved);
        if (resolved.isEmpty()) {
            LOG.warn("Schema " + schema + " has version " + currentSchemaVersion
                    + ", but no migration could be resolved in the configured locations !");
        } else {
            for (MigrationInfo migrationInfo : resolved) {
                // Only consider versioned migrations
                if (migrationInfo.getVersion() != null) {
                    LOG.warn("Schema " + schema + " has a version (" + currentSchemaVersion
                            + ") that is newer than the latest available migration ("
                            + migrationInfo.getVersion() + ") !");
                    break;
                }
            }
        }
    }

    // 检查迁移历史表中是否有失败的记录
    MigrationInfo[] failed = infoService.failed();
    // 如果有失败的记录，则直接抛出异常，后续的迁移脚本不会被执行
    if (failed.length > 0) {
        if ((failed.length == 1)
                && (failed[0].getState() == MigrationState.FUTURE_FAILED)
                && configuration.isIgnoreFutureMigrations()) {
            LOG.warn("Schema " + schema + " contains a failed future migration to version " + failed[0].getVersion() + " !");
        } else {
            if (failed[0].getVersion() == null) {
                throw new FlywayException("Schema " + schema + " contains a failed repeatable migration (" + failed[0].getDescription() + ") !");
            }
            throw new FlywayException("Schema " + schema + " contains a failed migration to version " + failed[0].getVersion() + " !");
        }
    }

    LinkedHashMap<MigrationInfoImpl, Boolean> group = new LinkedHashMap<>();
    // 获取下一个或者下一批待执行的迁移脚本列表
    for (MigrationInfoImpl pendingMigration : infoService.pending()) {
        boolean isOutOfOrder = pendingMigration.getVersion() != null
                && pendingMigration.getVersion().compareTo(currentSchemaVersion) < 0;
        group.put(pendingMigration, isOutOfOrder);

        // 如果不是 group 模式，则只包含一个待执行的迁移脚本
        if (!configuration.isGroup()) {
            // Only include one pending migration if group is disabled
            break;
        }
    }

    // 如果配置了 group 模式，则 group 中包含了所有待执行的迁移脚本，否则只包含一个待执行的迁移脚本
    if (!group.isEmpty()) {
        // 进行脚本迁移
        applyMigrations(group);
    }
    return group.size();
}

/**
 * 迁移脚本
 */
private void applyMigrations(final LinkedHashMap<MigrationInfoImpl, Boolean> group) {
    // 判断是否需要在事务中执行迁移，绝大部分情况下，都是在事务中执行的
    boolean executeGroupInTransaction = isExecuteGroupInTransaction(group);
    final StopWatch stopWatch = new StopWatch();
    try {
        // 在事务中执行迁移
        if (executeGroupInTransaction) {
            new TransactionTemplate(connectionUserObjects.getJdbcConnection()).execute(new Callable<Object>() {
                @Override
                public Object call() {
                    // 执行迁移
                    doMigrateGroup(group, stopWatch);
                    return null;
                }
            });
        } else {
            doMigrateGroup(group, stopWatch);
        }
    } catch (FlywayMigrateException e) {
        MigrationInfoImpl migration = e.getMigration();
        String failedMsg = "Migration of " + toMigrationText(migration, e.isOutOfOrder()) + " failed!";
        // 如果该数据库支持 DDL 事务，并且是在事务中执行的迁移，则会回滚所有的更改，否则往迁移历史表中添加一条失败记录，并抛出异常。
        if (database.supportsDdlTransactions() && executeGroupInTransaction) {
            LOG.error(failedMsg + " Changes successfully rolled back.");
        } else {
            LOG.error(failedMsg + " Please restore backups and roll back database and code!");

            stopWatch.stop();
            int executionTime = (int) stopWatch.getTotalTimeMillis();
            schemaHistory.addAppliedMigration(migration.getVersion(), migration.getDescription(),
                    migration.getType(), migration.getScript(), migration.getResolvedMigration().getChecksum(), executionTime, false);
        }
        throw e;
    }
}

/**
 * 执行迁移
 */
private void doMigrateGroup(LinkedHashMap<MigrationInfoImpl, Boolean> group, StopWatch stopWatch) {
    Context context = new Context() {
        @Override
        public Configuration getConfiguration() {
            return configuration;
        }

        @Override
        public java.sql.Connection getConnection() {
            return connectionUserObjects.getJdbcConnection();
        }
    };

    for (Map.Entry<MigrationInfoImpl, Boolean> entry : group.entrySet()) {
        final MigrationInfoImpl migration = entry.getKey();
        boolean isOutOfOrder = entry.getValue();

        final String migrationText = toMigrationText(migration, isOutOfOrder);

        stopWatch.start();

        LOG.info("Migrating " + migrationText);

        connectionUserObjects.restoreOriginalState();
        connectionUserObjects.changeCurrentSchemaTo(schema);

        try {
            callbackExecutor.setMigrationInfo(migration);
            // 执行迁移前的回调
            callbackExecutor.onEachMigrateOrUndoEvent(Event.BEFORE_EACH_MIGRATE);
            try {
                // 执行迁移脚本
                migration.getResolvedMigration().getExecutor().execute(context);
            } catch (FlywayException e) {
                // 如果执行迁移脚本时发生异常，则执行迁移后的回调
                callbackExecutor.onEachMigrateOrUndoEvent(Event.AFTER_EACH_MIGRATE_ERROR);
                throw new FlywayMigrateException(migration, isOutOfOrder, e);
            } catch (SQLException e) {
                callbackExecutor.onEachMigrateOrUndoEvent(Event.AFTER_EACH_MIGRATE_ERROR);
                throw new FlywayMigrateException(migration, isOutOfOrder, e);
            }

            LOG.debug("Successfully completed migration of " + migrationText);
            callbackExecutor.onEachMigrateOrUndoEvent(Event.AFTER_EACH_MIGRATE);
        } finally {
            callbackExecutor.setMigrationInfo(null);
        }

        stopWatch.stop();
        int executionTime = (int) stopWatch.getTotalTimeMillis();

        // 脚本迁移成功之后，会往迁移历史表中添加一条成功的记录，记录该脚本的版本号、脚本名称、校验和以及执行时间（毫秒）等信息。
        schemaHistory.addAppliedMigration(migration.getVersion(), migration.getDescription(), migration.getType(),
                migration.getScript(), migration.getResolvedMigration().getChecksum(), executionTime, true);
    }
}
```

- `SqlMigrationExecutor.java`

```java
/**
 * 迁移 SQL 脚本
 */
public void execute(Context context) {
    database.createSqlScriptExecutor(new JdbcTemplate(context.getConnection()), context.getConfiguration()).execute(sqlScript);
}
```

- `DefaultSqlScriptExecutor.java`

```java
public void execute(SqlScript sqlScript) {
    // 取出脚本中的所有 SQL 语句
    List<SqlStatement> sqlStatements = sqlScript.getSqlStatements();
    // 循环每条 SQL 语句并执行
    for (int i = 0; i < sqlStatements.size(); i++) {
        SqlStatement sqlStatement = sqlStatements.get(i);
        String sql = sqlStatement.getSql();
        if (LOG.isDebugEnabled()) {
            LOG.debug("Executing " + "SQL: " + sql);
        }
        // 执行 SQL 语句
        executeStatement(jdbcTemplate, sqlScript, sqlStatement);
    }
}
```

可以发现，其实核心流程很简单。先通过 `locations` 配置的路径扫描出该目录及其所有子目录下的所有 SQL 脚本文件，然后按照脚本的版本号进行升序排序，接着依次执行每个脚本中的 SQL 语句。执行 SQL 的时候，其实会把 SQL 脚本中的每条 SQL 语句解析成 `SqlStatement` 对象（每条 SQL 就对应一个 SqlStatement 对象），然后通过 `DefaultSqlScriptExecutor` 的 `execute` 方法循环执行每条 SQL 语句。执行前会先尝试创建迁移历史表（如果不存在的话），执行完成后，会往迁移历史表中添加一条成功或者失败的记录，记录该脚本的版本号、脚本名称、校验和、执行耗时、是否执行成功等信息。

**Flyway 如何控制事务？**  

Flyway 支持在迁移脚本中使用事务，具体取决于数据库的方言和配置。默认情况下，Flyway 会为每个 SQL 脚本文件单独开一个事务，并在脚本执行成功后提交事务。如果脚本执行失败，则会回滚事务，并且终止迁移过程。如果把 `flyway.group` 配置为 `true`，则会把所有 SQL 脚本文件放在同一个事务中，并在所有脚本执行成功后才提交事务，如果有任何脚本执行失败，则会回滚整个事务。这是 Flyway 9.0 之前的行为，从 9.0 开始， Flyway 支持使用参数 `flyway.executeInTransaction` 来控制是否在事务中执行迁移脚本。

当然，这里有一个问题。如果 SQL 脚本中同时存在 DML 和 DDL 语句，Flyway 会如何处理？其实 Flyway 没有做特殊处理，仍然是按照数据库的事务特性来执行。比如在 MySQL、Oracle 中，DDL 语句会自动提交事务（不管 DDL 是否执行成功），后续即使调用了回滚事务的操作，也无法回滚 DDL 及其之前的 DML 语句的执行结果。而在 PostgreSQL 中，DDL 语句可以在事务中执行，如果 DDL 语句执行失败，则会回滚整个事务。

- `DbMigrate.java`

```java
private void applyMigrations(final LinkedHashMap<MigrationInfoImpl, Boolean> group) {
    boolean executeGroupInTransaction = isExecuteGroupInTransaction(group);
    final StopWatch stopWatch = new StopWatch();
    try {
        // 如果需要在事务中执行
        if (executeGroupInTransaction) {
            new TransactionTemplate(connectionUserObjects.getJdbcConnection()).execute(new Callable<Object>() {
                @Override
                public Object call() {
                    doMigrateGroup(group, stopWatch);
                    return null;
                }
            });
        } else { // 如果不需要在事务中执行
            doMigrateGroup(group, stopWatch);
        }
    } catch (FlywayMigrateException e) {
        MigrationInfoImpl migration = e.getMigration();
        String failedMsg = "Migration of " + toMigrationText(migration, e.isOutOfOrder()) + " failed!";
        if (database.supportsDdlTransactions() && executeGroupInTransaction) {
            LOG.error(failedMsg + " Changes successfully rolled back.");
        } else {
            LOG.error(failedMsg + " Please restore backups and roll back database and code!");

            stopWatch.stop();
            int executionTime = (int) stopWatch.getTotalTimeMillis();
            schemaHistory.addAppliedMigration(migration.getVersion(), migration.getDescription(),
                    migration.getType(), migration.getScript(), migration.getResolvedMigration().getChecksum(), executionTime, false);
        }
        throw e;
    }
}
```

- `TransactionTemplate.java`

```java
public <T> T execute(Callable<T> transactionCallback) {
    boolean oldAutocommit = true;
    try {
        // 获取当前连接
        oldAutocommit = connection.getAutoCommit();
        // 开启事务
        connection.setAutoCommit(false);
        // 执行迁移
        T result = transactionCallback.call();
        // 提交事务
        connection.commit();
        return result;
    } catch (Exception e) {
        RuntimeException rethrow;
        if (e instanceof SQLException) {
            rethrow = new FlywaySqlException("Unable to commit transaction", (SQLException) e);
        } else if (e instanceof RuntimeException) {
            rethrow = (RuntimeException) e;
        } else {
            rethrow = new FlywayException(e);
        }

        // 如果发生异常，则判断是否需要回滚事务，这里恒为 true
        if (rollbackOnException) {
            try {
                LOG.debug("Rolling back transaction...");
                connection.rollback();
                LOG.debug("Transaction rolled back");
            } catch (SQLException se) {
                LOG.error("Unable to rollback transaction", se);
            }
        } else {
            try {
                connection.commit();
            } catch (SQLException se) {
                LOG.error("Unable to commit transaction", se);
            }
        }
        throw rethrow;
    } finally {
        try {
            connection.setAutoCommit(oldAutocommit);
        } catch (SQLException e) {
            LOG.error("Unable to restore autocommit to original value for connection", e);
        }
    }
}
```

**Flyway 如何判断需要执行哪些迁移脚本？**  

默认情况下，Flyway 在每次进行迁移时，都会把迁移历史表中的所有数据都查询出来，然后在内存中保存这张表中最大的版本号。接着会扫描 `locations` 配置的路径下的所有 SQL 脚本文件，并按照脚本的版本号进行升序排序。然后会把扫描到的脚本版本号与迁移历史表中的最大版本号进行比较，只有**大于**最大版本号的脚本才会被执行。当然，我们也可以通过配置 `flyway.outOfOrder = true` 来允许执行小于最大版本号的脚本。但是，不管是哪种方式，Flyway 都只会迁移那些没有被执行过的脚本，也就是那些在迁移历史表中没有版本号记录的脚本。

**Flyway 如何保证集群环境下迁移脚本的幂等性？**  

Flyway 借助数据库实现了排他锁，每次迁移脚本之前都会尝试获取排他锁，只有获取到锁的线程才能执行迁移脚本，获取锁失败的线程会自旋。获取到锁之后，都会先从迁移历史表中查询最新所有已经迁移过的脚本，这样就可以保证在集群环境下，只有一个节点会执行迁移脚本，从而避免了脚本的重复执行问题。

- `DbMigrate.java`

```java
/**
 * 迁移所有脚本
 */
public int migrate() throws FlywayException {
    callbackExecutor.onMigrateOrUndoEvent(Event.BEFORE_MIGRATE);

    int count;
    try {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        schemaHistory.create();

        count = configuration.isGroup() ?
                // When group is active, start the transaction boundary early to
                // ensure that all changes to the schema history table are either committed or rolled back atomically.
                schemaHistory.lock(new Callable<Integer>() {
                    @Override
                    public Integer call() {
                        return migrateAll();
                    }
                }) :
                // For all regular cases, proceed with the migration as usual.
                migrateAll();

        stopWatch.stop();

        logSummary(count, stopWatch.getTotalTimeMillis());
    } catch (FlywayException e) {
        callbackExecutor.onMigrateOrUndoEvent(Event.AFTER_MIGRATE_ERROR);
        throw e;
    }

    callbackExecutor.onMigrateOrUndoEvent(Event.AFTER_MIGRATE);
    return count;
}

/**
 * 迁移所有脚本
 */
private int migrateAll() {
    int total = 0;
    while (true) {
        final boolean firstRun = total == 0;
        int count = configuration.isGroup()
                // With group active a lock on the schema history table has already been acquired.
                ? migrateGroup(firstRun)
                // Otherwise acquire the lock now. The lock will be released at the end of each migration.
                : schemaHistory.lock(new Callable<Integer>() {
            @Override
            public Integer call() {
                return migrateGroup(firstRun);
            }
        });
        total += count;
        if (count == 0) {
            // No further migrations available
            break;
        }
    }
    return total;
}
```
上面的代码有一段 `schemaHistory.lock()` 这样的逻辑，这个方法会尝试获取排他锁，只有获取到锁的线程才能执行迁移脚本。其具体实现如下：

- `JdbcTableSchemaHistory.java`
```java
@Override
public <T> T lock(Callable<T> callable) {
    connection.restoreOriginalState();
    // 这里以 MySQLConnection 为例，调用 MySQLConnection 的 lock 方法
    return connection.lock(table, callable);
}
```

- `MySQLConnection.java`

```java
@Override
public <T> T lock(Table table, Callable<T> callable) {
    if (database.isPxcStrict()) {
        return super.lock(table, callable);
    }
    // 走这个分支
    return new MySQLNamedLockTemplate(jdbcTemplate, table.toString().hashCode()).execute(callable);
}
```

- `MySQLNamedLockTemplate.java`

```java
MySQLNamedLockTemplate(JdbcTemplate jdbcTemplate, int discriminator) {
    this.jdbcTemplate = jdbcTemplate;
    // 使用迁移历史表表名的哈希值作为锁的标识符
    lockName = "Flyway-" + discriminator;
}

public <T> T execute(Callable<T> callable) {
    try {
        // 自旋加锁
        lock();
        // 执行脚本迁移
        return callable.call();
    } catch (SQLException e) {
        throw new FlywaySqlException("Unable to acquire MySQL named lock: " + lockName, e);
    } catch (Exception e) {
        RuntimeException rethrow;
        if (e instanceof RuntimeException) {
            rethrow = (RuntimeException) e;
        } else {
            rethrow = new FlywayException(e);
        }
        throw rethrow;
    } finally {
        try {
            // 解锁
            jdbcTemplate.execute("SELECT RELEASE_LOCK('" + lockName + "')");
        } catch (SQLException e) {
            LOG.error("Unable to release MySQL named lock: " + lockName, e);
        }
    }
}

/**
 * 获取锁
 */
private void lock() throws SQLException {
    // 采用自旋等待的方式获取锁
    while (!tryLock()) {
        try {
            Thread.sleep(100L);
        } catch (InterruptedException e) {
            throw new FlywayException("Interrupted while attempting to acquire MySQL named lock: " + lockName, e);
        }
    }
}

/**
 * 尝试获取锁
 */
private boolean tryLock() throws SQLException {
    // GET_LOCK 函数用于获取一个命名锁，返回值为 1 表示获取成功，0 表示获取失败
    return jdbcTemplate.queryForInt("SELECT GET_LOCK(?,10)", lockName) == 1;
}
```

**Flyway 的迁移历史表什么时候会被创建？**

Flyway 的历史记录表会在执行迁移之前被创建。具体来说，当 Flyway 执行 `migrate` 方法时，会先检查迁移历史表是否存在，如果不存在，则会根据当前数据库的方言创建该表。这个过程是在 `DbSchemas.create()` 方法中完成的。Flyway 的 jar 包中，包含了各个数据库创建迁移历史表的 SQL 脚本，这些脚本位于 `org/flywaydb/core/internal/database/${dbType}/createMetaDataTable.sql` 路径下。

**Flyway 什么时候往迁移历史表插入数据？**

当某个 SQL 脚本被成功执行后，Flyway 会立即往迁移历史表中插入一条成功的记录。当某个 SQL 脚本执行失败时，Flyway **可能**会往迁移历史表中插入一条失败的记录，并抛出异常。这样可以确保迁移历史表中的数据始终是最新的，并且可以通过迁移历史表来查看哪些脚本已经被执行过，哪些脚本执行失败了。

为什么说“失败时**可能**会往迁移历史表中插入一条失败记录”呢？这是因为在执行迁移脚本时，如果发生了异常，Flyway 会尝试回滚事务。但是如果数据库支持 DDL 事务，那么就不会往迁移历史表中插入任何记录了。

- `DbMigrate.java`

```java
/**
 * 迁移脚本
 */
private void applyMigrations(final LinkedHashMap<MigrationInfoImpl, Boolean> group) {
    // 判断是否需要在事务中执行迁移，绝大部分情况下，都是在事务中执行的
    boolean executeGroupInTransaction = isExecuteGroupInTransaction(group);
    final StopWatch stopWatch = new StopWatch();
    try {
        // 在事务中执行迁移
        if (executeGroupInTransaction) {
            new TransactionTemplate(connectionUserObjects.getJdbcConnection()).execute(new Callable<Object>() {
                @Override
                public Object call() {
                    // 执行迁移
                    doMigrateGroup(group, stopWatch);
                    return null;
                }
            });
        } else {
            doMigrateGroup(group, stopWatch);
        }
    } catch (FlywayMigrateException e) {
        MigrationInfoImpl migration = e.getMigration();
        String failedMsg = "Migration of " + toMigrationText(migration, e.isOutOfOrder()) + " failed!";
        // 如果该数据库支持 DDL 事务，并且是在事务中执行的迁移，则会回滚所有的更改，否则往迁移历史表中添加一条失败记录，并抛出异常。
        if (database.supportsDdlTransactions() && executeGroupInTransaction) {
            LOG.error(failedMsg + " Changes successfully rolled back.");
        } else {
            LOG.error(failedMsg + " Please restore backups and roll back database and code!");

            stopWatch.stop();
            int executionTime = (int) stopWatch.getTotalTimeMillis();
            schemaHistory.addAppliedMigration(migration.getVersion(), migration.getDescription(),
                    migration.getType(), migration.getScript(), migration.getResolvedMigration().getChecksum(), executionTime, false);
        }
        throw e;
    }
}

/**
 * 执行迁移
 */
private void doMigrateGroup(LinkedHashMap<MigrationInfoImpl, Boolean> group, StopWatch stopWatch) {
    Context context = new Context() {
        @Override
        public Configuration getConfiguration() {
            return configuration;
        }

        @Override
        public java.sql.Connection getConnection() {
            return connectionUserObjects.getJdbcConnection();
        }
    };

    for (Map.Entry<MigrationInfoImpl, Boolean> entry : group.entrySet()) {
        final MigrationInfoImpl migration = entry.getKey();
        boolean isOutOfOrder = entry.getValue();

        final String migrationText = toMigrationText(migration, isOutOfOrder);

        stopWatch.start();

        LOG.info("Migrating " + migrationText);

        connectionUserObjects.restoreOriginalState();
        connectionUserObjects.changeCurrentSchemaTo(schema);

        try {
            callbackExecutor.setMigrationInfo(migration);
            // 执行迁移前的回调
            callbackExecutor.onEachMigrateOrUndoEvent(Event.BEFORE_EACH_MIGRATE);
            try {
                // 执行迁移脚本
                migration.getResolvedMigration().getExecutor().execute(context);
            } catch (FlywayException e) {
                // 如果执行迁移脚本时发生异常，执行迁移后的回调
                callbackExecutor.onEachMigrateOrUndoEvent(Event.AFTER_EACH_MIGRATE_ERROR);
                throw new FlywayMigrateException(migration, isOutOfOrder, e);
            } catch (SQLException e) {
                callbackExecutor.onEachMigrateOrUndoEvent(Event.AFTER_EACH_MIGRATE_ERROR);
                throw new FlywayMigrateException(migration, isOutOfOrder, e);
            }

            LOG.debug("Successfully completed migration of " + migrationText);
            callbackExecutor.onEachMigrateOrUndoEvent(Event.AFTER_EACH_MIGRATE);
        } finally {
            callbackExecutor.setMigrationInfo(null);
        }

        stopWatch.stop();
        int executionTime = (int) stopWatch.getTotalTimeMillis();

        // 脚本迁移成功之后，会往迁移历史表中添加一条成功的记录，记录该脚本的版本号、描述、类型、脚本内容、校验和以及执行时间等信息。
        schemaHistory.addAppliedMigration(migration.getVersion(), migration.getDescription(), migration.getType(),
                migration.getScript(), migration.getResolvedMigration().getChecksum(), executionTime, true);
    }
}
```

**Flyway 往迁移历史表插入数据时，id 是如何生成的？**

其实就是获取了迁移历史表中所有的数据，取出最大的 `installed_rank`（也就是 id），然后在这个基础上加 1 作为新的 `installed_rank`。这样可以确保每次插入的记录的 `installed_rank` 都是唯一且递增的。

- `DbMigrate.java`

```java
private void doMigrateGroup(LinkedHashMap<MigrationInfoImpl, Boolean> group, StopWatch stopWatch) {
    Context context = new Context() {
        @Override
        public Configuration getConfiguration() {
            return configuration;
        }

        @Override
        public java.sql.Connection getConnection() {
            return connectionUserObjects.getJdbcConnection();
        }
    };

    for (Map.Entry<MigrationInfoImpl, Boolean> entry : group.entrySet()) {
        final MigrationInfoImpl migration = entry.getKey();
        boolean isOutOfOrder = entry.getValue();

        final String migrationText = toMigrationText(migration, isOutOfOrder);

        stopWatch.start();

        LOG.info("Migrating " + migrationText);

        connectionUserObjects.restoreOriginalState();
        connectionUserObjects.changeCurrentSchemaTo(schema);

        try {
            callbackExecutor.setMigrationInfo(migration);
            callbackExecutor.onEachMigrateOrUndoEvent(Event.BEFORE_EACH_MIGRATE);
            try {
                migration.getResolvedMigration().getExecutor().execute(context);
            } catch (FlywayException e) {
                callbackExecutor.onEachMigrateOrUndoEvent(Event.AFTER_EACH_MIGRATE_ERROR);
                throw new FlywayMigrateException(migration, isOutOfOrder, e);
            } catch (SQLException e) {
                callbackExecutor.onEachMigrateOrUndoEvent(Event.AFTER_EACH_MIGRATE_ERROR);
                throw new FlywayMigrateException(migration, isOutOfOrder, e);
            }

            LOG.debug("Successfully completed migration of " + migrationText);
            callbackExecutor.onEachMigrateOrUndoEvent(Event.AFTER_EACH_MIGRATE);
        } finally {
            callbackExecutor.setMigrationInfo(null);
        }

        stopWatch.stop();
        int executionTime = (int) stopWatch.getTotalTimeMillis();

        // 往迁移历史表中添加一条成功的记录，记录该脚本的版本号、描述、类型、脚本内容、校验和以及执行时间（毫秒）信息。
        schemaHistory.addAppliedMigration(migration.getVersion(), migration.getDescription(), migration.getType(),
                migration.getScript(), migration.getResolvedMigration().getChecksum(), executionTime, true);
    }
}
```

- `SchemaHistory.java`

```java
public final void addAppliedMigration(MigrationVersion version, String description, MigrationType type,
                                        String script, Integer checksum, int executionTime, boolean success) {
    // 这里的 installedRank 是一个整数值，表示该迁移记录在迁移历史表中的顺序（其实就是 id）
    int installedRank = type == MigrationType.SCHEMA ? 0 : calculateInstalledRank();
    doAddAppliedMigration(
            installedRank,
            version,
            AbbreviationUtils.abbreviateDescription(description),
            type,
            AbbreviationUtils.abbreviateScript(script),
            checksum,
            executionTime,
            success);
}

/**
 * Calculates the installed rank for the new migration to be inserted.
 * 计算迁移历史表的下一个 installedRank（也就是 id）
 * @return The installed rank.
 */
private int calculateInstalledRank() {
    // 见 JdbcTableSchemaHistory 的 allAppliedMigrations 方法
    List<AppliedMigration> appliedMigrations = allAppliedMigrations();
    if (appliedMigrations.isEmpty()) {
        return 1;
    }
    return appliedMigrations.get(appliedMigrations.size() - 1).getInstalledRank() + 1;
}
```

- `JdbcTableSchemaHistory.java`

```java
@Override
public List<AppliedMigration> allAppliedMigrations() {
    if (!exists()) {
        return new ArrayList<>();
    }

    refreshCache();
    return cache;
}

private void refreshCache() {
    // 查询迁移历史表的所有数据
    int maxCachedInstalledRank = cache.isEmpty() ? -1 : cache.getLast().getInstalledRank();

    // 最终生成的 SQL 其实是 SELECT * FROM `mytest`.`MY_SCHEMA_HISTORY` WHERE `installed_rank` > ${maxCachedInstalledRank} ORDER BY `installed_rank`
    String query = database.getSelectStatement(table, maxCachedInstalledRank);

    try {
        cache.addAll(jdbcTemplate.query(query, new RowMapper<AppliedMigration>() {
            public AppliedMigration mapRow(final ResultSet rs) throws SQLException {
                Integer checksum = rs.getInt("checksum");
                if (rs.wasNull()) {
                    checksum = null;
                }

                return new AppliedMigration(
                        rs.getInt("installed_rank"),
                        rs.getString("version") != null ? MigrationVersion.fromVersion(rs.getString("version")) : null,
                        rs.getString("description"),
                        MigrationType.valueOf(rs.getString("type")),
                        rs.getString("script"),
                        checksum,
                        rs.getTimestamp("installed_on"),
                        rs.getString("installed_by"),
                        rs.getInt("execution_time"),
                        rs.getBoolean("success")
                );
            }
        }));
    } catch (SQLException e) {
        throw new FlywaySqlException("Error while retrieving the list of applied migrations from Schema History table "
                + table, e);
    }
}
```

**如果迁移历史表存在迁移失败的记录，Flyway 会如何处理？**

如果迁移历史表中存在迁移失败的记录，Flyway 会在执行迁移之前直接抛出异常，并不会执行任何迁移脚本。
