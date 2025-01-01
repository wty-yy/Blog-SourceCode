---
title: Hexo Fluid 显示视频文件
hide: false
math: true
abbrlink: 23047
date: 2025-01-01 18:23:41
index\_img:
banner\_img:
category:
 - Blog
tags:
---

参考[easyliu-ly - hexo插入音频和视频](https://easyliu-ly.github.io/2020/11/22/hexo/insert_video/)，进入到博客根目录下，安装[hexo-tag-dplayer](https://github.com/MoePlayer/hexo-tag-dplayer)
```bash
cnpm install hexo-tag-dplayer  # 如果安装了cnpm的话，用镜像源下载
npm install hexo-tag-dplayer  # 或者直接用npm安装
```
![到blog根目录下安装hexo-tag-dplayer](/figures/Blog/Video_cnpm_install.png)

> 必须到根目录下安装，因为会对`package.json`文件进行修改

将视频文件放到`[blog根目录]/source/videos/`文件夹下（例如我放了一个`AGX_rs_ros_node_python_yolov11.mp4`，videos文件夹没有可以创建一个），在博文中加入如下代码即可播放视频啦

```markdown
{%
    dplayer
    "url=/videos/AGX_rs_ros_node_python_yolov11.mp4"
    "loop=yes"  //循环播放
    "theme=#FADFA3"   //主题
    "autoplay=true"  //自动播放
    "screenshot=true" //允许截屏
    "hotkey=true" //允许hotKey，比如点击空格暂停视频等操作
    "preload=auto" //预加载：auto
    "volume=0.9"  //初始音量
    "playbackSpeed=1"//播放速度1倍速，可以选择1.5,2等
    "lang=zh-cn"//语言
    "mutex=true"//播放互斥，就比如其他视频播放就会导致这个视频自动暂停
%}
```

{%
    dplayer
    "url=/videos/AGX_rs_ros_node_python_yolov11.mp4"
    "loop=yes"  //循环播放
    "theme=#FADFA3"   //主题
    "autoplay=true"  //自动播放
    "screenshot=true" //允许截屏
    "hotkey=true" //允许hotKey，比如点击空格暂停视频等操作
    "preload=auto" //预加载：auto
    "volume=0.9"  //初始音量
    "playbackSpeed=1"//播放速度1倍速，可以选择1.5,2等
    "lang=zh-cn"//语言
    "mutex=true"//播放互斥，就比如其他视频播放就会导致这个视频自动暂停
%}


