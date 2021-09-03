---
title: Linux系统使用pip成功安装软件包，但不能从命令行找到可执行文件？
hide: false
math: true
abbrlink: 63680
date: 2021-09-03 15:22:49
index_img:
banner_img:
category:
 - tools
tags:
 - python
---

最近遇到了这个问题，我是用的是 WSL 系统，在网上找了很多方法都没解决，最后东拼西凑用以下方法解决了：

先找到默认包安装位置使用命令 `python -m site`，如下图：

![python -m site](https://upload.cc/i1/2021/09/03/ogYI9M.png)

找到进入到 `USER_BASE` 目录下，比如我的就是: `/home/yy/.local`。

查看该目录下文件，应该可以看到一个叫 `bin` 的文件夹，进入，查看里面是否有你用pip安装的可运行文件

![.local/bin](https://upload.cc/i1/2021/09/03/REVtlz.png)

最后就是将该目录加入到系统路径当中，随便找个位置，新建一个文件，比如叫 `test.sh`，加入如下代码：
（bin的目录填你本机的目录，注：`$HOME=/home/USER_NAME`）

```
if [ -d "$HOME/.local/bin" ] ; then
  PATH="$PATH:$HOME/.local/bin"
fi
```

写的不规范哈第一行没加 `#!/bin/bash`，不过没关系了。

执行 `source test.sh` 执行写入，然后尝试直接在命令行中输入你pip的运行文件名。

如果上述方法可行，又为了避免每次重启Linux都要重复上述操作，你可以将上述的那段代码，加入到用户根目录(就是这个：`~`)下的 `.bashrc` 或 `.zshrc` 文件中（取决于你使用的bash还是zsh界面，默认是bash界面哦）。

如果你没有 `~/.bashrc` 这个文件，你可以直接在这个位置新建一个，然后将上述代码写入然后保存，如果有则在末尾或空白区域加上就行了（zsh一样就把bashrc改成zshrc即可），这样每次启动Linux时都会自动运行这段代码了！

如果仍然不行，可以在评论区讨论一下~
