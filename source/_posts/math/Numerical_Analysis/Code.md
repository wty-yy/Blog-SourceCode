---
title: 数值分析中一些算法的MATLAB代码
hide: false
math: true
category:
  - Math
  - 数值分析
tags:
  - 插值多项式
abbrlink: 51787
date: 2022-03-31 17:45:33
index_img:
banner_img:
---

这里记录一些在数值分析课程、作业中所用到的算法，可用于检查自己作业是否计算正确
（代码应该没锅`(*>﹏<*)′

前三个算法的具体使用方法可以参考 [三次样条插值法&牛顿插值法&切比雪夫插值法 MATLAB实现](/posts/63175/) 

### Newton 插值法 & Chebyshev 多项式零点作为插值点

利用$\text{Chebyshev}$插值多项式，求最优一致逼近多项式

{% spoiler 点击显/隐代码 %}
```matlab
function main
    format short
    n = 2; % 插值点个数
    rg = [-1 1]; % 插值区间
    x = cos((1:2:(2*n-1))*pi/(2*n))'; % [-1, 1]
	% 做线性变化[-1,1]->[a,b]
    x = (rg(1)+rg(2)) / 2 + (rg(2)-rg(1)) * x / 2; % [a, b]
    y = Newton(x, f(x));
    syms x
	% 变化回去
    vpa(subs(y, x, (2*x-rg(1)-rg(2)) / (rg(2)-rg(1))), 5)
end
function y = f(x) % 目标函数
    y = exp(-x);
end
% Newton插值法,a为插值点列向量,b为插值点对应的函数值列向量
function N = Newton(a, b)
    [n, ~] = size(a);
    diff = zeros(n, n); % 初始化差商表
    diff(1, :) = b';
    syms x % 定义参数x
    now = 1; % 对应上文中的 pi(x)
    N = diff(1, 1);
    % 递推计算差商表，并同时计算出插值多项式N(x)
    for i = 2 : n
        for j = i : n
            diff(i, j) = (diff(i-1, j)-diff(i-1, j-1)) / (a(j) - a(j-i+1));
        end
        now = now * (x-a(i-1));
        N = N + diff(i, i) * now;
    end
    N = expand(N); % 展开插值多项式
    N = vpa(N, 5); % 将分式系数转化为小数系数
end
```
{% endspoiler %}

### 三次样条插值法


{% spoiler 点击显/隐代码 %}
```matlab
% 三次样条插值法
% a为传入的插值点构成的向量,b为插值点对应函数值构成的向量,M1,Mn为边界条件
function S = mySpline(a, b, M1, Mn)
    [n, ~] = size(a);
    % 向量定义
    h = a(2:n) - a(1:n-1); % 求解向量h
    mu = h(1:n-2) ./ (h(1:n-2) + h(2:n-1)); % 求解向量mu
    la = 1 - mu; % 求解向量lambda
    h1 = h(1:n-2); % 定义中间变量h1
    h2 = h(2:n-1); % 定义中间变量h2
    % 求解向量d
    d = 6*((b(3:n)-b(2:n-1))./h2-(b(2:n-1)-b(1:n-2))./h1)./(h1+h2);

    % 生成系数矩阵A，修改d向量，利用追赶法求解M
    A = zeros(n-2, n-2); % 初始化系数矩阵A
    for i = 1 : n-2 % 循环构造系数矩阵A
        if (i > 1)
            A(i, i-1) = mu(i); % 对角线下方
        end
        A(i, i) = 2; % 对角线
        if (i < n-2)
            A(i, i+1) = la(i); % 对角线上方
        end
    end
    d(1) = d(1) - mu(1) * M1; % 修改向量d
    d(n-2) = d(n-2) - la(n-2) * Mn; % 修改向量d
    M = [M1; chase(A, d)'; Mn]; % 利用追赶法求解方程组,并解出向量M

    % 求解三次样条插值函数S(x)
    syms x % 定义参数x
    % 根据上述定义,计算出以下6个中间变量
    x1 = a(2:n) - x;
    x2 = x - a(1:n-1);
    m1 = M(1:n-1);
    m2 = M(2:n);
    y1 = b(1:n-1);
    y2 = b(2:n);
    % 求解三次样条插值函数
    S = (x1.^3).*m1./(6*h)+(x2.^3).*m2./(6*h)+(y1-h.^2.*m1/6).*x1./h+(y2-h.^2.*m2/6).*x2./h;
    S = expand(S); % 展开插值多项式
    S = vpa(S, 5); % 将分式系数转化为小数系数
end
```
{% endspoiler %}

### 求解三对角方程组的追赶法

{% spoiler 点击显/隐代码 %}
```matlab
% 求解三对角方程组的追赶法
function x = chase(A, d) % A为系数矩阵,d为方程组右侧列向量
    [n, ~] = size(A);
    % 预分配内存,提高运算速度
    u = zeros(n, 1);
    l = zeros(n, 1);
    y = zeros(n, 1);
    % 参考课本第36面代码
    u(1) = A(1, 1);
    y(1) = d(1);
    for i = 2 : n
        l(i) = A(i, i-1) / u(i-1);
        u(i) = A(i, i) - l(i) * A(i-1, i);
        y(i) = d(i) - l(i) * y(i-1);
    end
    x(n) = y(n) / u(n);
    for i = n-1 : -1 : 1
        x(i) = (y(i) - A(i, i+1) * x(i+1)) / u(i);
    end
end
```
{% endspoiler %}

### 最小二乘拟合函数（离散型最优平方逼近问题）

选定一组基函数 $g_0(x),g_1(x),\cdots,g_n(x)$ 

$$p(x) = c_0g_0(x)+c_1g_1(x)+\cdots+c_ng_n(x)$$

{% spoiler 点击显/隐代码 %}
```matlab
function main
    syms x
    e = exp(1);
    phi = [1 x x^2]; % 一组基函数
    % 列表函数，权函数均为1
    X = [1 3 4 5 6 7 8 9 10]';
    Y = [2 7 8 10 11 11 10 9 8]';
    PHI = subs(phi, x, X)
    PHI'*PHI % 正规方程的系数矩阵
    PHI'*Y % 正规方程的右侧列向量
    format short
    eval((PHI'*PHI)\(PHI'*Y))
end
```
{% endspoiler %}

### 生成[0,1]区间上的首一正交多项式

若要生成 $[a,b]$ 区间上的首一正交多项式，只需要将beta和gamma函数中积分区间改为
 `ret = int(..., x, a, b);` 
> 请无视输出中g=的部分只用看ans即可，因为如果没有这个输出，最终结果可能无法输出（bug？

{% spoiler 点击显/隐代码 %}
```matlab
function main
    clear
    syms x
    global w % 权函数
    w = 1;
    n = 3; % 生成至n-1次多项式
    global g % 用于存储首一正交多项式
    g(1) = 1;
    g = [g, x - beta(1) / gamma(1)];
    for k = 2:n
        g = [g, (x-beta(k)/gamma(k))*g(k) - gamma(k)/gamma(k-1)*g(k-1)]
    end
    for k = 1:n
        expand(g(k))
    end
end

function ret = beta(k) % 计算beta系数
    global g
    global w
    syms x
    ret = int(w*x*g(k)*g(k), x, 0, 1);
end

function ret = gamma(k) % 计算gamma系数
    global g
    global w
    syms x
    ret = int(w*g(k)*g(k), x, 0, 1);
end
```
{% endspoiler %}
