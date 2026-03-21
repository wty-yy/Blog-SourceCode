---
title: Hexo Fluid 添加评论系统
hide: false
math: false
category: Blog
tags: Fluid
abbrlink: 60487
date: 2021-07-29 18:17:20
index_img:
banner_img:
---

> 20260321：由于LeanCloud在20270112准备停服，现在已经不再支持服务了，转而使用giscus，也能方便看到评论区的更新

{% spoiler "旧的在LeanCloud上创建APP" %}

**LeanCloud上创建APP**

1. 在[LeanCloud](https://console.leancloud.cn/)官网注册账号
2. 在首页点击“创建应用”，应用名称随便取
3. 进入应用，在左边分栏中展开“设置”，点进“应用凭证”，即可看到配置Valine所需要的"AppID"和"AppKey"
4. 在左侧“设置”中，再点进“安全中心”，找到“Web安全域名”，加入你的bolg域名：例如 `https://wty-yy.github.io`, `https://www.wty-yy.xyz/` 等等。

**配置config文件**

最新版的Fluid已经自带了Valine配置，只需加以简单的修改即可

进入`_config.fluid.yml`配置文件，找到`comments:`

对应修改为

![\_config.flud.yml](https://s1.ax1x.com/2022/03/29/q6s3eU.png)

在往下找到`valine:`

修改下方的`appId`和`appKey`为刚才在LeanCloud上生成的对应值

![valine](https://s1.ax1x.com/2022/03/29/q6saS1.png)

重新启动Hexo，`hexo clean && hexo s`，就能看到评论窗口了！

**删除无用的评论**

直接在LeanCloud的 数据存储-结构化存储-Comment表 中删除即可

**鸣谢**

感谢Fuild的大佬们，我还傻乎乎的自己加半天配置~

{% endspoiler %}

# 使用giscus创建评论区

giscus虽然每次评论都需要先登陆GitHub账号，但是可以白嫖GitHub免费的存储资源，使用GitHub部署的博客，可以直接使用当前的仓库作为存储评论的位置。

giscus原理：

- 博客每篇文章，对应GitHub仓库中的一个Discussion
- 评论区中发评论，在对应的GitHub Discussion中评论

相较于Valine，giscus最大的优点就是不需要自己再去维护LeanCloud之类的后端存储，也不用担心存储量的问题。

# 开启GitHub Discussions

首先进入自己的博客仓库，例如我的博客仓库是：[wty-yy/wty-yy.github.io](https://github.com/wty-yy/wty-yy.github.io)

打开仓库后，进入`Settings -> General`，找到`Features`，勾选`Discussions`

这样仓库就开启了Discussion功能，后面giscus才能正常使用。

| 进入 Settings | 打开 Discussions |
| - | - |
| ![Settings](/figures/Blog/comment/github_open_discussions_resized.jpg) | ![Discussions](/figures/Blog/comment/github_open_discussions2_resized.jpg) |

# 安装giscus GitHub App

进入[giscus GitHub App](https://github.com/apps/giscus)页面，点击`Install`

接着选择自己的GitHub账号，推荐安装时选择`Only select repositories`，然后只勾选自己的博客仓库即可，例如我的就是`wty-yy.github.io`

| 进入 giscus GitHub APP Install | 选择仓库 |
| - | - |
| ![Install](/figures/Blog/comment/install_giscus_resized.jpg) | ![Configure](/figures/Blog/comment/install_giscus2_resized.jpg) |

安装完成后，giscus就有权限读取和创建对应仓库中的Discussion了。

# 生成giscus配置

进入[giscus官网](https://giscus.app/zh-CN)，按照页面提示依次配置：

1. 选择仓库，例如`wty-yy/wty-yy.github.io`
2. 选择Discussion分类，推荐直接选择`Announcements`
3. 页面和Discussion映射方式选择`Discussion 的标题包含页面的 pathname`
4. 语言选择`zh-CN`

这里我实际使用的配置如下：

![配置giscus](/figures/Blog/comment/setup_giscus_resized.jpg)

页面下方会自动生成一段`<script>`代码，里面最重要的是下面几个字段：

- `data-repo`
- `data-repo-id`
- `data-category-id`

这几个值后面要填到Fluid主题配置文件中。

# 配置Fluid主题

打开`_config.fluid.yml`配置文件，找到：

```yml
post:
  comments:
    enable: true
    type: giscus
```

如果原来还是`valine`，直接将`type`改成`giscus`即可。

然后在下方评论插件配置区域加入：

```yml
giscus:
  repo: 这里填giscus自动生成的data-repo
  repo-id: 这里填giscus自动生成的data-repo-id
  category: Announcements
  category-id: 这里填giscus自动生成的category-id
  mapping: pathname
  strict: 0
  reactions-enabled: 1
  emit-metadata: 0
  input-position: top
  lang: zh-CN
  loading: lazy
  theme-light: light
  theme-dark: dark
```

其中`repo-id`和`category-id`不要自己手动编，直接复制giscus官网生成的值即可。

重新启动Hexo：

```bash
hexo clean && hexo s
```

或者：

```bash
npm run build
npm run server
```

重新打开文章页面，就能看到评论区了。

# giscus的一些说明

1. giscus评论必须使用GitHub账号登录后才能发表评论
2. 评论内容本质上保存在GitHub Discussions中，因此可以直接在GitHub网页上查看评论更新
3. 支持Markdown语法，也支持插入图片和emoji
4. 评论区的显示样式、最早/最新排序这些功能，基本由giscus和GitHub Discussions自己控制

如果页面没有显示评论区，通常优先检查下面几个地方：

1. 仓库是否开启了`Discussions`
2. `giscus` GitHub App是否已经安装到对应仓库
3. `_config.fluid.yml`中的`repo-id`和`category-id`是否填写正确
4. 当前文章是否关闭了评论，例如文章Front-matter里写了`comments: false`

# 鸣谢

感谢Fluid主题和giscus提供的现成支持，不然自己手搓评论系统就太麻烦了~
