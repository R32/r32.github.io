---

layout: post
title:  OCaml 相关
date:   2014-9-07 06:26:21
categories: other

---

[在线尝试编程](https://try.ocamlpro.com/)

[在 windows 中安装 ocaml](http://fdopen.github.io/opam-repository-mingw/installation/), 因为 linux 中安装简单没什么好说的.

* 不要使用 cygwin 自带的 ocaml, 因为它不包含 **opam**, 也没法编译一些库。

* 使用 cygwin, 但是得把之前通过 setup.exe 安装的 ocaml 和 flexdll 卸载(uninstall) 掉, 如果你有的话.

* 照着文档一步一步来(我是参照 Manual Installation 安装的)

编译 haxe 源码:

* 在 setup.exe 里选上 `mingw64-i686-zlib` 和 `mingw64-i686-pcre` (参考 Makefile.win 里的 dll 文件搜索)

* 通过 opam 安装 camlp4, 需要注意的是应该使用 mintty 来代替 bash 以防止乱码.

* 在 bash 里执行 `make haxe -j4 FD_OUTPUT=1 ADD_REVISION=1 -f Makefile.win` (第一次执行时必须编译 haxelib 因此先去掉 haxe)

* 如需开发 haxe 可以编译成字节码 `make haxe BYTECODE=1` 就可以了

<!-- more -->


接下来是 IDE 选择, 最重要的问题是 IDE 在调用命令是必须能调用 `cygwin/bin/bash`(需设置系统环境变量 `CHERE_INVOKING=1`，以防止 --login 时丢失目录),  但是这样做有一个副作用就是: 当从 "开始" 进入 "Cygwin Terminal" 时的当前目录会是 system32 下, 但可以通过可 `cd ~` 切回

* `vscode`: 需要需要使用 opam 安装 ocp-indent 和 merlin 来产生语法提示，选用 reason , 然后将 merlin 所在路径添加到 PATH. 例如: `cygwin/home/NAME/.opam/4.02.3+mingw32c/bin`

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
    "terminal.integrated.shell.windows": "E:\\cygwin\\bin\\bash.exe", // integrated 表示 ctrl+p 中集成的控制台
    "terminal.integrated.shellArgs.windows": ["--login"],
    "terminal.integrated.rightClickCopyPaste": false,

    "*.mly": "ocaml",
    "*.ml": "ocaml"
    },
    "[ocaml]": {
      "editor.tabSize": 4
    },
    "files.exclude": {
      "**/_build": true
    },
    "reason.server.languages": ["ocaml"]
  }
  ```

  ```cmd
  :: 一个 bash.bat 以后也许用得到.
  @echo off
  set CHERE_INVOKING=1
  if not "%1" == "" (
    E:\cygwin\bin\bash --login -c "%*"
  ) else (
    E:\cygwin\bin\bash --login
  )

  :: 例如把以下文件保存为 ocamlmerlin.bat 放在 dos 的路径文件夹, 但是目前没有一点用处
  :: E:\cygwin\bin\bash --login -c "ocamlmerlin %*"
  ```

  多个文件的编译要使 merlin 正确，先要用 ocamlc -c 编译出来一下, 再 touch 一下文件就好了

  > 可能需要添加 `.merlin` 文件来明确指出位置，格式可以参考 haxe 的源码。

  对于 tasks.json 和 launch.json 以后再弄,  现在使用 makefile TODO



[官方文档](http://ocaml.org/learn/tutorials/index.zh.html), 但网页引用了 google api, 你需要一个特殊的浏览器才能快速打开这个页面.

### 速记

API 文件建议参考 cygwin/lib/ocaml 下的 mli 文件, 一些方法会提示是否为 tail-recursive

* 和其它语言不一样的是, 字符串内的字符可以被修改。使用 `Bytes.set`

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

* 可选参数使用 `?` 作前缀, 命名参数使用 `~`(如果一个函数有二个参数最好是只定义一个"命令参数")

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
* 局部抽像类型: 通过 `(type a)` 声明一个伪参数, 可以创建一个新类型在构造模块时使用。

  ```ocaml
  let wrap_in_list (type a) (x:a) = [a];;

  module type Comparable = sig
    type t
    val compare: t -> t -> int
  end

  let create_comparable (type a) compare = (module struct
      type t = a
      let compare = compare
    end: Comparable with type t = a)

  (* 更多关于首类模块的示例 *)
  module type Bumpable = sig
    type t
    val bump: t -> t
  end

  (* 创建首类模块, 注意这里使用的是 let, 使得一个模块被包装成变量。 *)
  let create_bump (type a) = (module struct
    type t = a
    let bump x = x
  end : Bumpable with type t = a)

  (* 要使用首类模块，需要使用 val 解包为模块: *)
  module D = (val create_bump: Bumpable with type t = int);;
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
            # -c 参数表示仅编译不链接，（当ocamlmerlin找不到模块，没有语法提示时）

ocamlopt    # 原生代码编译器的前端, 生成 .o, .cmx 文件

ocamlbuild  # 用于编译复杂的项目，以 .byte 结尾的会被编译成字节码，而 .native 则为原生代码.
            # 并且能自动识别并且处理文件的依赖关系，即只要指定入口文件即可。
            # 重要: 如果源码发生变化，只需要删除 .byte 或 .native 文件，然后重新用 ocamlbuild 构建即可。
            # 不可以指定 "-o 输出名", 只能通过命令行例如 rename 来完成.
            # https://github.com/ocaml/ocamlbuild/blob/master/manual/manual.adoc

ocamldebug  #

ocamldoc    # 将注释转换成文档, 要使用2个星号作为注释起始, 例如: (**  *) "@" 为特定标记属性.
            # Argot 是另一个改进的 HTML 生成器.

camlp4      # 预处理，例如添加一些特殊的语法，或者像其它语言的"宏"的一样



# opam
ocp-indent  # 格式化源码
ocamlmerlin # IDE 需要它来提供智能提示

```

大都数情况下都是使用 `ocamlfind` 来编译项目.

```bash
ocamlfind ocamlc -c -syntax camlp4 -package
```


## misc

标准库下的 obj.ml 没有文档，它看上去有点像是 Reflect 之类的东西.

<br />
