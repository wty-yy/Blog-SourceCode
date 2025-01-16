---
title: 模板&dotfiles
hide: true
math: true
abbrlink: 18857
date: 2022-03-31 22:54:03
index_img:
banner_img:
category:
tags:
---

# 模板

## VsCode

按下快捷键 `Ctrl + Shift + p` 输入 `user settings`，选择 `Open User Settings (JSON)` 打开用户配置文件。

{% spoiler "显/隐全部配置文件代码" %}
```json
{
    "editor.fontSize": 19,
    "C_Cpp.default.cppStandard": "c++20",
    "C_Cpp.default.cStandard": "c11",
    "C_Cpp.clang_format_fallbackStyle": "LLVM",
    "terminal.integrated.shellArgs.windows": ["-NoLogo"],
    "terminal.integrated.shell.windows": "",
    "editor.suggestSelection": "first",
    "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
    "files.exclude": {
        "**/.classpath": true,
        "**/.project": true,
        "**/.settings": true,
        "**/.factorypath": true
    },
    "sonarlint.rules": {
        "java:S106": {
            "level": "off"
        }
    },
    "C_Cpp.updateChannel": "Insiders",
    "latex-workshop.view.pdf.viewer": "browser",
    "debug.onTaskErrors": "abort",
    "python.languageServer": "Default",
    "workbench.editorAssociations": {
        "*.ipynb": "jupyter-notebook",
        "*.pdf": "latex-workshop-pdf-hook",
    },
    "editor.codeLens": false,
    //"editor.fontFamily": "Consolas",
    //"editor.fontFamily": "CaskaydiaCove Nerd Font",
    "editor.fontFamily": "'CaskaydiaCove Nerd Font', '方正新书宋_GBK', '宋体', Consolas, 'Courier New', monospace",
    "editor.fontLigatures": true,
    "workbench.colorTheme": "One Dark Pro Mix",
    "notebook.cellToolbarLocation": {
        "default": "right",
        "jupyter-notebook": "left"
    },
    "editor.lineNumbers": "relative",
    "explorer.confirmDelete": false,
    "explorer.confirmDragAndDrop": false,
    "editor.wordWrapColumn": 200,

    "matlab.mlintpath": "D:\\Program Files\\MATLAB\\R2020b\\bin\\win64\\mlint.exe",
    "C_Cpp.intelliSenseCacheSize": 512,
    // vim配置
    "vim.handleKeys": {
            "<C-a>": false,
            "<C-f>": false,
            "<C-n>": false
    },
    "vim.useCtrlKeys": true,
    "vim.normalModeKeyBindingsNonRecursive": [
        {
            "before": ["u"],
            "commands": ["undo"]
        },
        {
            "before": ["<C-r>"],
            "commands": ["redo"]
        }
    ],
    //"matlab.linterEncoding": "gb2312",

    // LaTeX设置
    "latex-workshop.latex.autoBuild.run": "never",
    "latex-workshop.message.error.show": false,
    "latex-workshop.message.warning.show": false,
    "latex-workshop.latex.tools": [
        {
            "name": "xelatex",
            "command": "xelatex",
            "args": [
                "--shell-escape",
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "%DOCFILE%"
            ]
        },
        {
            "name": "pdflatex",
            "command": "pdflatex",
            "args": [
                "--shell-escape",
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "%DOCFILE%"
            ]
        },
        {
            "name": "bibtex",
            "command": "bibtex",
            "args": [
                "%DOCFILE%"
            ]
        }
    ],

    "latex-workshop.latex.recipes": [
        {
            "name": "xelatex",
            "tools": [
                "xelatex"
            ],
        },
        {
            "name": "pdflatex",
            "tools": [
                "pdflatex"
            ]
        },
        {
            "name": "xe->bib->xe->xe",
            "tools": [
                "xelatex",
                "bibtex",
                "xelatex",
                "xelatex"
            ]
        },
        {
            "name": "pdf->bib->pdf->pdf",
            "tools": [
                "pdflatex",
                "bibtex",
                "pdflatex",
                "pdflatex"
            ]
        }
    ],
    // latex正反向搜索
    "latex-workshop.view.pdf.viewer": "tab",
    /*
    "latex-workshop.view.pdf.viewer": "external",
    "latex-workshop.view.pdf.external.viewer.command": "D:/yy/Latex/SumatraPDF/SumatraPDF-3.2-64.exe",  //注意修改路径
    "latex-workshop.view.pdf.external.viewer.args": [
        "%PDF%"
    ],
    "latex-workshop.view.pdf.external.synctex.command": "D:/yy/Latex/SumatraPDF/SumatraPDF-3.2-64.exe", //注意修改路径
    "latex-workshop.view.pdf.external.synctex.args": [
        "-forward-search",
        "%TEX%",
        "%LINE%",
        "%PDF%",
    ],
    */
    "files.autoSave": "afterDelay",
    "security.workspace.trust.untrustedFiles": "open",
    "workbench.activityBar.iconClickBehavior": "focus",
    "editor.unicodeHighlight.allowedLocales": {
        "zh-hans": true,
        "zh-hant": true
    },
    "editor.unicodeHighlight.includeComments": false,
    "latex-workshop.bibtex-format.tab": "4 spaces",
    "python.terminal.executeInFileDir": true,
    "terminal.integrated.enableMultiLinePasteWarning": false,
    "terminal.integrated.defaultProfile.windows": "Command Prompt",
    "editor.unicodeHighlight.nonBasicASCII": false,

    "git.autorefresh": false,
    "git.autoRepositoryDetection": false,
    "search.followSymlinks": false,
    "editor.lineHeight": 1.3,
    "latex-workshop.hover.preview.maxLines": 5,
    "latex-workshop.intellisense.package.enabled": false,
    "latex-workshop.check.duplicatedLabels.enabled": false,
    "git.openRepositoryInParentFolders": "never",
    "r.rterm.option": [
        "--no-site-file"
    ],
    "[python]": {
        "editor.formatOnType": true
    },
    "git.ignoreMissingGitWarning": true,
    "cmake.configureOnOpen": true,

    // The number of spaces a tab is equal to.
    "editor.tabSize": 4,

    // Insert spaces when pressing Tab.
    "editor.insertSpaces": true,

    // When opening a file, `editor.tabSize` and `editor.insertSpaces` will be detected based on the file contents.
    "editor.detectIndentation": true,
}
```
{% endspoiler %}

## LaTeX

已将[LaTeX项目](https://github.com/wty-yy/LaTex-Projects)同步到GitHub上，模板更新修改可以实时同步了.

### 作业模板

模板：https://github.com/wty-yy/LaTex-Projects/blob/main/template.tex

### 报告模板

#### 旧版本

代码块使用的是lstlisting包, 可直接运行.

{% spoiler 点击显/隐代码 %}
```tex
\documentclass[12pt, a4paper, oneside]{ctexart}
\usepackage{amsmath, amsthm, amssymb, bm, color, graphicx, geometry, hyperref, mathrsfs,extarrows, braket, booktabs, array, listings, xcolor, fontspec, appendix}
\setmonofont{Consolas}

%%%%%% 设置字号 %%%%%%
\newcommand{\chuhao}{\fontsize{42pt}{\baselineskip}\selectfont}
\newcommand{\xiaochuhao}{\fontsize{36pt}{\baselineskip}\selectfont}
\newcommand{\yihao}{\fontsize{28pt}{\baselineskip}\selectfont}
\newcommand{\erhao}{\fontsize{21pt}{\baselineskip}\selectfont}
\newcommand{\xiaoerhao}{\fontsize{18pt}{\baselineskip}\selectfont}
\newcommand{\sanhao}{\fontsize{15.75pt}{\baselineskip}\selectfont}
\newcommand{\sihao}{\fontsize{14pt}{\baselineskip}\selectfont}
\newcommand{\xiaosihao}{\fontsize{12pt}{\baselineskip}\selectfont}
\newcommand{\wuhao}{\fontsize{10.5pt}{\baselineskip}\selectfont}
\newcommand{\xiaowuhao}{\fontsize{9pt}{\baselineskip}\selectfont}
\newcommand{\liuhao}{\fontsize{7.875pt}{\baselineskip}\selectfont}
\newcommand{\qihao}{\fontsize{5.25pt}{\baselineskip}\selectfont}

%%%% 下面的命令重定义页面边距，使其符合中文刊物习惯 %%%%
\addtolength{\topmargin}{-54pt}
\setlength{\oddsidemargin}{0.63cm}  % 3.17cm - 1 inch
\setlength{\evensidemargin}{\oddsidemargin}
\setlength{\textwidth}{14.66cm}
\setlength{\textheight}{24.62cm}    % 24.62

%%%% 下面的命令设置行间距与段落间距 %%%%
\linespread{1.4}
% \setlength{\parskip}{1ex}
\setlength{\parskip}{0.5\baselineskip}
%%%% 代码块的基本设置 %%%%
\lstset{
    language = MATLAB,
    breaklines,%自动换行
    columns=flexible,%不随便添加空格,只在已经有空格的地方添加空格,
    %如果想要添加空格使用fixed作为参数(这是默认的),如果坚决不添加空格使用fullflexible作为参数.
    numbers=left, 
    numberstyle=\tiny,
    keywordstyle=\color{blue!70},
    commentstyle=\color{red!50!green!50!blue!50},
    frame=shadowbox,
    rulesepcolor=\color{red!20!green!20!blue!20},
    basicstyle=\ttfamily
}

%%%% 正文开始 %%%%
\begin{document}

%%%% 定理类环境的定义 %%%%
\newtheorem{example}{例}             % 整体编号
\newtheorem{algorithm}{算法}
\newtheorem{theorem}{定理}[section]  % 按 section 编号
\newtheorem{definition}{定义}
\newtheorem{axiom}{公理}
\newtheorem{property}{性质}
\newtheorem{proposition}{命题}
\newtheorem{lemma}{引理}
\newtheorem{corollary}{推论}
\newtheorem{remark}{注解}
\newtheorem{condition}{条件}
\newtheorem{conclusion}{结论}
\newtheorem{assumption}{假设}
\numberwithin{equation}{section}  % 按章节编号

%%%% 重定义 %%%%
\renewcommand{\contentsname}{目录}  % 将Contents改为目录
\renewcommand{\abstractname}{摘要}  % 将Abstract改为摘要
\renewcommand{\refname}{参考文献}   % 将References改为参考文献
\renewcommand{\indexname}{索引}
\renewcommand{\figurename}{图}
\renewcommand{\tablename}{表}
\renewcommand{\appendixname}{附录}
\renewcommand{\algorithm}{算法}


%%%% 定义标题格式，包括title，author，affiliation，email等 %%%%
\title{数值分析上机试验报告\\观察高次插值多项式的龙格现象}
\author{姓名\\1234567890\\[2ex]
\xiaosihao 西安交通大学\\[2ex]
}
\date{2022年3月18日}

\maketitle % 设置上面是标题
\newpage
\tableofcontents % 创建目录，使用目录需要编译两次，并且不能删去编译产生的临时文件!!!

%%%% 以下部分是正文 %%%%  
\newpage
\section{123}
123
\subsection{123}
123
\subsubsection{123}
123
\begin{appendices}
    \section{附录}
    \begin{lstlisting}
        
    \end{lstlisting}
\end{appendices}
\end{document}

\iffalse
% 图片模板
\centerline{
    \includegraphics[width=0.8\textwidth]{figure.png}
}
\fi
\iffalse
% 表格模板
\renewcommand\arraystretch{0.8} % 设置表格高度为原来的0.8倍
\begin{table}[!htbp] % table标准
    \centering % 表格居中
    \begin{tabular}{p{1cm}<{\centering}p{1cm}<{\centering}p{3cm}<{\centering}p{5cm}<{\centering}} % 设置表格宽度
    %\begin{tabular}{cccc}
        \toprule
        $x_i$ & $f[x_1]$ & $f[x_i,x_{i+1}]$ & $f[x_i,x_{i+1},x_{i+2}]$ \\
        \midrule
        $x_0$ & $f(x_0)$ &                  &                          \\
        $x_0$ & $f(x_0)$ & $f'(x_0)$        &                          \\
        $x_0$ & $f(x_1)$ & $\frac{f(x_1)-f(x_0)}{x_1-x_0}$ & $\frac{f(x_1)-f(x_0)}{(x_1-x_0)^2}-\frac{f'(x_0)}{x_1-x_0}$\\
        \bottomrule
    \end{tabular}
\end{table}

% 代码块
\begin{lstlisting}
    
\end{lstlisting}
\fi

\end{document}
```
{% endspoiler %}

#### 新版本

代码块使用的是minted包, 需要配合python使用, 不然无法编译, 使用方法在代码中有详细解释.

模板：https://github.com/wty-yy/LaTex-Projects/blob/main/%E6%8A%A5%E5%91%8A%E6%A8%A1%E6%9D%BF_minted.tex

### PPT模板

在使用beamer模板，实现ppt，效果不错，且和写普通latex方法大致类似

模板：https://github.com/wty-yy/LaTex-Projects/blob/main/ppt%E6%A8%A1%E6%9D%BF.tex

### 常用功能总结

包含图片导入模板、表格模板、文字环绕图片模板、多组图模板. 提供一个excel表格转tex表格的[在线网站](https://www.tablesgenerator.com/).

模板：https://github.com/wty-yy/LaTex-Projects/blob/main/latex%E5%B8%B8%E7%94%A8%E5%8A%9F%E8%83%BD.tex

## C++


{% spoiler 点击显/隐代码 %}
```c++
#include <bits/stdc++.h>
#define db double
#define ll long long
#define int ll
#define vi vector<int>
#define vii vector<vi >
#define pii pair<int, int>
#define vp vector<pii >
#define vip vector<vp >
#define mkp make_pair
#define pb push_back
#define Case(x) cout << "Case #" << x << ": "
using namespace std;
const int INF = 0x3f3f3f3f;
const int P = 998244353;
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);

	return 0;
}
```
{% endspoiler %}

## Python

### Matplotlib中文调整

```python
config = {
    "font.family": 'serif', # 衬线字体
    "figure.figsize": (14, 6),  # 图像大小
    "font.size": 20, # 字号大小
    "font.serif": ['SimSun'], # 宋体
    "mathtext.fontset": 'cm', # 渲染数学公式字体
    'axes.unicode_minus': False # 显示负号
}
plt.rcParams.update(config)

config = {  # 另一种配置
    "figure.figsize": (6, 6),  # 图像大小
    "font.size": 16, # 字号大小
    "font.sans-serif": ['SimHei'],   # 用黑体显示中文
    "mathtext.fontset": 'cm', # 渲染数学公式字体
    'axes.unicode_minus': False # 显示负号
}
plt.rcParams.update(config)
```

### 重定向输出到文本和文件
```python
import sys
class Logger:
  def __init__(self, filename):
    self.terminal = sys.stdout
    self.log = open(filename, 'a', encoding='utf-8')
  
  def write(self, message):
    self.terminal.write(message)
    self.log.write(message)
  
  def flush(self):
    self.terminal.flush()
    self.log.flush()
  
def redirect_std_to_file(filename):
  sys.stderr = sys.stdout = Logger(filename)

if __name__ == '__main__':
  redirect_std_to_file('test.log')
  print("hi")
  raise ValueError("GG")
```

## Jupyter Notebook

### Vim安装

主要使用Vim-Binding插件，具体安装方法可以参考我写的这个 [Zhihu - 在Jupyter Notebook中使用Vim](https://www.zhihu.com/question/384989800/answer/2433089568).

### 主题颜色配置

由于Jupyter没有黑色主题，看久了非常不舒服，这里使用的是[`jupyter-themes`](https://github.com/dunovank/jupyter-themes)效果非常不错（效果图见下文），安装方法有以下两种：

> 如果想直接安装最新版本，推荐使用第二种安装方法.

```python
# 使用pip安装
pip install jupyterthemes

# 使用conda安装
conda install -c conda-forge jupyterthemes
```

但是这样安装的版本并不是最新的，版本是 `0.20.0`，后来又有很多小的更新更新到 `0.20.2`，这些都可以在github上看到，对vim玩家比较重要的是vim光标颜色修正：[Set color for fat-cursor of vim #350](https://github.com/dunovank/jupyter-themes/pull/350)，所以更新代码十分重要.

直接在 [jupyter-themes](https://github.com/dunovank/jupyter-themes) 中下载项目的zip压缩包，找到已经安装 `jupyterthemes` 的地址，例如我是在conda的名为tensorflow环境中安装的，则对应安装包位置为

```
D:\Anaconda3\envs\tensorflow\Lib\site-packages\jupyterthemes
```

我们只需将刚刚的压缩包中 `jupyterthemes` 文件夹直接替换上述地址中的文件夹即可. 我使用的主题配置代码如下（参考作者配置）：

> 由于缩小了字体，在浏览器中缩放125%后大小正好.

```python
# 如果不使用vim
jt -t onedork -fs 115 -altp -tfs 12 -nfs 115 -cellw 88% -T -lineh 140
# 使用vim需要加上-vim，避免选中单元格后背景颜色问题和光标颜色问题
jt -t onedork -fs 115 -altp -tfs 12 -nfs 115 -cellw 88% -T -vim -lineh 140
```

含义分别为：`-t` 主题设置，`-fs` code字体大小，`-altp` Alt Prompt Layout，`-tfs` text/Markdwon字体大小，`-nfs` Notebook字体大小，`-cellw` 单元格宽度，`-T` 工具栏保持可见，`-vim` 支持jupyter-vim配色，`-lineh` 行间距.

---


还有一种安装方式，将刚才下载的zip压缩包解压，然后从终端进入到 `\jupyter-themes-master` 目录下，然后使用 `setup.py` 进行安装（首先进入你要安装的环境中），执行以下命令，即可完成安装：

```
python setup.py build
python setup.py install
```

![主题图像效果](https://s1.ax1x.com/2023/01/01/pSCGYfs.png)

![主题表格效果](https://s1.ax1x.com/2023/01/01/pSCGJYj.png)

### 绘图默认配置

由于每次都要将中文标题进行修正（不然无法显示），而且有了主题之后还需要进一步适配主题效果，为了方便，可以修改 `~/.ipython/profile_default/startup/startup.ipy` 文件夹中的 `startup.ipy` 文件（没有则自行创建）

> 注：`~` 表示用户目录，在Windows中就是表示 `C:\Users\yy\`（我的用户名是 `yy`）

```python
from jupyterthemes import jtplot
import matplotlib.pyplot as plt
import warnings

warnings.filterwarnings("ignore")  # 忽略全部警告

jtplot.style(context='talk', fscale=1.4, spines=True, gridlines='--', figsize=(6, 4.5), ticks=True)

plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
plt.rcParams['axes.unicode_minus'] = False  # 用来正常显示负号
```

## ROS2
### ROS2模板
[joshnewans/my_bot](https://github.com/joshnewans/my_bot)，亦可以[直接下载zip文件](/file/ROS/ros2_template.zip)，使用方法将其中的所有`my_bot`文件名换成新项目的名称，例如`my_newbot`:
```bash
cd src/ros2_template
# 用gerp递归找到所有包含`my_bot`的文件, 用sed将`my_bot`都替换为`my_newbot`
sed -i 's/my_bot/my_newbot/g' `grep 'my_bot' -lr .`
```
### 修复zsh按tab没有提示的问题
参考[ Autocomplete fails while using zsh. #534 ](https://github.com/ros2/ros2cli/issues/534)，参考这个[回复](https://github.com/ros2/ros2cli/issues/534#issuecomment-988824521)，修改如下文件
```bash
sudo vim /opt/ros/$ROS_DISTRO/share/rosidl_cli/environment/rosidl-argcomplete.zsh
```
找到15行`autoload -U +X compinit && compinit`，将其注释掉即可

## Docker
### 清空缓存内容(创建镜像前)
```bash
# 创建clean_cache.sh文件并写入命令
cat > clean_cache.sh << EOF
rm -rf /var/lib/apt/lists/* \
  ~/.vscode-server \
  ~/.zcompdump* \
  ~/.bash_history \
  ~/.zsh_history \
  ~/.gazebo \
  ~/.ros \
  ~/.rviz3 \
  ~/.sdformat \
  ~/.ignition
EOF
# 赋予权限
chmod +x clean_cache.sh
# 清空缓存
./clean_cache.sh
```

## MarkDown
### 用table多图并行显示
```md
|fig1|fig2|
|-|-|
|![img1](/figures/essay/bivariate_normal_plot.png)|![img2](/figures/essay/many_number_plot.png)|
|<img width=50% src="/figures/essay/bivariate_normal_plot.png"/>|<img width=100% src="/figures/essay/many_number_plot.png"/>|
```
效果如下:
|fig1|fig2|
|-|-|
|![img1](/figures/essay/bivariate_normal_plot.png)|![img2](/figures/essay/many_number_plot.png)|
|<img width=50% src="/figures/essay/bivariate_normal_plot.png"/>|<img width=100% src="/figures/essay/many_number_plot.png"/>|

### 折叠
```html
<details>
<summary>hi</summary>
debug
</details>
```
效果如下:
<details>
<summary>hi</summary>
debug
</details>


# Dotfiles

## .vimrc

{% spoiler 点击显/隐代码 %}
```.vimrc
" 设置光标为方框
let &t_EI.="\e[1 q" "EI = NORMAL mode (ELSE)
" 高亮当前行
set cursorline
" 切换界面自动保存
set autowriteall
" 自动加载
set autoread
" 停止光标闪烁
set guicursor+=a:blinkon0

" Comments in Vimscript start with a `"`.

" If you open this file in Vim, it'll be syntax highlighted for you.

" Vim is based on Vi. Setting `nocompatible` switches from the default
" Vi-compatibility mode and enables useful Vim functionality. This
" configuration option turns out not to be necessary for the file named
" '~/.vimrc', because Vim automatically enters nocompatible mode if that file
" is present. But we're including it here just in case this config file is
" loaded some other way (e.g. saved as `foo`, and then Vim started with
" `vim -u foo`).
" set nocompatible

" Turn on syntax highlighting.
" syntax on

" Disable the default Vim startup message.
set shortmess+=I

" Show line numbers.
set number

" This enables relative line numbering mode. With both number and
" relativenumber enabled, the current line shows the true line number, while
" all other lines (above and below) are numbered relative to the current line.
" This is useful because you can tell, at a glance, what count is needed to
" jump up or down to a particular line, by {count}k to go up or {count}j to go
" down.
set relativenumber

" Always show the status line at the bottom, even if you only have one window open.
"set laststatus=2

" The backspace key has slightly unintuitive behavior by default. For example,
" by default, you can't backspace before the insertion point set with 'i'.
" This configuration makes backspace behave more reasonably, in that you can
" backspace over anything.
set backspace=indent,eol,start

" By default, Vim doesn't let you hide a buffer (i.e. have a buffer that isn't
" shown in any window) that has unsaved changes. This is to prevent you from "
" forgetting about unsaved changes and then quitting e.g. via `:qa!`. We find
" hidden buffers helpful enough to disable this protection. See `:help hidden`
" for more information on this.
set hidden

" This setting makes search case-insensitive when all characters in the string
" being searched are lowercase. However, the search becomes case-sensitive if
" it contains any capital letters. This makes searching more convenient.
set ignorecase
set smartcase

" Enable searching as you type, rather than waiting till you press enter.
set incsearch

" Unbind some useless/annoying default key bindings.
nmap Q <Nop> " 'Q' in normal mode enters Ex mode. You almost never want this.

" Disable audible bell because it's annoying.
set noerrorbells visualbell t_vb=

" Enable mouse support. You should avoid relying on this too much, but it can
" sometimes be convenient.
set mouse+=a

" 设置剪贴命令
map ;y :!/mnt/c/Windows/System32/clip.exe <cr>u
map ;p :read !/mnt/c/Windows/System32/paste.exe <cr>i<bs><esc>l
map! ;p <esc>:read !/mnt/c/Windows/System32/paste.exe <cr>i<bs><esc>l

" 插件配置
call plug#begin('~/.vim/plugged')
" Plug 'neoclide/coc.nvim', {'branch': 'release'}
" Plug 'jiangmiao/auto-pairs'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
call plug#end()

"配置airline
set laststatus=2  "永远显示状态栏
let g:airline_powerline_fonts = 1  " 支持 powerline 字体
let g:airline#extensions#tabline#enabled = 1 " 显示窗口tab和buffer
let g:airline_theme='murmur'

if !exists('g:airline_symbols')
let g:airline_symbols = {}
endif
let g:airline_left_sep = '▶'
let g:airline_left_alt_sep = '❯'
let g:airline_right_sep = '◀'
let g:airline_right_alt_sep = '❮'
let g:airline_symbols.linenr = '¶'
let g:airline_symbols.branch = '⎇'

set smarttab
set tabstop=4
set shiftwidth=4
```
{% endspoiler %}
{% spoiler 点击显/隐代码 %}
```
"设置vim配色
colorscheme molokai

" Quickly Run
map <F5> :call CompileRunGcc()<CR>
func! CompileRunGcc()
    exec "w"
    if &filetype == 'c'
        exec '!g++ -D _DEBUG % -o ./bin/%<'
        exec '!time ./bin/%<'
    elseif &filetype == 'cpp'
		#exec '!g++ -D _DEBUG -O2 -Wno-unused-result % -o ./bin/%<'
		#exec '!g++ -D _DEBUG -O2 -Wl,-z,stack-size=536870912 -mcmodel=large -Wno-unused-result % -o ./bin/%<'
		exec '!g++ -D _DEBUG -pthread -O2 -Wl,-z,stack-size=536870912 -mcmodel=large -Wno-unused-result % -o ./bin/%<'
        exec '!time ./bin/%<'
    elseif &filetype == 'python'
        exec '!time python3.9 %'
    elseif &filetype == 'sh'
        :!time bash %
    endif
endfunc

" coc.nvim的官方配置
" Use tab for trigger completion with characters ahead and navigate.
" NOTE: Use command ':verbose imap <tab>' to make sure tab is not mapped by
" other plugin before putting this into your config.
"inoremap <silent><expr> <TAB>
"      \ pumvisible() ? "\<C-n>" :
"      \ <SID>check_back_space() ? "\<TAB>" :
"      \ coc#refresh()
"inoremap <expr><S-TAB> pumvisible() ? "\<C-p>" : "\<C-h>"

" Make <CR> auto-select the first completion item and notify coc.nvim to
" format on enter, <cr> could be remapped by other vim plugin
"inoremap <silent><expr> <cr> pumvisible() ? coc#_select_confirm()
"                              \: "\<C-g>u\<CR>\<c-r>=coc#on_enter()\<CR>"

" Use `[g` and `]g` to navigate diagnostics
" Use `:CocDiagnostics` to get all diagnostics of current buffer in location list.
"nmap <silent> [g <Plug>(coc-diagnostic-prev)
"nmap <silent> ]g <Plug>(coc-diagnostic-next)
```
{% endspoiler %}

## .zshrc

{% spoiler 点击显/隐代码 %}
```.zshrc
cd ~
# 设置vi-mode模式
# bindkey -v

# 博客的快捷键
alias blog='~/blog'
alias post='~/blog/source/_posts' # 进入文档文件夹
alias hexos='hexo clean && hexo s' # 在本地建立并运行
alias fluid='~/blog/node_modules/hexo-theme-fluid' # 主题配置
alias cpPost='cp -r ~/blog/source/_posts .' # 备份
# hexo g 建立blog
# hexo d 上传到github

alias out='vim out'
alias cf='~/program/cf'
alias py='~/program/py'
alias poj='~/program/poj'
alias homework='~/program/homework'
source "/home/yy/program/cf/run"

if [ -d "$HOME/.local/bin" ] ; then
  PATH="$PATH:$HOME/.local/bin"
fi


# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH
export PATH=/home/yy/nodejs/bin:$PATH
# Path to your oh-my-zsh installation.
export TERM="xterm-256color"
export ZSH="/home/yy/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="powerlevel10k/powerlevel10k"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# Caution: this setting can cause issues with multiline prompts (zsh 5.7.1 and newer seem to work)
# See https://github.com/ohmyzsh/ohmyzsh/issues/5765
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git zsh-syntax-highlighting zsh-autosuggestions vi-mode)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```
{% endspoiler %}

## .bashrc

{% spoiler 点击显/隐代码 %}
```.bashrc
export DISPLAY=localhost:0.0
alias sl=ls
PS1="> "
if [ -d "$HOME/.local/bin" ] ; then
  PATH="$PATH:$HOME/.local/bin"
fi
```
{% endspoiler %}
