---

layout: post
title:  golang 相关
date:   2017-10-17 08:15:21
categories: other

---

[在线尝试 tour 中文](https://tour.go-zh.org/welcome/1)

[标准库中文](https://studygolang.com/pkgdoc)

<!-- more -->


### hello world

```go
// 文件 App.go
package main                     // 包名, 这个名字与其所在路径无关
                                 //
import(
    "fmt"                        // 包名使用字符串导入。
    "fmt/rand"                   // 包名 + 子目录名
)
func main() {                    // 入口函数, 无参数无返回值。
    fmt.Println("Hello %d",Foo); // 调用 Foo 文件中的 Foo 变量，只要是首字母大写的就可以。
}

// 文件 Foo.go
package main
var Foo = 10101;                 // 类型写在变量后边，但是没有":"符号, 能明确变量类型的地方可以不用写
```

### notes

* `fmt.Printf` 支持 `%v` 可以将整个变量传给它。

* 字符串底层编码为 utf8, 而 unicode 为 32位.(看上去对中文处理不太友好)

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

  var p1 = point{101, 202}        // 初使化值用逗号分隔。
  var p2 = point{x: 9, y: 8}      // 类似于 JSON 的语法。
  fmt.Println(p1.LengthSq())
  fmt.Println(p2);
  ```

  有一个很严重的就是在 struct 初始化时，最后的 "}" 不能单独放在新行，否则报错。

  结构体的初使化，将使用各类型的默认值。 数值对应 0, string 则对应空字符串 ""......

* 在 golang 中从函数中返回一个局部指针是合法的, 编译器会做"逃逸分析"而将它们通过 gc 分配。（golang 是否将所有的类似于 c 语言在 stack 上定义的结构全部通过 gc 分配了?）

  > If you need to know where your variables are allocated pass the "-m" gc flag to "go build" or "go run"
  > (e.g., `go run -gcflags -m app.go`).

* func(p point)` 与 `func(p *point)` 的区别:

  ```go
  // 前者会自动翻译成: 因此你在函数内部改变其属性值，并不会更新到外边。
  int lenSq(point p);

  // 而后者则为:
  int lenSq(point* p);
  ```

* 如果参数是接口类型，则 **不要** 加指针符 "*",

* golang 允许返回多个值, 因此在查看 API 时要特别注意这一点, 以免和参数搞混。

* slice（包括未定义大小的数组，因此 slice 的类型就写成 `[]type`） 是指针类型，注意与固定数组相区别。

  slice 可由 make 来创建, 例: `var s = make([]int, len, cap)`;

  使用 append(slice, val...) 向其后添加元素后(相当于 `s[len] = xx`), 如果 cap 的值不够则 **将会返回新的 slice**, 即它们不再指向相同的对象。

  > 实际上你必须使用一个变量接受 append 的返回值，否则无法通过编译。


  使用 range 来迭代 slice.

  ```go
  for i, v := range myslice {
    fmt.Printf("index: %d, value: %d\n", i, v)
  }
  ```

* 和 ocaml 或其它语言一样, 使用 `_` 来忽略某个多返回值。

### 命令行

编译这一块, 如果 main 模块有几个不同的文件，那么在编译时需要手动指出:(似乎并不需要明确顺序)

```bash
go run App.go Foo.go
```

### issues

* 如果未使用 import 导入的模块， 或某个变量定义了却未使用，或你没有使用变量去接收函数的返回值，将会报错，而不是警告。

  > 也许有个什么编译参数可以忽略这个?



