---
title: Hello World
hide: true
abbrlink: 16107
---

{% spoiler "点击显/隐内容" %}

隐藏文字隐藏文字隐藏文字。  

支持 `markdown` 语法

##### 支持标题

##### 支持简单文本编辑
- 支持 **粗体**、*斜体*

##### 支持列表
- 列表1
- 列表2

##### 支持图片
- md插入图片语法：![markdown 图片](https://www.zywvvd.com/about/index/1.png)
- html插入图片语法：

<div style='margin:0 auto'>
<img src="https://www.baidu.com/img/baidu_jgylogo3.gif"  />
</div>

##### 支持代码块
- 行内代码 `markdown`

```cpp
#include <initializer_list>
#include <iostream>
struct A {
    A() { std::cout << "1"; }
    A(int) { std::cout << "2"; }
    A(std::initializer_list<int>) { std::cout << "3"; }
};
int main(int argc, char *argv[]) {
    A a1;
    A a2{};
    A a3{ 1 };
    A a4{ 1, 2 };
}
```


##### 支持表格

| 文字 | 文字 |
| ---- | ---- |
| 文字 | 文字 |

##### 支持公式
- 行内公式$Y=aX^2+bX+c$
$$
Y=aX^2+bX+c
$$

{% endspoiler %}
