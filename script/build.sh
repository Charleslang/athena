#!/bin/bash
echo "开始构建！"
pwd
npm install \
  && npm run build \
  && cd /usr/local/myapp/project/portal/athena \
  && mv dist "dist.$(date +%Y%m%d%H%M%S).bak" \
  && mv ${WORKSPACE}/docs/dist ./ \
  && curl -I -m 5 -s -w "%{http_code}\n" -o /dev/null daijunfeng.com

echo "构建完成！"
