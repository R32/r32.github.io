---

layout: post
title:  c 语言技巧
date:   2023-03-23 09:23:10
categories: other

---

一些 c 语言技巧


可以使用 `#define` 代替 `struct` 来定义公共字段, 因为一些编译器可能不支持匿名结构(`unamed struct`),
还有 `struct` 可能因为要对齐, 浪费了字节.

```c
/* Common GC header for all collectable objects. */
#define GCHeader    GCRef nextgc; uint8_t marked; uint8_t gct
```

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
```

### unsigned

在使用无符号数时, 要特别小心减号"-" 的使用, 对于 "+" 要考虑到溢出的情形(虽然很少有溢出的状况).

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
