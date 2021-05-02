---

layout: post
title:  OCaml 相关
date:   2014-9-07 06:26:21
categories: other

---

[在线尝试编程](https://try.ocamlpro.com/)

在 windows 中安装 ocaml

* 不要使用 cygwin 自带的 ocaml, 因为它不包含 **opam**, 也没法编译一些库。

* 使用 cygwin, 但是得把之前通过 setup.exe 安装的 ocaml 和 flexdll 卸载(uninstall) 掉, 如果你有的话.

* 照着 [opam-repository-mingw/installation](http://fdopen.github.io/opam-repository-mingw/installation/) 一步一步来(我个人是参照 Manual Installation 安装的, 那个自动安装包我没尝试过。)

<!-- more -->

编译 haxe 源码:

* 在 setup.exe 里选上 `mingw64-i686-zlib` 和 `mingw64-i686-pcre` (参考 Makefile.win 里的 dll 文件搜索)

  ```bash
  #通过参考 haxe/.github/workflows/main.yml
  make
  git
  zlib-devel
  rsync
  patch
  diffutils
  curl
  unzip
  tar
  m4
  perl
  libpcre-devel
  mbedtls-devel
  mingw64-$($env:MINGW_ARCH)-zlib
  mingw64-$($env:MINGW_ARCH)-gcc-core
  mingw64-$($env:MINGW_ARCH)-pcre
  perl-IPC-System-Simple
  ```

* 通过 opam 安装 camlp5, *(可用 mintty 来代替 bash 以防止乱码)*.

* 参考 Makefile 文件, 执行 `make -f Makefile.win` 即可

  ```bash
  # 构建 c 语言外部库, ** 这项已经被移除, 如果是旧项目, 需要在 libs 目录下执行一次 make clean **
  make libs

  # 构建 haxe 编译器, 可附加: ADD_REVISION=1
  make haxe -f Makefile.win

  ##
  # 对于 haxe 编译器快速开发, 编译成字节码似乎更合适: make haxe BYTECODE=1

  # 构建 haxelib
  make tools
  ```

### IDE 选择

**`vscode`**: 使用 opam 安装 ocp-indent 和 merlin 来产生语法提示，vscode插件安装 reason , 然后将 merlin 所在路径添加到 PATH. 例如: `cygwin/home/NAME/.opam/4.02.3+mingw32c/bin`

  settings.json:

  ```json
  {
    "reason.path.ocamlmerlin": "ocamlmerlin-server", // 最新版的
  }
  ```

### 速记

[官方文档](http://ocaml.org/learn/tutorials/index.zh.html), 但网页引用了 google api,
你需要一个特殊的浏览器才能快速打开这个页面.

API 文件建议参考 cygwin/lib/ocaml 下的 mli 文件, 一些方法会提示是否为 tail-recursive

* 整数字面量后缀: `l, L, n` 分别表示为 int32, int64, nativeint.

* Warning 40: 在 ocaml 中, 直接访问某一模块 record 的属性将会弹出这个警告, 例:

  ```ocaml
  module Foo = struct
    type point = {
      x: int;
      y: int;
    }
    let pos_new x y = {x; y}
  end

  let () =
    let p = Foo.pos_new 11 22 in
    print_int p.x (** Warning 40: x was selected from type Foo.point. *)
  ```

  除非你使用 open 将 Foo 包含进来, 例如下边的局部打开:

  ```ocaml
  let open Foo in
  let p = Foo.pos_new 11 22 in
  print_int p.x
  (* 或者 *)
  let p = Foo.pos_new 11 22 in
  print_int Foo.(p.x * p.x + p.y * p.y)
  ```

* 一些 API（外部库）在编译时需要指定：例如正则表达式匹配

  ```bash
  ocamlc str.cma hello_world.ml
  ocamlopt str.cmxa hello_world.ml
  # 在顶层交互环境，则使用 #load "str.cma" 来打开处部库
  # 当然使用 ocamlfind 编译时会有更简洁的参数。
  ```

* 和其它语言不一样的是, ocaml 字符串内的字符默认是可以被修改。使用 `Bytes.set`

  > 注: 字符串中间即使遇 `0` 还将继续输出后边的
  >
  > 用使编译参数 `-safe-string` 限制 `Bytes.set` 对 string 的更改

* 值(函数也是值)与类型有不同的命名空间，因此即使名字相同也不会存在冲突。

  ```ocal
  type haha = int (* 类型， 类型必须是小字母开头, 而变体枚举则必须大写字母开头 *)

  let haha = 101  (* 值(还是叫变量好了，虽然它不可变), 并不会与类型 haha 冲突  *)

  (* "模块名"首字母必须大写, 虽然文件名都是小写。
     "变体名"首字母必须大写,
     "类型名"首字母必须小写,
     "字段名"首字母必须小写, (record 的字段)
     "模块类型"（sig） 则没有大小写限定。
  *)
  ```

* 小括号 `()` 其实就相当于 begin/end, 对于一些嵌套的地方(比如多个 match 表达式)你可能需要使用 begin/end 来划分

  ```ocaml
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

* 函数的参数类型应该要用括号, 如果你要添加的话

  ```ocaml
  let sum (a:int) (b:int) = a + b

  let sum a b:int = a + b (* 注意这个 :int 指的是返回值类型，非 b 的类型 *)
  ```

* 可选参数使用 `?` 作前缀, 命名参数使用 `~`(如果一个函数有二个参数最好是只定义一个"命令参数")

  ```ocaml
  let foo ~arg1 = arg1 + 5;;
  foo ~arg1:123;;
  (* Optional named parameters *)
  let odp ?(ftw = "OMG!!") () = print_endline ftw;;
  odp ~ftw:"hi there" ();; (* 但是在调用时，还是得用 ~ 来命名参数 *)
  odp ();;

  let sum ~(x:int) ~(y:int) = x + y;;
  let sum ~x ~y = x + y;;
  sum ~x:1 ~y:2
  let x = 1 and y = 2 in sum ~x ~y;;

  (* 别名, 稍了解下就行了，因为会与类型名容易混淆不建议使用 *)
  let sum ~x:x1 ~y:y1 = x1 + y1;;
  let sum ~x:(x1:int) ~y:(y1:int) = x1 + y1;;
  ```

* 同时let多个绑定

  ```ocaml
  let a, b = 1, 2 ...

  let a = 1 and b = 2 in ..
  ```

* “等号” `=`, `==` 和 “不等号”: `<>`, `!=` 的区别: [stackoverflow...](https://stackoverflow.com/questions/1412668/),

  因此除非判断二个变量是否为相同的一个变量，否则一律使用 "=" 和 "<>" 来检测相等。

  ```ocaml
  (* 在 pervasives.ml 下可找到如下: *)
  external ( = ) : 'a -> 'a -> bool = "%equal"
  external ( <> ) : 'a -> 'a -> bool = "%notequal"

  external ( == ) : 'a -> 'a -> bool = "%eq"
  external ( != ) : 'a -> 'a -> bool = "%noteq"

  1 = 1       (* true  *)
  1 == 1      (* true  *)
  1.0 = 1.0   (* true  *)
  1.0 == 1.0  (* false *)
  "a" = "a"   (* true  *)
  "a" == "a"  (* false *)
  let v = "a"
  v = v       (* true  *)
  v == v      (* true  *)
  ```

* 操作符`|>` 与 `@@`, 通过查看 pervasives.ml 可知

  ```ocaml
  101 |> print_int  (* 相当于 print_int 101 *)

  let sum a b = a + b in
  101 |> (fun a -> sum a 202)

  print_int @@ 101  (* print_int 101, 感觉好像没什么用处, 因为不用写 @@ 也没关系 *)
  let sum a b = a + b in
  (fun a -> sum a 202) @@ 101

  (* 单个 @ 用来连接二个 List, 相当于 List.concat([1;2;3] [4;5;6]) *)
  [1; 2; 3;] @ [4; 5; 6]
  ```
* 类似于 interface 的东西, 请注意: `with` 的意思类似于局部更新，修改了 IPoint 的定义，使其中的某个类型暴露给外部使用。

  在 ocaml 中 `interface` 称为 `Module_type`, 局部更新的语法为: `<Module_type>: with type <type> = <type'> and <t2> = <t2'>`

  ```ocaml
  module type Bumpable = sig
    type t
    val bump: t -> t
  end

  module Float_Bumpable = struct
    type t = float
    let bump n = n +. 1.0
  end

  module Int_Bumpable: (Bumpable with type t = int) = struct     (* 修改了类型 t, 使它不再为抽象类型, 即暴露可见 *)
    type t = int                                                 (* 这里的 t 则是给 struct 内部用 *)
    let bump n = n + 1
  end

  module Int32_Bumpble: (Bumpable with type t := int32) = struct (* 注意 :=, 能直接修改, 称为破坏性修改 *)
    let bump n = Int32.add n 1l
  end


  (* 而函子/仿函数则是如下, 当然这个示例弄得不太好 *)
  module Make_Bumpble(Bump: Bumpable) = struct
    type t = Bump.t
    let bump = Bump.bump
  end
  ```


* 首类函数:

  ```ocaml
  (* 使用 let 将 module 与 module_type 绑定 *)
  let bumps = (module Int_Bumpable: Bumpable)

  (* 使用 val 来引用这个模块 *)
  module New_Bumpable = (val bumps: Bumpable)

  (* 当然即使指定为 Int_Bumpable 但是并没有暴露其属性给外部，因此要使用它还得: *)
  let int_bump = (module Int_Bumpable: Bumpable with type t = int)

  module New_Int_Bumpable = (val int_bump: Bumpable with type t = int)

  (* 感觉好像也没什么用处。。。。 *)


  (* 局部抽象类型, 通过 `(type a)` 声明一个伪参数, 可以创建一个新类型在构造模块时使用 *)
  let wrap_in_list (type a) (x:a) = [x];;   (* 感觉可看成 function<T> wrap_in_list(x: T) return [x]*)

  module type Comparable = sig
    type t
    val compare: t -> t -> int
  end

  let create_comparable (type a) compare = (module struct
      type t = a
      let compare = compare
  end: Comparable with type t = a)
  ```

* misc
  - 数组和 List 不一样的是, 数组的值像 mutable record 一样可变, 即: `arr.(0) <- 100`
  - List 下的方法, 大多数 rec_ 为前缀的方法才是 tail-recursive 形式的
  - incr/decr 用于 int ref 为增和减


### opam

ocaml 的包管理器。 在 windows 中，并不是所有库都可以成功安装，例如: 书中的 Core 库就无法安装。


### 命令行

```
ocaml       # 不添加任何参数的话，会进入到一个交互式的 CLI(不过一点也不好用)
            # 执行多个文件(需要先编译出另外的): ocaml c.cmo b.cmo a.ml

ocamlrun    # 执行字节码的可移植解释器

ocamlc      # 字节码编译器, 文件扩展名为 cmo, (可添加 -custom 嵌入运行时，以避免安装整个 ocaml)
            # ocamlc -i xxx.ml 可以在控制台输出其文件签名，可通过控制台重定向到一个 .mli 文件.
            # 例: ocamlc -o app.byte c.ml b.ml a.ml
            # 看上去整个编译流程与 c 语言相似, 需要手动指定各个文件, 不过 ocamlbuild 似乎可以解决这一点
            # -c 参数表示仅编译不链接，（当 ocamlmerlin 找不到模块，没有语法提示时）

ocamlopt    # 原生代码编译器的前端, 生成 .o, .cmx 文件

ocamlbuild  # 用于编译复杂的项目，以 .byte 结尾的会被编译成字节码，而 .native 则为原生代码.
            # 并且能自动识别并且处理文件的依赖关系，即只要指定入口文件即可。
            # 重要: 如果源码发生变化，只需要删除 .byte 或 .native 文件，然后重新用 ocamlbuild 构建即可。
            # 不可以指定 "-o 输出名", 只能通过命令行例如 rename 来完成.
            # https://github.com/ocaml/ocamlbuild/blob/master/manual/manual.adoc

ocamldebug  #

ocamldoc    # 将注释转换成文档, 要使用2个星号作为注释起始, 例如: (**  *) "@" 为特定标记属性.
            # Argot 是另一个改进的 HTML 生成器.

camlp4      # 预处理器，例如添加一些特殊的语法, 它是标准 ocaml 安装包的一部分
            # 例如如果把特殊语法写在 ml 文件内, 则通用 -pp 参数编译, 例:
            # ocamlc -pp camlp4o -c -o _build/hello.cmo hello.ml
            # 上边的示例在添加 -dsource 将会显示预处理后的源码。
            # 假如将特殊语法写在别的文件扩展名内, 则预处理输出, 例:
            # camlp4o lexer.mll -o lexer.ml
            # camlp4o parser.mly -o parser.ml
            # 注意: cygwin 下使用 bash 才会输出正常的文本, 而用 mini bash 会产生一个二进制的输出文件

camlp5      # 预处理器, 同 camlp4, 但它并非由标准安装包提供，需要另行下载
            # 它的关系和现在的 camlp4 非常混乱, 因为它以前就叫做 camlp4, 而现在 camlp4 在之前并不叫做 camlp4

# opam
ocp-indent  # 格式化源码
ocamlmerlin # IDE 需要它来提供智能提示
```

## misc

* ocamlmerlin: 用于产生语法提示

* [oasis](http://oasis.forge.ocamlcore.org/): 用于编译 ocaml 项目

* ocaml 4.02 之后官方宣传使用 `-ppx` 来代替 camlp4 的语法扩展, [a-guide-to-extension-points-in-ocaml](https://whitequark.org/blog/2014/04/16/a-guide-to-extension-points-in-ocaml/)

  > 因为 camlp4 的语法扩展不但缺乏文档, 而且使用非常复杂,

* lexer
  - genlex: (标准库) 一个简单快速的 lexer 生成器, 自带了几个简单的 token。 依赖 camlp4
  - [ocamllex]: ocaml 自带的命令行工具, 通常处理 `.mll => .ml`
  - ulex: lexer generator for Unicode, 使用的是 camlp4 语法扩展, sedlex 也是这个作者写的
  - [sedlex]: 同 ulex, 但使用的是 -ppx 语法扩展
* parser
  - ocamlyacc: LALR, ocaml 自带的命令行工具, , 通常处理 `.mly => .ml`
  - [menhir]: LR(1), 尝试取代 ocamlyacc 的另一个 parser generator
  - camlp4: LL(1), 使用了 camlp4 流扩展语法: `[< >]`

* 标准库的 genlex 是一个非常简单的 lexer 生成器, 依赖 camlp4。


[ocamllex]:http://caml.inria.fr/pub/docs/manual-ocaml/lexyacc.html
[sedlex]:https://github.com/alainfrisch/sedlex
[menhir]:http://gallium.inria.fr/~fpottier/menhir/

<br />
