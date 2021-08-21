---
title: Hexo Fluid 数学公式
hide: false
math: true
category:
  - Blog
tags:
  - Fluid
abbrlink: 3849
date: 2021-07-29 08:22:07
index_img:
banner_img:
---

# 数学公式

## 1. 更改 Markdown 渲染器

卸载原有的渲染器

`npm un hexo-renderer-marked --save`

推荐使用 $\KaTeX$ 渲染器，$mathjax$ 在换行的时候总是把`\\`转义成`\`，修改了也不能换行，所以最终选择了 $\KaTeX$ 渲染器

如果安装过mathjax就先卸载: `npm un hexo-renderer-kramed --save`

安装katex: `npm i hexo-renderer-markdown-it-plus --save`

如果想要更好的视觉体验，推荐安装hexo官方的hexo-math插件，可以让字体变得更好看

安装hexo-math插件: `npm install hexo-math --save`

## 2. 设置配置文件

站点配置文件(\_config.yml)修改，加入hexo-math插件，直接到文本的末尾加入以下信息:

```
math:
  engine: katex
  katex:
    css: https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css
    js: https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js
    config:
      # KaTeX config
      throwOnError: false
      errorColor: "#cc0000"
```

主题配置文件(\_config.fluid.yml)修改

```
post:
  math:
    enable: true
    specific: true
    engine: katex
```

specific: 只有在 [Front-matter](https://hexo.io/zh-cn/docs/front-matter) 中加入 `math: true` 才会启用公式转换，以便在不包含公式时提高加载速度

完成上述配置后，重启hexo

```shell
hexo clean && hexo s
```

**强力推荐**: [LaTeX数学公式大全](https://www.luogu.com.cn/blog/IowaBattleship/latex-gong-shi-tai-quan)

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



# 参考

1. [Fluid官方配置指南](https://hexo.fluid-dev.com/docs/guide/#%E5%85%B3%E4%BA%8E%E6%8C%87%E5%8D%97)

2. [hexo的yelee主题使用katex引擎(markdown渲染加速)](https://blog.csdn.net/appleyuchi/article/details/92795620)

3. [Hexo-Fluid主题美化](https://blog.csdn.net/weixin_43471926/article/details/109798811)

