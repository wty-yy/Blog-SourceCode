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

### 更好看的折叠功能

方法参考 [使用Hexo过滤器实现Fluid主题的代码折叠](https://kiyanyang.github.io/posts/c4dd4019/#628eef888a6bd43571a6906f), 从github的issues上看到的 [给代码块增加折叠功能](https://github.com/fluid-dev/hexo-theme-fluid/issues/629)

具体代码参考博客, 这里也给出我的代码和具体位置

#### js文件
文件目录: `\blog\node_modules\_hexo-theme-fluid@1.9.0@hexo-theme-fluid\scripts\`

```JavaScript
"use strict";

// 获取唯一 ID
function getUuid() {
  return Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
}

hexo.extend.filter.register(
  "after_post_render",
  (data) => {
    const { line_number, lib } = hexo.theme.config.code.highlight;

    let reg;
    if (lib === "highlightjs") {
      if (line_number) {
        reg = /(<figure class="highlight.+?>)(.+?hljs (.*?)".+?)(<\/figure>)/gims;
      } else {
        reg = /(<div class="code-wrapper.+?>)(.+?hljs (.*?)".+?)(<\/div>)/gims;
      }
    } else if (lib === "prismjs") {
      reg = /(<div class="code-wrapper.+?>)(.+?data-language="(.*?)".+?)(<\/div>)/gims;
    }

    data.content = data.content.replace(reg, (match, begin, inner, lang, end, offset, string) => {
      const collapseId = `collapse-${getUuid()}`;
      //                             ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 设置折叠按钮图标，此处使用 GitHub 图标
      const collapseBtn = `<i class="iconfont icon-github-fill" type="button" data-toggle="collapse" data-target="#${collapseId}"></i>`;
      // const collapseDiv = `<div class="collapse show" id="${collapseId}">${inner}</div>`; // 默认不折叠
      const collapseDiv = `<div class="collapse show" id="${collapseId}">${inner}</div>`; // 默认折叠
      const langSpan = `<span>${lang}</span>`;
      return begin + collapseBtn + langSpan + collapseDiv + end;
    });
    return data;
  },
  10000 // 应该在完成其他渲染后执行，因此将优先级设大一点
);
```

#### styl文件

目录`\blog\source\css\`

```Stylus
.markdown-body .highlight table,
.markdown-body .code-wrapper pre {
  border-radius: 0 0 0.5rem 0.5rem;
}

.markdown-body .highlight,
.markdown-body .code-wrapper {
  background-color: #e6ebf1;
  border-radius: 0.625rem;

  // 折叠图标
  > i {
    color: #777777;
    margin-left: 10px;
    line-height: 2rem;
    transform: none;
    transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;

    &.collapsed {
      transform: rotate(-90deg);
    }
  }

  // 代码语言
  > span {
    color: #777777;
    margin-left: 10px;
    font-weight: bold;
  }
}

[data-user-color-scheme='dark'] {
  .markdown-body .highlight,
  .markdown-body .code-wrapper {
    background-color: #696969;
    transition: background-color 0.2s ease-in-out;

    > i {
      color: #c4c6c9;
    }

    > span {
      color: #c4c6c9;
      transition: color 0.2s ease-in-out;
    }
  }
}
```

然后在文件配置文件`_config.fluid.yml`中, `custom_css`部分加入 (注意不要加`.styl`后缀!!!)

```_config.fluid.yml
custom_css:
  - /css/fold_code
```

然后在markdown中正常输入代码块就可以看到效果了, 希望以后能加入根据代码块选择是否默认折叠.

# 参考

1. [Hexo -16- 折叠博客内容](https://www.zywvvd.com/2020/12/26/hexo/16_fold-content/fold-content/)

