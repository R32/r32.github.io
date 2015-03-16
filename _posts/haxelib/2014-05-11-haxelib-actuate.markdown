---

layout: post
title:  actuate
date:   2014-05-11 9:17:21
categories: haxelib

---

Actuate 是一个动画补间库. 你可以使用 bing 翻译来查看下边英文.

Actuate is not the only tween library that could be used with OpenFL, but it is highly recommended.

<!-- more -->

### 安装

安装正式版:
	
	haxelib install actuate
	
或者如果你喜欢开发版:
	
	git clone https://github.com/jgranick/actuate
	haxelib dev actuate actuate

如果需要将 Actuate 添加到 Openfl 项目中, 在 project.xml 文件中添加 `<haxelib name="actuate" />`.

将 Actuate 添加到普通的 Haxe 项目, 在 HXML 文件中添加一行编译标记 `-lib actuate`


### 使用指南

flashdevelop的智能提示将引导你如何使用这些方法.如参数个数及类型等等.

使用非常简单!

	Actuate.tween (MySprite, 1, { alpha: 1 });

Actuate is designed to be simple to use and to take advantage strong code completion support in code editors like FlashDevelop, which means no more "reserved" keywords or "special" properties

	Actuate.tween (MySprite, 1, { alpha: 1 }).onComplete (trace, "Hello World!");

Instance-based tweens can be a pain. When you don't keep track of each tween instance, you run the risk of creating conflicting tweens, which almost never turns out well. With first-class tween overwrite support, Actuate manages your tweens so you don't have to. Actuate also makes it simple to disable overwriting when you need to sequence multiple animations

	Actuate.tween (MySprite, 1, { alpha: 1 });
	Actuate.tween (MySprite, 1, { alpha: 0 }, false).delay (1);

很容易 停止,暂停,恢复以及重置

	Actuate.stop (MySprite);
	Actuate.stop (MySprite, "alpha");
	Actuate.pauseAll ();
	Actuate.pause (MySprite);
	Actuate.pause (MySprite, MyOtherSprite);
	Actuate.resumeAll ();
	Actuate.resume (MySprite);
	Actuate.resume (MySprite, MyOtherSprite);
	Actuate.reset ();

There also are additional shortcuts you can use to help you be even more productive. For example, you can use Actuate to create quick tween-based timers for sequencing events

	Actuate.timer (1).onComplete (trace, "Hello World!");
	
Or you can use the "apply" method to stop conflicting tweens and instantly set an object's properties

	Actuate.apply (MySprite, { alpha: 1 });

### 高级特性

For advanced animations, you can also tween function calls instead of properties

	Actuate.update (customResize, 1, [100, 100], [300, 300]);

Actuate also includes shortcuts for some special types of animation. Here is how you might apply a 50% tint using a color transform

	Actuate.transform (MySprite, 1).color (0xFF0000, 0.5);

You can also control the volume and pan of a sound transform as well

	Actuate.transform (MySprite, 1).sound (0.5, 1);
	Actuate.transform (MySoundChannel, 1).sound (0.5, 1);

You can also tween filters. You can reference the filter by its class, or by the value of its index in the filter array, whichever is easier
当你运行下行示列示,需要保证 MySprite 的 filters 数组值包含有 BlurFilter

	Actuate.effects (MySprite, 1).filter (BlurFilter, { blurX: 10, blurY: 10 });

You even can create bezier curves, and complete motion paths, like in the Flash IDE. Chain multiple path commands together to create one solid path you can tween your objects across using the MotionPathActuator

	var path = new MotionPath ().bezier (100, 100, 50, 50).line (20, 20);
	Actuate.motionPath (MySprite, 1, { x: path.x, y: path.y });

### Tween Modifiers

Each tween Actuate creates can be modified with many different tween modifiers. You can link tween modifiers to add delay, complete handlers, or configure many different options about the way your tween behaves

#### autoVisible

	Actuate.tween (MySprite, 1, { alpha: 1 }).autoVisible (false);

Changing the visible property results in better performance than only an alpha of zero, so the autoVisible modifier toggles the visible property automatically based upon the alpha value of the target. It is enabled by default, but it can be disabled if you choose

#### delay 延迟

	Actuate.tween (MySprite, 1, { alpha: 1 }).delay (1);

延迟执行动画,在每一次运行动画时,例如假如添加了 `repeat` , 那么每次重复时将告延迟指定秒数

#### ease

	Actuate.tween (MySprite, 1, { alpha: 1 }).ease (Quad.easeOut);

定义 ease, Actuate 包含很多流行 easing 函数.默认为 `Expo.easeOut`, 可以更改 `Actuate.defaultEase`.

#### onComplete

	Actuate.tween (MySprite, 1, { alpha: 1 }).onComplete (Lib.trace, ["Tween finished"]);

Calls a function when the tween is finished. You can also define parameters to be used when calling the function

#### onRepeat

	Actuate.tween (MySprite, 1, { alpha: 1 }).repeat().onRepeat (Lib.trace, ["Tween finished"]);

Calls a function when the tween repeats. You can also define parameters to be used when calling the function

#### onUpdate

	Actuate.tween (MySprite, 1, { alpha: 1 }).onUpdate (Lib.trace, ["Tween updated"]);

Calls a function every time the tween updates. You can also define parameters to be used when calling the function

#### reflect

	Actuate.tween (MySprite, 1, { alpha: 1 }).repeat ().reflect ();

Automatically reverses the animation every other time it is repeated. You must enable repeat in order to see any effect
相当于 greensock 的 yoyo 方法. reflect 方法必须和 repeat 一起使用.

#### repeat

	Actuate.tween (MySprite, 1, { alpha: 1 }).repeat (10);

重复,省略参数表示为无限次,或指定一个数字,每次将会回到初使值

#### reverse

	Actuate.tween (MySprite, 1, { alpha: 1 }).reverse ();

翻转动画,注意区别 reflect

#### smartRotation

	Actuate.tween (MySprite, 1, { rotation: 180 }).smartRotation ();

Rotation is circular, so it can be strange to animate. What should be positive one moment is negative the next. As a result, treating rotation like a standard tween will result in jerking once the signs change. Smart rotation always applies rotation in the nearest direction, alleviating this issue.

#### snapping

	Actuate.tween (MySprite, 1, { alpha: 1 } ).snapping ();

Math.Round 所有 补间值, 四舍五入.
