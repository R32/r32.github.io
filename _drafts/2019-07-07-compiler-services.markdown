---
layout: haxe
title:  compiler-services(未完成)
date:   2019-07-07 11:55:12
categories: haxe
---

haxe 编译器在最早设计时, 就已经内嵌了语法服务功能, 以帮助编辑器更好地实现"智能语法提示"之类的功能

可以在 [compiler-services 官方文档] 查看一些细节, 但其好并没有并新到相应的 `haxe 4.0`
[compiler-services 官方文档]:https://github.com/HaxeFoundation/HaxeManual/blob/master/content/08-cr-features.md#compiler-services

<!-- more -->

## 新语法

基于 `JSON` 字符串, 但并没有相应的文档, 但可在 [vshaxe haxe-language-server] 获得一些提示
[vshaxe haxe-language-server]: https://github.com/vshaxe/haxe-language-server/blob/master/src/haxeLanguageServer/protocol/Display.hx

## 旧语法

语法为: `--display file@pos[@mode]`

#### file 

必须是以 .hx 结尾的文件, 使用绝对或者相对于执行命令的相对路径, 将不会在 `-cp path` 或 `-lib lib` 中的路径中查找

#### pos 

基于文件的 `unicode` 字符位置, 从 0 开始, 输出位置的行号和列号都从 1 开始.

> 在测试时可使用 `notepad++`, 点击状态栏中间的 `Ln: NN Col: XX` 来查看位置
> 由于 `@pos` 只接受基于 `unicode` 的参数, 因此测试时不要有其它字符.
>
> 对于测试点, 例如 `.` 或 `(`, `{` 的位置, 将是光标放在这些字符后边的位置, 
> 但是对于"标识符", 则是将光标放在标识符第1个字符前的位置

#### mod: 

由于正常的返回值将是 XML 字符串, 因此返回值的内容已经被 HTML 转义了.
如果返回值不是 XML 字符串, 或 JSON 字符串 则意味着错误.

* 语法提示: 省略了 `mode`时, 编译器将会自动识别如下, 不同类型将会得到不同返的结果

  - 字段访问: 例如: `"hello".`
  
    ```xml
    <list>
        <i n="NAME" k="var|method">
            <t>TYPE</t>
            <d>COMMENT DOCS</d>
        </i>
        <i n="charCodeAt" k="method">
            <t>(index : Int) -&gt; Null&lt;Int&tg;</t>
            <d>..........</d>
        </i>
    </list>
    ```

  - 类型路径: 当你在输入包名时, 例如: `haxe.io.`
  
    ```xml
    <!-- 和上边几乎一致, 只是 k 为 "type", 另二个 t 与 d 将为 空 -->
    <list>
        <i n="NAME" k="type">
            <t></t>
            <d></d>
        </i>
        <i n="Bytes" k="type"><t></t><d></d></i>
    </list>
    ```
  - `toplevel`: 参见下边的 toplevel
  
  不需要添加 `-D display-details`, 因为它似乎已经是默认形为

* **`position`**: 用于实现 "跳转到定义处", 除了mod 还需要指明 target, 如: `-js bin/test.js`* 
  *类似于在 vscode 或 vs2017 中按下 `F12`*
  ```xml
  <list>
      <pos>G:\test\src\Main.hx:7: characters 18-21</pos>
  </list>
  ```

* **`usage`**: 用于实现 "查找被引用", 
  *类似于在 vs2017 中按下 `Ctrl -` 或 vscode 中按下 `Alt 左箭头`*
  ```xml
  <list>
      <pos>G:\test\src\Main.hx:5: characters 3-6</pos>
      <pos>G:\test\src\Main.hx:9: characters 3-6</pos>
  </list>
  ```
* **`diagnostics`**: 诊断, 这个模式将忽略 pos 值, 当保存源码时, 可以执行此命令检测以潜在性的错误.

  其返回值为 JSON 字符串, 在此模式下行与列都是从 0 开始.

  ```JSON
  [
      {
          "file": "G:\\test\\src\\Main.hx",
          "diagnostics": [
              {
                  "kind": 2,
                  "severity": 1,
                  "range": {
                      "start": {
                          "line": 4,
                          "character": 2
                      },
                      "end": {
                          "line": 4,
                          "character": 7
                      }
                  },
                  "args": "Not enough arguments, expected arg:FooArg"
              }
          ]
      }
  ]
  ```
  
  除了模式为 `FILE@0@diagnostics` 的单文件诊断, 还可以直接使用 `diagnostics` 作为 `--display` 的参数, 表示**全局诊断**
  
* `statistics`: 静态分析, TODO: 返回结果为很长的 JSON 字符串


* `toplevel`: 将会输出一大堆 XML 串,

  ```xml
  <!-- k: 表示类别 -->
  <!-- p: 路径 -->
  <!-- t: 类型 -->
  <il>
  <i k="static" t="Void -&gt; FooArg">main</i>
  <i k="literal">null</i>
  <i k="literal">false</i>
  <i k="literal">true</i>
  <i k="static" t="(arg : FooArg) -&gt; Void">foo</i>
  <i k="literal">trace</i>
  <i k="type" p="Any">Any</i>
  </il>
  
  
  <il>
  <i k="local" t="Int">a</i>
  <i k="static" t="Void -> Unknown<0>">main</i>
  <i k="enum" t="MyEnum">MyConstructor1</i>
  <i k="package">haxe</i>
  <i k="type" p="Int">Int</i>
  <!-- ...... -->
  </il>
  ```

* `type`: 需要标识符上调用, 当有IDE 在某个标识符上有 `hover` 行为时用于给 tooltip 一些信息.

  ```xml
  <type p="position" d="docs comment"> type define </type>
  ```
* `signature`: TODO: 目前返回 JSON, 其内容和 type 类似, 但能用在函数上  而旧版本(XML)的 print_signature 用在报错时, 打印函数的签名.

* `package`: TODO:

* `resolve`: TODO:
  需要附加的 `@arg` 参数, `file@pos@mod@arg` 
* `workspace-symbols`: TODO: 感觉是 CompilationServer 用来缓存编译结果的, 我们不需要关心它
  可选的附加 `@arg` 参数, `file@pos@mod@arg` 
  需要连接 CompilationServer

### 重要

**1-based column numbers in compiler errors and warnings**

当以行号与列号表示位置时, 错误与警告的列位置将从 1 开始(haxe 4.0+)

**Unicode-aware lexer**

`@pos` 接收基于 unicode 的位置, 但是 `macro.position.make` 好像只接收 bin 格式的.

## 其它

`-D old-error-format` 并不会影响 `@pos` 所接受的值, 它只影响输出

通过查看 haxe 编译器的源码可以得知: `--display` 后可接受如下参数:

* JSON 格式字符串
* `"classes"`: 列出当前环境的顶层类 和包(包括由 haxelib 和 `-cp PATH`所引入的), 
* `"keywords"`: 列出所有关键字
* `"memory"`: 打印编译器服务器内存使用. (TODO: 指的是通过 haxe --wait [prot] 开启的服务?)
* `"diagnostics"`: 上边已经描述, 这个是全局 diagnostics
* 其它则当成 `file@pos@mod` 处理