# 生产环境

:::tip 参考
[Production [Non-]Suitability Disclaimer](https://www.rabbitmq.com/tutorials/tutorial-three-java.html)
:::

在之前的一些章节中，我们一次展示一个新概念，并可能故意过度简化某些事情而忽略其它事情。例如，为了简洁起见，很大程度上省略了连接管理、错误处理、连接恢复、并发和指标收集等主题。这种简化的代码不应被视为生产就绪。

在使用您的应用程序之前，请先查看其余[文档](https://www.rabbitmq.com/documentation.html)。我们特别推荐以下指南：[Publisher Confirms and Consumer Acknowledgements](https://www.rabbitmq.com/confirms.html)、[Production Checklist](https://www.rabbitmq.com/production-checklist.html)、[Monitoring](https://www.rabbitmq.com/monitoring.html)。
