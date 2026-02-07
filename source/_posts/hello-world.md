---
title: Hello World
hide: true
abbrlink: 3
---

- 2023年3月31日：尝试将笔记本换为Ubuntu 22.04 LTS版本.

尝试下pdf，效果不错~

{% pdf /file/Spline_Newton.pdf %}

{% spoiler "点击显/隐内容" %}
隐藏文字隐藏文字隐藏文字。  
{% endspoiler %}

支持 `markdown` 语法

### 支持标题

### 支持简单文本编辑
- 支持 **粗体**、*斜体*

### 支持列表
- 列表1
- 列表2

### 支持图片
- md插入图片语法：`![markdown 图片](图片url链接或本地链接)`
- html插入图片语法：

```html
<div align='center'>
<img src="https://www.baidu.com/img/baidu_jgylogo3.gif"  />
</div>
```
效果如下
<div align='center'>
<img src="https://www.baidu.com/img/baidu_jgylogo3.gif"  />
</div>

### 支持代码块
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

### 支持表格

| 文字 | 文字 |
| ---- | ---- |
| 文字 | 文字 |

### 支持公式
- 行内公式$Y=aX^2+bX+c$
$$
Y=aX^2+bX+c
$$

### 图片并行显示方法
#### 表格
推荐使用简单易用:
```md
| ![img1](url1) | ![img2](url2) | ![img3](url3) | ![img4](url4) |
|-|-|-|-|
|<div align='center'>居中标题1</div>|标题2|标题3|标题4|

```

| ![img1](/figures/robotics/F28069M/1725081830775-7.png) | ![img2](/figures/robotics/F28069M/1725081830775-8.png) | ![img3](/figures/robotics/F28069M/1725081830775-8.png) | ![img4](https://www.baidu.com/img/baidu_jgylogo3.gif) |
|-|-|-|-|
|<div align='center'>居中标题1</div>|标题2|标题3|标题4|

如果用vscode写笔记的话, 可以用snippet功能快速将上面这段图片并行代码作为模版贴进去, 这里以两个图片并行为例:

加入方法`ctrl+shift+P -> snippets: configure -> 回车 -> markdown.json -> 回车` 在里面加入如下代码, 再根据[CSDN - Visual Studio Code配置Markdown文档的snippet不生效的解决](https://blog.csdn.net/qiguanjiezl/article/details/117586545)中的方法解决markdown中无提示的问题, 就可以通过输入 `myfigure2` 回车快速加入两个图片并行的模板了:
```json
"myfigure2": {
    "prefix": "myfigure2",
    "body": [
        "| ![img1]($1) | ![img2]($3) |",
        "|-|-|",
        "|<div align='center'>$2</div>|<div align='center'>$4</div>|",
    ],
}
```

#### html
对于不同的图片高度时, 效果不是很好
<style>
    .image-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
        text-align: center;
    }
    .image-box img {
        max-width: 100%;
        /*height: auto;*/
        display: block;
        margin: 0 auto;
    }
    .image-caption {
        margin-top: 5px;
    }
</style>
<div class="image-container">
    <div class="image-box">
        <img src="/figures/robotics/F28069M/1725081830775-7.png" alt="Image 1">
        <div class="image-caption">Caption for Image 1</div>
    </div>
    <div class="image-box">
        <img src="/figures/robotics/F28069M/1725081830775-8.png" alt="Image 2">
        <div class="image-caption">Caption for Image 2</div>
    </div>
    <div class="image-box">
        <img src="https://www.baidu.com/img/baidu_jgylogo3.gif" alt="Image 3">
        <div class="image-caption">Caption for Image 3</div>
    </div>
</div>

{% spoiler "点击显/隐代码"%}
```html
<style>
    .image-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
        text-align: center;
    }
    .image-box img {
        max-width: 100%;
        /*height: auto;*/
        display: block;
        margin: 0 auto;
    }
    .image-caption {
        margin-top: 5px;
    }
</style>
<div class="image-container">
    <div class="image-box">
        <img src="/figures/robotics/F28069M/1725081830775-7.png" alt="Image 1">
        <div class="image-caption">Caption for Image 1</div>
    </div>
    <div class="image-box">
        <img src="/figures/robotics/F28069M/1725081830775-8.png" alt="Image 2">
        <div class="image-caption">Caption for Image 2</div>
    </div>
    <div class="image-box">
        <img src="https://www.baidu.com/img/baidu_jgylogo3.gif" alt="Image 3">
        <div class="image-caption">Caption for Image 3</div>
    </div>
</div>
```
{% endspoiler %}

