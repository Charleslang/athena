# Spring Boot 整合原理

在 [快速开始](get-started.html) 中，我们已经介绍了 Flyway 的基本使用方法。现在我们来深入了解 Flyway 的工作原理。

在 Spring Boot 中，Flyway 的集成是通过 `FlywayAutoConfiguration` 类实现的，如果我们项目中引入了 Flyway 的依赖，那么这个自动配置类就会生效。

- `FlywayAutoConfiguration.java`

```java
@Configuration(proxyBeanMethods = false)
// 有 flyway 的依赖时，自动配置才生效
@ConditionalOnClass(Flyway.class)
@Conditional(FlywayDataSourceCondition.class)
// 如果配置了 spring.flyway.enabled=true，才启用 Flyway；没配置的话，默认启用
@ConditionalOnProperty(prefix = "spring.flyway", name = "enabled", matchIfMissing = true)
@AutoConfigureAfter({ DataSourceAutoConfiguration.class, JdbcTemplateAutoConfiguration.class,
		HibernateJpaAutoConfiguration.class })
@Import(DatabaseInitializationDependencyConfigurer.class)
public class FlywayAutoConfiguration {

	@Bean
	@ConfigurationPropertiesBinding
	public StringOrNumberToMigrationVersionConverter stringOrNumberMigrationVersionConverter() {
		return new StringOrNumberToMigrationVersionConverter();
	}

	@Bean
	public FlywaySchemaManagementProvider flywayDefaultDdlModeProvider(ObjectProvider<Flyway> flyways) {
		return new FlywaySchemaManagementProvider(flyways);
	}

	@Configuration(proxyBeanMethods = false)
	@ConditionalOnClass(JdbcUtils.class)
	@ConditionalOnMissingBean(Flyway.class)
	@EnableConfigurationProperties(FlywayProperties.class)
	public static class FlywayConfiguration {

        /**
         * 根据配置，往容器中放入 Flyway 的 bean
         */
		@Bean
		public Flyway flyway(FlywayProperties properties, ResourceLoader resourceLoader,
				ObjectProvider<DataSource> dataSource, @FlywayDataSource ObjectProvider<DataSource> flywayDataSource,
				ObjectProvider<FlywayConfigurationCustomizer> fluentConfigurationCustomizers,
				ObjectProvider<JavaMigration> javaMigrations, ObjectProvider<Callback> callbacks) {
			FluentConfiguration configuration = new FluentConfiguration(resourceLoader.getClassLoader());
			configureDataSource(configuration, properties, flywayDataSource.getIfAvailable(), dataSource.getIfUnique());
			checkLocationExists(configuration.getDataSource(), properties, resourceLoader);
			configureProperties(configuration, properties);
			List<Callback> orderedCallbacks = callbacks.orderedStream().collect(Collectors.toList());
			configureCallbacks(configuration, orderedCallbacks);
			fluentConfigurationCustomizers.orderedStream().forEach((customizer) -> customizer.customize(configuration));
			configureFlywayCallbacks(configuration, orderedCallbacks);
			List<JavaMigration> migrations = javaMigrations.stream().collect(Collectors.toList());
			configureJavaMigrations(configuration, migrations);
			return configuration.load();
		}

        /**
         * 放入 FlywayMigrationInitializer 的 bean
         */
		@Bean
		@ConditionalOnMissingBean
		public FlywayMigrationInitializer flywayInitializer(Flyway flyway,
				ObjectProvider<FlywayMigrationStrategy> migrationStrategy) {
			return new FlywayMigrationInitializer(flyway, migrationStrategy.getIfAvailable());
		}
	}

    // 省略其他代码
}
```

- `FlywayMigrationInitializer.java`

```java
public class FlywayMigrationInitializer implements InitializingBean, Ordered {

	private final Flyway flyway;

	private final FlywayMigrationStrategy migrationStrategy;

	private int order = 0;

	/**
	 * Create a new {@link FlywayMigrationInitializer} instance.
	 * @param flyway the flyway instance
	 */
	public FlywayMigrationInitializer(Flyway flyway) {
		this(flyway, null);
	}

	/**
	 * Create a new {@link FlywayMigrationInitializer} instance.
	 * @param flyway the flyway instance
	 * @param migrationStrategy the migration strategy or {@code null}
	 */
	public FlywayMigrationInitializer(Flyway flyway, FlywayMigrationStrategy migrationStrategy) {
		Assert.notNull(flyway, "Flyway must not be null");
		this.flyway = flyway;
		this.migrationStrategy = migrationStrategy;
	}

    /**
     * 执行 Flyway 的迁移操作
     */
	@Override
	public void afterPropertiesSet() throws Exception {
		if (this.migrationStrategy != null) {
			this.migrationStrategy.migrate(this.flyway);
		}
		else {
			try {
				this.flyway.migrate();
			}
			catch (NoSuchMethodError ex) {
				// Flyway < 7.0
				this.flyway.getClass().getMethod("migrate").invoke(this.flyway);
			}
		}
	}

	@Override
	public int getOrder() {
		return this.order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

}
```

其实很简单，在 `FlywayAutoConfiguration` 中，首先会根据配置往 IOC 容器中放入一个 `Flyway`、`FlywayMigrationInitializer` 的 bean。然后在 `FlywayMigrationInitializer` 的 `afterPropertiesSet` 方法中，会调用 `flyway.migrate()` 方法来执行数据库迁移。

接下来，我们研究一下 `Flyway#migrate()` 方法的实现，见 [Flyway 原理](./flyway-principle.html)。
