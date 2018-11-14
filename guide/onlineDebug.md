# 在线调试

此管理系统可以提供调试功能，完成模拟请求。如图所示：
<img :src="$withBase('/img/apiTest.png')" alt="apiTest">

- 调试接口
  - 模拟向设备单发消息：`http://iop-api.lantrue.net/recv/app/message/one`
  - 模拟向设备群发消息：`http://iop-api.lantrue.net/recv/app/message/batch`
- 请求方式:使用 POST
- Content-type:选择 application/json
- 请求头参数：
  - 消息单发 appId,deviceId,appSecret
  - 消息群发 appId,appSecret
  - 请求参数：{“payload”:”this is your message !”}
- 点击执行
- 调试结果
