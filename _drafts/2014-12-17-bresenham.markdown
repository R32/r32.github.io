---
layout: post
title:  Bresenham magic
date:   2014-12-17 07:16:10
categories: haxe
---


bresenham 是一种相当常见的算法, 几个月以前我发现一些非常有用的用途. [原文链接](http://deepnight.net/bresenham-magic-raycasting-line-of-sight-pathfinding/) 

这种算法基本上用于基于网格空间在二点之间画一条线(ie:像素单位). 其结果是完美的像素线条, 但该算法还具有很多其它有趣的用法:

 * 视线(line of sight)

 * 寻路优化(pathfinding optimization)

 * 寻路平滑(pathfinding smoothing)

 * 视野(锥形)(field of vision(cone))

 * 照明(lighting)

 * ...

<!-- more -->

这里是使用 haxe 的实现:

```haxe
function getLine(x0:Int,y0:Int, x1:Int,y1:Int) : Array<{x:Int, y:Int}> {
	var pts = [];
	var swapXY = fastAbs( y1 – y0 ) > fastAbs( x1 – x0 );
	var tmp : Int;
	if ( swapXY ) {
		// swap x and y
		tmp = x0; x0 = y0; y0 = tmp; // swap x0 and y0
		tmp = x1; x1 = y1; y1 = tmp; // swap x1 and y1
	}
	if ( x0 > x1 ) {
		// make sure x0 < x1
		tmp = x0; x0 = x1; x1 = tmp; // swap x0 and x1
		tmp = y0; y0 = y1; y1 = tmp; // swap y0 and y1
	}
	var deltax = x1 – x0;
	var deltay = fastFloor( fastAbs( y1 – y0 ) );
	var error = fastFloor( deltax / 2 );
	var y = y0;
	var ystep = if ( y0 < y1 ) 1 else -1;
	if( swapXY )
		// Y / X
		for ( x in x0 … x1+1 ) {
			pts.push({x:y, y:x});
			error -= deltay;
			if ( error < 0 ) {
				y = y + ystep;
				error = error + deltax;
			}
		}
	else
		// X / Y
		for ( x in x0 … x1+1 ) {
			pts.push({x:x, y:y});
			error -= deltay;
			if ( error < 0 ) {
				y = y + ystep;
				error = error + deltax;
			}
		}
	return pts;
}

//二个方法的简单实现, 参考 http://lab.polygonal.de/?p=81
static inline function fastAbs(v:Int) : Int {
	return (v ^ (v >> 31)) – (v >> 31);
}

static inline function fastFloor(v:Float) : Int {
	return Std.int(v); // actually it’s more "truncate" than "round to 0"
}
```

要了解 Bresenham 算法的一些事情:

 * 它很容易实现, 相当快速,高效

 * 我移动了 `if(swapXY)` 到循环外部为了稍快的结果(仅在非常大量的调用)

 * 数组内存分配(ie.var pts=[]) is not free(TODO:不明确的英文), 你可能需要专注此函数替换成需求的Point压入到数组.

 * **数组的顺序可以改变** 这是真的很重要! 这意味着返回的数组可以从 x0,y0 到 x1,y1 或者相反, 它取决于角度

我鼓励你阅读 [Bresenham 维基百科](http://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm#Optimization), 特别是你如果有特别的需求,能在那里发现更有趣的优化. 那么利用该算法我们能做什么?

#### AI

当你写怪物的 AI时, 你会经常想这二个基本问题:

 * 怪物离玩家近吗(基本上,检查距离)

 * 怪物能看见玩家吗?

第二个问题很容易使用 bresenham 算法来检查是否有墙阻拦了怪物和玩家之间的视线.

```haxe
function checkLine(x0:Int,y0:Int, x1:Int,y1:Int, rayCanPass:Int->Int->Bool) {
	var swapXY = fastAbs( y1 – y0 ) > fastAbs( x1 – x0 );
	var tmp : Int;
	if ( swapXY ) {
		// swap x and y
		tmp = x0; x0 = y0; y0 = tmp; // swap x0 and y0
		tmp = x1; x1 = y1; y1 = tmp; // swap x1 and y1
	}
	if ( x0 > x1 ) {
		// make sure x0 < x1
		tmp = x0; x0 = x1; x1 = tmp; // swap x0 and x1
		tmp = y0; y0 = y1; y1 = tmp; // swap y0 and y1
	}
	var deltax = x1 – x0;
	var deltay = fastFloor( fastAbs( y1 – y0 ) );
	var error = fastFloor( deltax / 2 );
	var y = y0;
	var ystep = if ( y0 < y1 ) 1 else -1;

	if( swapXY )
		// Y / X
		for ( x in x0 … x1+1 ) {
			if(!rayCanPass(y,x)) return false;	
			error -= deltay;
			if ( error < 0 ) {
				y = y + ystep;
				error = error + deltax;
			}
		}
	else
		// X / Y
		for ( x in x0 … x1+1 ) {
			if( !rayCanPass(x,y) ) return false;
			error -= deltay;
			if ( error < 0 ) {
				y = y + ystep;
				error = error + deltax;
			}
		}
	return true;
}
```

此版本不返回Point数组, 只运行一个给定的函数(rayCanPass) 在线的每个Point上, 如果给定的函数返回 false, 则 checkLine 返回 false 并停止.

```haxe
checkLine(mob.x,mob.y, player.x, player.y, function(x, y){
	return collisionMap[x][y] == false
});
```

如上示例, 简洁而快速, 尤其是因为循环停止如果有墙, 请注意, 在 flash 中函数调用是耗时的,如果你需要在循环多次在 checkLine 上.

#### 寻路优化

当你写寻路算法(如A星)时, 你知道它在游戏中非常耗时, 所以每一次你最好是避免调用寻路方法, 使用上一个示例, 如果你的答案是: 当 mob(坏人)看见玩家时, 

#### 寻路平滑

许多寻路算法返回START与END之间的完整列表(网格形式)

Bresenham 可以用于简单地 "平滑" 这结果, 需要做些什么:

 * 设置一个Point 称为 REF, 在最开始时它与 START 相等.

 * 检测如果 Point REF  看见了

