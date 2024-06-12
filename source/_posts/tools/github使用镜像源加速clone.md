---
title: github使用镜像源加速clone
author: wty
mathjax: true
comments: false
categories:
  - tools
abbrlink: 44791
date: 2021-07-27 15:56:19
tags:
---

> 老方法（无法使用）：
> 只需要将 github.com/... 改为
> github.com.cnpmjs.org/... 即可使用镜像库clone

新的代理源：https://mirror.ghproxy.com/

在原有的 `clone` 连接前面加上`https://mirror.ghproxy.com/`即可使用代理。
```bash
git clone https://mirror.ghproxy.com/https://github.com/wty-yy/katacr
```

如果要代理并使用 `push`（或 `clone` 私有仓库），则需要申请 [Personal access tokens (classic)](https://github.com/settings/tokens) 使用：
```bash
git clone https://{你的GitHub用户名}:{申请的token}@mirror.ghproxy.com/https://github.com/wty-yy/katacr
```

修改当前 `git` 的远程仓库连接 `url` 方法：
```bash
git remote set-url origin {新的url}
```

