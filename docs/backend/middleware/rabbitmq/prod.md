# 生产环境

:::tip 参考
[Production [Non-]Suitability Disclaimer](https://www.rabbitmq.com/tutorials/tutorial-three-java.html)
:::

在之前的一些章节中，我们每次都展示了一个新概念，并可能故意过度简化某些事情而忽略其它事情。例如，为了简洁起见，很大程度上省略了连接管理、错误处理、连接恢复、并发和指标收集等主题。然而在实际的生产环境中，我们应该考虑这些问题。

在使用应用程序之前，请先查看其余[文档](https://www.rabbitmq.com/documentation.html)。特别推荐查看以下指南：

- [Publisher Confirms and Consumer Acknowledgements](https://www.rabbitmq.com/confirms.html)
- [Production Checklist](https://www.rabbitmq.com/production-checklist.html)
- [Monitoring](https://www.rabbitmq.com/monitoring.html)
