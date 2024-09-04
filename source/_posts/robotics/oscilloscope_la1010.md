---
title: 逻辑分析仪LA1010笔记
hide: false
math: true
abbrlink: 48556
date: 2024-09-04 21:34:54
index\_img:
banner\_img:
category:
 - Robotics
tags:
---

逻辑分析仪可以通过采样的方法, 测逻辑信号, 也就是高低电平, 电平又需要设定一个相对基准电压Vth, 将所有高于该电压的信号记为1, 反之为0.

LA1010侧面的针脚可以与正面的图标对应, 总共有16个针脚, 前3个能够支持100MHz的采样频率, 后面依次降低频率. 

使用方法: 从[官网上下载软件](http://www.qdkingst.com/cn/download-vis)(软件自动安装驱动)
- 连线方法: 将GND与开发板的地引脚相连, CH0~15与待测信号源连接就可以测不同的信号
- 配置软件: 设置电压阈值Vth, 再分别设置采样次数, 采样频率, 点开始采样就可以了.

具体例子请见下文, 以下测试均在TMS320F28069M上进行的测试.

## CAN通讯信号
这个还要额外要求一个CAN控制器设备, TI开发板必须有个CAN控制器才会发送CAN包, 因为发包必须有控制器返回的ACK消息

| ![img1](/figures/robotics/oscilloscope/pin_select.PNG) | ![img2](/figures/robotics/oscilloscope/can_wiring.jpg) |
|-|-|
|<div align='center'>左上角选择需要显示的通道(和你连接的针脚有关)</div>|<div align='center'>接线方法</div>|

连接完成后执行如下代码, 参考[F28069M开发板笔记 - 控制器区域网络CAN使用方法](/posts/10130/#控制器区域网络can使用方法)的CAN介绍, 实现下述1s间隔发包代码:

```c
#include "DSP28x_Project.h"

void ecan_transmit(void) {
    ECanaRegs.CANTRS.bit.TRS0 = 1;
    while (ECanaRegs.CANTA.bit.TA0 != 1);
    GpioDataRegs.GPBTOGGLE.bit.GPIO34 = 1;  // change LED
}

void main(void) {
    // Initialization
    InitSysCtrl();
    DINT;
    IER = 0x0000;
    IFR = 0x0000;
    InitPieCtrl();
    InitPieVectTable();
    InitECanGpio();
    InitECana();
    // ECana
    // transmit
    ECanaMboxes.MBOX0.MSGID.all = 0x00000001;
    ECanaMboxes.MBOX0.MSGCTRL.bit.DLC = 8;  // data length code
    ECanaMboxes.MBOX0.MDL.all = 0x12345678;
    ECanaMboxes.MBOX0.MDH.all = 0x12345678;
    // configure
    ECanaRegs.CANMD.all = 0x00000000;
    ECanaRegs.CANME.all = 0x00000001;
    // LED
    EALLOW;
    GpioCtrlRegs.GPBDIR.bit.GPIO34 = 1;
    EDIS;

    while(1) {
        ecan_transmit();
        DELAY_US(1e6);  // delay: 1s
    }
}
```

逻辑分析仪中需要做如下配置, 配置完左边三个后, 点击开始采样就可以了, 获取到波形图后, 在右边加入一个解析器, 选择CAN, 调整为合适的波特率(可以再CAN控制器中找到), 然后就可以在右边看到解析出来的信号了:

| ![img1](/figures/robotics/oscilloscope/base_configure.png) | ![img2](/figures/robotics/oscilloscope/can_configure.png) |
|-|-|
|<div align='center'>配置逻辑分析仪</div>|<div align='center'>加入CAN解析器解析信息(解析结果在右下方显示了)</div>|

### GPIO开关信号
这个最简单, 我们只需要从[开发板手册](https://www.ti.com/lit/ug/sprui11b/sprui11b.pdf)中找到对应GPIO输出的针脚编号:
![GPIO与针脚对应关系(0~5部分接口)](/figures/robotics/oscilloscope/GPIO_pins.png)

看到对应的针脚编号就可以去开发板上找对应的数字了, 然后只需要将逻辑分析仪的通道与对应针脚链接即可:
![GPIO连线(其实没必要连这么多, 只需要连前6个即可)](/figures/robotics/oscilloscope/gpio_wiring.jpg)

参考例程中的`2806xGpioToggle`, 在其中加入我们写的这个简易控制GPIO0~3开关代码:
```c
#include "DSP28x_Project.h"

void main(void) {
    InitSysCtrl();

    // Init GPIO
    EALLOW;
    GpioCtrlRegs.GPAMUX1.all = 0x00000000;  // All GPIO
    GpioCtrlRegs.GPAMUX2.all = 0x00000000;  // All GPIO
    GpioCtrlRegs.GPADIR.all = 0x0000000F;   // GPIO 0~3
    GpioCtrlRegs.GPBDIR.bit.GPIO34 = 1;     // GPIO red LED
    EDIS;

    GpioDataRegs.GPASET.all    =0x0000000A;  // 1,3设置为高电平
    GpioDataRegs.GPACLEAR.all  =0x00000005;  // 0,2设置为低电平(默认)
    while(1) {
        GpioDataRegs.GPATOGGLE.bit.GPIO0 = 1;
        GpioDataRegs.GPATOGGLE.bit.GPIO1 = 1;
        GpioDataRegs.GPATOGGLE.bit.GPIO2 = 1;
        GpioDataRegs.GPATOGGLE.bit.GPIO3 = 1;
        GpioDataRegs.GPBTOGGLE.bit.GPIO34 = 1;
        DELAY_US(1e5);  // delay 100ms
    }
} 	
```
在逻辑分析仪软件中进行配置如下, 启动采样就可以看到波形了, 脉宽与我们设置的100ms十分接近, 由于我们设置了两种初始值, 所以0,2和1,3的波形是相同的:
![GPIO波形图](/figures/robotics/oscilloscope/gpio_wave.png)
