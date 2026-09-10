---

layout: post
title:  c 语言技巧
date:   2023-03-23 09:23:10
categories: other

---

一些 c 语言技巧


使用 `#define` 代替 `struct` 来定义公共字段, 因为一些编译器可能不支持匿名结构(`unamed struct`),
而且 `struct` 默认对齐到 8 字节, 可能会有浪费.

```c
/* Common GC header for all collectable objects. */
#define GCHeader    GCRef nextgc; uint8_t marked; uint8_t gct
```

### 陷阱

- strncpy :
  strncpy 会将 dst 里 n 个字符只要超出的部分都清 0, 而不仅仅只是在尾部添加 '\0',
  因此避免使用 MAX 之类的例如 : `strncpy(dst, MAX_PATH, src)`, 对于
  gcc 有 `strlcpy` 可以使用. 而 msvc 有那个 `StringCchCopy`.

- `&` 优先级低于 `==`

<!-- more -->

### CLAMP

通过添加临时变量, 消除条件检测 `data` 时的副作用, 使得编译器能编译成 "无分支" 的语句.

```c
// 在 msvc, gcc 中都能被优化
#define CLAMP(data, min, max) do {   \
	int tmp = data;              \
	if (tmp < (min)) data = min; \
	if (tmp > (max)) data = max; \
} while (0)

// 在 gcc 中能被优化, 但 msvc 不能
#define CLAMP(data, min, max) data = (data) < (min) ? (min) : ((data) > (max) ? (max) : (data))

// 或者使用 inline 函数
static inline int clamp_int(int v, int lo, int hi)
{
	int t = v < lo ? lo : v;
	return t > hi ? hi : t;
}
```

### unsigned

在使用无符号数时, 要特别小心减号"-" 的使用, 对于 "+" 要考虑到溢出的情形(虽然很少有溢出的状况).

对于有符号的整形, 例如 `char`, `short` 向上扩展时, 要小心符号位扩展, 例如 :

```c
char c = 0x80;
int i = (unsigned char)c; // 扩展 char 前, 先同宽度转换符号.
```

对于有符号的整形, 右移时, 也要先转换成无符号的.

符号位填充（算术右移）的核心意义是：让右移操作在语义上等价于 "除以 2"

### 2次幂对齐

通常使用  `value & (16 - 1)` 来将数字限制在 0-15, 但如果要获得 value 距离对齐差多少时,

可使用 : `(-value) & (16 - 1)` , -1 的值是 0xFF, 那么 (0xFF & 15) 将得到 15 才能对齐到 16.


### 宏可选参数

```c
#define new(...)            newx(__VA_ARGS__,new4,new3,new2)(__VA_ARGS__)
#define newx(a,b,c,d,e,...) e
#define new2(a, t)          (t *)alloc(a, sizeof(t), alignof(t), 1, 0)
#define new3(a, t, n)       (t *)alloc(a, sizeof(t), alignof(t), n, 0)
#define new4(a, t, n, f)    (t *)alloc(a, sizeof(t), alignof(t), n, f)
```

### 移动数组元素

对于 `[1, 0, 0, 2, 0, 0, ... 3, ...]` 数组, 要清除 0 的单位, 如果不需要排序的情况下,
尝试从数组尾端往前移动, 比移动后一个元素简单

```c
int bitmap[] = {1, 0, 0, 2, 0, 0, 0, 3, 0, 0};
int i = 0;
int len = ARRAYSIZE(bitmap);
while (i < len) {
	if (bitmap[i] == 0) {
		if (resource[i]) {
			some_free(resource[i]);
			resource[i] = NULL;
		}
		bitmap[i] = bitmap[--len];
		resource[i] = resource[len];
	} else {
		i++;
	}
}
int available = len;
```

### Named initializer, with default values

```c
// I use this one all the time when writing
// video game.  One of the reason why I
// don't like to use C++.

// Let say we have this struct
struct obj {
    const char *name;
    float pos[2];
    float color[4];
};

// We can write a macro like this one
#define OBJ(_name, ...)             \
    (struct obj) {                  \
        .name = _name,              \
        .color = {1, 1, 1, 1},      \
        __VA_ARGS__                 \
    };

// Now we can use the macro to create new objects.
// This one with color defaulted to {1, 1, 1, 1}.
struct obj o1 = OBJ("o1", .pos = {0, 10});
// This one with pos defaulted to {0, 0}.
struct obj o2 = OBJ("o2", .color = {1, 0, 0, 1});
```

### gcc

查看编译器预定义的那些宏 :

```bash
# GCC 和 Clang 都适用
gcc -dM -E - < /dev/null
# 或者
clang -dM -E -x c /dev/null

# msvc
cl /P myprogram.c
```

使用 objdump 查看动态依赖 :

```
objdump -p hello.exe | grep "DLL"
```