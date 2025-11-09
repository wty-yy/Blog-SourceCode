---
title: 使用SAM2对视频物体进行连续帧打码
hide: false
math: true
abbrlink: 4856
date: 2025-11-08 17:26:40
index\_img:
banner\_img:
category:
tags:
---

由于视频中的物体需要进行连续帧打码, 又不能打码过多导致视频展示性降低, 因此尝试通过SAM2框选prompt跟踪掩码的功能来对视频中的物体进行打码, 我的电脑配置如下
1. CPU: R7-5700X
2. GPU: RTX 4080
3. 内存: 50GB

只对原视频中三帧框选需要蒙版的对象即可, 整个视频分割效果如下

<style>
.layout-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
}
.layout-left, .layout-right {
  flex: 1;
  min-width: 300px;
}
@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }
}
</style>

<div class="layout-container">
  <div class="layout-left">
{%
    dplayer
    "url=/videos/g1_dance_demo.mp4"
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

  <div align="center">
    原视频
    <a href="/videos/g1_dance_demo.mp4" download>下载链接</a>
  </div>
  </div>
  <div class="layout-right">
{%
    dplayer
    "url=/videos/g1_dance_demo_masked.mp4"
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
  <div align="center">
    SAM2分割打码后效果
    <a href="/videos/g1_dance_demo_masked.mp4" download>下载链接</a>
  </div>
  </div>
</div>



## 安装SAM2
推荐安装Conda Miniforge环境: [miniforge](https://github.com/conda-forge/miniforge/releases), 再根据[SAM2 GitHub 官方安装流程](https://github.com/facebookresearch/sam2?tab=readme-ov-file#installation)安装好Pytorch, SAM2, 下载好模型文件, 放到`sam2/checkpoints`文件夹下：
1. [sam2.1_hiera_tiny.pt](https://dl.fbaipublicfiles.com/segment_anything_2/092824/sam2.1_hiera_tiny.pt)
2. [sam2.1_hiera_small.pt](https://dl.fbaipublicfiles.com/segment_anything_2/092824/sam2.1_hiera_small.pt)
3. [sam2.1_hiera_base_plus.pt](https://dl.fbaipublicfiles.com/segment_anything_2/092824/sam2.1_hiera_base_plus.pt)

如果后续运行显存不够, 可以尝试更小的模型文件, 我这里使用的是`sam2.1_hiera_base_plus`

## 分割视频
由于SAM2每次需要将整个视频划分为图片, 再一次性全部读入内存中, 并读取全部的prompt, 如果处理的视频时间过长则会显存溢出, 我的显存只有16GB每次只能处理20秒的数据, 下面我们先对视频数据进行处理:

裁剪命令如下, 可以将mp4文件按照20s中所有帧提取到同级目录下的文件夹中, 用于后续处理
```bash
python extract_frames_from_video.py --video-file g1_dance_demo.mp4 --folder-duration 20
```

`extract_frames_from_video.py`源代码如下

```python
"""
从视频中按指定时间间隔提取帧并保存为图片存储到对应文件夹中。
python extract_frames_from_video.py \
    --video-file g1_dance_demo.mp4 \
    --output-folder g1_dance_demo_frames \
    --start 2 --end 4 --folder-duration 0.2
"""
import os
import cv2
import time
from pathlib import Path
from typing import Optional

def extract_frames(
        video_path: str,
        output_dir: Optional[str] = None,
        start: int = 0,
        end: Optional[int] = None,
        interval_sec: Optional[float] = None,
        folder_duration: Optional[float] = None,
        folder_prefix: str = "frame",
        folder_start_idx: int = 1,
    ):
    """
    从视频中按指定时间间隔提取帧并保存为图片存储到对应文件夹中, 例如:
        folder_duration=20, start=0, end=60, 则会创建3个文件夹:
        
        output_dir/
            1_frame0-19/
            2_frame20-39/
            3_frame40-59/
        
        每个文件夹内保存对应时间段的视频帧图片。

    Args:
        video_path (str): 输入视频文件的路径。
        output_dir (str): 保存图片的目标目录, 默认在video_path同级路径下创建同名文件夹。
        start (int): 开始时间点 (秒), 默认从0秒开始。
        end (Optional[int]): 结束时间点 (秒), 默认到视频结尾。
        interval_sec (Optional[float]): 提取帧的时间间隔 (秒), 默认提取所有帧。
        folder_duration (Optional[float]): 每个子文件夹包含的视频时长 (秒), 默认不分文件夹。
        folder_prefix (str): 子文件夹前缀名称, 默认 "frame"。
        folder_start_idx (int): 子文件夹起始索引, 默认从1开始。
    """
    if not os.path.exists(video_path):
        print(f"[ERROR] Video file {video_path} not found.")
        return

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"[ERROR] Can't open video {video_path}.")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0:
        print("[ERROR] Can't get FPS.")
        cap.release()
        return
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    print(f"Process video: {video_path}")
    print(f"  - FPS: {fps:.2f}")

    if end is None or end > total_frames / fps:
        end = total_frames / fps
    if output_dir is None:
        output_dir = str(Path(video_path).parent / f"{Path(video_path).stem}_frames")
    output_dir = str(output_dir) + f"_{int(1/interval_sec) if interval_sec is not None else int(fps)}fps"
    output_dir = Path(output_dir)
    output_dirs = []
    output_dir.mkdir(parents=True, exist_ok=True)
    now_save_dir = output_dir / f"{folder_start_idx}_{folder_prefix}{int(start*fps)}-{int(end*fps-1)}"
    if folder_duration is None:
        now_save_dir.mkdir(parents=True, exist_ok=True)
        output_dirs.append(now_save_dir.name)
    now_end = None  # 当前子文件夹结束时间点 (秒)


    # 循环读取和保存帧
    frame_count = 0  # 记录总共读取了多少帧
    saved_count = 0  # 记录总共保存了多少帧
    next_save_time_sec = 0.0  # 下一个保存图片的目标时间点（秒）

    use_tqdm = True
    try:
        from tqdm import tqdm
        bar = tqdm(range(0, int(end * fps)), desc="Extracting frames", unit=" frames")
    except ImportError:
        bar = range(0, int(end * fps))
        use_tqdm = False

    start_time = time.time()
    for _ in bar:
        if cap.isOpened():
            flag, frame = cap.read()
        if not flag:
            break

        current_time_sec = frame_count / fps
        frame_count += 1
        if end is not None and current_time_sec >= end:
            break
        if current_time_sec < start:
            continue

        # 检查是否达到了保存时间点
        if current_time_sec > next_save_time_sec or interval_sec is None:
            if folder_duration is not None and (now_end is None or current_time_sec >= now_end):
                # 创建新的子文件夹
                now_save_dir = output_dir / f"{folder_start_idx}_{folder_prefix}{int(current_time_sec*fps)}-{int(min(current_time_sec+folder_duration, end)*fps-1)}"
                output_dirs.append(now_save_dir.name)
                now_save_dir.mkdir(parents=True, exist_ok=True)
                folder_start_idx += 1
                saved_count = 0
                now_end = current_time_sec + folder_duration

            output_filename = now_save_dir / f"{saved_count:05d}.jpg"
            cv2.imwrite(output_filename, frame)
            saved_count += 1
            if interval_sec is not None:
                next_save_time_sec += interval_sec
        if not use_tqdm:
            if frame_count % int(fps) == 0:
                time_used = time.time() - start_time
                print(f"  - Processed {frame_count}/{total_frames} frames, remaining {int(time_used)}<{int((total_frames - frame_count) / frame_count * time_used)} sec")

    cap.release()
    print(f"\n处理完成。")
    print(f"  - 总共读取帧数: {frame_count}")
    print(f"  - 图片保存至: '{output_dir}'")
    print(f"  - 包含子文件夹: {output_dirs}")

from argparse import ArgumentParser
parser = ArgumentParser()
parser.add_argument("--video-file", type=str, required=True, help="Path to the video file.")
parser.add_argument("--output-folder", type=str, help="Directory to save extracted frames.")
parser.add_argument("--start", type=int, default=0, help="Start time in seconds.")
parser.add_argument("--end", type=int, help="End time in seconds.")
parser.add_argument("--folder-duration", type=float, help="Duration of each folder in seconds.")
parser.add_argument("--interval-sec", type=float, help="Interval between extracted frames in seconds.")
parser.add_argument("--folder-prefix", type=str, default="frame", help="Prefix for folder names.")
parser.add_argument("--start-idx", type=int, default=1, help="Starting index for folder naming.")

args = parser.parse_args()

extract_frames(
    video_path=args.video_file,
    output_dir=args.output_folder,
    start=args.start,
    end=args.end,
    folder_duration=args.folder_duration,
    interval_sec=args.interval_sec,
    folder_prefix=args.folder_prefix,
    folder_start_idx=args.start_idx,
)

```

## LabelMe制作prompt
SAM2支持两种prompt: points和boxes, 通过prompt可以给出我们想要分割的目标对象, 在第$i$帧我们给出了分割对象, 后面模型就会自动追踪将其分割出来, 这里我们使用LabelMe来绘制boxes prompt, 这里推荐下载[GitHub - LabelMe - v5.5.0](https://github.com/wkentaro/labelme/releases/tag/v5.5.0)可执行文件, 直接运行

> LabelMe的配置文件在`~/.labelmerc` (Linux), `用户目录/.labelmerc` (Windows)下, 如果每次启动的配置不符合要求, 可以修改配置文件, 便于下次启动

打开LabelMe, 首先进行配置:
1. File -> Save Automatically 打开
2. File -> Save With Image Data 关闭
3. Edit -> Keep Previous Annotation 关闭

然后点击Open Dir, 打开刚才我们执行完`extract_frames_from_video.py`得到的数据文件夹`g1_dance_demo_frames_30fps/1_frame0-149`, 选择矩形边界框如下图所示, 框选出边界即可, Ctrl+S保存标记 (由于我们选择了Save Automatically, 切换到其他的图片也能自动保存标记)
| 第0帧 | 第14帧 | 第29帧 |
| - | - | - |
|![sam2_mask_prompts_1](/figures/tools/sam2_mask/sam2_mask_prompts_1.jpg)|![sam2_mask_prompts_2](/figures/tools/sam2_mask/sam2_mask_prompts_2.jpg)|![sam2_mask_prompts_3](/figures/tools/sam2_mask/sam2_mask_prompts_3.jpg)|

## SAM2蒙版生成
完成上述两帧的prompt标记后, **将下述代码main中的`video_parent_dir`修改为带有分割文件夹的图片路径**, 运行分割代码`python sam2_segment_video.py`, 最后就会在同文件夹下生成每个片段的蒙版视频, 如最上面的视频效果

如果要看手动标记的分割效果, 可以将`86-88, 104, 107-108`行的注释解注, 再运行就能看到prompt帧对应的分割效果图了

```python
"""
# Extract frames from video using ffmpeg
python tools/extract_frames_from_video.py  # change video path and output folder inside the script
"""
from pathlib import Path

import os
# if using Apple MPS, fall back to CPU for unsupported ops
os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"
import numpy as np
import torch
import matplotlib.pyplot as plt
import json
from tqdm import tqdm
from PIL import Image
import cv2

def show_mask(mask, ax, obj_id=None, random_color=False):
    if random_color:
        color = np.concatenate([np.random.random(3), np.array([0.6])], axis=0)
    else:
        cmap = plt.get_cmap("tab10")
        cmap_idx = 0 if obj_id is None else obj_id
        color = np.array([*cmap(cmap_idx)[:3], 0.6])
    h, w = mask.shape[-2:]
    mask_image = mask.reshape(h, w, 1) * color.reshape(1, 1, -1)
    ax.imshow(mask_image)

def show_points(coords, labels, ax, marker_size=200):
    pos_points = coords[labels==1]
    neg_points = coords[labels==0]
    ax.scatter(pos_points[:, 0], pos_points[:, 1], color='green', marker='*', s=marker_size, edgecolor='white', linewidth=1.25)
    ax.scatter(neg_points[:, 0], neg_points[:, 1], color='red', marker='*', s=marker_size, edgecolor='white', linewidth=1.25)

def show_box(box, ax):
    x0, y0 = box[0], box[1]
    w, h = box[2] - box[0], box[3] - box[1]
    ax.add_patch(plt.Rectangle((x0, y0), w, h, edgecolor='green', facecolor=(0, 0, 0, 0), lw=2))

class SAM2SegmentVideoProcessor:
    def __init__(self):
        # select the device for computation
        if torch.cuda.is_available():
            device = torch.device("cuda")
        else:
            device = torch.device("cpu")
        print(f"using device: {device}")

        if device.type == "cuda":
            # use bfloat16 for the entire notebook
            torch.autocast("cuda", dtype=torch.bfloat16).__enter__()
            # turn on tfloat32 for Ampere GPUs (https://pytorch.org/docs/stable/notes/cuda.html#tensorfloat-32-tf32-on-ampere-devices)
            if torch.cuda.get_device_properties(0).major >= 8:
                torch.backends.cuda.matmul.allow_tf32 = True
                torch.backends.cudnn.allow_tf32 = True

        from sam2.build_sam import build_sam2_video_predictor

        sam2_checkpoint = "./checkpoints/sam2.1_hiera_base_plus.pt"
        model_cfg = "configs/sam2.1/sam2.1_hiera_b+.yaml"
        # sam2_checkpoint = "./checkpoints/sam2.1_hiera_tiny.pt"
        # model_cfg = "./configs/sam2.1/sam2.1_hiera_t.yaml"

        self.predictor = build_sam2_video_predictor(model_cfg, sam2_checkpoint, device=device)
        self.label2obj_id = {}
        self.num_prompts = 0

    def init_state(self, video_dir: str):
        self.video_dir = Path(video_dir)
        self.frames = sorted(Path(video_dir).rglob("*.jpg"))
        self.w, self.h = Image.open(self.frames[0]).size
        print(f"found {len(self.frames)} frames")

        # Init model
        self.inference_state = self.predictor.init_state(video_path=video_dir)
        self.predictor.reset_state(self.inference_state)

    def load_frame_prompt(self):
        """ Find all json files for frame prompts (from LabelMe) """
        for frame_json in sorted(self.video_dir.rglob("*.json")):
            frame_idx = int(frame_json.stem)
            with open(frame_json, "r") as f:
                labelme_data = json.load(f)
            shapes = labelme_data["shapes"]
            if len(shapes) == 0: continue
            # plt.figure(figsize=(self.w / 100, self.h / 100), dpi=100)
            # plt.title(f"Frame {frame_idx} with Box Prompts")
            # plt.imshow(Image.open(self.frames[frame_idx]))
            for shape in shapes:
                if shape['shape_type'] != 'rectangle': continue
                label = shape['label']
                if label not in self.label2obj_id:
                    self.label2obj_id[label] = len(self.label2obj_id)
                box = shape['points']  # [[x0, y0], [x1, y1]]
                x0, y0 = box[0]
                x1, y1 = box[1]
                box = [min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1)]
                _, out_obj_ids, out_mask_logits = self.predictor.add_new_points_or_box(
                    inference_state=self.inference_state,
                    frame_idx=frame_idx,
                    obj_id=self.label2obj_id[label],
                    box=box
                )
                # show_box(box, plt.gca())
            for i, out_obj_id in enumerate(out_obj_ids):
                show_mask((out_mask_logits[i] > 0).cpu().numpy(), plt.gca(), obj_id=out_obj_id)
            # plt.axis('off')
            # plt.show()
            self.num_prompts += 1

    def segment_frames(self):
        # output_dir  = self.video_dir.parent / f"{self.video_dir.name}_segmented"
        # output_dir.mkdir(exist_ok=True, parents=True)
        output_video = self.video_dir.parent / f"{self.video_dir.name}_segmented.avi"
        video_segments = {}
        writer = cv2.VideoWriter(str(output_video), cv2.VideoWriter_fourcc(*'XVID'), fps=30, frameSize=(self.w, self.h))
        if self.num_prompts > 0:
            for out_frame_idx, out_obj_ids, out_mask_logits in self.predictor.propagate_in_video(self.inference_state):
                video_segments[out_frame_idx] = {
                    out_obj_id: (out_mask_logits[i] > 0.0).cpu().numpy()
                    for i, out_obj_id in enumerate(out_obj_ids)
                }
        for frame_idx in tqdm(range(len(self.frames))):
            # Write video
            if frame_idx not in video_segments:
                img = cv2.imread(self.frames[frame_idx])
                writer.write(img)
                continue
            img = cv2.imread(self.frames[frame_idx])
            for out_obj_id, out_mask in video_segments[frame_idx].items():
                mask = out_mask.reshape(self.h, self.w)
                pixels = img[mask].astype(np.float32)
                if len(pixels) > 0:
                    # img[mask] = np.mean(pixels, axis=0).astype(np.uint8)  # (Optional 1) color the masked area with mean color
                    img[mask] = 255  # (Optional 2) white out the masked area

            writer.write(img)

            # Save segmented frames
            # img = Image.open(self.frames[frame_idx])
            # img = np.array(img)
            # for out_obj_id, out_mask in video_segments[frame_idx].items():
            #     img[out_mask.reshape(self.h, self.w)] = 255
            # output_path = output_dir / f"{frame_idx:05d}.png"
            # Image.fromarray(img).save(output_path)

            # Matplotlib visualization (optional)
            # plt.figure(figsize=(self.w / 100, self.h / 100), dpi=100)
            # plt.title(f"Frame {frame_idx}")
            # plt.imshow(Image.open(self.frames[frame_idx]))
            # for out_obj_id, out_mask in video_segments[frame_idx].items():
            #     show_mask(out_mask, plt.gca(), obj_id=out_obj_id)
            # plt.axis('off')
            # output_path = output_dir / f"{frame_idx:05d}.png"
            # plt.savefig(output_path, bbox_inches='tight', pad_inches=0)
            # plt.close()
        writer.release()
        print(f"Segmented video saved to: {output_video}")

if __name__ == '__main__':
    video_parent_dir = "/home/yy/Videos/sam2_mask_demo/g1_dance_demo_frames_30fps"
    video_dirs = [x for x in sorted(Path(video_parent_dir).glob("*")) if x.is_dir()]
    for video_dir in video_dirs:
        idx = int(video_dir.name.split("_")[0])
        if idx >= 1:
        # if 2 <= idx <= 9 and idx not in []:
            sam2_segment_video_processor = SAM2SegmentVideoProcessor()
            print(f"Processing video directory: {video_dir}")
            sam2_segment_video_processor.init_state(str(video_dir))
            sam2_segment_video_processor.load_frame_prompt()
            sam2_segment_video_processor.segment_frames()

```

