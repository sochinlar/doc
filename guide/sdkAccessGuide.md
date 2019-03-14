# 第三方应用接入
&emsp;&emsp;Lantrue物联网平台提供SDK给第三方应用，用于接收平台推送的设备发送的消息

##  v1.3.4 

### 1. BUG修复

+ 用新的机制改善重连机制

+ 查询接口使用TCP通道
    + 启动后或重连上之后sdk自动查询失败消息数及自动拉取未送达消息
```
    产品还未接收的消息统计：[UnreachedCountDTO{appId='NyjTCPDevice001', count=0}, UnreachedCountDTO{appId='NyjAppMqttTest', count=0}, UnreachedCountDTO{appId='NyjAppUdpTest', count=2}]
```
   + 拉取消息
```
消息内容：[{receiveTime=1548033025000, payload=hahah, id=1087155418508742656, deviceId=DeviceUdp001}, {receiveTime=1548033086000, payload=hahah, id=1087155675661520896, deviceId=DeviceUdp001}]
```   
   
### 2. 消息发送说明

+ 消息发送后会由sdk返回一个消息ID： long msgId = subscribeClient.singleSend(CommandReqDTO));   
+ 当emc收到之后，会回复给SDK客户端一个回调信息（ 重写 AbstractMessageHandler 的 commandRes(CommandResDTO res)）
```java
public class CommandResDTO {
    /**结果码,*/
    private String code;
    /**信息描述*/
    private String desc;
    /**目标设备ID*/
    private String deviceId;
    /**指令消息，code！=200时 会把command原路返回,code =200,则为空*/
    private String command;
    /**指令ID,就是subscribeClient.singleSend() 返回的ID*/
    private Long msgId;
}
```
+ 如果code="200"，则表明EMC已正常接收且进行了转发动作，如果code !="200" 说明消息本身有误，错误说明见desc。对于没有回调的消息，说明EMC没收到。
如  subscribeClient.singleSend(CommandReqDTO) 返回1000000，但commandRes（）始终没有收到此msgId=1000000的回调信息，说明EMC没收到

### 功能优化

+ 新增配置  subscribe.client.grep-size
    用来设置启动时拉取数据每页大小，以防停机时间长，数据累计过多，一次拉取消息条数过多导致tcp通道读取数据超长异常。
    估算方法：假设每条数据10000，而配置的 subscribe.client.max-frame-length=102400。 102400/10000 = 10 ，由于传输本身会带有其它信息会占长度，所以最大只能约为9
    假设每条数据1000，而配置的 subscribe.client.max-frame-length=102400。 102400/10000 = 100 ，由于传输本身会带有其它信息会占长度，所以最大只能约为90

+ sdk应答消息放在客户端消息处理完成之后
    SDK接收到消息，先调用onMessage()将消息交给客户端处理，待客户端用户把数据处理完成之后，SDK再向服务端应答消息。假如客户端在处理消息时出现异常导致程序终止，
    或者处理期间服务重启，那么SDK不会应答接收信息。待客户端重启或者手动调用抓取信息接口能再次消费消息


### 使用步骤

+ 添加依赖 
+ 添加配置属性
+ 启动类添加@EnableSubscribeClient
+ 添加实现消息处理类AbstractMessageHandler,如果没有，则使用默认的处理类，只打印消息
+ @Autowired 获取SubscribeClient对象，调用指令发送方法等

#### 1. 添加依赖 
```
    <dependency>
        <groupId>com.whxx</groupId>
        <artifactId>emc-sdk</artifactId>
        <version>1.3.4</version>
    </dependency>
```

#### 2. 添加配置属性
+ 客户端订阅配置 application.yml
```
subscribe:
  server:
    #服务端ip 测试机
    ip: 192.168.185.57
	#服务端ip 正式机
    #ip: 111.47.243.211
    #服务端端口，默认9765
    port: 9765
  client:
    #用户名
    username: NYJ
    #订阅主题，数组形式配置springboot2.0及以上
    app-and-secrets:
      - NyjAppUdpTest/errorSecret
      - notExist/random
	#订阅主题，数组形式配置springboot2.0以下
	#app-and-secrets: appID1/appsecret1,appId2/appsecret2
    #是否启用连接，默认启用
    open: true
    #断开重连时间间隔 单位：秒，默认1
    reconnect-delay: 1 
```
+ 客户端订阅配置 application.properties
```
#测试机
subscribe.server.ip=192.168.185.57
#正式机
#subscribe.server.ip=111.47.243.211
subscribe.server.port=9765
subscribe.client.username=NYJ
#subscribe.client.app-and-secret=appID1/appsecret1,appId2/appsecret2#spring2.0以下,数组用逗号隔开
subscribe.client.app-and-secret[0]=appID1/appSecret1 #springboot2.0及以上，用下标
subscribe.client.app-and-secret[1]=appID2/appSecret2
subscribe.client.open=true #是否启用客户端默认true
subscribe.client.reconnect-delay=3 #重连时间间隔默认1，单位秒
subscribe.client.grep-size = 10 #拉取消息分页条数
```
#### 3. 启动类添加@EnableSubscribeClient
```java
@SpringBootApplication
@EnableSubscribeClient
public class EmcBridgeEspApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmcBridgeEspApplication.class, args);
    }
}
```
#### 4. 添加实现消息处理类AbstractMessageHandler,如果没有，则使用默认的处理类，只打印消息

```java

@Component
public class MyMessageHandler extends AbstractMessageHandler {
//接收消息包括 subscribeClient.getUnreceivedCount() 抓取的消息都是异步回调到次方法
    @Override
    public void onMessage(MessageDTO messageDTO) {
        log.info("收到来自应用【{}】的消息，本次接收{}条，总条数：{}",messageDTO.getProductId(),messageDTO.getTotal(),count);
        if(printMsg){
            log.info("list:{}",messageDTO.getList());
        }
    }
	//消息下发指令结果CommandResDTO中包含指令ID
	@Override
	public void commandRes(CommandResDTO res){
			
	}
}
public class CommandResDTO {
	//如果code="200"，则表明EMC已正常接收且进行了转发动作，如果code !="200" 说明消息本身有误，错误说明见desc。对于没有回调的消息，说明EMC没收到。
	//如  subscribeClient.singleSend(CommandReqDTO) 返回1000000，但commandRes（）始终没有收到此msgId=1000000的回调信息，说明EMC没收到
    /**结果码,*/
    private String code;
    /**信息描述*/
    private String desc;
    /**目标设备ID*/
    private String deviceId;
    /**指令消息，code！=200时 会把command原路返回,code =200,则为空*/
    private String command;
    /**指令ID,就是subscribeClient.singleSend() 返回的ID*/
    private Long msgId;
}
 
```


#### 5. 完成以上步骤，启动项目，即可进行订阅操作

#### 6. 下面是调用SDK发送消息到EMC服务端
```
@Component
public calss YourClass{
    @Resource
    private SubscribeClient subscribeClient;
    public void sendMsg() throws Exception{
	
		//发送消息到单个设备
        long msgId = subscribeClient.singleSend(new CommandReqDTO());
		//发送消息到多个设备
        long msgId = subscribeClient.batchSend(new CommandReqDTO());
		//获取未送达消息条数统计（sdk启动或重连成功会自动调用，一般不需要手动调用）
		subscribeClient.getUnreceivedCount()
		//将之前未送达的消息再次发送（sdk启动或重连成功会自动调用，一般不需要手动调用）
		subscribeClient。grepUnreceivedMsg()
    }
}
```

## v1.4.0

### 1. 改进

+ sdk客户端订阅产品ID不再需要用户名subscribe.client.username这一属性配置：这就意味着用户可以订阅多个多个产品，多个产品可能来自多个用户，
但不变的是，同一个产品同一时刻只能被一个客户端订阅。如果某APPID已经被订阅了，那么另一客户端订阅此APPID则会连接失败

+ 删除之前@Deprecated rest http查询消息记录接口相关的代码

### 2. 优化

+ 客户端连接：如果有相同的用户名已经连接了就不允许再次连接，以免互踢给服务端增加压力

+ 重连时间间隔默认值修改为 5 秒(原来为1秒)

+ 提供查询产品在线订阅的产品

+ 增加--客户端处理消息失败时告知服务端知晓(服务端打印客户端处理失败的消息ID warn日志)

### 3. 新增

+ 客户端查询接口（since v1.4.0）
```
      提供了用来统一查询的方法：客户端调用方调用此方法--》sdk将查询参数封装成一条查询指令通过
      tcp通道发送给服务端，服务端收到之后调用其它服务查询出结果来，再通过TCP通道将消息异步返回
      给sdk客户端，客户端收到查询结果后调用MessageHander 的apiResponse(ApiResVO apiResVO) 将
      结果交给客户端处理。
```
#### 3.1 客户端使用查询接口查询设备状态指导

```java
public class TestService{
    public void test(){
      DeviceStatusQueryVO deviceStatusQueryVO;
      // 参数组合1     没有给实际参数，则查所有订阅成功的产品的设备状态
      deviceStatusQueryVO = null;//或者 deviceStatusQueryVO = new DeviceStatusQueryVO() 
      
      // 参数组合2    给定要查询一个或多个产品的设备状态
      Set<String> appIds = new HashSet<>();
      appIds.add("appID002");//appID002 必须为已经订阅成功的产品ID
      deviceStatusQueryVO.setAppIds(appIds);
      
      // 参数组合3  查询某appID 下的某设备状态
      deviceStatusQueryVO.setAppId("appId001");//必须为已经订阅成功的产品ID
      deviceStatusQueryVO.setDeviceId("devideId001");//必须为setAppId中的产品ID下的设备ID
      
      //调用方法：
      //最终查询的结果会异步推送到   MessageHander 的apiResponse(ApiResVO apiResVO)接口中
      subscribeClient.deviceStatusQuery(deviceStatusQueryVO);
      
    }
}

@Component
@Slf4j
public class MyMessageHandler extends AbstractMessageHandler {
    @Override
    public void onMessage(MessageDTO messageDTO) {
        log.info("收到来自应用【{}】的消息，本次接收{}条",messageDTO.getProductId(),messageDTO.getTotal());
        log.info("消息内容：{}",messageDTO.getList());
    }
    @Override
    public void commandRes(CommandResDTO res) {
        log.info("指令下达结果：{}", res);
    }
    /**
    * 最终查询的结果会异步推送到此接口中
    * @param apiResVO
    *   如返回结果 apiResVO.getResult() 为  Map<String,Map<String,String>>  map<产品ID，map<设备ID，状态>> 的json数据
    *   查询名称：DEVICE_STATUS
    *   查询返回结果：【{"app001":{"device1":"ONLINE","device2":"OFFLINE"},"app002":{"device3":"NOSTATUS"}}】
    *   对于MQTT,TCP设备，会返回ONLINE/OFFLINE状态表示在线/离线状态，其它协议设备不能监测状态，用NOSTATUS表示
    */
    @Override
    public void apiResponse(ApiResVO apiResVO) {
        log.info("查询名称：{}", apiResVO.getQueryName());
        log.info("查询返回结果：【{}】", apiResVO.getResult());
    }
}
    
```