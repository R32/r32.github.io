---

layout: post
title:  datatime(时区处理)
date:   2015-3-17 06:55:23
categories: haxelib

---

haxe 标准库的 Date 类不能处理时区(timezone), 返回的总是当前时区,相对于 Flash或JS, haxe 的 Date 没有 相关的 UTC 方法.
**而 Datetime 的方法全部都是通过时区(UTC)方法**.

datetime 的源码地址为: <https://github.com/RealyUniqueName/DateTime>

<!-- more -->


### 简介

* DateTime 是基于 float(32位)的抽像(abstract)类

* 支持日期从 公元 1 年到 公元 16 777 215年(也许更多).

* DateTime 完全跨平台,因由是由纯(pure)　haxe　代码实现.

* 性能: 取决于指定平台，可以比标准的 Date 快 7倍或 慢 10倍.

* datetime.getTime() 不包含微秒(milliseconds) , 这是由于32位float的存储关系

* datetime 使用的月份值是从 1~12,而不是 0~11;

#### 重要

就是这个类容易和标准库带的 Date 类的时间值混淆, 因为虽然 `now().getTime()` 返回的时间戳值一至,

但是 DateTime 库的 toString, getHour 等等这些方法却没有切换为本地时间.

* 标准库的时间戳值同样以 UTC 为准, 但是在调用方法时会自动转换成本地时间, 包括接受参数

* 如果你使用 JS/AS3 的话, 那个这个库的方法和带 UTC 前缀的方法返回的值一致

  > 如: `dt.getHour() == date.getUTCHours() && dt.getTime() == date.getTime()`

* 示例: `DT.local().utc().getTime() == Date.now().getTime()`

因此结论是如果使用了 DateTime 则不要使用标准库的 Date了,反之亦然。 否则容易混淆, 特别是你比较二个日期的值时

### API

原项目API文档: <http://doc.stablex.ru/datetime/index.html>

#### DateTime


#### TimeZone

Datetime 使用 IANA timezone database用于处理 时区  <http://www.iana.org/time-zones>

本地时区检测代码移植于JS库的 jstimezonedetect , 地址为: <https://bitbucket.org/pellepim/jstimezonedetect>.
注意: 查看JS库的Readme了解一些限制

##### TimeZone database

全部 TimeZone database 代码大小为 116K.

除非在代码中引用 TimeZone 类,否则这个库不会编译到结果，但是你仍然可以通过 DateTime.local() 得到本地时区时间.

由于 timezones 每年将会改变多次,因为不同国家的各种历法, 也许你需要更新 timezone database,
通过使用 `haxelib run datetime`

#### DateTimeInterval


### 最新改动

* `datetime.TimeZone.get(zoneName)` - 现在返回 null,如果 zoneName 不符合 IANA 时区名称

* `datetime.Timezone.getZonesList(): Array<String>` - 返回时区名称列表

* `datetime.DateTime.local()` - **现在已经更改为静态方法**　获得一个本地时区的 DateTime 实例

* `datetime.DTMonth`  - 新的 enum,包含月份列表

* `datetime.DateTime.monthStart()` - 现已为 private 方法. 使用 `getMonthStart(month:DTMonth):DateTime` 替代

* `datetime.DateTime.yearStart()` - 现已为 private 方法. 使用 `snap(Year(Down)):DateTime` 替换.

* new classes which describe periods between time changes in timezone: datetime.utils.pack.TZPeriod, datetime.utils.pack.DstRule. Both implement datetime.utils.pack.IPeriod

* `datetime.Timezone.getAllPeriods():Array<IPeriod>` - returns all periods between timechanges in this zone

* datetime.Timezone.getPeriodForLocal(localDateTime) : TZPeriod - returns period which contains localDateTime

* datetime.Timezone.getPeriodForUtc(utc) : TZPeriod - returns period wich contains utc

* Changed TZdata file format (reduced from 2.5Mb to 116Kb)

* Added script for 'semi-automatic' TZdata updates: haxelib run datetime


为避免混乱下边是一些参数一致的示例:

```
new Date:		2014-04-15 01:01:01 getTime: 1397494861	getHours: 1
DateTime.make:	2014-04-15 01:01:01	getTime: 1397523661	getHour: 1
// 说明标准库把输入值当成本地时间, 因此时间戳自动转换为相应的 UTC 时区
// 而 DT 库永远都是以 UTC 为基准不进行任何转换

Date.now:		2015-04-06 11:32:43 getTime: 1428291163	getHours: 11
DateTime.now:	2015-04-06 03:32:43	getTime: 1428291163	getHour: 3
// 标准库返回本地时区的Date值, 但时间戳则自转转换为 UTC 的, 在调用方法时也会自动处进时区
// 以 UTC 以基础, 不转换

Date.fromString:	2014-04-15 01:01:01 getTime: 1397494861	getHours: 1
DateTime.fromString:2014-04-15 01:01:01	getTime: 1397523661	getHour: 1
```
