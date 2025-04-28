---
title: Effective Modern C++笔记
hide: false
math: true
abbrlink: 33835
date: 2025-04-28 10:30:31
index\_img:
banner\_img:
category:
 - coding
 - C++
tags:
---

样例代码可参考[GitHub - BartVandewoestyne/Effective-Modern-Cpp](https://github.com/BartVandewoestyne/Effective-Modern-Cpp)，这里记录一些自己觉得重要的有意思的点，本文中自己实现的用力位于[GitHub - wty-yy-mini/effective-modern-cpp-examples](https://github.com/wty-yy-mini/effective-modern-cpp-examples)

这是一本介绍C\+\+11, 14特性的书籍，适合从C或C\+\+98转向新版特性的人学习，由于我要提高在ROS中的C++编程效率，所以也需要学习该书籍

我使用的系统为Ubuntu24.04，编译器为g++ 13.2.0（台式机）和11.4.0（笔记本）

## 常用基础
### 查看型别
学会查看实参或形参的型别方法可以方便理解，查看[Item4-查看型别的3中方法](./#item4查看型别的3种方法)，这里给出一个头文件`my_show_type.hpp`，后续代码中可能用此文件中函数显示型别，编译中使用`g++ -I <hpp文件路径> ...`来找到头文件：
{% spoiler 点击显/隐 my_show_type.hpp %}
```cpp
// my_show_type.hpp 用于显示模板形参的型别
#pragma once

#include <iostream>
#include <boost/type_index.hpp>
using std::cout;
using boost::typeindex::type_id_with_cvr;

#define PRINT_TYPE(x) (cout << type_id_with_cvr<decltype(x)>() << '\n')

template<typename T> void show_type_copy(T x) { cout << type_id_with_cvr<decltype(x)>() << '\n'; }
template<typename T> void show_type_lref(T &x) { cout << type_id_with_cvr<decltype(x)>() << '\n'; }
template<typename T> void show_type_rref(T &&x) { cout << type_id_with_cvr<decltype(x)>() << '\n'; }
```
{% endspoiler %}

### 术语
| 名称 | 英文名 | 含义 |
| - | - | - |
| 型别 | type | 参数的数据类型 |
| 形参 | parameter | 函数定义中的参数 |
| 实参 | argument | 调用函数时传入的实际参数 |
| 左值 | lvalue | 存在持久地址的对象，可执行取地址操作`&x` |
| 右值 | rvalue | 没有持久地址的临时对象，例如`1+2, x*2` |
| 代理类 | proxy class | 一种变成思路，访问它前后植入控制逻辑，例如`bool`型别指针代理为`std::vector<bool>::reference` |

### 饰词的位置
在C++中装饰词`const, volatile`既可以在型别的前面也可以在后面
```cpp
// 如下定义的x, y型别都一致
const char x;
char const x;
volatile char const y;
char const volatile y;
// 指向const char的const指针
char const* const ptr;
const char* const ptr;
```

## 自我总结
由于我对有些C\+\+的基础还是不了解，这里总结一些我没见过但是感觉有用的内容

### 类型标识符使用typename
在C\+\+11后推荐使用`typename`作为类型标识符，虽然以下这两种写法是等价的
```cpp
template<typename T> class TD;
template<class T> class TD;
```
并且`typename`可以用来强调类型，这一点在[Item9](./#item9优先使用using而非typedef)中提到，当使用模板参数作为型别时，必须需要在前面加上`typename`

### 模板特化 (template specialization)
```cpp
#include <my_show_type.hpp>

template<typename T>
void func(T x) { cout << "HI! "; PRINT_TYPE(x); }

template<>  // 对bool的特化
void func<bool>(bool x) { cout << "HI! You are bool!" << '\n'; }

template<typename T>
void func(T* x) { cout << "HI ptr! "; PRINT_TYPE(x); }

template<>  // 对bool*的特化
void func<bool>(bool* x) { cout << "HI ptr! You are bool ptr!" << '\n'; }

int main() {
    int x = 10;
    bool flag = false;
    func(x);
    func(true);
    func(&x);
    func(&flag);
    return 0;
}
```

## 重要准则
这里和《Effective Modern C++》中的准则顺序一致，对其进行进一步总结，并给出自己尝试的用例，全部用例请见：[GitHub - wty-yy-mini/effective-modern-cpp-examples](https://github.com/wty-yy-mini/effective-modern-cpp-examples)

### Item1：模板型别推导
- 模板型别推导时，引用型实参会被当成非引用型处理，也就是实参中引用的记号`&`会直接被无视
- 模板中存在万能指针（Universal Reference, URef）`&&`时，左值会被作为左值引用处理
    ```cpp
#include <iostream>
#include <boost/type_index.hpp>
using boost::typeindex::type_id_with_cvr;
using std::cout;

template<typename T>
void f(T&& param) {
  cout << type_id_with_cvr<T>() << ", ";
  cout << type_id_with_cvr<decltype(param)>() << '\n';
}

int main()
{
  int x = 27;
  const int cx = x;
  const int& rx = x;

  f(x);                   // x is lvalue, so T is int&,
                          // param's type is also int&

  f(cx);                  // cx is lvalue, so T is const int&,
                          // param's type is also const int&

  f(rx);                  // rx is lvalue, so T is const int&,
                          // param's type is also const int&

  f(27);                  // 27 is rvalue, so T is int,
                          // param's type is therefore int&&
}
    ```
- 模板形参为按值传递时，则无视型别的cvr（const, volatile, reference）饰词，直接传入型别，需要注意`const char* const`去除掉**指针**的饰词变为`const char*`
- 模板型别推导时，数组和函数在**按值传递**时退化为指针，在**形参引用**时不会退化
    ```cpp
#include <iostream>
#include <boost/type_index.hpp>
using std::cout;
using boost::typeindex::type_id_with_cvr;

// 模板按值传递 (发生退化)
template<typename T> void func(T x) { cout << type_id_with_cvr<decltype(x)>() << ", "; }
// 模板引用形参 (不会退化)
template<typename T> void func2(T &x) { cout << type_id_with_cvr<decltype(x)>() << '\n'; }
// 模板传递数组模板 (获取数组大小N)
template<typename T, size_t N> decltype(auto) arraySize(T (&s)[N]) { return N; }

void call_func(void (&f)()) { f(); }  // 指定的函数引用
template<size_t N>  // 必须手动获取数组大小 N
void show_array_size(char (&s)[N]) { cout << "array=" << s << ", size=" << N << '\n'; }

void foo() { cout << "foo!" << '\n'; }
void bar(int a) { cout << "bar!" << '\n'; }

int main() {
    auto a = 1;
    func(foo), func2(foo);  // void (*)(), void (&)()
    call_func(foo);  // foo!
    // call_func(bar);  // 报错
    func(bar), func2(bar);  // void (*)(int), void (&)(int)
    char s[] = "abc123def";
    cout << type_id_with_cvr<decltype(s)>() << '\n';  // char [10]
    func(s), func2(s);  // char*, char (&) [10]
    show_array_size(s);  // array=abc123def, size=10
    const char* const ptr = s;
    func(ptr), func2(ptr);  // char const*, char const* const
    cout << arraySize(s) << '\n';  // 10
    // cout << arraySize(ptr) << '\n';  // 报错
    return 0;
}
    ```

### Item2：auto型别推导
- `auto`型别推导与模板型别推导一致，除去以下两种情况：
    - 假定用大括号初始化表达式为`std::initializer_list<T>`类型，而模板型不会
    - 函数返回值或lambda形参中使用auto，表示使用模板型推导，而非auto型推导
```cpp
#include <my_show_type.hpp>

int main() {
    auto x = {1, 2, 3};
    auto func = [](auto x) { cout << x.size() << '\n'; };
    func(x);  // 3
    show_type_lref(x);  // std::initializer_list<int>&
}
```

### Item3：decltype型别推导
- `decltype`会直接得到变量或表达式的型别，除去以下一种情况：
    - 当表达式中加上括号`(x)`, `(((x)))`, ...，就会得到`T&`类型
    ```cpp
#include <my_show_type.hpp>

decltype(auto) func() {
    int x = 1;
    return x;  // int ()
    // 加上括号会返回引用
    // return (x);  // int& ()
    // return ((x));  // int& ()
}

int main() {
    cout << type_id_with_cvr<decltype(func)>() << '\n';
    return 0;
}
    ```
- C\+\+14支持`decltype(auto)`可以直接推导出auto的型别

### Item4：查看型别的3种方法
存在3中方法
1. IDE自动推理，将鼠标放上去即可看到推理的数据类型（如VsCode加上C++插件），可能很慢
2. 编译器报错显示，本质上就是通过编译报错中的显示内容，判断当前的数据类型
    ```cpp
template<class> class TD;  // Type Display

template<typename FuncType, typename ValueType>
decltype(auto) call(FuncType func, ValueType value) {
    // error: ‘TD<void (*)(int)> FuncTypeDebug’ has incomplete type
    TD<FuncType> FuncTypeDebug;
    return func(value);
}

void hi(int a);

int main() {
    call(hi, 5);
    auto a{5};
    auto* b = &a;
    // error: aggregate ‘TD<int> TypeADisplay’ has incomplete type and cannot be defined
    TD<decltype(a)> TypeADisplay;
    // error: aggregate ‘TD<int*> TypeBDisplay’ has incomplete type and cannot be defined
    TD<decltype(b)> TypeBDisplay;
    // error: aggregate ‘TD<void> TypeCallDisplay’ has incomplete type and cannot be defined
    TD<decltype(call(hi, 5))> TypeCallDisplay;
    return 0;
}
    ```
3. （推荐）用`boost::typeindex::type_id_with_cvr`输出类型，该函数模板返回`boost:typeindex::type_index`，可以使用成员函数`pretty_name`产生可读的`std::string`类型，直接用`cout <<`也可以转为可读类型显示
    ```cpp
#include <iostream>
#include <boost/type_index.hpp>
using std::cout;
using boost::typeindex::type_id_with_cvr;

template<typename FuncType, typename ValueType>
decltype(auto) call(FuncType func, ValueType value) {
    cout << type_id_with_cvr<FuncType>() << '\n';
    return func(value);
}

void hi(int a) {};

int main() {
    call(hi, 5);  // void (*)(int)
    auto a{5};
    auto* b = &a;
    char c[] = "abc";
    auto s{"abc"};
    auto& s2{"abc"};
    cout << type_id_with_cvr<decltype(a)>().pretty_name() << '\n';  // int
    cout << type_id_with_cvr<decltype(b)>() << '\n';                // int*
    cout << type_id_with_cvr<decltype(call(hi, 5))>() << '\n';      // void
    cout << type_id_with_cvr<decltype(c)>() << '\n';                // char [4]
    cout << type_id_with_cvr<decltype(s)>() << '\n';                // char const*
    cout << type_id_with_cvr<decltype(s2)>() << '\n';               // char const (&) [4]
    return 0;
}
    ```

### Item5,6：推荐使用auto
- 使用auto类型作为变量初始化，可避免空内容的问题，打字更快
- 代理类可能导致auto推理出意想不到的型别，例如`std::vector<bool>::reference`
```cpp
#include <my_show_type.hpp>
#include <vector>
using std::vector;

int main() {
    vector<bool> vb(5);
    auto a = vb[0];
    PRINT_TYPE(a);  // std::_Bit_reference
    bool b = vb[0];
    PRINT_TYPE(b);  // bool
    auto c = static_cast<bool>(vb[0]);  // 强调进行了型别变换
    PRINT_TYPE(c);  // bool

    auto x = 0.9;
    PRINT_TYPE(x);  // double
    auto y = static_cast<float>(x);  // 强调进行型别变换
    PRINT_TYPE(y);  // float
    return 0;
}
```

### Item7：可以使用{}创建对象

- 使用`{}`创建对象优点：窄化变换时会报错，从`float/double -> int`；当没有初始化参数创建对象时，写`Foo foo();`会被视为函数声明，但是`Foo foo{};`仍然可用，为什么不直接写`Foo foo;`呢？
- 缺点：初始化函数中有`initialize_list<T>`变量时，且存在将传入的实参转为`initialize_list<T>`的可能性时，则一定会调用该函数，无视其他初始化函数
- 在使用vector时，用`{}`就一定会用`initializer_list`初始化
```cpp
#include <my_show_type.hpp>
#include <vector>

class First {
    public:
    First(int a) { cout << "init 1-1" << '\n'; }
};

class Second {
    public:
    Second(int a, int b) { cout << "init 2-1" << '\n'; }
    // 如果存在可转换数据类型的std::initializer_list, 大括号就一定会调用该函数
    Second(std::initializer_list<int> x) { cout << "init 2-2" << '\n'; }
    Second(std::string a, int b) { cout << "init 2-3" << '\n'; }
};

class Third {
    public:
    Third(std::string a, float b) { cout << "init 3-1" << '\n'; }
    Third(std::initializer_list<std::string> x) { cout << "init 3-2" << '\n'; }
};

int main() {
    First a(4.0);  // init 1-1
    // First a2{4.0};  // 报错, 无法进行窄化变化(narrowing conversion), 从double->int会损失精度
    First a2{static_cast<int>(4.0)};  // init 1-1
    First a3(true);  // init 1-1, bool -> int不会丢失精度

    Second b(1, 2);  // init 2-1
    // 存在转化为initializer_list<int>可能, 则会优先
    Second b2{1, 2};  // init 2-2, 存在可能就会调用形参为initializer_list
    Second b3{"HI", 2};  // init 2-3
    // 存在转为initializer_list<int>可能, 但是需要将double->int, 由于无法窄化变换, 报错
    // Second b4{1.0, 2};

    Third c{"HI", 1};  // init 3-1, 不存在转为initializer_list<std::string>可能
    Third c2{"HI", 1.0};  // init 3-1, 从double变化到float不算窄化
    Third c3{"HI", "OK"};  // init 3-2

    std::vector<int> v{10, 20};  // 使用了initializer_list创建方法
    cout << v.size() << '\n';  // 2
    std::vector<int> v2(10, 20);  // 创建了长度为10, 每个值都是20的vector
    cout << v2.size() << '\n';  // 10
    return 0;
}
```

### Item8：优先使用nullptr
- 相比使用`0`和`NULL`作为空指针传递，`nullptr`传入模板时效果更好
```cpp
#include <my_show_type.hpp>
template<typename FuncType, typename PtrType>
void func(FuncType& func, PtrType ptr) { func(ptr); }

void foo(int* a) { cout << "foo! " << a << '\n'; }

int main() {
    // 可以但是不清晰
    foo(0);
    foo(NULL);
    foo(nullptr);

    // 使用模板会直接导致报错, 仅有nullptr可行
    // func(foo, 0);  // error: invalid conversion from ‘int’ to ‘int*’
    // func(foo, NULL);  // error: invalid conversion from ‘long int’ to ‘int*’
    func(foo, nullptr);  // int*
    return 0;
}
```

### Item9：优先使用using而非typedef
- 别名声明`using T = ...`支持模板化，而`typedef`需要自己构造非常麻烦

#### 声明与模板的基本用法
```cpp
#include <my_show_type.hpp>

// 定义型别映射
using ll = long long;
typedef long long LL;

// 定义函数指针型别的两种方法
using func_ptr = void (*)(ll);  // 更加清晰
typedef void (*func_ptr2)(LL);  // 注意型别名称位置

void func(func_ptr f, ll a) { f(a); }
void func2(func_ptr2 f, ll a) { f(a); }
void foo(ll a) { cout << a << '\n'; }

int main() {
    func(foo, 42ll);
    func2(foo, 30ll);
}
```
#### 别名模板效果更好
```cpp
#include <map>
#include <vector>
#include <my_show_type.hpp>
using std::map;
using std::vector;

/* ---------------------------------- 别名模板 ---------------------------------- */
template<typename T>
using MyMap = map<T, std::vector<T>>;

template<typename T>
struct Foo { MyMap<T> mp; };

/* ------------------------------ typedef创建型别模板 ----------------------------- */
template<typename T>  // 通过构造struct, 将别名赋值到type上
struct MyMap2 {
    typedef map<T, std::vector<T>> type;
};

template<typename T>  // 使用时需引用::type并声明为typename
struct Foo2 { typename MyMap2<T>::type mp; };

template<template<typename> typename T>  // T是模板类型支持一个型别参数传入
void run() {
    T<int> foo;
    PRINT_TYPE(foo);
    foo.mp[4] = {1,2,3,4};
    foo.mp[1] = {3,4};
    for (auto x : foo.mp) {
        cout << "key=" << x.first << ", value=";
        PRINT_TYPE(x.second);
        for (auto y : x.second) { cout << y << ' '; }
        cout << '\n';
    }
}

int main() {
    run<Foo>();
    run<Foo2>();
    return 0;
}

/* --------------------------------- Return ---------------------------------
Foo<int>
key=1, value=std::vector<int, std::allocator<int> >
3 4
key=4, value=std::vector<int, std::allocator<int> >
1 2 3 4
Foo2<int>
key=1, value=std::vector<int, std::allocator<int> >
3 4
key=4, value=std::vector<int, std::allocator<int> >
1 2 3 4
-------------------------------------------------------------------------- */
```

### Item10：优先使用限定作用域的枚举型别
- C\+\+98风格的`enum Color { black, white, red };`被称为不限范围的(unscoped)枚举型别，导致初始化了变量名`black, white, red`（如果在全局定义，就是全局变量名）
- C\+\+11中加入限定作用域的(scoped)枚举型别`enum class Color { black, white, red };`更不容易泄漏名字，不会初始化全局变量名，而是要通过类引用
- 限定作用域参数必须通过强制型别转换`static_cast<int>(Color::red)`，才能变为其他型别，而不限范围枚举可以随意转化（从int转其他）
- 限定作用域可以前置声明（在头文件中定义），因为默认底层型别是`int`，而不限作用域需要指定底层型别才能前置声明`enum Color2: int`

下面这个例子给出头文件`enum_header.hpp`以及对应的`enum_scoped_with_unscoped.cpp`用于理解：

{% spoiler 点击显/隐 enum_header.hpp %}
```cpp
#pragma once
#include <my_show_type.hpp>

// 无法前置声明, 在创建时才自动推理出底层型别
// enum Color2;  // error: use of enum ‘Color2’ without previous declaration
enum Color2: int;  // 必须指定底层型别
// 可以前置声明, 默认底层型别为int
enum class Color;

void hello_color(Color x) {
    cout << "hello: " << static_cast<int>(x) << '\n';
}
```
{% endspoiler %}

{% spoiler 点击显/隐 enum_scoped_with_unscoped.cpp %}
```cpp
#include <header.hpp>
#include <my_show_type.hpp>

enum class Color { red, white, black };
enum Color2 { red, white, black };

// 默认的enum class类型为int最大到0x7fffffff
enum class Status { foo=100, bar=0x7fffffff };
// 指定enum class类型
enum class Status2: uint64_t { bar=0xffffffffffffffff };
// 不限范围枚举是自动推理底层型别的, 这意味着修改Status3就需要重新编译整个代码
enum Status3 { bar=0xffffffffffffffff };

int main() {
    cout << red << '\n';  // 0
    // 注意限定作用域枚举必须强制转化类型
    cout << static_cast<int>(Color::red) << '\n';  // 0
    PRINT_TYPE(Color::red);  // Color
    PRINT_TYPE(red);  // Color2
    hello_color(Color::red);  // hello: 0, 调用前置声明中的函数
    // 查看底层型别
    PRINT_TYPE_DIRECT(std::underlying_type_t<Color>);  // int
    PRINT_TYPE_DIRECT(std::underlying_type_t<Status2>); // unsigned long
    PRINT_TYPE_DIRECT(std::underlying_type_t<Status3>); // unsigned long
    return 0;
}
```
{% endspoiler %}


