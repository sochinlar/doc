# 第三方应用接入sdk
&emsp;&emsp;Lantrue物联网平台提供SDK给第三方应用，用于接收平台推送的设备发送的消息
<a href="https://github.com/yandixuan/doc/raw/master/.vuepress/public/files/emc-sdk-1.4.2.jar" download>点击下载emc-sdk-1.4.2.jar</a>


## v1.4.2

### 1 产品绑定第三方配置

+ 进入平台管理系统-产品管理页面，点击操作列的第三方配置图标<img :src="$withBase('/img/bind.png')" alt="bind">
+ 选择SDK转发方式(上下线通知可按需求勾选)，确定保存

### 2 应用端使用SDK

+ 添加依赖 
+ 添加配置属性
+ 启动类添加@EnableSubscribeClient
+ 添加实现消息处理类AbstractMessageHandler,如果没有，则使用默认的处理类，只打印消息
+ @Autowired 获取SubscribeClient对象，调用指令发送方法等


#### 2.1 添加依赖 

```xml
    <dependency>
        <groupId>com.whxx</groupId>
        <artifactId>emc-sdk</artifactId>
        <version>1.4.2</version>
    </dependency>
```

#### 2.2 配置文件 application.yml

+ 最简配置
```yaml
subscribe:
  server:
    ip: 10.10.0.75
    port: 9765
  client:
    app-and-secrets:
      - yourAppId/yourAppSecret
```

+ 所有配置
```yaml
subscribe:
  server:
    #服务端ip，
    ip: 10.10.0.75
    #服务端端口，默认9765
    port: 9765
  client:
    #订阅主题，数组形式配置
    app-and-secrets:
    # - 产品Id/产品密钥
      - yourAppId/yourAppSecret
    #接收最大数据大小，默认102400
    #max-frame-length: 102400
    #一条消息结束的结束符号，默认 $$,与服务端一致不建议修改
    #line-separator: $$
    #编码方式 默认UTF-8 与服务端一致不建议修改
    #charset-name: UTF-8
    #心跳间隔时间 默认60s
    #heartbeat-time: 60000
    #连接成功是否自动拉取未送达消息，默认：false
    #auto-grep-data: false
    #重连时间间隔时间,默认5（单位：秒）
    #reconnect-delay: 5
    #抓取消息每页条数(默认每页20 条,至少10)
    #grep-size: 20
    #项目启动时如果注解启用了客户端，open为true则自动连接，false不连接
```

#### 2.3 启动类添加@EnableSubscribeClient
```java
@SpringBootApplication
@EnableSubscribeClient
public class EmcBridgeEspApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmcBridgeEspApplication.class, args);
    }
}
```

#### 2.4 添加实现消息处理类AbstractMessageHandler,如果没有，则使用默认的处理类，只打印消息
     
```java

@Component
public class MyMessageHandler extends AbstractMessageHandler {
  //设备发送的消息
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
      log.info("指令下达结果：{}",res);
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
  //服务器推送的设备上下线消息
  @Override
  public void deviceOnOff(DeviceOnOffDTO deviceOnOffDTO){
      log.info("设备【{}】上下线【{}】",deviceOnOffDTO.getDeviceId(),deviceOnOffDTO.getEvent());
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
     /**指令ID,就是subscribeClient.singleSend() 返回的ID,平台内部不会记录此ID，只回复时用*/
     private Long msgId;
 }
 
 public class DeviceOnOffDTO {
    /**产品ID*/
     private String productId;
     /**设备ID*/
     private String deviceId;
     /**上下线等事件  上线 ON 下线 OFF*/
     private String event;
     /**事件时间 时间戳*/
     private Long eventTime;
     //getter/setter...
}
  
 ```

#### 2.5 完成以上步骤，启动项目，即可进行订阅操作

#### 2.6 下面是调用SDK发送消息到EMC服务端
```java
@Component
public class YourClass{
    @Resource
    private SubscribeClient subscribeClient;
    public void sendMsg() throws Exception{
	
		//发送消息到单个设备
        long msgId = subscribeClient.singleSend(new CommandReqDTO());
		//发送消息到多个设备
        long msgId = subscribeClient.batchSend(new CommandReqDTO());
		//获取未送达消息条数统计（sdk启动或重连成功会自动调用，一般不需要手动调用）
		subscribeClient.getUnreceivedCount();
		//手动调用：将之前未送达的消息再次发送（如果配置auto-grep-data=true 则sdk启动或重连成功会自动调用）
		subscribeClient.grepUnreceivedMsg();
    }
}
```

#### 2.7 查询设备状态

      提供了用来统一查询的方法：客户端调用方调用此方法--》sdk将查询参数封装成一条查询指令通过
      tcp通道发送给服务端，服务端收到之后调用其它服务查询出结果来，再通过TCP通道将消息异步返回
      给sdk客户端，客户端收到查询结果后调用MessageHander 的apiResponse(ApiResVO apiResVO) 将
      结果交给客户端处理。
```java
public class TestService{
    @Resource
    private SubscribeClient subscribeClient;
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
      //apiResVO.result数据格式为 Map<String,Map<String,String>> 对应数据Map<appId,Map<deviceId,状态>>
      subscribeClient.deviceStatusQuery(deviceStatusQueryVO);
      
    }
}

public class ApiResVO {
    private QueryName queryName;
    private Object result;
}
```

### 3 其他补充说明

#### 3.1  拉取消息
```
消息内容：[{receiveTime=1548033025000, payload=hahah, id=1087155418508742656, deviceId=DeviceUdp001}, {receiveTime=1548033086000, payload=hahah, id=1087155675661520896, deviceId=DeviceUdp001}]
```

#### 3.2 未送达消息统计查询
```
    产品还未接收的消息统计：[UnreachedCountDTO{appId='NyjTCPDevice001', count=0}, UnreachedCountDTO{appId='NyjAppMqttTest', count=0}, UnreachedCountDTO{appId='NyjAppUdpTest', count=2}]
```

#### 3.3 配置补充说明
+ subscribe.client.grep-size
    用来设置启动时拉取数据每页大小，以防停机时间长，数据累计过多，一次拉取消息条数过多导致tcp通道读取数据超长异常。
    估算方法：假设每条数据10000，而配置的 subscribe.client.max-frame-length=102400。 102400/10000 = 10 ，由于传输本身会带有其它信息会占长度，所以最大只能约为9
    假设每条数据1000，而配置的 subscribe.client.max-frame-length=102400。 102400/10000 = 100 ，由于传输本身会带有其它信息会占长度，所以最大只能约为90

+ sdk应答消息放在客户端消息处理完成之后
    SDK接收到消息，先调用onMessage()将消息交给客户端处理，待客户端用户把数据处理完成之后，SDK再向服务端应答消息。假如客户端在处理消息时出现异常导致程序终止，
    或者处理期间服务重启，那么SDK不会应答接收信息。待客户端重启或者手动调用抓取信息接口能再次消费消息
