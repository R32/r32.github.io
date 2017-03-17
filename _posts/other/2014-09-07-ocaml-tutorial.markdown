---

layout: post
title:  OCaml 入门教程
date:   2014-9-07 06:26:21
categories: other

---

[在线尝试编程](https://try.ocamlpro.com/)

[在 windows 中安装 ocaml](http://fdopen.github.io/opam-repository-mingw/installation/), 因为 linux 中安装简单没什么好说的.

> 不要使用 cygwin 自带的 ocaml, 因为它不包含 opam, 也没法编译一些库。

* 使用 cygwin, 但是得把之前通过 setup.exe 安装的 ocaml 和 flexdll 卸载(uninstall) 掉, 如果你有的话.

* 照着文档一步一步来(我是参照 Manual Installation 安装的)

编译 haxe 源码:

* 在 setup.exe 里选上 `mingw64-i686-zlib` 和 `mingw64-i686-pcre` (参考 Makefile.win 里的 dll 文件搜索)

* 通过 opam 安装 camlp4, 需要注意的是应该使用 mintty 来代替 bash 以防止乱码.

* 在 bash 里执行 `make haxe -j4 FD_OUTPUT=1 ADD_REVISION=1 -f Makefile.win` (第一次执行时必须编译 haxelib 因此先去掉 haxe)

<!-- more -->

[ocpwin](https://www.typerex.org/ocpwin.html), 虽然 haxe 有人用这个[编译 #5174](https://github.com/HaxeFoundation/haxe/issues/5174)


接下来是 IDE 选择, 最重要的问题是 IDE 在调用命令是必须能调用 `cygwin/bin/bash`(需设置系统环境变量 `CHERE_INVOKING=1`，以防止 --login 时丢失目录),  但是这样做有一个副作用就是: 当从 "开始" 进入 "Cygwin Terminal" 时的当前目录会是 system32 下, 但可以通过可 `cd ~` 切回

* `vscode`: 这个插件需要 ocp-indent, merlin 来产生语法提示,, 幸运的是这二个都不依赖 cygwin 登录环境

  settings.json:

  ```json
  // 将设置放入此文件中以覆盖默认设置
  {
    "files.trimTrailingWhitespace": true,
    "git.enabled": false,
    "update.channel": "none",
    "emmet.triggerExpansionOnTab": false,
    "editor.renderWhitespace":"all",
    "editor.insertSpaces": false,
    "haxe.enableCodeLens": true,
    "files.associations": {
        "*.ml": "ocaml",
        "*.mli": "ocaml"
    },
    "ocaml.ocpIndentPath": "E:\\cygwin\\home\\mn\\.opam\\4.02.3+mingw32c\\bin\\ocp-indent",
    "ocaml.merlinPath": "E:\\cygwin\\home\\mn\\.opam\\4.02.3+mingw32c\\bin\\ocamlmerlin",
    "terminal.integrated.shell.windows": "E:\\cygwin\\bin\\bash.exe", // integrated 表示 ctrl+p 中集成的控制台
    "terminal.integrated.shellArgs.windows": ["--login"],
    "terminal.integrated.rightClickCopyPaste": false
  }
  ```

  对于 tasks.json 和 launch.json 以后再弄,  现在使用 makefile TODO


[官方文档](http://ocaml.org/learn/tutorials/index.zh.html), 但网页引用了 google api, 你需要一个特殊的浏览器才能快速打开这个页面.

### 速记

API 文件建议参考 cygwin/lib/ocaml 下的 mli 文件, 一些方法会提示是否为 tail-recursive

* 小括号 `()` 其实就相当于 begin/end, 对于一些嵌套的地方(比如多个 match 表达式)你可能需要使用 begin/end 来划分

  ```ocaml
  (* 可以尝试将小括号换成 begin/end *)
  if 1+2 = 3 then (
	print_string "did you knew that?\n";
	print_string "amazing!\n"
  )

  let f = function
  | (a, 1) -> (match a with | 1 -> true | _ -> false)
  | _ -> true
  ```

* 由于函数的优先级最高, 应此很多时候参数需要加上括号被优先计算

  ```ocaml
  let double x =
    x + x;;

  double 3 + 2 (* 这个其实是先算 double 3, 然后再把结果 + 2*)
  double (3+2)

  let neg = ref (-1) (* 当引用一个负值时, 如果不加小括号将出错 *)
  ```

* 跟大多数语言不一样提 list, array .... 等复杂类型也可以直接判断是否相等

  ```
  [1;2;3] = [1;2;3]
  [|1;2;3|] = [|1;2;3|]
  (1,2,3) = (1,2,3)
  {a=1; b="hi"} = {a=1; b="hi"}
  ```

* 在定义时可选参数使用 `?` 作背缀, 命名参数使用 `~`(如果一个函数有二个参数最好是只命令一个)

  ```ocaml
  let foo ~arg1 = arg1 + 5;;
  foo ~arg1:123;;
  (* Optional named parameters *)
  let odp ?(ftw = "OMG!!") () = print_endline ftw;;
  odp ~ftw:"hi there" ();; (* 但是在调用时，还是得用 ~ 来命名参数 *)
  odp ();;
  ```

* 同时let多个绑定

  ```ocaml
  let a, b = 1, 2 ...

  let a = 1 and b = 2 in ..
  ```

* misc
  - 对于不等号 ocaml 支持 `!= , <>` 二种型式
  - 数组和List不一样的是, 数组的值像mutable record 一样可变, 即: `arr.(0) <- 100`
  - List 下的方法, 大多数 rec_ 为前缀的方法才是 tail-recursive 形式的
  - incr/decr 用于 int ref 为增和减

### Hello Wrold

将下列代码保存为 Hello.ml 文件,

```ocaml
print_string "Hello world!\n";;
```

使用下边命令行参数编译:

```bash
ocamlc -o hello Hello.ml

# 运行, 只能于 cygwin bash 中. dos 中运行将会提示缺少 cygwin1.dll
./hello
Hello world!
```

基础知识
-----

### 注释

OCaml 注释像这样:

```ocaml
(* Ocaml 没有单行注释, 只能这样 *)

(**
This is a
Multi-line
comment
	(* 和其它语言不一样的是 Ocaml 注释 可以嵌套 *) XXX;;
*)
```


### 调用函数

假设你编写了一个函数,叫 `repeated`, 实现了 重复一个字符串 n 次, ocaml 和其它通过括号调用函数不同: **注意: 没有小括号,各参数之间没逗号**

```ocaml
repeated "hello" 3		(* 这是 OCaml 代码 *)
```

添加另一项功能 `prompt_string`, 从用户输入读取字符串并返回, 我们想要把该字符串传递给 `repeated`, 以下是 C 和 OCaml 的版本: 注意: 小括号内部表示另一个函数调用.

```ocaml
repeated (prompt_string "Please Type: ") 3		(* 这是 OCaml 代码 *)

(* 更多示例 *)
f 5 (g "hello") 3    (* f 有 3 个参数, g 有 1 个参数 *)
f (g 3 4)            (* f 有 1 个参数, g 有 2 个参数 *)
```


### 函数定义

示例: 计算二个 Float 数的平均值, 在 命令行中键入 `ocaml` (cwgwin bash), 然后输入下列值:

```ocaml
let average a b =
	(a +. b) /. 2.0;;
```

将得到: `val average : float -> float -> float = <fun>`, 参数类型 -> 参数类型 -> 返回值类型

* ocaml 是强静态类型语言.(就是没有一些动态语言  Int,Float,String 之间的通用类型)

* ocaml 使用类型推理 解析数据类型, 所以不必声明变量类型

* ocaml 不做任何隐式转换, 如果你想要一个浮点数, 必须是 2.0, 因为 2 是一个整数.

* ocaml 加法运算 `+` 只作用于整数, 如需要用于 Flaot 类型,则为 `+.`(注意有小数点), 同样 `-.` `*.` `/.` 用于 Flaot 数.

* ocaml 没有 return 关键字, 函数中最后一行将为函数的返回值.


**无参数的函数**: 使用 `()` 当参数. `()` 的类型为 unit, 像其它语言的 void

```ocaml
let hello () =
	print_endline "Hello"

(* 调用, 像是其它语言的函数调用 *)
hello()

(* 或者这样调用 *)
let () = hello()
```

**`fun`**, 对于 C 语言, 像是声明一个函数指针指向一个函数, 对于 haxe|as3|js 则像是 `var average = function (a, b){return (a+b)/2;}` 如果定义局部函数经常会用到 这个关键字, 如示例中的 List.map

> 其实 ocaml 中可以声明一个匿名函数并且直接调用像这样 `(fun x -> x + 1) 101` 将返回 int - 102, 你可以把这个匿名函数通过 let 绑定

```ocaml
let average = fun a b -> (a +. b) /. 2.0;;

List.map (fun i -> i*2) [1;2;3];;
```

还有个 [function](#function) 的形为蛮复杂的, 放在后边再说.


### 基本类型

<http://caml.inria.fr/pub/docs/manual-ocaml/coreexamples.html>

```bash
int         31-bit signed int (roughly +/- 1 billion) on 32-bit
            processors, or 63-bit signed int on 64-bit processors
			由于 ocaml 使用了 int 一个位(bit) 用于管理内存(garbage collection),
			所以基本 int 类型为 31 位. 如果你需要更大数字,可以使用 bignums .
			或者你需要处理 32 位类型(例如: 加密代码), ocaml 提供 nativeint 类型

			ocaml 没有无符号的整数类型. 但使用 nativeint 能得到同样效果.

float       IEEE double-precision floating point, equivalent to C\'s double
			ocaml 没有单精度浮点数.

bool        A boolean, written either true or false

char        8 bit 字符类型, 例如: `x`, 不支持 unicode 或 utf-8, 这是一个严重的缺陷,
			但是你可以找到一些 [unicode 库](camomile.sourceforge.net) 来处理这些.

string      字符串不是 (lists of characters)字符列表, 它有它自已更高效的内部表示

unit        Written as (),写成空括号(), 将会被解析成 unit, 有点像 C 语言中的 void
```

### 显式转换

在 C 语言中,如果你写 `1 + 2.5`, 结果将会隐式自动转换成浮点数. 这相于你写了 `((double) 1) + 2.5`.

OCmal 没有这样的隐式转换, `1 + 2.5` 将直接报错:

```
# 1 + 2.5;;
Error: This expression has type float but an expression was expected of type
         int

# 1 +. 2.5;;
Error: This expression has type int but an expression was expected of type
         float
```

但是如果需要计算 整形和浮点数, 需要 显示强制转换:

```ocaml
(float_of_int i) +. f
```

float_of_int 是一个函数, 它接受一个 int 并返回 float, 类似的函数如: `int_of_float, char_of_int, int_of_char, string_of_int` ...等等

将 int 转换为 float 类型很常见, float_of_int 具有较短的别名:

```ocaml
float i +. f
```

**请注意和 C 语言不一样, 一个类型和一个函数具有相同的名称 这是完全有效的**



### 普通函数和递归函数

ocaml 递归函数 需要用 `let rec` 声明.示例:

```ocaml
let rec range a b =
    if a > b then []
    else a :: range (a+1) b;;
```

let, let rec 之间的唯一区别是函数名称的作用域. 如果只是 let, 当在 range 内部调用 range时, 那么将在定义这个 range 函数之前查找 range 的定义.


使用 let (无 rec) 允许重新定义一个值. 因为 ocaml 变量定义之后就不能改变, 需要用 let 重新定义

```ocaml
let positive_sum a b =
    let a = max a 0	    (*  重新定义 a 和 b ,
                            "let a =" 之后的 "max a 0" 中的 a 表示之前定义
                            所以这里不能使用 let rec a ,
                        *)
    and b = max b 0 in
    a + b;;

(* val positive_sum : int -> int -> int = <fun> *)
```

在 let 和 let rec 定义的函数之间并没有性能差异, 所以如果你愿意可以一直使用 `let rec`, 并得到 C 语言相同的语义.



### 函数类型

与 haxe 语法一致, 函数 f 以参数 arg1, arg2,.... argn 和返回类型 rettype, 编译器打印为:

```bash
f: arg1 -> arg2 -> ... -> argn -> rettype

# ocaml 标准类型转换 int_of_float
int_of_char : char -> int
```

如果一个函数返回 nothing (相当于 C 语言的 void), 这表示返回 uint 类型. 例如:

```ocaml
output_char : out_channel -> char -> unit
```


下边是一个奇怪的函数, 包含一个参数, 这将会忽略参数,并始终返回 3:

```ocaml
let give_me_a_three x = 3;;

(**
 此函数的参数类型是什么? 在 ocaml 中使用一个特殊的占位符, 意思是 "任意类型的幻想",
 表现形式为: 单引号字符后跟一个字符( 字符从 a 开始,那么第二个不同参数将为 b......),

 give_me_a_three : 'a -> int = <fun>

 'a 确实意味着任意类型, 这对多态函数非常有用. 多态性像是 c++ 中的模板或 haxe,java 中的泛型
*)
```

### 类型推导

参看 [函数定义](#函数定义) 那一小节, ocaml 不需要声明函数或变量的类型





Ocaml程序的结构
------

观察一些 ocaml 程序, 下边内容为: 局部和全局定义, 何时使用 `;;`, 何进使用`;`, 模块, 嵌套函数, 以及引用. 还会见到很多现在还不理解的意义以及目前还未接触过的概念. 不要担心这里细节, 只要专注于程序的整体及提到的特性

### 局部变量

即局部表达式, 先看下 C 语言中的 average 函数,并增加一个局部变量:

```c
double average (double a, double b){
	double sum = a + b;
	return sum/2;
}
```

ocaml 版本:

```ocaml
let average a b =
  let sum = a +. b in
  sum /. 2.0
;;
```

短语 `let name = expression in` 用来定义一个局部表达式,之后在函数中 name 就可以用来代替 expressionm, 直到遇到 `;;` 结束代码块, 注意在 in 之后并不缩进, 只要把 let ... in 当作是一个整体就可以了.

**重要:** 比较一下和 C语言 局部变量的区别, C 变量 sum, 将在堆栈段上给其分配了内存空间(参考汇编语言), 所以可以得到 sum 的内存地址. 而在 ocaml 中的 sum 却不是这样. ocaml 中的 sum ,只是 表达式 a +. b 的 **简短别名**. 所以我们无法给 sum 赋值或更改它.

下面的示例更清楚地说明了这个区别. 下面的两段代码返回同样的值, 后者中的 x 中是 a +. b 的缩写别名:

```ocaml
let f a b =
  (a +. b) +. (a +. b) ** 2.
  ;;

let f a b =
  let x = a +. b in
  x +. x ** 2.
  ;;
```



### 全局变量

即全局表达式, 我们也可以在 top level 中像上边定义局部变量那样定义全局变量, 但实际上那些都不是真正的变量, 只是缩写别名.



### let

任何 let ..., 无论是在 top level (全局) 还是在函数内部, 称为 let-绑定



### 引用

这才是真正的变量,下边示例说明在 ocaml 中怎么创建一个 init 引用:

```ocaml
ref 0;;
```

实际这个语句并无用处, 我们创造了一个引用, 但是因为没有命名它会被垃圾收集器清除(实际上在编译时就会被丢弃)

```ocaml
let my_ref = ref 0;;

(* 引号保存一个个整数0, 现在可以赋值: *)
my_ref := 100;;

(*
查看这个引用包含的值:
# !my_ref;;
- : int = 100
 *)
```

**因此**: `:=` 用于更改 ref 的值, `!` 用于 取出 ref 的值.下边是一个粗略的比较:

```
ocaml						c/c++

let my_ref = ref 0;;		int a = 0; int *my_ptr = &a;
my_ref := 100;;				*my_ptr = 100;
!my_ref						*my_ptr
```



### 嵌套函数

C 中实际上没有嵌套函数的概念. GCC对C支持嵌套函数但是我发现几乎没有程序用到这个特性。不管怎样，下面是GCC的info页给出的关于嵌套函数的说明：

**“嵌套函数"" 是在另一个函数内部定义的函数。** （GNU C＋＋ 不支持嵌套函数）嵌套函数的名字域是它被定义的那个程序块。例如：下面我们定义一个名为‘square‘的嵌套函数，然后调用它两次：

```cpp
foo (double a, double b){
  double square (double z) { return z * z; } // 定义嵌套函数

  return square (a) + square (b);
}
```

嵌套函数可以使用包含它的函数当前可见的所有变量. 下面是

```ocaml
let read_whole_channel chan =
  let buf = Buffer.create 4096 in
  let rec loop () =
    let newline = input_line chan in
    Buffer.add_string buf newline;
    Buffer.add_char buf '\n';
    loop ()
  in
  try
    loop ()
  with
    End_of_file -> Buffer.contents buf;;
```

不用担心这段代码在做什么－它包含了很多我们还未涉及的概念。只要专注于名叫loop的只有一个 unit 参数的嵌套函数就可以了。你可以在函数read_whole_channel中来调用函数loop()，但是它在read_whole_channel函数外是没有定义的。嵌套函数可以使用主函数中定义的变量.（这里loop使用了局部变量buf).

**嵌套函数格式和局部变量相同** `let name arguments = function-definition in`.

通常我们如上面的例子中那样让函数定义缩进，如果你函数是递归的记住用let rec代替let，如上面的例子中那样。



### 模块和open

OCaml带有很多有趣的模块（含有用代码的库）。例如标准模块中有画图、与GUI小部件（widget）交互、处理大数、数据结构、POSIX系统调用等模块。这些库位于/usr/lib/ocaml/VERSION/ （当然是指在Unix系统下的情况）。

.mli 文件, 这是一个可读的 text 文件, 注意文件名大小写, **OCaml通常将文件名的第一个字母大写作为模块名**.

例如如果想用Graphics中的函数，存在两种方法:

* 一是在程序开头声明open Graphics;;。`open` 有点象Java中的 `import` 语句，不过更象Perl中的 use语句。

* 二是在所有函数调用前加上前缀，比如Graphics.open_graph。


### Pervasives模块

有一个模块我们无需使用"open"。这就是Pervasives模块. (我的cygwin 在 `/lib/ocaml` 目录下)



### 重命名模块

如果你想用Graphics模块中的符号，但是不想全部引入它们而又觉得每次使用前缀Graphics太麻烦，那怎么办呢？ 你可以象下面这样重命名它们:

```ocaml
module Gr = Graphics;;

Gr.open_graph " 640x480";;
Gr.fill_circle 320 240 240;;
read_line ();;
```

实际上这在引入一个嵌套模块（模块可以被嵌套）而又不想每次键入完整路径名的时候非常有用。



### 使用;;或;或两者都不用

什么时候你应该使用;;，什么时候你应该使用;，什么时候你都不用。这是一个很有意思的窍门，除非你能真正掌握这点。而且往往也会花费初学者很长的时间来掌握。

* 规则 #1: 必须使用 ;; 在代码的最顶端来分隔不同的语句,并且绝对不要在函数定义中或者其他的语句中使用。

  ```ocaml
  Random.self_init ();;
  Graphics.open_graph " 640x480";;

  let rec iterate r x_init i =
  	if i = 1 then
  		x_init
  	else
  		let x = iterate r x_init (i-1) in
  		r *. x *. (1.0 -. x);;
  ```

* 规则 #2: 可省略的 ;;

  - 关键字 let 之前

  - 关键字 open 之前

  - 关键字 type 之前

  - 文件的最后.

  - 一些其它（非常少）Ocaml能够 “猜出” 是语句结尾而不是中间的地方

* 规则 #3 和 #4:  关于单独的分号 ;

  > 它与 ;; 完成不同, 单独的分号 ;, 被称为 **连接点**(sequence point),
  >
  > 具有在 c, c++, java 和 perl 一样的用途.
  >
  > 我打赌你不知道它表示“先执行这个位置之前的语句，执行完成之后继续之后的语句”。

* 规则 #3: 把let ... in看作一条语句，永远不要在它后面加上单独的;

* 规则 #4：在所有代码块中其他的语句后面跟上一个单独的; 最后一个例外


上面示例中的for循环内部就是一个很好的例子。 请注意我们从来都不会在下面的代码中使用单独的;

```ocaml
for i = 0 to 39 do
	let x_init = Random.float 1.0 in
	let x_final = iterate r x_init 500 in
	let y = int_of_float (x_final *. 480.) in
	Graphics.plot x y
done
```

上面代码中唯一可能考虑加上;的地方是在Graphics.plot x y的后面，但是因为这是代码块中的最后一条语句，规则#4要求我们不要加在这里。

**`;`** 注解: Brian Hurt 更正了一些我对于";"的观点。 ; 是和 + 一样的运算符。当然只是概念上的，并不完全一样。

> **`+`** 具有 `int -> int -> int` 类型, 接受二个整型并返回一个整型(求合).
>
> **`;`** 的类型是 `unit -> 'b -> 'b`, 接受两个值并简单返回第二个. 就像 C 语言中的`,`(逗号)运算符,
>
> 你可以如同 `a+b+c+d` 一样的写 `a;b;c;d`.


几乎任何东西都是表达式，这是OCaml中一个从未很好描述过的"脑筋急转弯(mental leaps)".  `if/then/else` 是一个表达式, a;b 是一个表达式. `math foo with ...` 是一个表达式. 下面的代码完全合法(并且都是做同样的一件事):

```ocaml
let f x b y = if b then x+y else x+0

let f x b y = x + (if b then y else 0)

let f x b y = x + (match b with true -> y | false -> 0)

let f x b y = x + (let g z = function true -> z | false -> 0 in g y b)

let f x b y = x + (let _ = y + 3 in (); if b then y else 0)
```

特别注意最后一行, 用了 `;` 作为运算符 "联合(join)" 两个语句. ocaml 所有的函数可以表示成:

```ocaml
let name [parameters] = expression
```

`;` 不同于 `+` 的一个地方是不能像函数一样引用 `+`。比如，可以定义一个对一列整数求和的函数sum_list:
```ocaml
let sum_list = List.fold_left ( + ) 0
```



数据类型和匹配
------

### 链表(List)

和 Perl 一样, ocaml 也对链表的支持直接内建在语言中了, ocaml 链表中所有元素的类型必须一致,但类型可以是多态的. 如: `'a list`, 像其它语言的泛型 `List<T>`. 链表使用下边格式: (注意是 分号; 不是逗号), `[]` 表示为空链表.

```ocaml
[1; 2; 3]
```

一个链表有 **链头(第一个元素)**, **链尾(剩下的元素)**. 前边的示例中, 链头是整数 1, 链尾则是 List [2; 3].

另一种做法是使用 cons 运算符 -- `头::尾`. 所以下边示例结果一致:

```ocaml
[1; 2; 3]
1 :: [2; 3]
1 :: 2 :: [3]
1 :: 2 :: 3 :: []
```

cons 运算符在使用 **模式匹配** 的时是相当有用的.下边会详细说明.


### 结构体

考虑下边简单 C 结构:

```cpp
struct pari_of_ints{
	int a, b;
};
```

ocaml 中最简单的对应形式是组元( **tuple** ), 元组的元素可以是不同类型. 例如: `(3, "hello", 'x')` 的类型是 `int * string * char`. 不能在 tuple 中命名元素, 而是要记住它们出现的顺序. tuple 表现形式为: 小括号中用逗号分隔数据. tuple 常常用作于 Variants 的参数列表.


另外一种稍显复杂的方法, 就是使用记录( **record** ),像 C 语言的结构一样在 record 中为元素命名:

```ocaml
type pair_of_int = {a:int; b;int};;
```

在定义类型之后,构造一个该类型的对象: 请注意 类型定义中使用 `:`, 构造对象时用 `=`

```ocaml
type pair_of_ints = { a : int; b : int };;
(* type pair_of_ints = { a : int; b : int; } *)

{a=3; b=5};;
(* - : pair_of_ints = {a = 3; b = 5} *)

{a=3};;
(* Error: Some record fields are undefined: b *)
```

### Variants(变体)

感觉就是 haxe 中的 enum, 在 ocaml 中:

```ocaml
type foo =
    | Nothing
    | Int of int
    | Pair of int * int
    | String of string;;
(* type foo = Nothing | Int of int | Pair of int * int | String of string *)
```

这是类型定义, 首先每个 `|` 分隔各个 **构造器(constructor)**, constructor 可以是任意以 **大写字母开头的名称**, 如果 constructor 可以用来定义一个值, `of type` 的部分则是以 **小写字母开头的类型名称**. 在上边示例中: `Nothing` 将作为常量可以和其它 constructor 一起使用.

```ocaml
Nothing
Int 3
Pair (4,5)
String "Hello"
```

这些表达式都具有类型 foo, 例如: 如果一个函数接受 foo 类型的参数, 则上边不同类型的值都可用.

一个简单的 C 语言 enum 定义为:

```c
enum sign{positive, zero, negative };
```

在 ocaml 中则写成:

```ocaml
type sign = Positive | Zero | Negative
```

#### 递归变体

Variants 可以是递归的对此的一个常见用途是定义树状结构:

```ocaml
type tree =
	| Leaf of int
	| Node of tree * tree
;;

(*  type tree = Leaf of int | Node of tree * tree  *)
(* 测试这个 Variants *)
Leaf 3

Node (Leaf 4, Leaf 4)

Node (Node(Leaf 5, Leaf 6), Leaf 5)
```

实在找不到在 C 中对应的代码, 在 haxe 中的表现形式为:

```haxe
enum Tree{
    Leaf(v:Int);
    Node(l:Tree, r:Tree);
}
```

#### 参数化变体

上一节的二叉树中的 Leaf 使用的是 int 类型, 但最后也许 Leaf 并非只使用 int 类型.

```ocaml
type 'a tree =
	| Leaf of 'a
	| Node of 'a tree * 'a tree
;;
```

对应的 haxe 代码为:

```haxe
enum Tree<T> {
    Leaf(v:T);
    Node(l:Tree<T>, r:Tree<T>);
}
```

### 摘要(链表,结构体,变体)

```
OCaml name     Example type definition        Example usage

list           int list                       [1; 2; 3]

tuple          int * string                   (3, "hello")

record         type pair =                    { a = 3; b = "hello" }
                 { a: int; b: string }

mutable        type pair =                    let p = { a = 3; b = "hello" }
record           { mutable a: int; b: string} p.a <- 6   # 更改值

variant        type foo =
                 | Int of int                 Int 3
                 | Pair of int * string

variant        type sign =
                 | Positive                   Positive
                 | Zero                       Zero
                 | Negative

parameterized  type 'a my_list =
variant          | Empty                      Cons (1, Cons (2, Empty))
                 | Cons of 'a * 'a my_list
```

### 模式匹配

模式匹配(Pattern matching)是函数式语言一个很酷的特性, 例: 我们想要呈现简单的数学表达式 `n *(x + y)` 并表现为 `n*x + n*y`. 让我们定义这个变体:

```ocaml
type expr =
  | Plus of expr * expr		(* a + b *)
  | Minus of expr * expr	(* a - b *)
  | Times of expr * expr	(* a * b *)
  | Divide of expr * expr	(* a / b *)
  | Value of string			(* "x", "y", "n", ect. *)
;;
```

表达式 `n * (x + y) 表现为:

```ocaml
Times (Value "n", Plus(Value "x", Value "y"));;

let rec to_string e =
  match e with			(* match expr with 更像是其它语言的 switch(expr) *)
  | Plus(left, right) ->
       "(" ^ to_string left ^ " + " ^ to_string right ^ ")"
  | Minus (left, right) ->
       "(" ^ to_string left ^ " - " ^ to_string right ^ ")"
  | Times (left, right) ->
       "(" ^ to_string left ^ " * " ^ to_string right ^ ")"
  | Divide (left, right) ->
       "(" ^ to_string left ^ " / " ^ to_string right ^ ")"
  | Value v -> v
;; (* val to_string : expr -> string = <fun> *)

let print_expr e =
  print_endline (to_string e);;
```

(注: `^` 用于连接字符串), 下面是打印:

```ocaml
(* # *)print_expr (Times (Value "n", Plus (Value "x", Value "y")));;

(*
(n * (x + y))
: unit = ()
*)
```

模式匹配的语法一般为:

```ocaml
mathc value with
  | pattern -> result
  | pattern -> result
  ......
```

上边示例所对应的 haxe 语言: 说真的在 haxe 中写成这样也很怪异.

```haxe
enum Expr{
	Plus(e1:Expr, e2:Expr);
	Minus(e1:Expr, e2:Expr);
	Times(e1:Expr, e2:Expr);
	Divide(e1:Expr, e2:Expr);
	Value(s:String);
}

class Main {
	static function main() {
		trace(to_string(Times(Value("n"), Plus(Value("x"),Value("y")) )));
		// output: (n * (x + y))
	}
	static function to_string(e) {
		return switch(e) {
			case Plus(left, right):
				"(" + to_string(left) + " + " + to_string(right) + ")";
			case Minus(left, right):
				"(" + to_string(left) + " - " + to_string(right) + ")";
			case Times(left, right):
				"(" + to_string(left) + " * " + to_string(right) + ")";
			case Divide(left, right):
				"(" + to_string(left) + " / " + to_string(right) + ")";
			case Value(str):
				str;
		}
	}
}
```

扩展 to_string 为 更复杂的匹配模式:

```ocaml
let rec multiply_out e =
    match e with
    | Times (e1, Plus (e2, e3)) ->
       Plus (Times (multiply_out e1, multiply_out e2),
             Times (multiply_out e1, multiply_out e3))
    | Times (Plus (e1, e2), e3) ->
       Plus (Times (multiply_out e1, multiply_out e3),
             Times (multiply_out e2, multiply_out e3))
    | Plus (left, right) ->
       Plus (multiply_out left, multiply_out right)
    | Minus (left, right) ->
       Minus (multiply_out left, multiply_out right)
    | Times (left, right) ->
       Times (multiply_out left, multiply_out right)
    | Divide (left, right) ->
       Divide (multiply_out left, multiply_out right)
    | Value v -> Value v
;; (* val multiply_out : expr -> expr = <fun> *)

(* # *) print_expr(multiply_out(Times (Value "n", Plus (Value "x", Value "y"))));;

(*
((n * x) + (n * y))
- : unit = ()
*)
```


**guards** 模式匹配

先看下 haxe 中的相同代码: 其实就是在 switch 的 case 后使用了 条件表达式

```haxe
var myArray = [7, 6];
var s = switch(myArray) {
    case [a, b] if (b > a):
        b + ">" +a;
    case [a, b]:
        b + "<=" +a;
    case _: "found something else";
}
trace(s); // String: 6<=7
```

在 ocaml 中的语言为:

```ocaml
match value with
  | pattern [when condition] -> result
  | pattern [when condition] -> result
(* ...... *) ;;


let factorize e =
    match e with
    | Plus (Times (e1, e2), Times (e3, e4)) when e1 = e3 ->
       Times (e1, Plus (e2, e4))
    | Plus (Times (e1, e2), Times (e3, e4)) when e2 = e4 ->
       Times (Plus (e1, e3), e4)
    | e -> e
;;  (* val factorize : expr -> expr = <fun> *)

(* # *)factorize (Plus (Times (Value "n", Value "x"),
                   Times (Value "n", Value "y")));;
(* - : expr = Times (Value "n", Plus (Value "x", Value "y")) *)
```

通常来说 match e with, 需要列出 Variants 的所有 constructor,例如: 将上边示例中的`to_string` 去掉`| Devide(left, right)` 那一行,将会弹出警告:

```ocaml
(* Warning 8: this pattern-matching is not exhaustive.
Here is an example of a value that is not matched:
Divide(_,_)
val to_string : expr -> string = <fun>
*)
```

但有时候并不需要匹配所有 constructor ,所以表达式 `| e -> e`(这个变量名不必与 match 后边的变量名一致) 将代替所有剩余的模式, 相当于其它语言中 `switch` 中的 `default:` (注: 在 haxe 中,如果 switch 中检测 enum 时值也是如此.)




空指针,断言和警告
------

### null

ocaml 具有优雅的方案来解决 null 值. 简单地使用 Variants 定义:

```ocaml
type 'a option =
  | None
  | Some of 'a
;; (* type 'a option = None | Some of 'a *)
```

把这个 Variants 用于年龄, 那么空值写成 None, 实际年龄则写成 Some n,

```ocaml
[None; Some 17; Some 24; None];;

(* - : int option list = [None; Some 3; Some 6; None] *)

Some [1; 2; 3];;
(* - : int list option = Some [1; 2; 3] *)
```

### 断言,警告和致命错误

首先 assert 以表达式作为参数, 并引发异常. 如果你没有捕获到这个异常, 这将会使程序停止并打印出发生错误的位置. 例如: 可以调用 `assert false` 停止你的程序,

```ocaml
assert (Sys.os_type = "Win32");; (* 等号使用 =, 这有点怪异 *)
(* Exception: Assert_failure ("", 1, 0). *)
```

`failwith "error message"` 将抛出异常, 同样如果你没有捕获到这个异常, 将会停止程序并给定 "error message". failwith 经常用于 `math exrp with`:

```ocaml
match Sys.os_type with
  | "Unix" | "Cygwin" ->	(* 代码省略 *)
  | "Win32" -> 				(* 代码省略 *)
  | "MacOS" ->				(* 代码省略 *)
  | _ -> failwith "不支持这个系统"
;;
```

一个特别的说明是和 haxe 一样, `_` 匹配任意值. 请注意区别 当 match expression with 后的 `| expr->expr`(变量名随意.)


如果你想调试程序,可能需要在程序中间打印一些警告信息.

```ocaml
prerr_endline("some tips message");;

(* 如果你喜欢 C 语言的 printf, 可以尝试 ocaml 的 Printf 模块*)
open Printf
eprintf("message")
```


函数式编程
------

在函数式语言中 函数是一等公民. 听上去不是很有用.

```ocaml
let double x = x * 2 in
  List.map double [1; 2; 3];;
(* int list = [2; 4; 6] *)
```

在这个示例中, 首先定义了 函数 double, 它读入一个参数 x 然后返回 x * 2. 然后 map 在给定的 链表 [1; 2; 3] 让给个元素都调用 double.

map 被称为 **高阶函数(higher-order function, HOF)** 高阶函数是指把其它函数作为参数的函数. 如果你对 c/c++ 熟悉, 就像传递一个函数指针作为参数.

**闭包(Closures)** 就是本文中的 [嵌套函数](#嵌套函数), 可以把上边的函数变得更通用一些:

```ocaml
let multiply n list =
  let f x = n * x in
  List.map f list;;

(* 测试 *)

multiply 2 [1; 2; 3];;		(* - : int list = [2; 4; 6] *)

multiply 5 [1; 2; 3];;		(* - : int list = [5; 10; 15] *)
```

multiply 函数中有一个嵌套函数 f. 这是一个闭包. 我们并没有把 n 作为参数传递给它, f 是从它的环境中找到它的.其实很多语言和这个一样,  JS:

```js
function multiply(n, list){
	var f = function(x){
		return n * x;
	};
	return list.map(f);
}

// 测试
multiply(2, [1, 2, 3] ); // output: [2, 4, 6]
```

### 部分函数应用和currying

定义一个加法函数:

```ocaml
let plus a b =
  a + b
;; (* val plus : int -> int -> int = <fun> *)
```

 * 什么是 `plus`?

 * 什么是 `plus 2 3`?

 * 什么是 `plus 2`?

问题一很简单, plus 是一个函数. `plus: int -> int -> int`

问题二就更简单了. plus 2 3 是一个数, 整数 5. `5: int`

问题三了? 看上去 plus 2 是一个错误, 但实际上却不是的. 如果在 ocaml 的 toplevel 中输入上述代码,则会显示:

```ocaml
plus 2;;
(* - : int -> int = <fun> *)
```

这不是一个错误, 它告诉我们 plus 2 事实上也是一个函数. 但到底是一个什么的函数了? 我们可以给这个神秘的函数起个别名 f, 然后做些尝试:

```ocaml
let f = plus 2;;

(* f : int -> int = <fun> *)

f 10;;
(* - : int = 12 *)

f 15;;
(* - : int = 17 *)
```

回到原始定义, 把第一个参数(a) 换成 2:, 希望你能理解 plus 2 是给整数加 2 的函数

```ocaml
let plus 2 b = (* 这不是真正的OCaml代码！ *)
  2 + b
```
plus, plus 2, plus 2 3,这个过程叫 currying(或者应该叫 uncurrying), 你可以 google 更多关于 currying 的信息

回到前边的 multiply 函数. 现在我们可以像这样来定义 double, triple函数:

```ocaml
let double = multiply 2;;
(* val double : int list -> int list = <fun> *)

let triple = multiply 3;;
(* val triple : int list -> int list = <fun> *)
```

它们却实是函数:

```ocaml
double [1; 2; 3];;
(* - : int list = [2; 4; 6] *)

triple [1; 2; 3];;
(* - : int list = [3; 6; 9] *)
```

你也可以不用中间函数 f, 而像这样来直接用部分应用(partial application):

```ocaml
let multiply n = List.map (( * ) n);;
(* val multiply : int -> int list -> int list = <fun> *)

let double = multiply 2;;
(* val double : int list -> int list = <fun> *)

let triple = multiply 3;;
(* val triple : int list -> int list = <fun> *)

double [1; 2; 3];;
(* - : int list = [2; 4; 6] *)

triple [1; 2; 3];;
(* - : int list = [3; 6; 9] *)
```

在上边的示例中 ( ( * ) n ) 是一个 (*) (乘)函数的部分应用, 注意这里的空格, 使得不会被当成是注释的开始.

你也可以把 中序操作符放在括号中形成一个函数:

```ocaml
let plus = ( + );;
(* val plus : int -> int -> int = <fun> *)

plus 2 3;;
(* - : int = 5 *)

( * ) 2 3;;
(* - : int = 6 *)
```

#### function

<https://ocaml.org/learn/tutorials/functional_programming.zh.html>

* function 为匹配模式,
* fun 为函数定义

```ocaml
(* 简单的和 function 形式, 看上去它接受一个参数 *)
let double = function n -> n * 2

(* 但其实 function 后的那个参数严格的来说并不能算是参数 *)
let foo = function
	| 0 -> "zero"
	| 1 -> "one"
	| _ -> "other"
;;
(*val foo : int -> string = <fun> *)

(* 可以用这种方式增加参数, 如果 fun 后边没有参数则不能有 fun 关键字 *)
let max x = fun y -> if x > y then x else y

(* 这看上去有点像 match expr with.... *)
let foo = function
	[] -> 0				(* 如果参数为空链表 则返回 0, *)
	| a::l -> a		(* 如果空链表不为空, 则以头和尾形式表现, 这里将返回链表第一个值 *)
;; (* var foo : int list -> int = <fun> *)

(* 上边的示例加上归递, 可以计算 List 的长度  *)
let rec length_aux len = function
	[] -> len							(* 如果为空链表[], 则返回值 len *)
	| a::l -> length_aux (len + 1) l
;;

length_aux 0 [0; 1; 2; 3; 4];;	(* 初使化第一个参数为 0, 因为递归需要 *)
(* - int : 5 *)

let length li = length_aux 0 li;; (* 包装一下 length_aux, 使它能计算 List 长度 *)


(* 再回顾一下 function 类似于 match expr with ....的形为*)
type language =
	| Zh
	| En
	| De
;; (* type language = Zh | En | De *)

let bar = function
 | Zh -> 1
 | En -> 2
 | De -> 3
;; (* val bar : language -> int = <fun> *)

bar Zh;; (* - : int = 1 *)
```

currying(科里化):

```ocaml
let plus a b = a + b;;

let f = plus 2;;	(* 像是 haxe 中的 var f = plus.bind(2) *)

f 10;;
(* val f : int -> int = <fun> *)
(* - : int = 12 *)

(* 如果你想把 2 放到后边，则*)
let f a = plus a 2;;
```

函数部分: (个人感觉这个虽然简洁, 但却造成了理解的复杂度, 不过放在 callback 的地方还是蛮简明直了的)

```ocaml
let multiply n list =
    let f x =
      n * x in
    List.map f list;;
(* val multiply : int -> int list -> int list = <fun> *)

(* 其实可以像下行这样, 不使用 f *)
let multiply n = List.map (( * ) n);;


let plus = (+);;
plus 2 3;;
(* - : int = 5 *)

( ^ ) (* string -> string -> string = <fun>;; 字符串连接 *)
( ** ) (* float -> float -> float = <fun>;; 求幂 *)
```

(( * ) n)是一个(乘)函数的部分应用。 注意这里额外的空格，它使得OCaml不会认为是注释。

非懒惰和懒惰, OCaml是缺省非懒惰， 但是在需要的时候支持懒惰的风格。

* 对于一个非懒惰的语言，参数和函数总是在使用前被求值，然后再传入到函数中

* 在懒惰语言中，一些奇怪的事情会发生。函数的参数只有在被使用的时候才会被求值

  ```ocaml
  let give_me_a_three _ = 3;;
  (* val give_me_a_three : 'a -> int = <fun> *)
  give_me_a_three (1/0);;
  (* Exception: Division_by_zero. *)

  let lazy_expr = lazy (1/0);;
  (* val lazy_expr : int lazy_t = <lazy> *)

  give_me_a_three lazy_expr;;
  (* - : int = 3 *)
  ```


模块
------

在 ocaml 中, 每一段代码被包成一个模块, 一个模块可以选择性地作为另一个模块的子模块,很像文件系统中的目录-但是我们不经常这样做。

当你写一个程序使用两个文件amodule.ml和bmodule.ml，它们中的每一个都自动定义一个模块，名字叫Amodule和Bmodule，模块的内容就是你写到文件中的东西。

这里是文件amodule.ml里面的代码：

```ocaml
let hello () = print_endline "Hello"
```

还有bmodule.ml里面的：

```ocaml
Amodule.hello ()
```

通常文件一个一个编译，让我们来编译：

```bash
ocamlopt -c amodule.ml
ocamlopt -c bmodule.ml
ocamlopt -o hello amodule.cmx bmodule.cmx
```

现在我们有一个很好的可执行文件用来打印 “Hello”。如你所见，如果你要访问一个给定模块的任何东西，你要用模块的名字（通常是大写字母开头）后面跟一个点号，然后是你要用的东西。可能是一个值，一个类型构造器，或者是给定模块能提供的任何东西。

程序库，从标准库开始，提供模块的集合。比如，List.iter指定List模块中的iter函数。 好了，如果你正在重度使用一个给定的模块，你可以使这个模块的内容直接可以访问。要实现这个，我们要使用open指令。在我们的例子中，bmodule.ml可以写成这样：

```ocaml
open Amodule;;
hello ();;
```

通常人们为了避免 `;;` 符号所以常见的是: bmodule.ml

```ocaml
open Amodule
let () =
  hello()
```

不管怎样，用不用open是个人品味的问题。一些模块提供在很多其他模块中使用的名字。List模块就是这样的例子。通常我们不用open List。像Printf的其他模块，提供通常不受冲突的名字，比如printf。为了避免到处写Printf.printf，在文件开头放一句open Printf是有道理的。 示例:

```ocaml
open Printf
  let my_data = [ "a"; "beautiful"; "day" ]
  let () = List.iter (fun s -> printf "%s\n" s) my_data;;
(*
a
beautiful
day
val my_data : string list = ["a"; "beautiful"; "day"]
*)
```

### 接口和签名

接口就像是 c/c++ 语言的 头文件. ocaml 的接口文件后缀名为 `.mli`. 如果没有 .mli 文件,则 ml 中定义的所有"类型定义"都可以从外部访问, mli 文件就是用于控制这些访问, 使哪些 "类型定义" 这 public, 哪些为 private. 重写刚才 amodule.ml 文件:

```ocaml
let message = "Hello"
let hello() = print_endline message;;
```

这样的话, amodule 会有如下接口:

```ocaml
val messages : string
val hello : unit -> unit
```

假设访问 message 和其它模块没有关系(像 C 语言中把 message 定义为 static, 或其它语言的 private ), 隐藏 message 之后的 amodule.mli 文件为:

```ocaml
val hello : unit -> unit
(* 显示一句问候消息。 *)
```
(注意，使用ocamldoc支持的格式来写 .mli 文件的文档是个好习惯。)

.mli 文件必须在对应的 .ml 文件之前编译, 如果目录中有同名 .mli 文件,必须先编译 .mli 文件, 否则编译报错.

```bash
ocamlc -c amodule.mli
ocamlopt -c amodule.ml
```

(注: 官方文档也没解释什么是 签名(signature). 不过个人感觉 从后边的子模块来看, 签名只是子模块对接口的另一种叫法)



### 抽像类型

什么是"类型定义"了? 我们看到的值例如像函数可以被导出放到 .mli 文件, 示例:

```ocaml
val hello : unit -> unit
```

但是模块经常定义新类型. 让我们定义简单的 record 类型来表示 日期(Date):

```ocaml
type date = {day: int; month: int; year: int}
```

当要写 .mli 文件时有 四种选译, 而不是二种:

 1. 类型在签名中完全忽略

 2. 类型定义 复制-粘贴 到签名

 3. 类型做成抽像: 只给出名字

 4. record 字段为只读: type date = private {... }

对于 第 3 种情况, 对应为下列代码:

```ocaml
type date
```

现在, 这个模块中能操作 date 类型的对象, 但是不能直接访问 record 字段. 必须使用 模块提供的函数才能访问这些 record 字段. 假设这个模块提供三个函数, 其接口文件为:

```ocaml
type date
val create : ?days:int -> ?moths:int -> ?years:int -> unit -> date
val sub : date -> date -> date
val years : date -> float
```
只有 create 和 sub 才能用来创建 date record, 因此访问这个模块的用户不可能创建不合规范的 record 值.


### 子模块

我们看到 example.ml 文件自动表示为 Example 模块, 模块签名是自动得到的, 或者写一个 .mli 文件来约束一些访问.

这就是说, 一个给的模块也可以在一个文件中显示的定义, 这样就作为当前模块的一个子模块。让我们来看看example.ml文件：

```ocaml
module Hello = struct
  let message = "Hello"
  let hello () = print_endline message
end

let goodbye () = print_endline "Goodbye"
let hello_goodbye () =
  Hello.hello ();
  goodbye ()
```

从另一个文件中可以看出, 有二个层次的模块, 可以这样写:

```ocaml
let () =
  Example.Hello.hello ();
  Example.goodbye ()
```

### 子模块接口

同样可以约束一个子模块的访问, 这叫做 模块类型. 我们在example.ml文件中做一下:

```ocaml
module Hello : sig
 val hello : unit -> unit
end =
struct
  let message = "Hello"
  let hello () = print_endline message
end

(* 在这里 Hello.message 不再能被访问。 *)
let goodbye () = print_endline "Goodbye"
let hello_goodbye () =
  Hello.hello ();
  goodbye ()
```

上边的 Hello 模块的定义 和 hello.mli+hello.ml 文件是等价的.但把所有东西写在一个代码块里是不优雅的，所以一般我们选择单独定义模块签名。

```ocaml
module type Hello_type = sig
 val hello : unit -> unit
end

module Hello : Hello_type  = struct
  let message = "Hello"
  let hello () = print_endline message
end
```

`Hello_type` 是一个命名的模块类型，并且可以重用，用来定义其他的模块接口。

虽然子模块在一些情况下可能有用，但是它们和函子一起用的时候效果比较明显。这个下一部分讲

### 函子

函子(Functors) 可能是OCaml中最复杂的特性之一，但是你想成为一个成功的OCaml程序员不需要大量地使用函子。实际上，你可能从来不用自己定义一个函子，不过你确实会在标准库中遇到它们。函子是使用 Set 和 Map 模块的唯一途径，不过使用它们并不困难。

函子是用另一个模块来参数化的模块, 就像函数是用其他的值，也就是参数，来参数化的值一样。



结束语：函子是用来帮助程序员写出正确的程序的，而不是用来提高性能的，甚至会有运行时的损耗，除非使用像 ocamldefun 这样的解函器，ocamldefun 需要访问函子的源代码。

### 模块实际操作

在ocaml的 toplevel 中，下面的技巧可以让一个现存的模块的内容可视化，比如List：

```ocaml
module M = List;;

(* 省略.... *)
```

### 模块包含

如果我们觉得在标准的List模块中缺少一个函数，但是如果里面有我们确实需要它。在文件extensions.ml中，我们可以用include指令来实现这个效果。

```ocaml
module List = struct
    include List
    let rec optmap f = function
      | [] -> []
      | hd :: tl ->
         match f hd with
         | None -> optmap f tl
         | Some x -> x :: optmap f tl
end;;
```

它创建了Extensions.List模块，这个模块有标准的List模块的所有东西，加上一个新的optmap函数。从另一个文件看，要覆盖默认的List模块我们所要做的只是在 .ml 文件的开头open Extensions

```ocaml
open Extensions
...
List.optmap ...
```




条件 循环 递归
------

所有的这些都是表达式

### 条件语句

ocaml 有一个 if 语句,其含义很明显:

```ocaml
if boolean-condition then
	expression

if boolean-condition then
	expression
else
	other-expression
```

不像你使用过的传统的语言, if 语句其实就是表达式(expression), 换句话说, 其实这更像 `boolean-condition ? expression : other-expression`.

下面是一个简单的 if 语句示例:

```ocaml
let max a b =
	if a > b then
		a
	else
		b
	;;

(* val max: `a -> `a -> `a = <fun> *)
```

顺便说下, 如果你在 ocaml 顶层输入这个, 你会发同 ocaml 的多态函数是的具有以下类型:

```ocaml
max : 'a -> 'a -> 'a

(* max 可以用任何类型 *)
max 3 5;; 			(* - : int = 5 *)

max 2.5 12.0;;		(* - : float = 13. *)

max 'a' 'b';;		(* - : string = "b" *)
```

这是因为 > 其实是多态性。它适用于任何类型，即使对象（可做二进制比较）。

[注意: `Pervasives` 模块已经定义了 min 和 max]

再细致的分析 if 表达式, 这是早前没有过多描述的的函数 range,

```ocaml
let rec range a b =
	if a > b then []
    else a :: range (a+1) b
;;

(* val range : int -> int -> int list = <fun> *)
```

查看这人常见的函数调用, 从最开始简单处 `a > b`, 如果调用 `range 11 10` 将返回 `[](空链表)` 就是这样. 还记得运算符 `::(cons)` 吗? `10::[]` 和 `[10]` 是一样的.

所以 `range 1 10` 的计算结果为: `[ 1; 2; 3; 4; 5; 6; 7; 8; 9; 10 ]`; 另一个复杂的 string_of_float 函数,展示了 多重 else if.. 注意嵌套函数 loop 如何递归.

```ocaml
let string_of_float f =
  let s = format_float "%.12g" f in
  let l = string_length s in
  let rec loop i =
    if i >= l then s ^ "."
    else if s.[i] = '.' || s.[i] = 'e' then s
    else loop (i+1) in
  loop 0
```

另一种直接的写法, 但是速度比上边的归递要慢:

```ocaml
let string_of_float f =
  let s = format_float "%.12g" f in
  if String.contains s '.' || String.contains s 'e'
  then s
  else s ^ "."
```

### Using begin ... end

这是一些来自 lablgtk 的源码:

```ocaml
if GtkBase.Object.is_a obj cls then
  fun _ -> f obj
else begin
  eprintf "Glade-warning: %s expects a %s argument.\n" name cls;
  raise Not_found
end
```

begin 和 end 都是所谓的打开和关闭括号的 **语法糖**, 类似于其它语言的大括号`{}`. 或者你可以使用小括号代替 begin 和 end.

```ocaml
if 1 = 0 then
      print_endline "THEN"
    else begin
      print_endline "ELSE";
      failwith "else clause"
    end;;
(*
ELSE
Exception: Failure "else clause".
*)

if 1 = 0 then
      print_endline "THEN"
    else (
      print_endline "ELSE";
      failwith "else clause"
    );;
(*
ELSE
Exception: Failure "else clause".
*)
```


### for loop and while loop

ocaml 对循环支持有限,因为更多的是使用递归

```ocaml
for variable = start_value to end_value do
  expression
done

for variable = start_value downto end_value do
  expression
done

(* 简单示例：相当于 for(int i = 0; i<=5; i++){}
   注意: 和 haxe 的 for 循环最大区别是 for(i in 0...5), i 的值最大为 4, 而 ocaml 为 5
*)
for i = 0 to 5  do
  print_int i
done
;; (* 012345 : uint = () *)
```

ocaml 不支持 break, continue 或 last 语句(你可以引发异常然后在外边捕获它. 但这样看起来好像很笨拙).

注意: do 和 done 之间的表达式类型必须为 unit, 因此 `for i = 0 to 5 do i done` 将会报错, 所以 函数式程序员更倾向于使用 递归而不是循环.

你可能不会在 ocaml 的源码中见到有人使用 while, 因为却实不方便使用.

```ocaml
let quit_loop = false in
while not quit_loop do
  print_string "Have you had enough yet? (y/n) ";
  let str = read_line () in
  if str.[0] = 'y' then
    (* 怎么设置 quit_loop 为 true 而 退出循环 ?!? *)
done
```

ocaml 的 let 绑定 并不是真正的变量(更像是宏常量),幸运的是 ocaml 有引用(ref), 注意 引用(ref)前的 `!` 类似于 C语言的 `*` 用于从指针中提取值, 并不是 逻辑非(Not) 的意思.

```ocaml
let quit_loop = ref false in
while not !quit_loop do
  print_string "Have you had enough yet? (y/n) ";
  let str = read_line () in
  if str.[0] = 'y' then
    quit_loop := true
done;;
```

#### 遍历链表

如果你想遍历链表, 不要用 for 或 while 循环, 因为 ocaml 有更好更快的方法. 这些方法位于 List 模块中(List 使用递归来遍历链表). 首先定义一个测试用的链表:

```ocaml
let my_list = [1; 2; 3; 4; 5; 6; 7; 8; 9; 10];;

(* 如果你想对列表中的每个元素调用一个函数, 可以用 List.iter, 像这样: *)
let f elem =
    Printf.printf "I'm looking at element %d now\n" elem in
    List.iter f my_list
;;

(* map, 便历链表改变每一个元素, 返回新的链表 *)
List.map (( * ) 2 ) my_list
;; (* - : int list = [2; 4; 6; 8; 10; 12; 14; 16; 18; 20] *)

(* filter 过滤链表, 只返回为 true 的元素链表 *)
let is_even i = i mod 2 == 0 in
	List.filter is_even my_list
;; (* - : int list = [2; 4; 6; 8; 10] *)

(* mem 检测链表是否包含指定元素 *)
List.mem 12 my_list
;; (* - : bool = false *)

(* List.exists 和 mem 一样, 只是第一个参数为回调函数
   List.for_all 则所有元素必须满足回调函数

  iter2, map2 for_all2, exists2 则可以同一时间遍历二链表
*)
```

map 和 filter 只能操作单独的元素, **`fold`** 是更常见的操作, 思考"在链表元素之间插入操作符", 假设我们要将链表中的数字全都加在一起:

```ocaml
1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10;;
(* - : int = 55  *)
```

首先, 如果我们尝试 合拢(fold) 一个空链表将会发生什么? 那么 ocaml 将无法确定链表类型.或者一些其它的原因(TODO 未翻译),显然我们 **必须为 fold 提供一个默认值 参数**

让我们使用 List.fold_left(有另一个版本的fold_right, 只是性能稍差) 来定义 整数链表的 sum 和 product:

```ocaml
let sum = List.fold_left ( + ) 0		(* 0 默认值 参数,作为归递初始值, 而并不是每个元素都会加上这个值 *)
;; (* val sum : int list -> int = <fun> *)

let product = List.fold_left ( * ) 1
;; product : int list -> int = <fun>

sum my_list;; (* - : int = 55 *)

product my_list;; (* - : int = 3628800  *)

(* 这很简单, 偶然做一个数学阶乘: (range 参上前边小节的定义)
请注意这个阶乘的函数不是非常有用，因为会溢出整数，或者如果参数值较小将得到一个错误。真正的阶乘的函数将使用Big_int模块。
 *)
let fact n = product (range 1 n);;
```

### 遍历字符串

String 模块提供很多字符串处理的相关功能.其中一些波及遍历整个字符串. String.iter

String.fill 和 String.blit 分别是 C 语言 memset 和 strcpy, String.copy 复制一个字符串, 像 strdup.


### 递归

叫 归递 也行.在函数式编程中, 递归得到最好的支持, 而循环(for or while)则是二等公民.

在第一个示例中, 我们要将整个文件读入内存(很长的字符串), 对此有三种可能的方法:

* 方法一:  获得文件的长度(length), 然后使用 really_input方法读入. 这是最简单的方法但很可能不能用于 通道(channel)(通道并不是真正的文件例如从键盘输入)

  ```ocaml
  open Printf

  let read_whole_chan chan =
    let len = in_channel_length chan in
    let result = string.create len in
    really_input chan result 0 len;
    result

  let read_whole_file filename =
    let chan = open_in filename in
    read_whole_chan chan

  let () =
    let filename = Sys.argv.(1) in
    let str = read_whole_file filename in
    printf "I read %d characters from %s\n" (String.length str) filename

  (* 不是很理想, 因为 read_whole_chan 不会像 键盘输入或套接字之类的非文件流 *)
  ```

* 方法二: 使用 while 循环,以 抛出异常(exception)的方式从循环中退出

  ```ocaml
  open Printf
  let read_whole_chan chan =
    let buf = Buffer.create 4096 in
    try
      while true do
        let line = input_line chan in
        Buffer.add_string buf line;
        Buffer.add_char buf '\n'
      done;
      assert false (* This is never executed
              (always raise Assert_failure). *)
    with
      End_of_file -> Buffer.contents buf

  let read_whole_file filename =
    let chan = open_in filename in
    read_whole_chan chan

  let () =
    let filename = Sys.argv.(1) in
    let str = read_whole_file filename in
    printf "I read %d characters from %s\n" (String.length str) filename
  ```

* 方法三: 递归, 以 抛出异常(exception)的方式结束递归. 它不太容易理解

  ```ocaml
  open Printf

  let read_whole_chan chan =
    let buf = Buffer.create 4096 in
    let rec loop () =
      let line = input_line chan in
      Buffer.add_string buf line;
      Buffer.add_char buf '\n';
      loop () in
    try
      loop ()
    with
      End_of_file -> Buffer.contents buf

  let read_whole_file filename =
    let chan = open_in filename in
    read_whole_chan chan

  let () =
    let filename = Sys.argv.(1) in
    let str = read_whole_file filename in
    printf "I read %d characters from %s\n" (String.length str) filename
  ```

(注: 通道(channel) 应该就是所谓的 **文件流** 吧,类似于 stderr,stdio,stdin 之类的)




扩展
------

### 数组

数组的表达式形式为: `[| el; e2; e3; .... |]`, 和链表很像, 只是中括号二边多了 '\|' 符号.一个展示 for 循环的示例:

```ocaml
 let add_vect v1 v2 =
    let len = min (Array.length v1) (Array.length v2) in
    let res = Array.make len 0.0 in
    for i = 0 to len - 1 do
      res.(i) <- v1.(i) +. v2.(i)
    done;
    res;;

add_vect [| 1.0; 2.0 |] [| 3.0; 4.0 |];;
(* - : float array = [|4.; 6.|] *)
```

### 异常

```ocaml
exception Empty_list;;

let head l =
    match l with
      [] -> raise Empty_list
    | hd :: tl -> hd;;

head [1;2];;	(* - : int = 1 *)

head [];;		(* Exception: Empty_list. *)

(* 定义异常和定义 variant 一样.. *)

exception SomeLog of string;;

raise (SomeLog "hello");;
```

### 独立程序

使用 `ocamlc` 和 `ocamlopt` 编译 ml 文件,	打印斐波那契数字:

```ocaml
(* File fib.ml *)
let rec fib n =
  if n < 2 then 1 else fib (n-1) + fib (n-2);;
let main () =
  let arg = int_of_string Sys.argv.(1) in
  print_int (fib arg);
  print_newline ();
  exit 0
let () = main()
```

编译测试:

```bash
$ ocamlc -o fib fib.ml

$ ./fib 10
89
$ ./fib 20
10946
```




ocaml 命令行
------

ocaml 的命令行工具实在太多了,下边只是其中的几个.

```bash
ocaml.exe		# 单独输入这个则进去 top level,

ocamlc.exe		# 编译 mli, ml , 及 链接

ocamlopt.exe	#

ocamldoc.exe	#

#......
```

<br />
