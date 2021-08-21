---
title: Syslog
hide: true
math: true
abbrlink: 10791
date: 2021-08-01 11:34:02
index_img:
banner_img:
category:
tags:
---
# Syslog
时间限制：1s，空间限制：512MB

## 题目描述
在Linux系统上同时运行多个性能测试程序，程序名为：`perftest`，同时还有一个程序`perfmax`会输出当前正在运行中的perftest程序的最大PID号

现在要求通过两个程序的产生的Syslog日志来判断每次`perfmax`的输出值

其中，Syslog日志格式定义为: `<PRI>日期 主机名 程序名[PID]: 程序输出信息`

各个数据的数据类型: 

`PRI`: 由三种数字组成：38，39，40，它们分别表示：`perftest`程序启动，`perftest`程序结束，`perfmax`程序查找到`perftest`程序的最大PID号

**注**：由于`perftest`这个测试程序。保证最后执行的，最先结束。因此`PRI`为39时，对应的`perftest`一定是最后启动的一个`perftest`。

`日期`: `Mmm dd hh:mm:ss`

`Mmm`: 由12种长度为3字符串组成，取值为`Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec`

`dd hh:mm:ss`: “日”的数字如果是1～9，前面会补一个空格（也就是月份后面有两个空格），而“小时”、“分”、“秒”则在前面补“0”

`主机名`: 由固定的字符串`TestHost1`组成

`程序名`: 由两种字符串组成：

1. `perftest`: 表示`perftest`程序输出的日志，当`PRI`为38或39时，输入保证程序名为`perftest`
2. `perfmax`: 表示`perfmax`程序输出的日志，当`PRI`为40时，输入保证程序名为`perfmax`

`PID`: 正整数 $(1\sim 2^{31}-1)$，`PID`号由系统**随机**生成，而非单调递增，输入保证同时运行的程序中`PID`号**两两不同**

`程序输出信息`: 长度小于10的字符串组成

例子：`<38>Oct  9 22:33:20 TestHost1 perftest[67]: Start test!`，`PRI`号为38，表示`perftest`程序启动，它的`PID`号为67


## 输入格式

包含 $N+1$ 行：

第一行为 $1$ 个正整数 $N$，对应Syslog日志的总行数

接下来 $N$ 行，为两个程序产生的Syslog日志(Syslog日志格式如上文所述)

## 输出格式

输出行数等于Syslog日志中`PRI`号为40的个数

当Syslog日志的`PRI`号为40时，输出当前正在运行的`perftest`程序的最大`PID`号，如果当前没有`perftest`程序正在运行，则输出0

## 输入输出样例

### 输入 #1
```
10
<38>Oct  9 02:12:00 TestHost1 perftest[4]: Start test!
<38>Oct  9 02:12:01 TestHost1 perftest[7]: Start test!
<38>Oct  9 02:12:02 TestHost1 perftest[5]: Start test!
<40>Oct  9 02:12:03 TestHost1 perfmax[67]: Find max perftest PID!
<39>Oct  9 02:12:04 TestHost1 perftest[5]: End test!
<40>Oct  9 02:12:05 TestHost1 perfmax[67]: Find max perftest PID!
<39>Oct  9 02:12:06 TestHost1 perftest[7]: End test!
<40>Oct  9 02:12:07 TestHost1 perfmax[67]: Find max perftest PID!
<39>Oct  9 02:12:06 TestHost1 perftest[4]: End test!
<40>Oct  9 02:12:07 TestHost1 perfmax[67]: Find max perftest PID!
```
### 输出 #1

```
7
7
4
0
```

### 输入 #2
```
12
<38>Aug  1 09:24:49 TestHost1 perftest[9]: Start test!
<38>Aug  1 09:24:55 TestHost1 perftest[29]: Start test!
<38>Aug  1 09:24:59 TestHost1 perftest[12]: Start test!
<38>Aug  1 09:25:00 TestHost1 perftest[33]: Start test!
<40>Aug  1 09:25:01 TestHost1 perfmax[35]: Find max perftest PID!
<39>Aug  1 09:25:02 TestHost1 perftest[33]: End test!
<40>Aug  1 09:25:03 TestHost1 perfmax[47]: Find max perftest PID!
<39>Aug  1 09:25:04 TestHost1 perftest[12]: End test!
<40>Aug  1 09:25:05 TestHost1 perfmax[39]: Find max perftest PID!
<38>Aug  1 09:25:06 TestHost1 perftest[46]: Start test!
<38>Aug  1 09:25:07 TestHost1 perftest[28]: Start test!
<40>Aug  1 09:25:05 TestHost1 perfmax[30]: Find max perftest PID!
```

### 输出 #2
```
33
29
29
46
```

## 说明/提示

对于 $20\%$ 的数据，$N\leqslant 10$

对于 $40\%$ 的数据，$N\leqslant 1000$

对于 $100\%$ 的数据，$N\leqslant 1000000$
