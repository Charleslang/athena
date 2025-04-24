#!/bin/bash

WEBHOOK_URL=$WX_ROBOT_WEBHOOK_URL
CONTENT_TYPE='Content-Type: application/json'
STATUS_COLOR=$([ "${BUILD_RESULT}" == "Success" ] && echo 'info' || echo 'comment')

echo "### send message to wx，build result: ${BUILD_RESULT}"

curl "$WEBHOOK_URL" \
-H "$CONTENT_TYPE" \
-d '
  {
    "msgtype": "markdown",
    "markdown": {
      "content": "<font color=\"warning\">**【Jenkins 构建结果】**</font> \n
      > 任务序号：<font color=\"comment\">'"${BUILD_NUM}"'</font>
      > 任务名称：<font color=\"comment\">'"${JOB_NAME}"'</font>
      > 构建分支：<font color=\"comment\">'"${BUILD_BRANCH}"'</font>
      > 构建时间：<font color=\"comment\">'"${BUILD_TIME}"'</font>
      > 构建耗时：<font color=\"comment\">'"${BUILD_DURATION}"'</font>
      > 构建地址：<font color=\"comment\">[点击查看]('"${JOB_URL}"')</font>
      > 构建日志：<font color=\"comment\">[点击查看]('"${JOB_CONSOLE}"')</font>
      > 构建状态：<font color=\"'"$STATUS_COLOR"'\">**'"${BUILD_RESULT}"'**</font> \n
      > 已完成构建请确认：<@DaiJunFeng>"
    }
  }
'

echo "### send message to wx finished！"
