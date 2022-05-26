---
title: Hexo Fluid 数学公式和主题美化
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

站点配置文件(\_config.yml)修改，加入hexo-math插件，直接到文本的末尾加入以下信息: (由于cdn被墙了, 改成fastly即可)

```
math:
  engine: katex
  katex:
    css: https://fastly.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css
    js: https://fastly.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js
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

可以参考我的这篇文章：[Hexo Fluid 代码折叠](/posts/44830/)

# 博客运行时长

在`_config.fluid.yml`中的`footer`部分修改如下, 前三行为默认的, 注意时间为美式计时法, `3/19/2021`表示2021年3月19日.
```_config.fluid.yml
footer:
  content: '
    <a href="https://hexo.io" target="_blank" rel="nofollow noopener"><span>Hexo</span></a>
    <i class="iconfont icon-love"></i>
    <a href="https://github.com/fluid-dev/hexo-theme-fluid" target="_blank" rel="nofollow noopener"><span>Fluid</span></a>
    <br>
    <span id="runtime_span"></span> <script type="text/javascript">function show_runtime(){window.setTimeout("show_runtime()",1000);X=new Date("3/19/2021 00:00:00");Y=new Date();T=(Y.getTime()-X.getTime());M=24*60*60*1000;a=T/M;A=Math.floor(a);b=(a-A)*24;B=Math.floor(b);c=(b-B)*60;C=Math.floor((b-B)*60);D=Math.floor((c-C)*60);runtime_span.innerHTML="小站已运行"+A+"天"+B+"小时"+C+"分"+D+"秒"}show_runtime();</script>
    `
```

# 主题美化

主要参考的是 [Hexo-Fluid主题美化](https://blog.csdn.net/weixin_43471926/article/details/109798811) 这篇文章。

分享下 `_config.fluid.yml` 文件中这一块我的配置

```
# 主题字体配置
# Font
font:
  font_size: 16px
  #font_family: {"Fira Sans", "Helvetica Neue", Helvetica, Arial, sans-serif}
  font_family:
  code_font_size: 85%

# 指定自定义 .js 文件路径，支持列表；路径是相对 source 目录，如 /js/custom.js 对应存放目录 source/js/custom.js
# Specify the path of your custom js file, support list. The path is relative to the source directory, such as `/js/custom.js` corresponding to the directory `source/js/custom.js`
custom_js:
  - //fastly.jsdelivr.net/gh/bynotes/texiao/source/js/caidai.js # 动态彩带
    #- //fastly.jsdelivr.net/gh/bynotes/texiao/source/js/timeDate.js # 运行时间

# 指定自定义 .css 文件路径，用法和 custom_js 相同
# The usage is the same as custom_js
custom_css:
  - //fastly.jsdelivr.net/gh/bynotes/texiao/source/css/toubudaziji.css # 头部打字机颜色效果渐变
  # - //fastly.jsdelivr.net/gh/bynotes/texiao/source/css/shubiao.css # 鼠标指针
```

# 参考

1. [Fluid官方配置指南](https://hexo.fluid-dev.com/docs/guide/#%E5%85%B3%E4%BA%8E%E6%8C%87%E5%8D%97)

2. [hexo的yelee主题使用katex引擎(markdown渲染加速)](https://blog.csdn.net/appleyuchi/article/details/92795620)

3. [Hexo-Fluid主题美化](https://blog.csdn.net/weixin_43471926/article/details/109798811)

