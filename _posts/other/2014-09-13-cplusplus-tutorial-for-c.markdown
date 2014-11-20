---

layout: post
title:  C++ tutorial for C users
date:   2014-9-13 10:11:52
categories: other

---

原文: http://www.4p8.com/eric.brasseur/cppcen.html, 这里只记录一些 C++ 个人觉得好的的方法, 一些如 运算符重载(太过于混乱)或引用(个人习惯使用指针,为了避免弄混),将被丢弃.

默认使用 gcc 的 g++ 命令编译下边示例, 如果使用 gcc 则需加上 `-lstdc++`
<br />

<!-- more -->

#### 其它

 * `#ifdef __cplusplus` 一些源码能常见到的.

	> C++ 语言在编译的时候为了解决函数的多态问题，会改变函数名称，但 C 语言则不会，因此会造成链接时找不到对应函数的情况，此时C函数就需要用extern “C”进行链接指定，这告诉编译器， **请保持我的名称，不要给我生成用于链接的中间函数名**.

	```cpp
	#ifdef __cplusplus
		extern "C" { // extern C 修饰变量和函数按照 C 语言方式编译和连接;
	#endif
	
		void gme_clear_playlist( Music_Emu* );
		 	
	#ifdef __cplusplus
		}	// extern C 结尾
	#endif
	```

 
 * 函数后边跟 const, 表示这个函数不会修改成员变量.

	```cpp
	int current_track() const;
	
	//....
	
	int current_track() const{
		return x;
	}
	```

 * 初使化成员列表, 可以初使化 const 类型成员.

	> 如果有一个类成员, 类型为 类或结构, 而这个成员需要参数来初使化, 这时就需要对这个类成员进行初使化.

	```cpp
	class Vector{
	public:
		double x;
		double y;
		const double PI;
		Vector(): x(1.0), y(1.0), PI(3.1415926){
		
		}	
	};
	```
<br />

#### 头文件引用

C++ 的 `#include` 在引用头文件时, 不需要添加头文件扩展名 `.h`, 当 **引用标准 C 库时,需要以字母 c 开头**. C++ 的一些标准库需要添加命名空间 `using namespace std`

```c++
using namespace std;
#include <iostream>        // This is a key C++ library
#include <cmath>           // 标准 C 库 math.h

int main (){
   double a;
   a = 1.2;
   a = sin (a);
   cout << a << endl;	
   return 0;
}
```

对于引用 C 库, 个人还是更喜欢使用 C 的方式,即 `#include <math.h>`;

#### 输入和输出

从键盘输入和输出到屏幕可以使用 流操作 ` cout <<` 和 `cin >>`:

```c++
using namespace std;
#include <iostream>

int main()
{
   char s [100];             // s points to a string of max 99 characters

   cout << "This is a sample program." << endl;

   cout << endl;             // Just a line feed (end of line)

   cout << "Type your name: ";
   cin >> s;

   cout << "Hello " << s << endl;
   cout << endl << endl << "Bye!" << endl;

   return 0;
}
```

同样可以对文件流进行操作.

```cpp
using namespace std;
#include <iostream>
#include <fstream>

int main (){
   fstream f;

   f.open("test.txt", ios::out);

   f << "This is a text output to a file." << endl;

   double a = 345;

   f  << "A number: " << a << endl;

   f.close();

   return 0;
}
```

从文件中读取:

```cpp


using namespace std;
#include <iostream>
#include <fstream>

int main (){
   fstream f;
   char c;
   cout << "What's inside the test.txt file" << endl;
   cout << endl;
   f.open("test.txt", ios::in);
   while (! f.eof() ){
      f.get(c);                          // Or c = f.get()
      cout << c;
   }
   f.close();
   return 0;
}
```

cout 有 width(n)和 setw() 二个方法用于格式化输出. 这二个方法仅影响到下一次输出, 注意: 只一次.

```cpp
using namespace std;
#include <iostream>
#include <iomanip>

int main (){
   int i;
   cout << "A list of numbers:" << endl;
   for (i = 1; i <= 1024; i *= 2){
      cout.width (7);
      cout << i << endl;
   }
   cout << "A table of numbers:" << endl;
   for (i = 0; i <= 4; i++){
      cout << setw(3) << i << setw(5) << i * i * i << endl; 	// setw 有点像 \t 
   }
   return 0;
}
```


#### 变量声明及作用域

变量可以在代码的任意位置声明,大括号或 for 循环中都属于局部变量. 其实目前 C 是一样的.


#### 引用全局同名变量

```c++
using namespace std;
#include <iostream>
double a = 128;
int main (){
   double a = 256;
   cout << "Local a:  " << a   << endl;
   cout << "Global a: " << ::a << endl; // 注意 双冒号 的用法
   return 0;
}
```



#### 命名空间

使用 `::` 访问各命名空间下, 例如: `std::cout << "Hello" << std::endl`

```c++
using namespace std;
#include <iostream>
#include <cmath>
namespace first{
   int a;
   int b;
}
namespace second{
   double a;
   double b;
}
int main (){
   first::a = 2;
   first::b = 5;
   second::a = 6.453;
   second::b = 4.1e4;
   cout << first::a + second::a << endl;
   cout << first::b + second::b << endl;
   return 0;
}
```

#### 内联替换

inline 内联替换,常用于对性能有要求的小代码块,或常在宏替换中出现.

```haxe
using namespace std;
#include <iostream>
#include <cmath>
inline double hypothenuse (double a, double b){
   return sqrt (a * a + b * b);
}
int main (){
   double k = 6, m = 9;
   cout << hypothenuse (k, m) << endl;
   cout << sqrt (k * k + m * m) << endl;
   return 0;
}
```

#### 捕获异常

try,catch,throw

```haxe
using namespace std;
#include <iostream>
#include <cmath>
int main (){
   int a, b;
   cout << "Type a number: ";
   cin >> a;
   cout << endl;
   try{
      if (a > 100) throw 100;
      if (a < 10)  throw 10;
      throw a / 3;
   } catch (int result){ // 根据 throw 会抛出什么类型的异常
      cout << "Result is: " << result << endl;
      b = result + 1;
   } catch (const char * message){
	 
   }
   cout << "b contains: " << b << endl;
   return 0;
}
```

#### 默认参数

可以为函数定义默认参数. 

```c++
using namespace std;
#include <iostream>
double test (double a, double b = 7){
   return a - b;
}

int main (){
   cout << test (14, 5) << endl;    // Displays 14 - 5
   cout << test (14) << endl;       // Displays 14 - 7
   return 0;
}
```

如果 要将函数声明写到 头文件中去, 则把默认参数写在声明上,在函数定义那里就不要写了

```c++
// 函数声明
double test (double, double = 7)

// 函数定义
double test (double a, double b){
	return a - b;
}
```

#### 函数重载

C++ 的一个重要特性. 对于同名函数或方法,只要参数或返回值不一致, 将会自动重载. 其实就是编译器帮你改名了而已.

```c++
using namespace std;
#include <iostream>

double test (double a, double b){
   return a + b;
}
int test (int a, int b){
   return a - b;
}
int main (){
   double   m = 7,  n = 4;
   int      k = 5,  p = 3;

   cout << test(m, n) << " , " << test(k, p) << endl;

   return 0;
}
```

#### 模板

对于 C++ 的函数重载, 你当然不会想要为每个类型都写一个同名方法, 不知道是否应该叫做 **泛型**,或者 C++ 依靠模板实现泛型, 

```c++
template <class T> 
T minimum (T a, T b){
   T r;
   r = a;
   if (b < a) r = b;
   return r;
}

int main (){
   int i1, i2, i3;
   i1 = 34;
   i2 = 6;
   i3 = minimum (i1, i2);
   cout << "Most little: " << i3 << endl;
   double d1, d2, d3;
   d1 = 7.9;
   d2 = 32.1;
   d3 = minimum (d1, d2);
   cout << "Most little: " << d3 << endl;
   return 0;
}
```

多类型, 不过这种方式很混乱的..

```c++
template <class T1, class T2>
T1 minimum (T1 a, T2 b){
   T1 r, b_converted;
   r = a;
   b_converted = (T1) b;
   if (b_converted < a) r = b_converted;
   return r;
}
```


#### new delete

C++ 新的关键字. new 将返回一个对应的类型指针, 而 delete 将回收指针指向的内存. 像是 C 中的 malloc 和 free. 由于是关键字的原因,因此编译器能优化 new 和 delete.

```c++
using namespace std;
#include <iostream>
#include <cstring>

int main (){
   double *d;                     
   d = new double; 
   *d = 45.3; 
   cout << "Type a number: ";
   cin >> *d;
   *d = *d + 5;
   cout << "Result: " << *d << endl;
   delete d;     
   d = new double[15];   // 相当于 d = (double *) malloc(sizeof(double) * 15);
   d[0] = 4456;
   d[1] = d[0] + 567;
   cout << "Content of d[1]: " << d[1] << endl;
   delete [] d; 		// 相当于 free(d);
   int n = 30;
   d = new double[n];                 // new can be used to allocate an
                                      // array of random size.
   for (int i = 0; i < n; i++)   {
      d[i] = i;
   }
   delete [] d;
   char *s;
   s = new char[100];
   strcpy (s, "Hello!");
   cout << s << endl;
   delete [] s;
   return 0;
}
```

对于new double[n]之后,对于 delete 是否需要加上括号 `[]`: 


 > 《深度探索C++对象模型》P259的描述，“寻找数组维度给delete运算符的效率带来极大的影响，所以才导致这样的妥协：
 > 只有在中括号出现时，编译器才寻找数组的维度，否则它便假设只有单独一个objects要被删除。”

 * delete [] 释放空间,并且调用了每个对象的析构函数

 * delete 释放空间, 并且调用了第一个的析构函数

 * 对于 char,int,float,double,struct ,基本类型的对象没有析构函数,他们等价

<br />

#### 结构体

在标准 C中, struct 只能包含数据(定义函数指针也是蛮麻烦的).在 c++ 中, 可以包含 函数. 在 C++ 中, struct 其实和 class 区别不大.

```c++
using namespace std;
#include <iostream>

struct vector{
   double x;
   double y;
   double surface (){
      double s;
      s = x * y;
      if (s < 0) s = -s;
      return s;
   }
};

int main (){
   vector a = {x:5,y:6};
   cout << "The surface of a: " << a.surface() << endl;
   a.x = 7;
   cout << "The surface of a: " << a.surface() << endl;		
   return 0;
}
```

### 类

 * 如果定义了 构造函数或继承了虚函数的话,就不能用 大括号 进行初使化

 * class 默认成员访问为 private, struct 默认为 public.

 * class 继承默认是 private，而struct继承默认是public.

 * 对于 template <struct T>, 将报错为 未定义的类型, 因此需要写成 template <class T>

```c++
using namespace std;
#include <iostream>

class vector{
public:
   double x;
   double y;

   double surface ()
   {
      double s;
      s = x * y;
      if (s < 0) s = -s;
      return s;
   }
};

double ex_module

int main (){
   vector a;
   a.x = 3;
   a.y = 4;
   cout << "The surface of a: " << a.surface() << endl;
   return 0;
}
```

#### 构造函数和析构函数:

```c++
class person{
public:
   char *name;
   int age;

   person (const char *n = "no name", int a = 0)
      name = new char [100];                 // better than malloc!
      strcpy (name, n);
      age = a;
      cout << "Instance initialized, 100 bytes allocated" << endl;
   }

   ~person (){
      delete name;          // instead of free!
                            // delete [] name would be more
                            // academic but it is not vital
                            // here since the array contains
                            // no C++ sub-objects that need
                            // to be deleted.
      cout << "Instance going to be deleted, 100 bytes freed" << endl;
   }
};

int main (){
    cout << "Hello!" << endl << endl;
    person a;
    cout << a.name << ", age " << a.age << endl << endl;

    person b ("John");
    cout << b.name << ", age " << b.age << endl << endl;

    b.age = 21;
    cout << b.name << ", age " << b.age << endl << endl;

    person c ("Miki", 45);
    cout << c.name << ", age " << c.age << endl << endl;

    cout << "Bye!" << endl << endl;
   return 0;
}
```

#### 类声明和定义

大型项目中因为常常要把源码编译成 `.lib|.a|.so|` 库文件, 所以需要写成 .h 和 .cpp的形式, 

vector.h

```c++
class vector{
public:
   double x;
   double y;

   double surface();
};
```


vector.cpp

```c++
using namespace std;
#include "vector.h"

double vector::surface(){
   double s = 0;

   for (double i = 0; i < x; i++){
      s = s + y;
   }
   return s;
}
```

#### 派生和继承 

DERIVED and INHERITS

```cpp
using namespace std;

#include <iostream>
#include <stdio.h>
#include <math.h>

class Vector{
public:
	double x;
	double y;

	Vector (double a = 0, double b = 0){
		x = a;
		y = b;
	}

	double module(){
   		return sqrt(x*x + y*y);
	}

	double surface(){
		return x * y;
	}
	
	double sum(){
		return x + y;
	}
};

class TriVector: public Vector{		// TriVector 从 Vector 派生而来, 使用冒号 :.
public:
	double z;	// 增加成员属性

	TriVector(double a = 0, double b = 0, double c = 0):Vector(a,b){
		z = c;
									// Vector 构造函数将在 TriVector 构造函数之前被调用, 类似于 super(a,b)
									// 同样使用冒号 :.
	}
	
	TriVector(Vector a){			// 当出现赋值 trivector = vector 时.将自动调用这个方法. 值复制
		x = a.x;
		y = a.y;
		z = 0;
	}

	double module(){				// 重定义 module 方法, 不需要写 override 关键字
		return sqrt(x*x + y*y + z*z);
	}
	
	double sum(){
		return Vector::sum() + z;	// override, 由于 C++ 允许多继承, 所以其它语言的 super.method 的方式为这样.
	}
	
	double volume(){
		return this->surface() * z;
	}
};


int main(int argc, const char ** argv){
	Vector v(4,5);
	TriVector t(1,2,3);
	
	cout << "Surface of v: " << v.surface() << endl;
	cout << "Volume of t: " << t.volume() << endl;
	
	TriVector t2;
	t2 = v;			// 值复制, 自动调用 TriVector(Vector a) 方法, 做一些值修改
					// TriVector(Vector a) 必须要自已写.
	
	Vector v2;
	v2 = t;			// 值复制, z 值将会被自动丢弃
					// 编译器自动调用类似于 Vector(TriVector t),的方法, 不用自已实现
					
	cout << "Surface of t2: " << t2.surface() << endl;
	cout << "Surface of v2: " << v2.surface() << endl;	
	return 0;
}
```

#### 虚函数(virtual)

如下示例, 当一个 Vector 的指针指向 TriVector实例时, 当调用 module()时,指向的将是 Vector 的方法

```cpp
int main(int argc, const char ** argv){
	TriVector t(1,2,3);

	Vector *r = &t; // Vector指针, 但是指向 TriVector 的实例,
	
	cout << "module of r: " << r->module() << endl;		// output: 2.23607
	cout << "module of t: " << t.module() << endl;		// output: 3.74166
	return 0;
}
```

因此, 在上边示例中,如果 Vector 类的 module 加上 **virtual** 关键字,同样的示例 那么结果就不一样了:

```cpp	
	virtual double module(){
   		return sqrt(x*x + y*y);
	}

// ......上边同样的示例,

	TriVector t(1,2,3);
	Vector *r =  &t; // Vector指针, 但是指向 TriVector 的实例,
	
	cout << "module of r: " << r->module() << endl;		// output: 3.74166
	cout << "module of t: " << t.module() << endl;		// output: 3.74166	
``` 

结论: C++ 通过 virtual 来实现类似于 其它语言称为 Interface 的东西.

```cpp
using namespace std;
#include <iostream>
#include <math.h>

class Octopus{
public:
	virtual double module() = 0;	// = 0 强制方法未定义, 这可以使这个类无法被声明.
};

class Vector: public Octopus{
public:
	double x;
	double y;
	Vector (double a = 0, double b = 0){
		x = a;
		y = b;
	}
	double module(){
   		return sqrt(x*x + y*y);
	}
};


class Number: public Octopus{
public:
	double n;
	Number(double a = 0){
		n = a;
	}
	double module(){
   		return n>=0 ? n : -n;
	}
};


double biggest_module(Octopus *a){
	return a->module();
}


int main(int argc, const char ** argv){
	Vector v1(1,2), v2(6,7), v3(100,10);
	Number n1(5), n2(-3), n3(-150);

	cout << biggest_module(&v1) << " - " << biggest_module(&v2) << " - " << biggest_module(&v3) << endl;
	cout << biggest_module(&n1) << " - " << biggest_module(&n2) << " - " << biggest_module(&n3) << endl;
	return 0;
}
```

#### 访问控制

 * public: 公共

 * protected: 保护, 继承类可以访问基类的 protected 成员.

 * private: 私有

访问继承, 例如: `class Vector: public Octopus{}`



| 基类            | public     | protected  | private |
| -------------- | ---------- | ---------  | ------- |
| public 继承     | public     | protected |  不可见  |
| protected 继承  | protected  | protected |  不可见  |
| private 继承    | private    | private   |  不可见  |

 

#### 多重继承

用逗号 , 分隔就好了. 大多数语言只能单个继承(因为它们能实现多个接口). 

```cpp
// 省略基类

class TriVector: public Vector, public Number{
	TriVector(double a, double b, double c): Vector(a,b),Number(c){
		
	}
}
```


#### 静态字段

C++ 中 **静态成员变量不能在类的内部初始化**,只能在外部初使化.在初始化值时也必须加上类型. 通过 className::fieldName 双冒号形式访问静态字段.

注: 被限定为 const 的变量可以在声明时初始化.

```cpp
class Vector{
public:
   double x;
   double y;
   static int count;
   static const double PI = 3.1415926;

   Vector (double a = 0, double b = 0){
      this->x = a;
      this->y = b;
      count++;
   }
   ~Vector(){
      count--;
   }
};
int Vector::count = 0; // 外部初使化, 并且加上类型, 这里是 int
```

<br />




