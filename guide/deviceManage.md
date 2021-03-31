---
sidebarDepth: 3
---

# 设备管理

- 设备管理包括 设备的添加，修改，条件查询，删除，设备详情，设备调试功能。
  <img :src="$withBase('/img/deviceManage.png')" alt="deviceManage">

## 添加设备

- 点击图中‘添加设备’按钮，出现如图所示对话框，填入设备信息：
  <img :src="$withBase('/img/addDevice.png')" alt="addDevice">
  
  

## 编辑设备

- 点击 图中‘编辑’按钮图标，如图所示，可以修改设备名称,其它属性不能修改：

## 删除设备

- 点击图中‘删除’按钮，即可删除设备。

## 设备详情

### MQTT

<img :src="$withBase('/img/mqttInfo.png')" alt="addDevice">

- MQTT设备使用信息包括 用户名，密码，发布或订阅的客户端id，发布或订阅的主题
- 其它信息包括服务端地址，设备状态，所属产品等

::: warning 注意
  如果设备订阅与发布使用同一个连接，则直接使用subscribeId,如果订阅发送使用两个连接通道，则分别使用subscribeId与publishId
:::

### TCP

<img :src="$withBase('/img/tcpInfo.png')" alt="addDevice">

- TCP设备信息包括设备基本信息，TCP服务地址,设备状态等
- TCP设备连接须知:
```text
  1. TCP协议连接上服务器之后，10秒内发送注册信息。，格式为：A-{产品ID}-{设备ID}-{设备密钥}$$，
    如产id为appTEST,设备ID为deviceTest,设备密钥为deviceKey01。那么则注册发送的消息为  
    A-appTEST-deviceTest-deviceKey01$$
  2. 服务器收到注册信息返回 21$$ 表示注册成功
  3. 注册成功后需要发送心跳，推荐60秒发送一次。心跳内容为  C$$
  4. 设备收集的信息发送：注册成功后才能发送消息，其格式为 B-{设备ID}-{消息payload}$$，
    如你的设备ID为device002,某次要发送的消息内容为 temp:37，则拼接后发送消息内容为  
    B-device002-temp:37$$
  5. 服务器收到设备信息，返回 22$$ 表示接收成功
  6. 应用下发消息到设备，其消息格式为 31-xxxxx$$,xxxxx就表示你的应用下发的消息内容
  7. 更多返回码可以查看EMC物联网平台操作文档。   

```
::: warning 注意
1. 设备消息payload中禁止包含中横线 '-'
2. 心跳建议间隔时间60秒
:::

### UDP

<img :src="$withBase('/img/udpInfo.png')" alt="addDevice">

- UDP设备信息包括设备基本信息，UDP服务地址,设备状态等
- UDP设备连接须知:

```text
  1. UDP设备发送消息：直接向服务器地址发送 A-{产品ID}-{设备ID}-{设备密钥}-{消息payload}
  2. 服务器收到设备信息，返回 2000 表示接收成功
  3. 更多返回码可以查看EMC物联网平台操作文档。   
```
::: warning 注意
1. 设备消息payload中禁止包含中横线 '-'
:::

### CoAP

<img :src="$withBase('/img/coapInfo.png')" alt="addDevice">
- CoAP设备信息包括设备基本信息，CoAP服务地址等
- CoAP设备发送消息需要先获取token,再携带token作为参数发送消息。

## 批量导入

- 先点击`导出模板`按钮，下载模板 excel 表格，然后填写设备id及名称信息

<img :src="$withBase('/img/deviceTemplate.png')" alt="deviceTemplate">

::: warning 注意

1. 设备 id 不能为空
2. 设备 id 不能重复
3. 设备 id 不能出现数字字母以外的字符
4. 设备名称不能为空

:::

按要求填入设备 id 及名称后先保存文件。然后点击导入按钮，选择相应的产品ID

<img :src="$withBase('/img/deviceImport.png')" alt="deviceImport">
