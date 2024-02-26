---
title: ffmpeg常用命令
hide: false
math: true
abbrlink: 50944
date: 2024-02-19 15:55:33
index\_img:
banner\_img:
category:
  - Linux
tags:
---

# ffmpeg常用命令

> 以下代码可在Linux上测试通过，参考：[GitHub awesome-cheatsheets - 中文速查表](https://github.com/skywind3000/awesome-cheatsheets/blob/master/tools/ffmpeg.sh)，[JiaHe's Blog - FFMPEG CHEATSHEET (中文速查表)](https://xiaojianzheng.cn/cheat-sheet/ffmpeg.html)
> 可以从 [Sample Videos](https://sample-videos.com/) 网站上下载视频进行测试。

### 基础参数

ffmpeg是一个在`shell`中对视频进行处理的工具，包含以下基础参数：

`-i <input>`：指定输入视频为`input`

`-vcodec, -c:v libx264`：指定编码器为`libx264`（不指定则当输出文件格式为 `mp4` 时默认使用）

`-an`：静止音频（不制定则使用`-c:a aac` 为默认的音频编码）

### 分割视频

分割视频有以下两种方法：

方法一：流复制（速度快，但不建议使用，开头帧大概率出现花屏，这是由于`libx264`编码中的`I`帧关键帧没有被截取到的原因）

```shell
ffmpeg -i <input> -ss <start time> -t <continue time> -vcodec copy -an <output>
```

方法二：重解码（速度慢，但是正确）

```shell
ffmpeg -i <input> -ss <start time> -t <continue time> -c:v libx264 -an <output>
```

### 连接视频

连接多个相同视频：[How to concatenate two MP4 files using FFmpeg?](https://stackoverflow.com/questions/7333232/how-to-concatenate-two-mp4-files-using-ffmpeg)，对具有相同编解码器的视频们进行连接

```shell
$ cat mylist.txt  # 创建待连接的视频路径文本，按照连接顺序顺次枚举
file '/path/to/file1'
file '/path/to/file2'
file '/path/to/file3'

$ ffmpeg -f concat -i mylist.txt -c copy output.mp4  # 视频合并
```

### 修改fps

参考[Changing the frame rate](https://trac.ffmpeg.org/wiki/ChangingFrameRate)，将视频`fps`修改为`30`帧：

```shell
ffmpeg -i <input> -filter:v fps=30 <output>
```

### 在Python中执行ffmpeg命令

参考`moviepy.tools.subprocess_call`，只用`subprocess`执行`cmd`命令：

```python
from subprocess import DEVNULL
import subprocess as sp

def subprocess_call(cmd):
  print('Moviepy - Running:\n>>> '+ " ".join(cmd))

  popen_params = {"stdout": DEVNULL,
          "stderr": sp.PIPE,
          "stdin": DEVNULL}

  proc = sp.Popen(cmd, **popen_params)  # 创建Popen执行cmd命令

  out, err = proc.communicate() # proc.wait()
  proc.stderr.close()

  if proc.returncode:
    print('Moviepy - Command returned an error')
    raise IOError(err.decode('utf8'))
  else:
    print('Moviepy - Command successful')

  del proc
```

使用方法，以分割视频`filename`中`[t1,t2]`时间段的子视频文件为例：

```python
def ffmpeg_extract_subclip(filename, t1, t2, targetname, no_audio=True):
  """ Makes a new video file playing video file ``filename`` between
    the times ``t1`` and ``t2``. """
  name, ext = os.path.splitext(filename)

  cmd = ["ffmpeg", "-y", # cover same file
    "-ss", "%0.2f"%t1,
    "-i", filename,
    "-t", "%0.2f"%(t2-t1),
    "-c:v", "libx264", "-an" if no_audio else "", targetname]

  subprocess_call(cmd)
```


