---
title: Hexo Fluid 代码折叠
hide: false
math: true
category: Blog
tags: Fluid
abbrlink: 44830
date: 2021-07-29 14:30:51
index_img:
banner_img:
---

# 代码折叠

先尝试过很多next主题下的配置方法，不会套用过来（没学过JavaScript的痛~），即使套用过来后，也出现按钮不显示，折叠框位置不正确等等问题，所以最后还是使用的hexo的插件，真香

操作很简单

## hexo-sliding-spoiler插件

github链接: [hexo-sliding-spoiler](https://github.com/fletchto99/hexo-sliding-spoiler)

### 插件安装

```shell
npm install hexo-sliding-spoiler --save
```

### 自定义配置

通过修改`blog/node_modules/hexo-sliding-spoiler/assets/spoiler.css`下的内容，从而自定义配置

![spoiler.css](https://img13.360buyimg.com/ddimg/jfs/t1/167255/35/24193/60202/616d6915E248e196c/7793e663b880d5cf.png)

可以修改`content`对应位置的图标为 `▲` 和 `▼`，在上面`background`内修改颜色，标准为[16色标准](https://www.sioe.cn/yingyong/yanse-rgb-16/)，在`font-size`中可以修改标签的字体大小。

### 使用方法

在markdown中直接以标签的形式加入：
 
参考代码，注意: 要把c++前面的`/`符号去掉

```
{% spoiler "点击显/隐内容" %}

隐藏的内容

支持markdown语法，代码块，数学公式

/```c++
#include <bits/stdc++.h>
using namespace std;
int main() {
	cout << "Hello World!" << '\n';
	return 0;
}
/```

$$
e^{ix} = cosx+isinx
$$

{% endspoiler %}
```

### 效果展示

{% spoiler "点击显/隐内容" %}

隐藏的内容

支持markdown语法，代码块，数学公式

```c++
#include <bits/stdc++.h>
using namespace std;
int main() {
	cout << "Hello World!" << '\n';
	return 0;
}
```

$$
e^{ix} = cosx+isinx
$$

{% endspoiler %}

# 参考

1. [Hexo -16- 折叠博客内容](https://www.zywvvd.com/2020/12/26/hexo/16_fold-content/fold-content/)

