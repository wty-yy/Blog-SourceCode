---
title: git常用命令
hide: false
math: true
category:
  - tools
abbrlink: 953
date: 2025-03-27 15:24:23
index\_img:
banner\_img:
tag:
---

`git`作为最流行代码版本管理软件，使我们可以方便的查看每次代码的更新内容，不用害怕修改代码时出现错误回退不到之前的版本，还可以将代码开源到[GitHub](https://github.com/)，[Gitee](https://gitee.com/)上，向更多人分享我们的成果，我使用了好久的`git`，但还是对整个处理逻辑理解不充分，容易导致误操作，因此简单总结下`git`的使用方法

# 实战操作

我们先介绍本次git仓库的使用方法，再介绍如何将本地仓库上传到远程仓库，**所有操作都在Linux系统上操作**

## git init
初始化：进入我们工作区（一个用来写代码的文件夹），用终端打开，执行`git init`，可以看到工作区内生成了`.git`文件夹，就表明创建完成了

## git add . && git commit -m "msg"
加入缓存，提交修改，我们可以新建文件，例如创建一个`README.md`markdown文本文件，接下来就是提交更改内容：
```bash
cd <工作区路径>
echo "hi" > README.md
git add .  # 将当前工作区下所有修改,添加,删除的文件加入缓存(cache)
# git reset  # 如果想取消这次add, 将缓存删除, 但修改的文件都保留
git commit -m "First commit"  # 将本次修改提交, 提交注释为First commit
```
这样我们就完成了代码的提交

## 代码回退
由于我们提交了一次，可以通过如下命令看到这一次的修改
```bash
git log  # 按q退出查看
> commit 38a292910e07b483643576c67aff7a2bead265bc (HEAD -> master)
> Author: wty-yy <wty-yy@github.com>
> Date:   Thu Mar 27 15:40:09 2025 +0800
> 
>     First commit
```
这里有几个信息：
1. `commit`的ID号`38a292910e07b483643576c67aff7a2bead265bc`，一般只用记前7位即可
2. `HEAD -> master`，`HEAD`表示当前我们的工作区，`master`是创建`git`后的默认分支（branch）名称，这就表示我们现在在`master`分支上
> 分支在下文会详细介绍

接下来我们可以再添加一个文件，作为第二次的提交，测试代码回退功能，创建文件`echo aa > a.txt`，提交`git add . && git commit -m "Second commit"`，再使用`git log`可以看到两次的提交内容
```bash
git --no-pager log --oneline  # 简洁查看commit信息, 并不用less进行分页
> d2e8708 (HEAD -> master) Second commit
> 38a2929 First commit
```
### git reset (删除后继commit)
上文我们知道`git reset`能够撤销当前的`git add .`中的缓存，下文介绍`git reset`对`commit`进行整个撤销

如果我们发现`commit`之后仍有文件被修改，例如想撤销`d2e8708`这个`commit`，并保留我们的文件修改（添加`a.txt`文件），可以通过`git reset --soft <ID>`来回到之前的分支
```bash
git reset --soft 38a2929  # 回退版本，并保留当前修改的文件
# git reset --hard 38a2929  # 强行回退, 不保留任何当前文件
git --no-page log --oneline
> 38a2929 (HEAD -> master) First commit  # 看到只剩下第一次的从commit
```

如果回退的版本与当前的修改存在冲突（修改同一个文件），则可以通过`git diff`查看冲突，例如：
```bash
echo "HELLO" > README.md  # 修改README.md文件内容
git add . && git commit -m "Add HELLO to README.md"
git reset --soft 38a2929
# 因为回退后默认将差异的内容加入cache中, 因此要从--cached查看差异
git diff --cached  # 查看冲突
# 解决完冲突后在进行提交即可
```

#### 删除commit
假如我们发现某一次`commit`上错误添加大量文件，我们应该如何删除这个`commit`并不影响后续的代码修改呢？
假如我们错误的将数据集提交到某次`commit`，然后我们在该`commit`后修改了代码，最后发现这个错误，这时应该如何修改呢？我们模拟下该问题
```bash
touch {a..z}.txt  # 这会创建a.txt, ..., z.txt 26个空文件
git add . && git commit -m "Error commit"
echo "print('HI')" > code.py  # 假如我们修改了代码
git add . && git commit -m "Add code"
rm -rf *.txt  # 发现错误的上传了数据集
git add . && git commit -m "Remove error files"

git --no-pager log --oneline  # 最终log
> c4869da (HEAD -> master) Remove error files
> 6934f21 Add code
> 106656e Error commit
> 38a2929 First commit
```
这样虽然在当前分支上删除了错误数据，但是由于`106656e`这个提交，导致数据被保存在`.git/`文件夹中，如果其他人`git clone`你的仓库会发现需要下载的内容非常大，就是因为错误数据作为缓存被保留了下来，因此我们需要回退到`38a2929`，并重新提交，同时保留我们的代码`code.py`
```bash
git reset --soft 38a2929  # 回退到错误提交数据前的commit
ls  # 可以发现我们的code.py还在，数据集已经被删除
git add . && git commit -m "Add code"  # 提交

git --no-pager log --oneline  # 修复好的log
> f0a9878 (HEAD -> master) Add code
> 38a2929 First commit
```
这样别人`clone`仓库时就不会下载错误的`commit`缓存了

#### 如果后面的commit存在branch或tag
这里就产生一个问题，如果我们`reset`的commit后面有其他的branch或tag，那么branch或tag会消失么？（[branch的创建](./#添加与合并branch)，[tag的创建](./#tag创建)请见下文）答案是不会的，请见如下branch的例子，tag的例子也可以自行尝试。

```bash
# 假如当前分支情况如下
git --no-pager log --oneline --all --graph  # --graph可以看到分支图
* b0967da (HEAD -> dev) Add a.txt
| * 66f7a63 (master) Add HELLO in code.py
|/
* f8b8ef4 Add HI in code.py
* 38a2929 First commit

# 如果master回退到38a2929, 那么dev会消失么
git checkout master
git reset --hard 38a2  # master重置到38a2

# 可以看到只有66f7a63被删除了, dev分支部分还是存在
git --no-pager log --oneline --all --graph  # --all可以看到全部的提交信息, 包括其他的branch
* b0967da (dev) Add a.txt
* f8b8ef4 Add HI in code.py
* 38a2929 (HEAD -> master) First commit

git branch -D dev  # 我们删除dev分支
# 再次查看全部提交, 发现只有38a2929了
git --no-pager log --oneline --all
> 38a2929 (HEAD -> master) First commit
```
上面例子说明，如果其他分支在当前回退的commit之后，如果后继commit不从属于任何的branch或tag，则会被删除，否则后继commit只是在当前分支上不显示，但是在其他分支上还是存在的！

也就是说，当commit不从属于任何的branch或tag时（远程的branch也算哦），才会被删除。

### git revert
另一种回退方法，仅回退某次`commit`的修改内容，例如
```bash
# 修改README.md和code.py
echo "HELLO" > README.md && echo "print('HI')" > code.py
git add . && git commit -m "Add HELLO in README.md and Add HI in code.py"
echo "print('HELLO')" > code.py
git add . && git commit -m "Add HELLO in code.py"

git --no-pager log --oneline
> 72fa98e (HEAD -> master) Add HELLO in code.py
> 9ba1079 Add HELLO in README.md and Add HI in code.py
> 38a2929 First commit
```
如果我们想要回退`README.md`之前的修改内容，即回退`9ba1079`的修改（用`git reset --soft 38a2929`也可以回退，但后续commit都被删除了，如果有其他成员在后续commit上更新可能导致问题），并保留后续的commit，我们执行
```bash
git revert 9ba1079  # 发现合并冲突, 因为这个分支回退会删除code.py文件, 但我们当前对code.py文件进行了修改, 所以无法回退
# 这个命令本质也是合并命令: 将9ba1079回退修改, 与后续所有分支的修改进行合并
> CONFLICT (modify/delete): code.py deleted in parent of 9ba1079 (Add HELLO in README.md and Add HI in code.py) and modified in HEAD.  Version HEAD of code.py left in tree.
> error: could not revert 9ba1079... Add HELLO in README.md and Add HI in code.py
git --no-pager diff  # 查看冲突
* Unmerged path code.py  # code.py无法合并
```
这里我们有两个方法处理这个文件
```bash
# 1. 删除文件
rm code.py
git revert --continue
# 2. 或保留文件
git add code.py
git revert --continue

git --no-pager log --oneline  # 这样就可以看到revert产生了一个新的commit
# 这个commit就是将9ba1079回退修改, 与后续全部commit进行合并的结果
> a8069cf (HEAD -> master) Revert "Add HELLO in README.md and Add HI in code.py"
> 72fa98e Add HELLO in code.py
> 9ba1079 Add HELLO in README.md and Add HI in code.py
> 38a2929 First commit
```

## 添加与合并branch
默认我们会有一个叫master的分支名称，上文通过`git log`已经查看了，那么如果我们想同步开发另外的一些功能，那么就可以基于某次commit再开启一个分支（就和树杈一样）
```bash
# 当前只有一个commit, 在master分支上
git --no-pager log --oneline --all
> 38a2929 (HEAD -> master) First commit

echo "print('HI')" > code.py
git add . && git commit -m "Add HI in code.py"

# 主分支上再修改一次code.py
echo "print('HELLO')" > code.py
git add . && git commit -m "Add HELLO in code.py"

git --no-pager log --oneline --all --graph
* 65d4669 (HEAD -> master) Add HELLO in code.py
* 1f2eeec Add HI in code.py
* 38a2929 First commit

# 如果我们想在HI这一次进行开发, 可以回到1f2ee, 创建分支beta
git checkout -b beta 1f2ee
# 如果我们想要修改分支名称, 将beta分支重命名为dev
git branch -m dev
# 可以看到1f2e上面已经创建新的分支dev了
git --no-pager log --oneline --all --graph
* 65d4669 (master) Add HELLO in code.py
* 1f2eeec (HEAD -> dev) Add HI in code.py
* 38a2929 First commit

# 在dev节点上提交
echo "print('HELLO dev')" > code.py
git add . && git commit -m "Add HELLO dev in code.py"

# 可以看到就出现树杈的分支了
git --no-pager log --oneline --all --graph
* c7c9a11 (HEAD -> dev) Add HELLO dev in code.py
| * 65d4669 (master) Add HELLO in code.py
|/
* 1f2eeec Add HI in code.py
* 38a2929 First commit

# 通过git branch --all也可以查看当前已有分支
git --no-pager branch --all
* dev
  master
```

现在我们想要合并master和dev分支，来将我们开发的功能合并到主分支中
```bash
# 回到主分支中
git checkout master
# 合并分支
git merge dev
> Auto-merging code.py  # 发生报错, 无法合并, 因为我们同时改了code.py文件
> CONFLICT (content): Merge conflict in code.py
> Automatic merge failed; fix conflicts and then commit the result.
# 查看差异
git diff
# 发现code.py文件中差异部分被修改为如下内容
# <<<<<<< HEAD
# print('HELLO')  # 原始master内容
# =======
# print('HELLO dev')  # 合并发生冲突dev内容
# >>>>>>> dev
# 我们手动修改文件, 保留我们想要的内容

# 暂存并提交
git add .
git commit  # 这次git会帮我们写好备注内容, 解决了什么文件的冲突

# 可以看到我们的分支成功被合并了！
git --no-pager log --oneline --all --graph
*   cc84921 (HEAD -> master) Merge branch 'dev'
|\
| * c7c9a11 (dev) Add HELLO dev in code.py
* | 65d4669 Add HELLO in code.py
|/
* 1f2eeec Add HI in code.py
* 38a2929 First commit

# 注意此时我们的dev分支还是存在的, 我们可以继续在dev分支上添加内容, 如果不再使用, 可以将其删除
git branch -d dev
git branch -D dev  # 强制删除, 如果发现dev有提交的commit没有被合并, 则需要
```

## 上传远程仓库
下文以GitHub为例，介绍git的远程仓库使用方法

初始化仓库，点击头像左侧的加号，点击New repository
1. 起一个Repository name，例如我的是`test`
2. 在Description中添加仓库描述，可以在仓库主页右侧看到
3. 选择仓库的类型Public还是Private（公开：所有人都能看到，私有：只有自己以及添加的管理员能看到）
4. 添加一个README文件，这就会自动添加一个空`README.md`文件在master分支上（可以不选，后续手动添加）
5. 添加`.gitignore`文件，该文件存放于`.git/`的同级目录下，在`git add`时会自动忽略`.gitignore`中包含的文件名（可以不选，后续手动添加）
6. 添加`license`，我一般用MIT License，个人的通用开源协议，同样会自动添加`LICENSE`在master分支上（建议添加）
7. 右下方按钮，创建仓库

### 第一次使用git
如果是第一次使用git，先配置用户信息：
```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

在第一次`git push`时候会要求输入远程用户的用户名和密码，而GitHub的上传密码是Token形式，创建方式如下：

1. 点击头像，点击右侧弹出的Setting
2. 左侧列表找到Developer settings
3. 左侧找到Personal access tokens，下拉找到Tokens (classic)
4. 右上角点击Generate new token，下拉找到Generate new token (classic)
5. Note输入对当前Token的备注，比如哪台电脑上使用的，Expiration（Token的截止日期）
6. 将下方的全部可勾选项全部勾上，点击最下方的Generate token，即可生成一串Token，这就是我们的密钥

为了方便，我们通常让git记住远程的密钥，这样可以避免每次再输入密钥：
```bash
git config --global credential.helper store
```
这样在下文的`git push`后输入一次密码后就会记录在`~/.git-credentials`文件中，以后不用再手动添加了，但这样也容易泄露，有利有弊

### 本地branch与远程branch绑定关系
初始化完成仓库后，进入仓库主页点击右上角`Code`按钮，点击`HTTPS`复制下方连接`https://github.com/wty-yy-mini/test.git`，然后我们有两种方法向其中添加代码：

`git clone https://github.com/wty-yy-mini/test.git`将空仓库克隆下来，然后将文件复制进去，这样就默认将`master`分支和`origin/master`分支绑定了，后续直接通过`git push`就可以将本地的`master`分支内容上传到`origin/master`，如果想要详细理解，请见下文的绑定关系理解

在已有本地仓库上添加
```bash
cd <本地仓库>  # 如上文创建好的
# 添加远程仓库url, 默认的远程仓库名字为origin
git remote add origin https://github.com/wty-yy-mini/test.git
git remote -v  # 看到远程仓库已经被绑定了
> origin	https://github.com/wty-yy-mini/test.git (fetch)
> origin	https://github.com/wty-yy-mini/test.git (push)
# 使用rebase从远程的master节点拉取代码, 并用rebase（变基）方法整合代码
# rebase相当于将本地的commit放置到远程commit的后面
git pull origin master --rebase

# 效果如下
git --no-pager log --oneline --all --graph
* c99faba (HEAD -> master) First commit
* 74b6441 (origin/master) Initial commit

# 提交到远程, 将master分支提交到origin/master
git push origin master
# 但这样是不完美的, 因为我们还没有将本地master分支和origin/master绑定, 这样每次都需要输入 git push origin master 很麻烦
git branch -vv  # vv表示very verbose可以显示本地和远程分支的关系
* master c99faba First commit
# 我们需要设定master和origin/master的跟踪关系(origin/master称为master的upstream branch)
git push -u origin master
git branch -vv  # 再次查看关系
* master c99faba [origin/master] First commit  # 可以看到和origin/master绑定了
git remote show origin  # 查看详细的远程节点信息, 也可以看到绑定的内容
```

这时，我们在网上仓库，例如[GitHub - test](https://github.com/wty-yy/test)，就可以看到更新内容啦，可以看到项目根目录中由于出现了`README.md`文件，下方就会直接显示当前`README.md`文件，这个文件就是仓库的更加详细的使用说明，因此该文件也是每个仓库所必须的，理解一个仓库功能，一般看首页`README.md`即可

### 远程branch创建
参考通过上文中[添加本地branch](./#添加与合并branch)的方法，首先创建一个本地的分支，例如
```bash
# 假如我们现在将本地修改为如下形式
git --no-pager log --all --graph --oneline
* b2e90c6 (HEAD -> master) add b.txt
| * f3bdedc (dev) add a.txt
|/
* c99faba (origin/master, origin/HEAD) First commit
* 74b6441 Initial commit

# 由于我们在master和origin/master绑定, 如下就可以更新master分支
git push
# 切换到dev分支
git checkout dev
# 我们需要将本地的dev分支与远程的origin/dev分支绑定并上传
git push -u origin dev

# 这样就看到两个分支内容都被上传了
git --no-pager log --all --graph --oneline
* b2e90c6 (origin/master, origin/HEAD, master) add b.txt
| * f3bdedc (HEAD -> dev, origin/dev) add a.txt
|/
* c99faba First commit
* 74b6441 Initial commit

# 用如下代码可以查看当前全部的远程分支有哪些
git --no-pager branch -r
>   origin/HEAD -> origin/master
>   origin/dev
>   origin/master
```

现在在网页上刷新界面，点击左上角的master按钮，就发现下拉出现dev按钮，点击即可查看dev分支信息

如果我们想将dev分支设置为默认的远程显示的分支，容易想到，将`origin/HEAD`指向`origin/dev`即可，但是本地是无法修改的，我们进入网页仓库的Setting界面，找到Default branch，点击右侧第二个按钮Switch to another branch，选择dev分支，点击update即可

### tag创建
tag用于标记特定的commit，tag可以认为是对commit的一个快捷名称，便于通过简单的名称找到对应的commit，通常用来标记代码的不同版本，例如
```bash
git --no-pager log --graph --oneline
* f3bdedc (HEAD -> dev, origin/dev) add a.txt
* c99faba First commit
* 74b6441 Initial commit
```
如果我们想要将当前commit设置为`v1.1.0`，`c99faba`设置为我们代码的第一个版本`v1.0.0`，那么我们可以
```bash
git tag v1.0.0 c99faba  # 指定c99faba为v1.0.0 tag
git tag v1.1.0  # 不指定默认为当前commit打上tag

git --no-pager log --graph --oneline  # 可以看到tag信息
* f3bdedc (HEAD -> dev, tag: v1.1.0, origin/dev) add a.txt
* c99faba (tag: v1.0.0) First commit
* 74b6441 Initial commit

git --no-pager tag  # 也可以查看tag信息
> v1.0.0
> v1.1.0

git push origin v1.0.0  # 将本地的tag信息上传到远端
git push origin v1.1.0
```
这样就可以刷新界面，点击左上角的master按钮，Switch branches/tags，点击Tags，就可以看到不同的tag信息啦，下面介绍如何删除tag
```bash
# 删除远端tag
git push origin -d v1.0.0  # 删除指定tag
# 删除本地tag
git tag -d v1.0.0
```

### 利用远程仓库恢复错误操作
假如我们当前错误地删除了branch或tag，但是远程仓库还没有被修改，我们可以通过`git fetch`重新下拉来修复
```bash
# 例如当前存在dev, origin/dev, v1.1.0两个分支和一个标签
git --no-pager log --graph --oneline --all
* 717918d (HEAD -> dev, origin/dev) Add dev.txt
* f3bdedc (tag: v1.1.0) add a.txt
| * 7044173 (origin/master, origin/HEAD, master) update test-submodule
| * 2e55b26 add b.txt
| * 9b5ed7e update submodule
| * b2e90c6 add b.txt
|/
* c99faba First commit
* 74b6441 (HEAD, tag: v0) Initial commit

git checkout v0
git tag -d v1.1.0  # 删除标签
git branch -D dev  # 删除分支
git branch -D --remote origin/dev  # 删除origin/dev分支

# 再次查看git日志
git --no-pager log --graph --oneline --all
* 7044173 (origin/master, origin/HEAD, master) update test-submodule
* 2e55b26 add b.txt
* 9b5ed7e update submodule
* b2e90c6 add b.txt
* c99faba First commit
* 74b6441 (HEAD, tag: v0) Initial commit

# 由于远程上还存在origin/dev和v1.1.0, 所以我们重新获取即可
git fetch
> From https://github.com/wty-yy-mini/test
>  * [new branch]      dev        -> origin/dev
>  * [new tag]         v1.1.0     -> v1.1.0

# 再次查看, 发现删除的远程分支和标签都回来了
git --no-pager log --graph --oneline --all
* 717918d (origin/dev) Add dev.txt
* f3bdedc (tag: v1.1.0) add a.txt
| * 7044173 (origin/master, origin/HEAD, master) update test-submodule
| * 2e55b26 add b.txt
| * 9b5ed7e update submodule
| * b2e90c6 add b.txt
|/
* c99faba First commit
* 74b6441 (HEAD, tag: v0) Initial commit

# 接下来我们重新在origin/dev上创建本地dev分支即可
git branch dev origin/dev

# 这样就回到最初始的状态了
git --no-pager log --graph --oneline --all
* 717918d (origin/dev, dev) Add dev.txt
* f3bdedc (tag: v1.1.0) add a.txt
| * 7044173 (origin/master, origin/HEAD, master) update test-submodule
| * 2e55b26 add b.txt
| * 9b5ed7e update submodule
| * b2e90c6 add b.txt
|/
* c99faba First commit
* 74b6441 (HEAD, tag: v0) Initial commit
```
值得注意这里`git fetch`只是将远程的数据（分支、提交、标签）下载下来，但是不会进行自动的分支合并！一般需要手动合并

## 子模块
git支持仓库包含子模块，即一个仓库可以调用另一个仓库，在clone时候将调用的仓库都下拉，使用场景，例如另一个仓库的不同分支上专门存储各种数据集，用于其他的各种仓库，那么该仓库的某个分支就可以作为其他仓库的子模块，这样无需占用其他仓库的内存，便于管理

我们再创建一个测试仓库test-submodule，地址为`https://github.com/wty-yy-mini/test-submodule.git`，我们添加一个`README.md`进去
```bash
cd ..
git clone https://github.com/wty-yy-mini/test-submodule.git
echo "This is a submodule." > README.md
git add . && git commit -m "add README.md"
git push -u origin master
```

重新回到test工作区，我们将test-submodule作为子模块加入进来
```bash
cd ../test
# 将test的作为子模块放到submodule/文件夹中, 并指定追踪master分支
git submodule add -b master https://github.com/wty-yy-mini/test-submodule.git test-submodule
# 我们发现多出了两个文件.gitmodules和test-submodule
ls -a
> .  ..  b.txt  .git  .gitmodules  LICENSE  README.md  test-submodule

cat .gitmodules  # 这个文件记录了子模块的所有信息
> [submodule "test-submodule"]
> 	path = test-submodule
> 	url = https://github.com/wty-yy-mini/test-submodule.git
> 	branch = master
```

添加了子模块后，我们进入`.git/modules/`会发现有`test-submodule`文件夹，这个就对应了这个子模块的`.git`缓存信息，我们又可以发现`./test-submodule/.git`不再是一个文件夹，而是一个文件，其中内容为
```bash
cat test-submodule/.git
> gitdir: ../.git/modules/test-submodule
```
这正好说明，子模块的`.git`存在主仓库的`.git/modules`下！我们还可以发现，当我们`cd`到子模块下后，使用`git log`查看的信息就是子模块的，因此如果进行`git push`那么就是对子模块进行的了，现在我们再尝试对子模块仓库更新
```bash
cd ../test-submodule  # 进入子模块仓库
touch subfile.txt  # 添加commit到master分支
git add . && git commit -m "add subfile.txt"
git push
cd ../test  # 主仓库中的子模块还没更新
git submodule update --remote  # 更新我们的子模块
```

注意：子模块本身并不会跟踪某个branch，而是固定为某个commit，主仓库也会记录下这个commit，因此在使用`git submodule update --remote`时，就更新了子模块的commit，在主仓库中相当于修改了文件，需要一次额外的`git add . && git commit -m "Update submodule to new commit"`

### clone主仓库时将子模块一起clone

```bash
cd ..
# 只需加上--recurse-submodules
git clone --recurse-submodules https://github.com/wty-yy-mini/test.git test2
```

```bash
# 如果忘记加上了, 也没关系, 初始化submodule即可
git submodule update --init --recursive
```

后续更新
```bash
git pull  # 主仓库更新
# 注意主仓库更新并不会携带子模块更新, 需要手动执行以下命令
git submodule update --remote  # 更新子模块
```

### 创建子模块无需clone整个子模块仓库
如果我们的子模块仓库非常庞大，但是我们仅想要某个commit/branch/tags的信息，可以先用clone方法创建好文件夹，再用`submodule add`来添加：
```bash
# 还是以添加test-submodule的master分支为例
# 先单独clone master最新commit
git clone --depth 1 --branch master https://github.com/wty-yy-mini/test-submodule.git
# 添加子模块
git submodule add -b master https://github.com/wty-yy-mini/test-submodule.git test-submodule
```
这样就无需对整个`test-submodule`进行下载了！

# 命令小结
> 将上文用到的指令进行总结，by deepseek-R1

## 初始化与基础操作
1. **`git init`**
    初始化当前目录为 Git 仓库，生成 `.git` 文件夹。

2.  **`git add <文件/目录>`**
    将文件/目录的修改添加到暂存区：
    - `git add .`：添加所有修改。
    - `git add <文件名>`：添加指定文件。

3.  **`git commit -m "提交信息"`**
    将暂存区的修改提交到本地仓库，并添加注释。

4.  **`git reset`**
    撤销暂存区的修改（保留工作区文件）： 
    - `git reset`：取消所有暂存。
    - `git reset --soft <commit-ID>`：回退到指定提交，保留工作区修改。
    - `git reset --hard <commit-ID>`：强制回退到指定提交，丢弃所有修改。

5.  **`git revert <commit-ID>`** 
    回退指定提交的修改，生成新的提交记录（适用于保留后续提交的场景）。

## 查看与日志
1. **`git log`**
    查看提交历史：
    - `git log --oneline`：简洁模式显示。
    - `git log --graph --all`：图形化显示分支合并情况。

2. **`git diff`**
    查看工作区与暂存区的差异：
    - `git diff --cached`：查看暂存区与最近提交的差异。
    - `git diff <分支1> <分支2>`：比较两个分支的差异。

## 分支管理
1. **`git branch`** 
    管理分支：
    - `git branch`：列出本地分支。
    - `git branch <分支名> [ID]`：默认在当前提交上创建新分支，否则在指定提交ID上创建分支。
    - `git branch -m <新分支名>`：重命名当前分支。
    - `git branch -d/-D <分支名>`：删除分支（`-D` 强制删除未合并分支）。

2. **`git checkout`**
    - `git checkout <分支名/commit-ID/标签名>`：切换分支或回退到指定提交或标签。
    - `git checkout -b <新分支名>`：创建并切换到新分支。

3. **`git merge <分支名>`** 
   合并指定分支到当前分支（可能需手动解决冲突）。

## 标签管理
1. **`git tag`**
    管理标签：
    - `git tag`：列出本地标签。
    - `git tag <标签名> [ID]`：默认在当前commit上创建标签，否则在指定commit ID上创建标签。
    - `git tag -d <标签名>`：删除标签。

## 克隆(下载)远程仓库
1. **`git clone <远程URL> [本地存储路径]`**
    克隆远程仓库的全部分支

2. **`git clone --branch <branch名称/tag名称> --depth 1 <仓库URL> [本地存储路径]`**
    仅下载某个branch/tags

3. 仅克隆某个指定提交ID
    ```bash
    git init <仓库名称>
    cd <仓库名称>
    git remote add origin <仓库URL>
    git fetch --depth 1 origin <完整提交ID>
    git checkout FETCH_HEAD
    ```

## 远程仓库操作
2. **`git remote`** 
    管理远程仓库：
    - `git remote add origin <远程URL>`：添加远程仓库。
    - `git remote -v`：查看远程仓库信息。

3. **`git push`**
    推送本地分支到远程仓库（这里默认远程名称为`origin`）：
    - `git push origin <分支名/标签名>`：推送指定分支/标签。 
    - `git push -u origin <分支名>`：绑定本地分支与远程分支（设置上游）。
    - `git push -d origin <分支名/标签名>`：删除远程分支/标签。

4. **`git pull`**
    拉取远程分支并合并到本地：
    - `git pull --rebase`：以变基方式拉取（避免合并提交）。

5. **`git fetch`**
    拉取远程的分支但不进行合并。

## 子模块管理
1. **`git submodule add -b <分支> <仓库URL> [本地存储路径]`**
    添加子模块并指定跟踪分支。

2. **`git submodule update --remote`**
    更新子模块到最新提交。

3. **`git clone --recurse-submodules <仓库URL>`**
    克隆主仓库时递归克隆所有子模块。

4. **`cat .gitmodules`或`git submodule`**
    查看当前仓库中的子模块信息

## 配置与工具
1. **`git config`** 
    配置 Git 用户信息或行为：
    - `git config --global user.name "用户名"`
    - `git config --global user.email "邮箱"`
    - `git config --global credential.helper store`：保存远程仓库认证信息。

2. **`git branch -vv`**
    查看本地分支与远程分支的绑定关系。


## 其他实用命令
1. **`git rm <文件>`**
    删除文件并提交到暂存区。

2. **`git tag`**
    管理版本标签（如 `git tag v1.0` 创建标签）。

3. **`git stash`**
    暂存当前未提交的修改（临时切换分支时使用）。

