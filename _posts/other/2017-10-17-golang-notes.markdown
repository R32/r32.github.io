---

layout: post
title:  golang 相关
date:   2017-10-17 08:15:21
categories: other

---

[golang.google.cn](https://golang.google.cn/) 不需要翻墙

  在线文档能直接在网页上运行一些示例, 而且国内的翻译版文档并非最新，而且翻译质量有点不太好。

  本地文档: 在 CMD 下键入:(任意目录) `godoc -http :6060`,

<!-- more -->


### hello world

```go
// 文件 App.go
package main                     // 包名, 这个名字与其所在路径无关
                                 // 但却是以目录作为"模块"的，因为同一个目录下不可以有多个包存在
                                 // 有时候需要使用相对路径前缀即: `./sub/some` or `../sub/other`
import(
    "fmt"                        // 包名使用字符串导入。
    "fmt/rand"                   // 包名 + 子目录名
)
func main() {                    // 入口函数, 无参数无返回值。
    fmt.Println(Foo);            // 调用 Foo 文件中的 Foo 变量，只要是首字母大写的就可以。

    var a = [...]int32 {0, 1, 2} // [...] 表示固定数组，而非 slice, 不过感觉还是写上明确的数量才好。

}

// 文件 Foo.go
package main
var Foo = 10101;                 // 类型写在变量后边，但是没有":"符号, 能明确变量类型的地方可以不用写
```

### notes

* 名为 `func init(){}` 的函数用于初使化, 类似于 haxe 中的一个类的 `static function __init__(){}`

* 通过 `.(type)` 的方式获得 `interface{}` 类型的变量, 用于断言.

  ```go
  var i = foo().(int)     // assert 如果, foo 返回的不是 int 类型
  var j, ok = foo().(int) // 即使返回的非 int 类型，也不会产生 panic
  ```

* `fmt.Printf` 支持 `%v` 可以将整个变量传给它。

  ```go
  // 打印 []byte 时, 使用 ("% x", bytes) 多出一个空格, 能更好地查看其数据
  // "%T"  用于某个变量的打印类型, 例如 'x' 将为 int32
  // "%+v" 可在打印结构时，额外打印其字段名
  ```

* 字符串底层编码为 utf8, 而 unicode 为 32位.(看上去对中文处理不太友好)

* `byte` & `bytes`

  ```go
  var c = byte('k')              // byte
  var a = [32]byte{}             // array of byte
  var a1 = [...]byte{1,2,3,4,5}  // array of byte
  var b = []byte("hello world")  // slice
  ```

* 序列化: 例如 json, xml, binary, 由于使用了 reflect 因此结构的字段名有时候需要 **首字母大写** 才能成功。

  ```go
  // 可使用 `` 来注释字段名, `struct field tags` 更多细节可参见 .Marshal
  struct {
    Header string   `json:"header"`
    Body   string   `json:"body"`           // 字段名为: "body", 注意 tag 不可以有空格
                    `json:"div,omitempty"`  // 如果值为空，则忽略当前字段
                    `json:"-"`              // 忽略这个字段
                    `json:"-,"`             // 字段名为:  "-"
                    `json:",string"`        //
                    `json:"name" xml:"name"`// 多个 tag 之间使用空格分隔, 注意不同 tag 之间的差异。
  }
  struct {
    XMLName   xml.Name `xml:"person"`       // 这个将作为 xml 的根节点
    Id        int      `xml:"id,attr"`
    FirstName string   `xml:"name>first"`
    LastName  string   `xml:"name>last"`
    Age       int      `xml:"age"`
    Height    float32  `xml:"height,omitempty"`
    Married   bool
    Address
    Comment string `xml:",comment"`
  }
  ```

* golang 变量在定义时没有初使化时会赋值为"零"值, 而其它语言大多数为 undefined.

* go 语言有一个最大的特点就是 "不加行尾分号", 感觉一点也不习惯。

* 与 c 语言一样, go 的结构体也是传值, 因此可能在很多地方需要使用指针:

  ```go
  type point struct {             // 使用 type, 结构名在 struct 前边.
    x int;
    y int;
  }
  func (p point) LengthSq() int { // 函数必须显示地声明返回值类型
    return p.x * px + p.y * p.y
  }
  var p1 = point{101, 202}        // 初使化值用逗号分隔，这时必须填写所有字段。
  var p2 = point{x: 9}            // 类似于 JSON 的语法，这时字段变成为可选。
  fmt.Println(p1.LengthSq())
  fmt.Println(p2);
  ```

  在初始化 struct 时，最后一个字段也要添加分隔符 "," 否则 "}" 不能单独放在新行

  结构体的初使化，将使用各类型的默认值。 数值对应 0, string 则对应空字符串 ""......

* 在 golang 中从函数中返回一个局部指针是合法的, 编译器会做"逃逸分析"而将它们通过 gc 分配。（golang 是否将所有的类似于 c 语言在 stack 上定义的结构全部通过 gc 分配了?）

  > If you need to know where your variables are allocated pass the "-m" gc flag to "go build" or "go run"
  > (e.g., `go run -gcflags -m app.go`).

* 如果参数类型或变量的类型是接口，则 **不要** 加指针符 "*",

* golang 允许返回多个值, 因此在查看 API 时要特别注意这一点, 以免和参数搞混。

* 固定数组(`[N]type`)和结构体一样使用"值"传递, 而 slice(`[]type`) 则为指针类型。

  slice 可由 make 来创建, 例: `var s = make([]int, len, cap) // 最好省略掉最后那个参数，因为反正也没有 push 方法`;

  不过, 固定数组可通过类似于 `a[0:]` 的语法将其转换成指向同一内存块(无 append 操作的情况下)的 slice

  使用 append(slice, val...) 向其后添加元素后(相当于 `s[len] = xx`), 如果 cap 的值不够则 **将会返回新的 slice**,

  ```go
  // 使用 range 来迭代 slice.
  for i, v := range myslice {
    fmt.Printf("index: %d, value: %d\n", i, v)
  }
  ```

* 和 ocaml 或其它语言一样, 使用 `_` 来忽略某个多返回值。

* 如果我们有一个指向结构体的指针 p ，那么可以通过 (*p).X 来访问其字段 X 。
不过这么写太啰嗦了，所以语言也允许我们使用隐式间接引用，直接写 p.X 就可以。

* map:

  ```go
  var m = make(map[string] int32) // StringMap<Int>
  m["a"] = 97
  var elem, ok = m["a"]
  delete(m, "a")
  ```

* 函数类型: 不过感觉可读性太性太差。

  ```go
  func compute(f func(int32, int32) int32) int32 {
    return f(101, 202);
  }
  ```

* 枚举: `const + iota`

  ```go
  const (
    a int32 = 1 + iota
    b
    c
  )
  ```

* 变长参数，和反射

  ```go
  func test(values ...interface{}) {
    for _, val := range values {
        switch v := val.(type) {
        case int:
            fmt.Println("val type is int ", v)
        case float64:
            fmt.Println("val type is float ", v)
        case string:
            fmt.Println("val type is string ", v)
        case bool:
            fmt.Println("val type is bool ", v)
        case Person: // 要区分是 struct 还是指针。
            fmt.Println("val type is Person ", v.name)
        case *Person:
            fmt.Println("val type is *Person ", v.name)
        default:
            fmt.Println("val type is unknow ", v)
        }
    }
  }
  ```

* 通过类型转换来实现接口: 参考: `type http.HandlerFunc`

  ```go
  // 只有一个函数的接口:
  type Handler interface {
    ServeHTTP(ResponseWriter, *Request)
  }
  // 定义一个函数类型
  type HandlerFunc func(ResponseWriter, *Request)
  // 并为这个类型实现上边的那个方法, 注: 当类型非 struct 时, 不要添加指针符号: "*"
  func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
    f(w, r)
  }
  // 自定义一个与 HandlerFunc 一样签名的方法
  func myJSONHander(w ResponseWriter, r *Request) {
    fmt.Fprintf(w, "hello world!")
  }
  // 强制转换为 type HandlerFunc, 由于它实现了 Handler, 因此它就可以作为 Handler 类型的参数。
  HandlerFunc(myJSONHander)
  ```


### 命令行

编译这一块, 如果 main 模块有几个不同的文件，那么在编译时需要手动指出:(似乎并不需要明确顺序)

```bash
go run App.go Foo.go
```

### issues

* 如果未使用 import 导入的模块， 或某个变量定义了却未使用，或你没有使用变量去接收函数的返回值，将会报错，而不是警告。

  > 也许有个什么编译参数可以忽略这个?

