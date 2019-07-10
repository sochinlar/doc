# 第三方应用接入http
&emsp;&emsp;Lantrue物联网平台提供http回调，用于将设备消息通过http方式推送给第三方应用。

## 产品绑定第三方配置

+ 进入平台管理系统-产品管理页面，点击操作列的第三方配置图标<img :src="$withBase('/img/bind.png')" alt="bind">
+ 选择http转发方式(上下线通知可按需求勾选)，填写您的回调接口（平台会以GET方式请求该地址，并携带token参数，url需要将token原值返回给平台，从而验证地址的可用性。
真正的设备消息回以POST方式推送到该地址），信息填完后确认保存。

##  设备上行消息

+ 平台推送消息到第三方：通过调用用户填写的回调地址推送消息

### 设备发送的消息
```json
{
    "total":1,  
    "productId":"testAppid",
    "event":"BIZ",//BIZ代表设备发出的消息
    "eventTime":10347234078,
    "list":[
        {
            "receiveTime":1562557066027,
            "payload":"[125205]Msg from MqttDeviceTest7",
            "id":"1148073660634144768",
            "deviceId":"MqttDeviceTest7"
        }
    ]
}
```

### 平台推送的设备上下线通知消息
```json
{
    "productId":"testAppid",
    "event":"ON",//ON设备上线，OFF设备下线
    "eventTime":10347234078,
    "deviceId":"youdeviceID"
}
```

### 建议

+ 建议用户回调接口中参数解析格式为以下，可以兼容设备发送消息及上下线消息，根据event来判断消息类型从而做出不同的处理
```json
{
    "total":1, //event为BIZ时list的大小
    "productId":"testAppid",  //产品ID
    "deviceId":"deviceId", //设备ID
    "event":"BIZ",  //消息类型
    "eventTime":10347234078, //消息时间
    "list":[
        {
            "receiveTime":1562557066027,  //平台接收到消息的时间
            "payload":"[125205]Msg from MqttDeviceTest7", //设备发出的消息内容
            "id":"1148073660634144768",  //消息ID（此ID在平台有记录）
            "deviceId":"MqttDeviceTest7" //设备ID
        }
    ]
}
```
## 应用下发指令

+ 第三方平台推送消息到设备：通过调用平台提供的接口将指令消息推送给指定设备

### 消息单发
    说明：消息单发能够将消息发到指定唯一设备ID上。
    调用接口：http://iot-api.lantrue.net/recv/app/message/one
    请求方式：post
    请求头  ：必要参数
          appId(应用ID)
          deviceId(设备ID)
          appSecret(应用密钥:产品密钥或者密钥管理下设备绑定的密钥)；
          Content-Type(固定使用application/json)
    负载参数：
          payload(必须使用此参数名称)
          
    消息必须以json格式发送
    如：{“payload”:”this is your message”}

### 消息群发

    说明：消息群发能将消息发送到指定应用ID下的所有设备上
    调用接口：http://iot-api.lantrue.net/recv/app/message/batch
    请求方式：post
    请求头  ：必要参数
        appId(应用ID)
        appSecret(应用密钥：图2.2-1 页面中对应应用的默认密钥)
        Content-Type(固定使用application/json)
    负载参数：
        payload(必须使用此参数名称)
        
    消息必须以json格式发送
    如：{“payload”:”this is your message”}
