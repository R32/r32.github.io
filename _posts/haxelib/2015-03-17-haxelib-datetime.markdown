---

layout: post
title:  datatime(时区处理)
date:   2015-3-17 06:55:23
categories: haxelib

---

haxe 标准库的 Date 类不能处理时区(timezone), 返回的总是当前时区,相对于 Flash或JS, haxe 的 Date 没有 相关的 UTC 方法.
**而 Datetime 的方法全部都是通过时区(UTC)方法**. 

datetime 的源码地址为: https://github.com/RealyUniqueName/DateTime

<!-- more -->


### 简介

 * DateTime 是基于 float(32位)的抽像(abstract)类

 * 支持日期从 公元 1 年到 公元 16 777 215年(也许更多).

 * DateTime 完全跨平台,因由是由纯(pure)　haxe　代码实现.

 * 性能: 取决于指定平台，可以比标准的 Date 快 7倍或 慢 10倍.

 * datetime.getTime() 不包含微秒(milliseconds) , 这是由于32位float的存储关系

 * datetime 使用的月份值是从 1~12,而不是 0~11;

#### 重要

除了主动调用 local(), 需要记住 DateTime 的方法全部是基于 **通用时区**

 * 因此: 如果你打算获得一个本地时间应该用: DateTime.local 而不是 DateTime.now.
	
 * 在与标准库的 Date 比较 时间戳时, 先调用 DateTime::utc, 使时区一致


### 示例

```haxe
var utc = DateTime.fromString('2014-09-19 01:37:45');
//or
var utc : DateTime = '2014-09-19 01:37:45';
//or
var utc = DateTime.fromTime(1411090665);
//or
var utc : DateTime = 1411090665;
//or
var utc = DateTime.make(2014, 9, 19, 1, 37, 45);
//or
var utc = DateTime.fromDate( Date.make(2014, 9, 19, 1, 37, 45) );
//or
var utc : DateTime = Date.make(2014, 9, 19, 1, 37, 45);

trace( utc.format('%F %T') );    // 2014-09-19 01:37:45
trace( utc.getYear() );          // 2014
trace( utc.isLeapYear() );       // false
trace( utc.getTime() );          // 1411090665
trace( utc.getMonth() );         // 9
trace( utc.getDay() );           // 19
trace( utc.getHour() );          // 1
trace( utc.getMinute() );        // 37
trace( utc.getSecond() );        // 45
trace( utc.getWeekDay() );       // 5

//find last Sunday of current month
trace( utc.getWeekDayNum(Sunday, -1) ); // 2014-09-28 00:00:00

//find DateTime of May in current year
var may : DateTime = utc.monthStart(5);
trace( may ); // 2014-05-01 00:00:00

//snap to the beginning of current month
utc.snap( Month(Down) );            // 2014-10-01 00:00:00
//snap to next year
utc.snap( Year(Up) );               // 2015-01-01 00:00:00
//find next Monday
utc.snap( Week(Up, Monday) );
//find nearest Wednesday
utc.snap( Week(Nearest, Wednesday) );

trace( utc.add(Year(1)) );       // 2014-09-19 -> 2015-09-19
trace( utc + Year(1) );          // 2014-09-19 -> 2015-09-19

trace( utc.add(Day(4)) );        // 2014-09-19 -> 2014-09-23
trace( utc += Day(4) );          // 2014-09-19 -> 2014-09-23

trace( utc.add(Minute(10)) );    // 01:37:45 -> 01:47:45
trace( utc + Minute(10) );       // 01:37:45 -> 01:47:45

trace( utc.add(Second(-40)) );   // 01:37:45 -> 01:37:05
trace( utc - Second(40) );       // 01:37:45 -> 01:37:05

trace( utc.add(Week(3)) );       // 2014-09-19 -> 2014-10-10
trace( utc + Week(3) );          // 2014-09-19 -> 2014-10-10

trace( utc.snap(Year(Down)) );           // 2014-01-01 00:00:00
trace( utc.snap(Year(Up)) );             // 2015-01-01 00:00:00
trace( utc.snap(Year(Nearest)) );        // 2015-01-01 00:00:00
trace( utc.snap(Week(Up, Wednesday)) );  // 2014-09-24 00:00:00

var utc2 : DateTime = '2015-11-19 01:37:45';
var dti  : DateTimeInterval = utc2 - utc;
trace( dti.toString() );                    // (1y, 2m)
trace( utc + dti );                         // 2015-11-19 01:37:45

//assuming your timezone has +4:00 offset
// 个人注: 由于 3.0 的改动, local() 已经为静态方法, 下行将不可用.
trace (utc.local());    // 2014-09-19 05:37:45

var tz = Timezone.local();
trace( tz.getName() );                  // Europe/Moscow
trace( tz.at(utc) );                    // 2014-09-19 05:37:45
trace( tz.format(utc, '%F %T %z %Z') ); // 2014-09-19 05:37:45 +0400 MSK
```

### API

原项目API文档: http://doc.stablex.ru/datetime/index.html

#### DateTime


#### TimeZone

Datetime 使用 IANA timezone database用于处理 时区  http://www.iana.org/time-zones

本地时区检测代码移植于JS库的 jstimezonedetect , 地址为:https://bitbucket.org/pellepim/jstimezonedetect.
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

Date.now:		2015-04-06 11:32:43 getTime: 1428291163	getHours: 11
DateTime.now:	2015-04-06 03:32:43	getTime: 1428291163	getHour: 3

Date.fromString:	2014-04-15 01:01:01 getTime: 1397494861	getHours: 1
DateTime.fromString:2014-04-15 01:01:01	getTime: 1397523661	getHour: 1
```