---
title: Arduino学习笔记
hide: false
math: true
abbrlink: 55771
date: 2025-01-02 10:00:52
index\_img:
banner\_img:
category:
 - Robotics
tags:
---

我使用的Arduino版本为[Arduino Mega 2560](https://docs.arduino.cc/hardware/mega-2560/)，本文按照[官方样例](https://docs.arduino.cc/built-in-examples/)学习基础，编程环境为VSCode + Arduino Community Edition插件 + Arduino v1.8.19(插件和v2.x不兼容)

## 环境安装
安装[VSCode](https://code.visualstudio.com/download)，[Arduino Community Edition插件](https://marketplace.visualstudio.com/items?itemName=vscode-arduino.vscode-arduino-community)，[Arduino编辑器](https://www.arduino.cc/en/software/)（向下翻找到1.8.19版本）

完成安装后，先打开Arduino界面，点击左上角第二各按钮Upload试一下能否烧录，如果报错`can't open device "/dev/**": Permission denied`，执行`sudo usermod -a -G dialout $USER`，登出重进一下即可，再测试能否烧录

VSCode打开设置搜索`arduino path`，将Arduino的安装路径添上，打开工作空间（最好是默认路径`~/Arduino`(Linux)，`C:/user/<usr_name>/Arduino`(Windows)），`ctrl+shift+p`输入`arduino initialize`回车，创建空白项目，选择开发板类型，右下角Serial Port点击选择对应的USB接口，如下图所示
![VSCode配置端口+烧录](/figures/robotics/Arduino/VSCode配置烧录.png)

## 样例学习
官方样例详细解释[Arduino - Built-in Examples](https://docs.arduino.cc/built-in-examples/)，每一个样例都有对应的电路图和示意图

`ctrl+shift+p`输入`arduino example`回车，弹出新窗口中选择我们想要的样例，会打开一个新窗口，如果进入了默认路径，就会在其下生成`generated_examples/<ex_name>`，`ctrl+shift+p`输入`arduino select sketch`回车，选择我们想执行的样例，这样就可以在一个工作空间下执行不同的样例啦7
### Basics
#### AnalogReadSerial
通过串口（USB）读取A0口的模拟电压大小，通过模拟`1024`，通过变压器（类似滑动变阻器）调节电压大小：
```ino
// 初始化dsp的各种信息, 例如GPIO模式设定PWM, INPUT, OUTPUT配置(仅运行一次)
void setup() {
  // 设置串口通讯的比特流大小9600bit/s, 只有几种常用的大小, 默认这个
  Serial.begin(9600);
}

// 死循环重复执行代码
void loop() {
  // 读取转换得到的感知值
  int sensor_value = analogRead(A0);
  Serial.print(">sensor_value:");  // 使用serial plotter插件需要加的输出
  Serial.println(sensor_value);
  float voltage = sensor_value * (5.0 / 1024.0);  // 转化为真实电压大小
  Serial.print(">voltage:");  // 使用serial plotter插件需要加的输出
  Serial.println(voltage);
  delay(1);        // delay in between reads for stability
}
```
在VSCode中再安装一个[Serial Plotter插件](https://marketplace.visualstudio.com/items?itemName=badlogicgames.serial-plotter)可以绘制端口数据的图像，`ctrl+shift+p`输入`serial plotter`回车，在新窗口中选择对应的端口，比特率选择9600，点击Start即可看到曲线图：
![逻辑电压读取](/figures/robotics/Arduino/serial_plotter.png)
**注意**: 每次烧录前，需要点击Serial Plotter中的Stop按钮，暂停端口数据的读取，否则被占用无法烧录程序
#### Blink
在Mega 2560官网介绍上可以找到[Pinout.pdf](https://docs.arduino.cc/resources/pinouts/A000067-full-pinout.pdf)对每个针脚功能和编号进行了介绍，如果我们要用哪个针脚可以直接输入对应名称（已进行宏定义声明了）
```ino
void setup() {
  // 将LEB_BUILTIN GPIO设置为输出模式
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // 数字信号写入, 设置为HIGH高电压, LOW低电压
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                       // wait for a second
}
```

#### DigitalReadSerial
数字信号(0或1)读取，这里直接通过手动按开关来模拟高低信号，这里电路图中要求的电阻只要是1k以上的都可以（电阻色环[在线读取网页](https://www.digikey.sg/zh/resources/conversion-calculators/conversion-calculator-resistor-color-code)方法），只需要避免正负极连接导致短路
```ino
// 直接写端口2, 默认为PIN2
int pushButton = 2;

void setup() {
  Serial.begin(9600);
  // 设置GPIO为输入模式
  pinMode(pushButton, INPUT);
}

void loop() {
  // 读取数字信号信息 0或1
  int buttonState = digitalRead(pushButton);
  Serial.print(">var1:");
  Serial.println(buttonState);
  delay(1);        // delay in between reads for stability
}
```

#### Fading a LED
用PWM(Pulse Width Modulation)脉冲宽度调制来控制LED灯的亮度，就是通过控制信号（电压）的占空比（高电平“非空”的所占比例），例如高电平为5V，当占空比为30%时，输出电压就相当于是$5\times 0.3=1.5\text{V}$，由于Arduino无需指定PWM波的频率，使用非常简单直接用`analogWriter`就可以输出指定占空比的PWM波:
> 在[pinout.pdf](https://docs.arduino.cc/resources/pinouts/A000067-full-pinout.pdf)中的所有带有`~`开头的针脚表示支持PWM模式，MEGA2560就是PIN 2~13都支持
```ino
int led_pin = 9;  // 设置PWM波输出引脚
int current_brightness = 0;  // 当前占空比
int fade_amount = 5;  // 渐变量

void setup() {
  // 不设置pinMode也可以使用PWD，查看analogWrite源码可以看到他会先设置针脚为OUTPUT模式
  pinMode(led_pin, OUTPUT);
}

void loop() {
  analogWrite(led_pin, current_brightness);  // 设置占空比
  current_brightness += fade_amount;  // 更新占空比

  // 占空比范围0~255
  if (current_brightness <= 0 || current_brightness >= 255) {
    fade_amount = -fade_amount;
  }

  delay(30);
}
```

有趣的是`analogWrite(pin, val)`当`val==0,255`时，等价于`digitalWrite(pin, LOW), digitalWrite(pin, HIGH)`（源码中可以看到），在输出时也是默认为数字输出，当`val!=0,255`时，使用PWM进行模拟输出（这里的模拟，指的是模拟信号输出，介于低电平和高电平之间的电平）

- 数字信号: 离散，一般只有0,1取值，一般用于二进制数据传输
- 模拟信号: 连续，在这里就是0~255之间的正整数，用占空比来表示，一般用于模拟物理量

### 自行设计
#### Input&PWM Output
简单总结上上述四个例子所用到的针脚与函数:
|函数|针脚|备注|
|-|-|-|
|`DigitalRead(pin_id)`|**D**开头|数字信号读入，只能获取0或1的读入信息，分别表示高电平5V与低电平0V|
|`DigitalWrite(pin_id)`|**D**开头|数字信号输出，只能输出高电平5V或低电平0V|
|`AnalogRead(pin_id)`|**A**开头|模拟信号读入，能将读取到的0~5V电压等比例转换为10bit正整数(0~1023)|
|`AnalogWrite(pin_id, val)`|**D**开头|模拟信号输出，通过PWM波形式，将`val`(0~255)等比例转换为0~5V模拟电压|

同时，通过加入分压电阻，我们可以计算出在读入模拟信号时，Arduino中内置的上拉电阻阻值为$11.67\times 10^3\Omega$，可选的上拉电阻阻值为$162\Omega$，测量模拟输出与分压电路电路图如下:
![分压电路](/figures/robotics/Arduino/voltage_divider_circuit.png)
其中$R_{in}$为Arduino的内置电阻，$R_3$为分压电阻，可以将**红色部分**理解为模拟输入部分的电路图。因为如果我们直接连接A0和2号针脚时，模拟输入为$1023$，而串联一个$R_3=10^3\Omega$的分压电阻时，模拟输入为$922$，简单计算
$$
\frac{R_{in}}{R_{in}+R_3}=\frac{922}{1023}\Rightarrow R_{in}=\frac{922}{1024-922}\times 10^3\approx 9\times 10^3\Omega
$$

为了验证上述正确性，可以简单写一个PWM波输出，模拟信号读入的代码:
```ino
int analog_pin = A0;
int pwm_pin = 2;
int x = 0, y = 0;

void setup() {
  Serial.begin(9600);
  pinMode(analog_pin, INPUT);  // 默认上拉9K Ohm
  pinMode(pwm_pin, OUTPUT);
}
void loop() {
  y = sin(x++ / 255.0 * PI * 2) * 128 + 128;  // 生成正弦波信号(0~255)
  if (x > 255) x = 0;
  analogWrite(pwm_pin, y);
  Serial.print(">pwm:");
  Serial.println(y);

  int p1 = analogRead(analog_pin);
  Serial.print(">p1:");
  Serial.println(p1);
  float voltage = p1 * 5.0 / 1024;
  Serial.print(">voltage:");
  Serial.println(voltage);

  delay(10);
}
```
同时绘制`pwm`和`p1`得到如下图像，可以看出PWM波就是通过调整占空比来模拟不同的电压输出，左侧低电压，占空比更小（更多为0V），右侧高电压，占空比更大
![模拟输入PWM波](/figures/robotics/Arduino/analog_input_pwm.png)

#### 中断控制LED
Arduino还支持终端信号，例如可以将数字输入信号作为中断触发条件，从而作为LED开关，电路图如下:
![中断控制LED](/figures/robotics/Arduino/interrupt_control_led_circuit.png)
```ino
const byte interrupt_pin = 2;  // 中断引脚
volatile byte state = LOW;    // 用于存储LED状态的变量

void setup() {
  Serial.begin(9600);         // 初始化串口通信
  pinMode(13, OUTPUT);         // 设置LED引脚为输出模式
  pinMode(interrupt_pin, INPUT_PULLUP);  // 设置中断引脚为输入模式，并启用内部上拉电阻
  attachInterrupt(digitalPinToInterrupt(interrupt_pin), blink, CHANGE);  // 当引脚电平变化时调用blink函数
}

void loop() {
  digitalWrite(13, state);  // 设置LED状态
  int p2 = digitalRead(interrupt_pin);
  Serial.print(">LED_state:");
  Serial.println(state);
  Serial.print(">interrupt_pin:");
  Serial.println(p2);
}

void blink() {
  state = !state;  // 反转LED状态
}

```
