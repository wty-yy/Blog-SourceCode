---
title: Hexo Fluid 添加Valine评论系统
hide: false
math: false
category: Blog
tags: Fluid
abbrlink: 60487
date: 2021-07-29 18:17:20
index_img:
banner_img:
---

# LeanCloud上创建APP

1. 在[LeanCloud](https://console.leancloud.cn/)官网注册账号
2. 在首页点击“创建应用”，应用名称随便取
3. 进入应用，在左边分栏中展开“设置”，点进“应用凭证”，即可看到配置Valine所需要的"AppID"和"AppKey"

# 配置config文件

最新版的Fluid已经自带了Valine配置，只需加以简单的修改即可

进入`_config.fluid.yml`配置文件，找到`comments:`

对应修改为

![\_config.flud.yml](https://upload.cc/i1/2021/07/29/DjP7I6.png)

在往下找到`valine:`

修改下方的`appId`和`appKey`为刚才在LeanCloud上生成的对应值

![valine](https://upload.cc/i1/2021/07/29/8jZrPG.png)

重新启动Hexo，`hexo clean && hexo s`，就能看到评论窗口了！

# 删除无用的评论

直接在LeanCloud的 数据存储-结构化存储-Comment表 中删除即可

# 鸣谢

感谢Fuild的大佬们，我还傻乎乎的自己加半天配置~
