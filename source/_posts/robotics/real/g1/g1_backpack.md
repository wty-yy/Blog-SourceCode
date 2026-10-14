---
title: G1安装3D打印Wifi背包
hide: false
math: true
abbrlink: 4046
date: 2026-10-13 22:27:01
index\_img:
banner\_img:
category:
 - Robotics
 - Real
tags:
---

为了方便链接上G1，不再用手机热点做中转，便于后续导航控制G1移动，用GPT6设计了3D打印背包，安装上了MT3000 WiFi路由器，以及对应的电源适配器

## 背包3D模型

| ![backpack](/figures/robotics/real/g1/backpack_wifi/backpack.jpg) | ![backpack_weight](/figures/robotics/real/g1/backpack_wifi/backpack_weight.jpg) |
|-|-|
|<div align='center'>背包安装效果</div>|<div align='center'>背包总重量593.6g</div>|

step模型文件下载链接：[Google Drive - G1_V21_outward_base_STEP_STL_source_SC](https://drive.google.com/drive/folders/18rJCqjLlrmG2WC229zs02-ZEfO13Pmwd?usp=sharing)，其中包含了GPT6建模的相关文件，需要打印的在 `MEASURED_PROTOTYPE` 文件夹中
- `backbone_*.step`：背包骨架
- `router_cover_*.step`：路由器保护盖板
- `adapter_cover_*.step`：电源适配器保护盖板

Onshape在线查看链接：[G1_V21_Five_Parts_and_Screws_Group.step](https://cad.onshape.com/documents/8f16b7cfd22c21bf47873dff/w/95f17b4ee3be2d568cac5252)

最终装配体效果如下

{%
    dplayer
    "url=/figures/robotics/real/g1/backpack_wifi/G1_V21_exploded_assembly_1080p.mp4"
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

安装所需配件汇总：

| 配件 | 数量 | 链接 | 参考价格 (2026-10-14) | 说明 |
|---|---|---|---|---|
| MT3000 Wi-Fi路由器 | 1 | [淘宝](https://e.tb.cn/h.jb1I528XyHwlify?tk=vCWITHa49ZX) | 447 | - |
| 电源电压适配器5V3A | 1 | [淘宝](https://e.tb.cn/h.j1AO4afSIrK77ZP?tk=MT4UTHasilk) | 21 | 将G1的12V供电口转换为5V |
| TYPE-C公头带线 | 1 | [淘宝](https://e.tb.cn/h.jY8Dl4RnsF4BYxn?tk=9xKgTHaHDr6) | 2.42 | MT3000供电 |
| XT30公头 | 1 | - | - | 接G1供电 |
| 网线 | 1 | - | - | 连接G1和MT3000 |
| `M6*22`螺丝，M6螺母，M6垫片 | 8 | - | - | 固定所有背盖 |
| `M6*30`螺丝 | 4 | - | - | 固定背包到G1背上 |

在电源适配器的输入端焊上XT30公头，接入靠中间的G1供电口（如下图所示），输出端焊上TYPE-C公头，接入MT3000 Wi-Fi路由器的电源接口，路由器的LAN口接入G1的网口，完成如下图所示的背包安装

| ![backpack_on_g1](/figures/robotics/real/g1/backpack_wifi/backpack_on_g1.jpg) | ![backpack_on_g1_2](/figures/robotics/real/g1/backpack_wifi/backpack_on_g1_2.jpg) |
|-|-|
|<div align='center'>背包安装在G1上</div>|<div align='center'>G1接线</div>|

## MT3000配置

将MT3000的IP配置为 `192.168.123.1` 这样能直接扫描到G1上下位机所有的 `123` 网段的设备

另外的端口转发配置，是指使用中继模式将WiFi连接到另一个居于局域网的路由器上，然后将G1的SSH端口转发到MT3000的WAN口上，这样就可以通过MT3000的IP连接到G1了，下文[连接速度比对](#连接速度比对)有端口转发的方法介绍

| ![MT3000局域网ip配置](/figures/robotics/real/g1/backpack_wifi/MT3000局域网ip配置.png) | ![MT3000端口转发配置](/figures/robotics/real/g1/backpack_wifi/MT3000端口转发配置.png) |
|-|-|
|<div align='center'>MT3000局域网ip配置</div>|<div align='center'>MT3000端口转发配置</div>|

## 连接速度比对

> 下表中2.4G/5G表示主机使用的WiFi速度

| 测试场景 | SSH 建连 (s) | 交互延迟中位数 (ms) | 最大交互延迟 (ms) | G1 → 电脑 (MB/s) | 电脑 → G1 (MB/s) |
|---|---:|---:|---:|---:|---:|
| MT3000 (5G) | 0.538 | 17.582 | 51.792 | **16.160** | **11.694** |
| 手机热点 (5G) | 0.358 | 7.811 | **12.555** | 10.154 | 11.122 |
| 遮挡手机热点 (5G) | **0.355** | 7.728 | 13.564 | 8.308 | 9.923 |
| MT3000 (2.4G) | 0.50 | 14.65 | 39.27 | 4.21 | 1.67 |
| 手机热点 (2.4G) | 1.21 | 19.65 | 88.74 | 0.096 | 1.02 |
| MT3000 端口转发 | 1.22 | **5.32** | 98.43 | 5.91 | 6.57 |

MT3000 端口转发：MT3000 通过中继电脑的局域网WiFi，并对 192.168.123.164:22 开启端口转发模式，我配置的 WAN 口对应端口为 2222，于是电脑可以通过 `<MT3000在电脑局域网的IP>:2222` 连接上 G1

(2.4G/5G)：电脑用2.4G/5G WiFi网卡，直连MT3000 WiFi以及手机热点做测试，手机热点距离二者的距离为3.5m，遮挡手机热点就是简单盖上一个羽毛球拍

ssh测速方法，在 `~/.ssh/config` 中分别创建对应的连接名称 `g1, g1_direct, g1_phone` 然后执行下述脚本完成测试

```bash
python3 ssh_speed_test.py g1 g1_direct g1_phone  # 可支持多个链接测试比对
```

{% spoiler ssh_speed_test.py测试脚本 %}

```py
#!/usr/bin/env python3
import argparse
import selectors
import statistics
import subprocess
import time


def run_test(target, args):
    ssh = [
        "ssh", "-T", "-o", "BatchMode=yes", "-o", "ConnectTimeout=8",
        "-o", "Compression=no", "-o", "ControlMaster=no",
        "-o", "ControlPath=none", "-o", "ServerAliveInterval=5",
        "-o", "ServerAliveCountMax=3", target,
    ]
    result = {"target": target}
    print(f"\nTesting {target} ...", flush=True)
    try:
        probe = subprocess.run(
            ssh + ['hostname; printf "SSH_CONNECTION=%s\\n" "$SSH_CONNECTION"'],
            capture_output=True, text=True, timeout=args.timeout, check=True,
        )
        print(probe.stdout.strip(), flush=True)

        # One persistent SSH session measures interactive round trips.
        with subprocess.Popen(
            ssh + ['while read line; do printf "%s\\n" "$line"; done'],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            text=True, bufsize=1,
        ) as process:
            with selectors.DefaultSelector() as selector:
                selector.register(process.stdout, selectors.EVENT_READ)

                def exchange(message):
                    start = time.monotonic()
                    process.stdin.write(message + "\n")
                    process.stdin.flush()
                    if not selector.select(args.timeout):
                        process.kill()
                        raise TimeoutError("SSH response timed out")
                    if process.stdout.readline().strip() != message:
                        raise RuntimeError("Unexpected SSH response")
                    return time.monotonic() - start

                try:
                    result["setup"] = exchange("ready")
                    samples = [exchange(str(i)) * 1000 for i in range(args.rounds)]
                    result["median"] = statistics.median(samples)
                    result["max"] = max(samples)
                    print(f"Setup: {result['setup']:.3f} s; RTT median/max: "
                          f"{result['median']:.2f}/{result['max']:.2f} ms", flush=True)
                finally:
                    process.stdin.close()
                    try:
                        process.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        process.kill()

        size = args.size_mib * 1024 * 1024
        tests = [
            ("download", f"head -c {size} /dev/zero", None),
            ("upload", "cat > /dev/null", bytes(size)),
        ]
        for name, command, data in tests:
            start = time.monotonic()
            try:
                subprocess.run(
                    ssh + [command], input=data, stdout=subprocess.DEVNULL,
                    timeout=args.timeout, check=True,
                )
                elapsed = time.monotonic() - start
                result[name] = f"{size / elapsed / 1e6:.3f}"
                print(f"{name}: {result[name]} MB/s ({elapsed:.3f} s)", flush=True)
            except subprocess.TimeoutExpired:
                result[name] = "timeout"
                print(f"{name}: timed out after {args.timeout} s", flush=True)
            except subprocess.CalledProcessError:
                result[name] = "failed"
    except (subprocess.SubprocessError, OSError, RuntimeError, TimeoutError) as exc:
        print(f"{target}: {exc}", flush=True)
        if isinstance(exc, subprocess.CalledProcessError) and exc.stderr:
            print(exc.stderr.strip(), flush=True)
    return result


def main():
    parser = argparse.ArgumentParser(
        description="Compare SSH aliases: interactive latency and RAM-only transfer speed."
    )
    parser.add_argument("targets", nargs="+", help="SSH aliases from ~/.ssh/config")
    parser.add_argument("--size-mib", type=int, default=32, help="MiB per direction (default: 32)")
    parser.add_argument("--rounds", type=int, default=20, help="RTT samples (default: 20)")
    parser.add_argument("--timeout", type=int, default=60, help="Timeout per operation in seconds")
    args = parser.parse_args()
    if min(args.size_mib, args.rounds, args.timeout) <= 0:
        parser.error("size, rounds and timeout must be positive")
    results = [run_test(target, args) for target in args.targets]
    print(f"\nPayload: {args.size_mib} MiB per direction; compression disabled.")
    print("| SSH alias | Setup (s) | RTT median (ms) | RTT max (ms) | G1 → PC (MB/s) | PC → G1 (MB/s) |")
    print("|---|---:|---:|---:|---:|---:|")
    for result in results:
        cells = [result["target"]]
        for key in ("setup", "median", "max"):
            cells.append(f"{result[key]:.3f}" if key in result else "failed")
        cells.extend(result.get(key, "not tested") for key in ("download", "upload"))
        print("| " + " | ".join(cells) + " |")


if __name__ == "__main__":
    main()
```
{% endspoiler %}

