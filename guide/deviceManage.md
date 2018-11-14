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

- 点击 图中‘编辑’按钮，如图所示，可以修改设备名称,其它属性不能修改：

## 删除设备

- 点击图中‘删除’按钮，即可删除设备。

## 设备详情

### MQTT

<img :src="$withBase('/img/mqttInfo.png')" alt="addDevice">

### TCP

<img :src="$withBase('/img/tcpInfo.png')" alt="addDevice">

### UDP

<img :src="$withBase('/img/udpInfo.png')" alt="addDevice">

### CoAP

<img :src="$withBase('/img/coapInfo.png')" alt="addDevice">

## 批量导入

- 先点击`导出模板`按钮，下载模板 excel 表格。

::: warning 注意

1. 设备 id 不能为空
2. 设备 id 不能重复
3. 设备 id 不能出现数字字母以外的字符
4. 设备名称不能为空

:::

按要求填入设备 id 及名称后先保存文件。然后点击导入按钮，选择相应的应用 ID

<img :src="$withBase('/img/deviceImport.png')" alt="deviceImport">
