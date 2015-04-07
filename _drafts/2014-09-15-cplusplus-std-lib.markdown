---

layout: post
title:  C++ 标准库
date:   2014-9-15 07:22:52
categories: other

---

内容来自 http://www.cplusplus.com/reference, 有时候会需要参考手册但是又找不到合适的,因此这里慢慢记录一些


<!-- more -->


### C library

在 C++ 引用头文件:

 * C++ 引用 头文件时不需要加 .h 扩展名,但是引用　标准C库时,需要以字母 c 开头.(或者使用 C 语法引用头文件)

	```cpp
	using namespace std;
	#include <iostream>        // This is a key C++ library
	#include <cmath>           // 或者 #include "math.h"
	```

 * 标准库需要添加命名空间 using namespace std


一些特定的更改在 C++ 中:

 * wchar_t,char16_t, char32_t 和 bool 是 c + + 中的基本类型, 但它们并没有在 C 语言中定义.同样有几个宏 (在头文件 iso646.h 中) 它们是 C++ 的关键字

 * 下列函数在其声明中有关参数的常量有变化: `strchr, strpbrk, strrchr, strstr, memchr`

 * 这些函数 atexit, exit and abort, 定义在 <cstdlib> 有一些扩展的行为在 C++ 中

 * 一些函数的重载版本提供了带有附加类型作为参数与相同的语义，例如在 cmath 头文件中，float 和 long double,或 long 版本的 abs 和 div

	> 原文: Overloaded versions of some functions are provided with additional types as parameters and the same semantics, like float and long double versions of the functions in the cmath header file, or long versions for abs and div
	

#### cassert

定义于 assert.h, 断言

 * `void assert(int expression)`: **宏方法** 

  - expression 将被执行,如果返回值为 0(值为假),将中断程序的执行并显示错误信息,通常用于程序的测试

  - - 可以通过#define NDEBUG(或命令行 -D NDEBUG)来取消　assert　的测检

#### cctype

定义于 ctype.h,用于测试 **字符** 是否属于特定的字符类别.所有函数原型均为 `int isXXX(int c);`

 * isalnum: 检测字符是否为 字母或数字

 * isalpha: 检测字符是否为 字母

 * isblank: (c++ 11 only)检测字符是否为 空字符(空格,Tab,)
    Check if character is blank (function )

 * iscntrl: 检测字符是否为
    Check if character is a control character (function )

 * isdigit: 检测字符是否为
    Check if character is decimal digit (function )

 * isgraph: 检测字符是否为
    Check if character has graphical representation (function )

 * islower: 检测字符是否为
    Check if character is lowercase letter (function )

 * isprint: 检测字符是否为
    Check if character is printable (function )

 * ispunct: 检测字符是否为
    Check if character is a punctuation character (function )

 * isspace: 检测字符是否为
    Check if character is a white-space (function )

 * isupper: 检测字符是否为
    Check if character is uppercase letter (function )

 * isxdigit: 检测字符是否为
    Check if character is hexadecimal digit (function )

#### cerrno

#### cfloat

#### cios646

#### climits

#### clocale

#### cmath

#### csetjmp

#### csignal

#### cstdarg

#### cstddef

#### cstdio

#### cstdlib

#### cstring

#### ctime

### Containers


### Input-Output


### Multi-threading


### 其它


### Boost