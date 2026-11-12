---
title: 对长江江豚迁地保护种群数量的预测 基于Leslie和Logistic模型
hide: false
math: true
abbrlink: 58946
date: 2022-01-16 21:48:32
index_img:
banner_img:
category:
 - 数学建模
tags:
---

对2022年一月初进行的xjtu的美赛选拔赛进行一点总结（学到了一些MATLAB技巧，比赛经验），比赛时间为1月13日6点~1月17日9点，一共给出了两道题

> A题：要求预测长江江豚在迁地保护下20年后的种群数量和假设没有迁地保护下江豚是否会出现功能性灭绝。

> B题：研究人才流动模型，判断当前西安人才现状的健康状况，研究一个人才引进政策体系，提出建议。

A题为预测拟合类题目，B题为评价标准类题目，感觉A题更加易于建模（脚踏实地点），最后选择了A题，以下为详细题目：

{% spoiler 点击显/隐 A题 %}
A：长江江豚保护策略研究
江豚是目前长江里唯一的淡水哺乳动物，分布于长江中下游干流以及洞庭湖和鄱阳湖等区域，近20年来种群量快速衰减。资料显示，1991年长江江豚数量是2700多头；2006年，江豚数量已不足1800头；2011年，它们的数量可能仅为1000余头,2018年数量约为1012头。事实上，自上世纪80年代起，逐步探索了就地保护、迁地保护、人工繁育三大保护策略。其中，迁地保护，即选择一些生态环境与长江相似的水域建立迁地保护地，是当前保护长江江豚最直接、最有效的措施。至今，我国已建立5个迁地保护地，迁地群体总量超过150头。2021年9月18日，央视报道：长江江豚种群数量稳中有升。长江江豚种群数量大幅下降趋势得到遏制，但极度濒危状况仍未改变。
请解决下列问题：
1）	建立数学模型预测五个迁地保护地20年后长江江豚种群数量，通过模型说明迁地保护地150头江豚的性别比例会对江豚种群发展产生多大的影响？
2）	如不采用迁地保护策略，长江江豚会出现功能性灭绝？
3）	请根据你的分析，向有关部门提出不超过2页的保护江豚建议。


注：本次赛题为中文，提交论文必须采用英文书写，论文提交PDF版（包括：Summary sheet，Table of contents, Reference list and any Appendices），页数不超过25页。
{% endspoiler %}

{% spoiler 点击显/隐 B题 %}
B：“抢人大战”：城市人才流动模式研究
人口是一切经济社会活动的基础，人才更是第一资源。习近平总书记指出“发展是第一要务，人才是第一资源，创新是第一动力。”新时代中国大地上正在发生“人随产业走、人往高处走”的现象，其背后的深层逻辑正是人口正持续向大城市及大都市圈集聚，随着人口红利消逝、人才价值日益凸显。一个城市用于一个健康，可持续的人才流动模式意味着什么？哪些问题是重要的？如何衡量城市的人才生态建设水平？一座城市吸引人才、留住人才和培养人才当如何取长补短？哪些中国城市在人才建设方面成效卓越？这些问题成为一个城市的管理者所必须思考的问题。
中国15-64岁劳动年龄人口规模及比例分别在2011、2013年见顶，标志着过去长期支撑经济高速发展的人口红利消逝，中国亟需转向人才红利。城市对人才的吸引是一个城市健康，可持续发展的重要内生动力。当我们环顾中国，从北京到上海，从广州到深圳，我们可以看到各种各样城市吸引人才的政策。这些政策各有长处和短处，在当前新冠大流行之后，各个城市需要思考，什么样的改革，什么政策是最适合城市的人才引进的。然而，改变是困难的，任何制度的推进都需要长期执行，以便建立一个更加健康，完善和可持续的制度。
在这个问题上，你的团队将会开发一个模型用以评估西安市的人才生态健康状况，以确定一个健康和可持续的人才引进模式。考虑到，提出和分析一套城市的人才引进政策，将一个城市的人才引进从目前的状态迁移回你提出的健康和可持续的状态。
具体来说，你将被要求：
· 开发和验证一个模型或一套模型，使之能够评估西安市人才现状的健康状况；
· 为西安市的制度提出一个可实现和合理的愿景，以支持一个健康和可持续的人才引进政策体系。
· 使用您的模型来衡量当前系统的健康状况，以及为您选定的城市提出健康的、可持续的系统；
· 提出有针对性的政策和实施时间表，以支持从当前状态变化到您提议的状态；
· 使用您的模型来塑造和评估您政策的有效性；
·在考虑到改变在现实中是困难的，讨论在过渡期间和最终状态下实施你的计划对现实城市人才流动的影响。
·将您的模型应用于15个新一线城市（成都、重庆、杭州、武汉、西安、天津、苏州、南京、郑州、长沙、东莞、沈阳、青岛、合肥、佛山）中的至少5个，并分析其适用性；

注：本次赛题为中文，提交论文必须采用英文书写，论文提交PDF版（包括：Summary sheet，Table of contents, Reference list and any Appendices），页数不超过25页。
{% endspoiler %}

### 比赛日记

#### Day1

上午：查找论文，统计各地江豚数量（长江支流，鄱阳湖，洞庭湖，保护区如：天鹅洲），绘制江豚数量统计表，确定第一问使用 $Leslie$ 模型，第二问使用 $Logistic$ 模型。

下午：学习 $Leslie$ 模型，由天鹅洲保护区从1991年到2021年的数据进行建模（其实就三个点），建模关键是对 **生存率** 的估计。

晚上： 调整生存率参数，完成拟合。

#### Day2

上午：提取昨天由 $Leslie$ 模型拟合的数据（生育模式，年龄分布）。

下午：用2021年的预测数据在不同的性别比例下，对20年后（2041年）保护区总江豚数进行预测。

晚上：绘制不同地区江豚数量的散点图，思考如何拟合 $Logistic$ 模型，修改论文格式。

#### Day3

上午：通过加入假想数据，成功使用 `Auto2Fit` 对数据进行 $Logistic$ 模型拟合。

下午：利用第一题所做出的预测，完成对种群功能性灭绝进行估计，提取预测数据，撰写拟合方法。

晚上：修改论文图片格式。

#### Day4

上午：学习SPSS（但没用上），整理全部代码。

下午：翻译代码注释，转换格式。

晚上：整理论文格式，转化为PDF，加入公式编号，优化图片质量。

### 模型

#### Leslie 人口预测模型

##### 变量声明

$$
\begin{aligned}
l\sim&\ \text{性别参数},\ l=m\text{为男性},\ l=w\text{为女性}\\
x^l(i, k)\sim&\ \text{第 } k\text{ 年, 年龄范围在 } [i,i+1) \text{ 岁, 性别为 }l\text{ 的人口数量}\\
d^l(i)\sim&\ \text{年龄范围在 } [i,i+1) \text{ 岁, 性别为 }l\text{ 的死亡率}\\
&\text{（死亡人数在当年总人口中的占比）}\\
s^l(i)=1-d^l(i)\sim&\ \text{年龄范围在 } [i,i+1) \text{ 岁, 性别为 }l\text{ 的存活率}\\
&\text{（从第 }i\text{ 岁活到 }i+1\text{ 岁的人在当年总人口中的占比）}\\
b(i)\sim&\ \text{生育率}\text{（每位 }[i,i+1)\text{ 岁女性平均生育婴儿数）}\\
a(k)\sim&\ \text{新生儿中男婴占比}\\
[i_1,i_2]\sim&\ \text{育龄区间（具有生育能力女性的年龄范围）}\\
v^l(i, k)\sim&\ \text{第 } k\text{ 年, 年龄范围在 } [i,i+1) \text{ 岁, 性别为 }l\text{ 的迁移数量}\\
&\text{（迁入为正, 迁出为负）}
\end{aligned}
$$

对于此题，通过查阅资料知道，江豚平均寿命为20年，雌性育龄期为 $4$ 到 $16$ 岁，可以假设保护区没有迁入迁出变化，从而确定以下变量

$$
\begin{aligned}
a(k) =&\ \frac{1}{2}\\
[i_1,i_2]=&\ [4,16]\\
v^l(i, k) =&\ 0
\end{aligned}
$$

##### 递推公式

根据上述变量含义可以给出如下的人数递推公式

$$
\begin{cases}
\displaystyle x^l(1, k+1) =s^l(0)a(k)\sum_{i=i_1}^{i_2}b(i)x^w(i, k)+v^l(0, k)\\
\displaystyle x^l(i+1,k+1)=s^l(i)x^l(i, k)
\end{cases}
\quad(l=m, w)
$$
代入已确定的变量得
$$
\begin{cases}
\displaystyle x^l(1, k+1) =\frac{1}{2}s^l(0)\sum_{i=i_1}^{i_2}b(i)x^w(i, k)\\
x^l(i+1,k+1)=s^l(i)x^l(i, k)
\end{cases}
\quad(l=m, w)
$$

##### 矩阵递推

为了更方便地递推，使用矩阵乘法代替求和，引入如下记号（下文中 $i$ 岁均指：年龄在 $[i,i+1)$ 范围内的个体）

总生育率（每位女性一生的平均剩余数）：$\displaystyle\beta=\ \sum_{i=i_1}^{i_2}b(i)$
生育模式（ $i$ 岁女性的生育数在育龄女性中的占比）：$\displaystyle h(i) =\ \frac{b(i)}{\beta(k)}$

人口分布向量（第 $k$ 年人口在不同年龄段上的分布）：$\bm{x}^l(k) = \ \left[x^l(1, k), x^l(2, k),\cdots, x^l(n, k)\right]^T$

存活率矩阵（人口分布变化）：

$$
S^l = \left[\begin{matrix}
0&0&\cdots&0&0\\
s^l(1)&0&\cdots&0&0\\
0&s^l(2)&\cdots&0&0\\
\vdots&\vdots&\ddots&\vdots&\vdots\\
0&0&\cdots&s^l(n-1)&0
\end{matrix}\right]
$$

生育模式矩阵：

$$
H = \left[\begin{matrix}
0&\cdots&0&h(i_1)&\cdots&h(i_2)&0&\cdots&0\\
0&\cdots&0&0&\cdots&0&0&\cdots&0\\
\vdots&\ddots&\vdots&\vdots&\ddots&\vdots&\vdots&\ddots&\vdots\\
0&\cdots&0&0&\cdots&0&0&\cdots&0
\end{matrix}\right]
$$

转移矩阵（可以验证，下述转移矩阵和上述的递推式等价）

$$
\begin{cases}
\displaystyle \bm{x}^m(k+1) = S^m\bm{x}^m(k)+\frac{1}{2}s^m(0)\beta H\bm{x}^w(k)\\
\displaystyle \bm{x}^w(k+1) = S^w\bm{x}^w(k)+\frac{1}{2}s^m(0)\beta H\bm{x}^w(k)
\end{cases}
$$

观察上式发现，影响男女分布主要参数是 $S^l$，影响整个种群总数的参数是 $\beta, H$ 和初始的雌雄分布比例。

生育率使用概率中的 $\Gamma$ 分布：

$$
y = \frac{1}{b^a\Gamma(a)}x^{a-1}e^{-x/b}
$$

利用如下公式生成（别人给的，不懂原理）

$$
h(i) = \frac{1}{2^n\Gamma(n)}(i-i_1+1)^{n-1}e^{-(i-i_1+1)/2}
$$

其中 $n = \frac{i_c-i_1+2}{2}$，$i_1\leqslant i\leqslant i_2$，$i_1=4,i_2=16,i_c=6$（$i_c$ 称为生育高峰期），生成效果如下（代码中所有年份都要减去1才是真实年份，因为matlab没有0😢）

![生育模式](https://s4.ax1x.com/2022/01/17/7UUfmD.png)

##### 调参拟合

经过手动调整生存率参数（只会手动调。。。），得到以下较好的拟合图形

![1991年对2021年数据拟合](https://s4.ax1x.com/2022/01/17/7UU4TH.png)

{% spoiler 点击显/隐代码 %}
```matlab
% 由91年对21年估计生存率参数 
% 考虑到的江豚的最大年龄均不超过20岁 
function main 
    format short g; 
    % 以下所指的n维向量均为n*1的列向量 
    % 以下所述的i岁，均指代年龄属于[i-1,i)岁中的江豚，江豚年龄范围设置为[0,20) 
    % 由于MATLAB从数字1开始，所以只能这样表示0~1岁 
    global n; % 考虑到的江豚的最大年龄 
    n = 20; 
    % s1为雄性生存率随时间的关系，s2为雌性的生存率随时间的关系 
    s1 = [1 repmat(0.99, 1, 7) repmat(0.8, 1, 6) repmat(0.7, 1, 3) 0.7 0.3 0]'; 
    s2 = [1 repmat(0.99, 1, 7) repmat(0.88, 1, 6) repmat(0.8, 1, 3) 0.7 0.3 0]'; 
    % 绘制生存率条形图 
    %{ 
    tiledlayout(1, 2); 
    ax1 = nexttile; 
    bar(ax1, s1); 
    ax2 = nexttile; 
    bar(ax2, s2); 
    %} 
    % 假设5只江豚的性别比例，雄性2只，雌性3只 
    x1 = [0 0 0 1 1 zeros(1, 15)]'; 
    x2 = [0 0 0 2 1 zeros(1, 15)]'; 
    % 调用Leslie函数进行1991到2021年的预测 
    Leslie(x1, x2, s1, s2, 31); 
end 
% 初始时的雄性江豚分年龄数量(n维向量)，x1为雄性，x2为雌性 
% 各个年龄段[0,20)的在一年中存活率(n维向量)，s1为雄性，s2为雌性，预测年数为Years年 
function Leslie(x1, x2, s1, s2, Years) 
    global n; 
    % 育龄区间 [i1,i2] 4岁到16岁 
    i1 = 5; 
    i2 = 17; 
    ic = 7; 
    % 生育模式：i岁女性生育数在育龄女性中的比例，用h表示(1*n的行向量) 
    % 使用Gamma分布生成生育模式 
    t = ic - i1 + 2; 
    a = t/2; 
    b = 2; 
    h = [zeros(1, i1-1) gampdf(1:(i2-i1+1), a, b) zeros(1, n - i2)]; 
    h = h / sum(h); 
    % 绘制生育模式条形图 
    %{ 
    bar(h); 
    xlabel('Age', 'FontName', 'Times New Roman', 'FontSize', 11); 
    ylabel('Fertility Pattern', 'FontName', 'Times New Roman', 'FontSize', 11); 
    set(gca, 'xtick', 0:1:20); 
    %} 
    % 数据导出 
    % writematrix(h', 'Leslie.xlsx', 'Range', 'D1'); 
    % 生育模式矩阵 
    H = [h; zeros(n-1, n)]; 
    % 总和生育率 beta （每个雌性个体一生的平均生育率） 
    beta = (i2 - i1 + 1) / 3; % 假设为周期性生殖，每隔3年生一次 
    % 存活率矩阵，S1为雄性，S2为雌性 
    S1 = [zeros(1, n); [diag(s1(2:n, 1)) zeros(n-1, 1)]]; 
    S2 = [zeros(1, n); [diag(s2(2:n, 1)) zeros(n-1, 1)]]; 
    % 种群总数 
    tot = zeros(1, Years); 
    tot(1) = sum(x1) + sum(x2); 
    % 开始递推 
    for k = 2 : Years 
        x1 = S1 * x1 + 1/2 * s1(1) * beta * H * x2; 
        x2 = S2 * x2 + 1/2 * s2(1) * beta * H * x2; 
        tot(k) = sum(x1) + sum(x2); 
        % 提取出2021年江豚年龄分布，用于代码part2的初始参数 
        %{ 
        if k == 31 
            output1 = x1' 
            output2 = x2' 
            save('out.txt', 'o*', '-ascii'); 
            writematrix([x1 x2], '2021.xlsx'); 
        end 
        %} 
    end 
    x = 1991 + [0:Years-1]; 
    plot(x, tot, '-'); 
    hold on 
    DrawDate(); 
    % 导出数据 
    % writematrix([x', tot'], 'Leslie.xlsx'); 
end 
% 绘制观测数据 
function DrawDate() 
    global out; 
    x = [1991 2015 2017 2021]; 
    y = [5 60 80 101]; 
    plot(x, y, '*'); 
    % 导出数据 
    % writematrix([x', y'], 'Leslie.xlsx', 'Range', 'C1'); 
    xlabel('Year', 'FontName', 'Times New Roman', 'FontSize', 11); 
    ylabel('Total Number of Populations(Unit: Head)', 'FontName', 'Times New Roman', 'FontSize', 11); 
    axis([1991 2021 5 105]); 
end
```
{% endspoiler %}

接下来利用1991年预测得到的2021年的年龄分布先进行单位化，在根据性别比例等比例缩放至总数为150只（因为所有保护区的总数为150只，而上述预测只是对天鹅洲一地所进行的），再使用 $Leslie$ 模型对20年后种群总数量进行预测。

思路比较简单直接上代码：

{% spoiler 点击显/隐代码 %}
```matlab
% 2021年变化雄雌比对2042年预测 
function main 
    format short g; 
    global n; 
    n = 20; 
    s1 = [1 repmat(0.99, 1, 7) repmat(0.8, 1, 6) repmat(0.7, 1, 3) 0.7 0.3 0]'; 
    s2 = [1 repmat(0.99, 1, 7) repmat(0.88, 1, 6) repmat(0.8, 1, 3) 0.7 0.3 0]'; 
    % 通过1991年预测出的2021年数据，将总个体数目等比例放大到150只，再等比例修改雄雌比例，进而对2041年进行预测 
    x1 = [6.9607761e+00   6.3417223e+00   5.7640680e+00   5.2331215e+00   4.7603080e+00   4.3499696e+00   3.9894351e+00   3.6526676e+00   2.6816939e+00   1.9513385e+00   1.4179936e+00   1.0431283e+00   7.8205754e-01   5.9151737e-01   3.8581006e-01   2.4277269e-01   1.4821516e-01   9.1458084e-02   2.5760444e-02   0.0000000e+00]'; 
    x2 = [6.9607761e+00   6.3417223e+00   5.7640680e+00   5.2331215e+00   4.7603080e+00   4.3499696e+00   3.9894351e+00   3.6526676e+00   2.9498632e+00   2.3611196e+00   1.8873495e+00   1.5272442e+00   1.2595115e+00   1.0479091e+00   7.8112692e-01   5.6174581e-01   3.9194451e-01   2.4185443e-01   6.8121672e-02   0.0000000e+00]'; 
    % 单位化 
    e1 = x1 / sum(x1); 
    e2 = x2 / sum(x2); 
    % 绘制单位化后的雌雄分布比例条形图 
    tiledlayout(1, 2); 
    ax1 = nexttile; 
    bar(ax1, e1); 
    %ylabel('比例'); 
    xlabel('Age', 'FontName', 'Times New Roman', 'FontSize', 11); 
    ylabel('Ratio', 'FontName', 'Times New Roman', 'FontSize', 11); 
    title('Male', 'FontName', 'Times New Roman', 'FontSize', 11); 
    ax2 = nexttile; 
    bar(ax2, e2); 
    xlabel('Age', 'FontName', 'Times New Roman', 'FontSize', 11); 
    ylabel('Ratio', 'FontName', 'Times New Roman', 'FontSize', 11); 
    title('Female', 'FontName', 'Times New Roman', 'FontSize', 11); 
	figure;
    % 雄雌比0.7到1.3计算 
    for k = 1:7 
        alpha = 0.7 + 0.1 * (k-1); 
        % 计算对应于alpha雌雄个体数目 
        x1 = e1 * 150 * alpha / (alpha + 1); 
        x2 = e2 * 150 / (alpha + 1); 
        Leslie(k, x1, x2, s1, s2, 21); %2021年到2041年 
    end 
    % 用元胞数组Tot保存每一种性别比例下每一年的总种群数量 
    global Tot; 
    x = [2021:2041]'; 
    % 从21年到41年每一年的预测值，用于第二问 
    %{ 
    output = Tot{1, 1}; 
    save('out.txt', 'output', '-ascii'); 
    output = [x output']; 
    writematrix(output, '从21年到41年每一年的预测值.xlsx'); 
    %} 
    % k为不同的alpha个数 
    for k = 1:7 
        plot(x, Tot{k}, '*-'); 
        hold on; 
        %Sum(k, 1) = Tot{k}(21); 
    end 
    % 对不同预测值做图 
    legends = string(0.7:0.1:1.3); 
    legend(legends); 
    axis([2021 2041 150 900]); 
    xlabel('Year', 'FontName', 'Times New Roman', 'FontSize', 11); 
    ylabel('Total Number of Populations(Unit:Head)', 'FontName', 'Times New Roman', 'FontSize', 11); 
end 

% Leslie和代码part1相同部分不再解释 
function Leslie(Id, x1, x2, s1, s2, Years) 
    global n; 
    i1 = 5; 
    i2 = 17; 
    ic = 7; 
    t = ic - i1 + 2; 
    a = t/2; 
    b = 2; 
    h = [zeros(1, i1-1) gampdf(1:(i2-i1+1), a, b) zeros(1, n - i2)]; 
    h = h / sum(h); 
    H = [h; zeros(n-1, n)]; 
    beta = (i2 - i1 + 1) / 3; 
    S1 = [zeros(1, n); [diag(s1(2:n, 1)) zeros(n-1, 1)]]; 
    S2 = [zeros(1, n); [diag(s2(2:n, 1)) zeros(n-1, 1)]]; 
    tot = zeros(1, Years); 
    tot(1) = sum(x1) + sum(x2); 
    for k = 2 : Years 
        b = beta; 
        x1 = S1 * x1 + 1/2 * s1(1) * b * H * x2; 
        x2 = S2 * x2 + 1/2 * s2(1) * b * H * x2; 
        tot(k) = sum(x1) + sum(x2); 
    end 
    global Tot; 
    Tot{1, Id} = tot; 
end
```
{% endspoiler %}

预测效果如下图

![2021年不同性别比例对20年后种群数量的影响](https://s4.ax1x.com/2022/01/17/7UUIkd.png)

#### Logistic 拟合

这个相比上面就暴力多了，希望直接使用 $Logistic$ 函数往目标数据上套，于是使用如下的方法：

首先 $Logistic$ 函数就是一个微分方程的解：

$$
\frac{dx}{dt}=u(x-a)^2-r(x-a)
$$

解得

$$
x = \frac{r}{u+e^{rt+c}}+a
$$

原方程中其实没有变量 $a$，但是如果没有 $a$ （即函数下界为 $0$）对于近几年的拟合效果较差。

先通过绘制不同地区的离散图，选择适合的数据。

![不同地区的离散图](https://s4.ax1x.com/2022/01/17/7Uycp4.png)

用于生成图像的代码（里面包含了实际观测的数据）。

{% spoiler 点击显/隐代码 %}
```matlab
% 观测数据散点图
x1 = [1988 1991 1993 1994 1997 2000 2006 2011 2012 2017 2019];
y = [2700 2700 2700 2500 2000 2000 1800 1000 1045 1012 1040];
plot(x1, y, '*-');
hold on;
s = "种群数量";
x2 = [2006 2012 2017];
y = [1225 505 445];
plot(x2, y, '*-');
hold on;
s = [s "长江干流"];
x3 = [1997 2000 2006 2007 2009 2010 2012 2016 2017];
y = [250 388 450 180 145 114 90 100 110];
plot(x3, y, '*-');
hold on;
s = [s "洞庭湖"];
x4 = [1998 2012 2017];
y = [300 450 457];
plot(x4, y, '*-');
hold on;
s = [s "鄱阳湖"];
legend(s, 'FontSize', 15);
```
{% endspoiler %}

最后选择对 **种群数量** 进行 $Logistic$ 预测，由于可用参数太少了，所以只能加入一些假想的点

![假想点设置](https://s4.ax1x.com/2022/01/17/7UcFPO.png)

然后使用Auto2Fit进行拟合（Auto2Fit软件很不好下，这里给出一个网盘下载连接 [提取码：1234](https://pan.baidu.com/s/1lFvhm4VQEQEIfrZTC32o4A?pwd=1234)）

Auto2Fit 的代码很简短易懂，只需要把变量写出来，可变参数直接写在式子中，点击上面运行键即可进行拟合（拟合代码如下）：

```matlab
Variable x, y;
Function y=a/(b+exp(a*x+c))+d;
Data;
         0    2.7000
    4.0000    2.6000
    6.0000    2.4000
    7.0000    2.2000
    9.0000    2.0000
   10.0000    1.8000
   13.0000    1.4000
   17.0000    1.2000
   21.0000    1.0450
   26.0000    1.0120
```

![两种函数拟合效果的比较](https://s4.ax1x.com/2022/01/17/7UUb1P.png)

拟合图像代码：

{% spoiler 点击显/隐代码 %}
```matlab
% 用logistic函数进行拟合 
function main 
    % 观测数据 
    y = [2700 2600 2400 2200 2000 1800 1800 1400 1200 1045 1012]'; 
    x = [1991 1995 1997 1998 2000 2001 2004 2006 2008 2012 2017]'; 
    % 对种群总数缩放1000倍，为了有更好的拟合效果 
    y = y / 1000; 
    % 将年份对1991年做差 
    x = x - 1991; 
    plot(x, y, '*'); 
    hold on 
    % 定义logistic拟合函数f，包含4个参数a,b,c,d，变量x 
    f = @(a, b, c, d, x) a./(b+exp(a.*x+c))+d; 
    x = 0:50; 
    % 通过Auto2Fit求解拟合参数 
    y = f(0.34765, 0.1972, -4.8873, 1.028273819, x); 
    plot(x, y, '-'); 
    hold on 
    axis([0 50 0.5 3]); 
    % 这种没有限制种群总数下限的拟合（效果一般） 
    y = f(0.064, 0.009329, -4.332468, 0, x); 
    p = plot(x, y, '-'); 
    p.Color = '#EDB120'; 
    xlabel('t', 'FontName', 'Times New Roman', 'FontSize', 11); 
    ylabel('x', 'FontName', 'Times New Roman', 'FontSize', 11); 
end
```
{% endspoiler %}

由于2021年前迁地保护的江豚数量在总种群数目中占比较小，可以忽略，所以上述模拟的可以认为是总江豚数目的变换，由于21年后保护区的江豚总数在总种群数目中占比逐渐增大，直接通过减法，即可预测到没有迁地保护下江豚数目的变化。

![预测结果](https://s4.ax1x.com/2022/01/17/7UUotA.png)

制图代码：

{% spoiler 点击显/隐代码 %}
```matlab
function main 
    % x均为种群数量，t为年份 
    t = [1991 1995 1997 1998 2000 2001 2004 2006 2008 2012 2017]'; 
    % x0为原始观测数据 
    x0 = [2700 2600 2400 2200 2000 1800 1800 1400 1200 1045 1012]'; 
    plot(t, x0, '*'); 
    hold on 
    % x1为第一问中21年到41年的预测数据 
    % 由于前30年数据迁徙保护在总种群数目中占比较小，可用线性增长代替 
    x1 = [5:4.8387:150 1.5000000e+02   1.6302948e+02   1.7713275e+02   1.9243870e+02   2.0909418e+02   2.2723304e+02   2.4696784e+02   2.6840726e+02   2.9168075e+02   3.1695127e+02   3.4441046e+02   3.7426423e+02   4.0672256e+02   4.4200119e+02   4.8033226e+02   5.2197542e+02   5.6722229e+02   6.1639384e+02   6.6983573e+02   7.2791722e+02   7.9103528e+02]; 
    t = 1991:2041; 
    plot(t, x1, '-', 'linewidth', 1.5); 
    hold on 
    % x2为第二问前置程序中拟合的总种群数目的结果 
    x2 = f(t-1991) * 1000; 
    plot(t, x2, '-', 'linewidth', 1.5); 
    hold on 
    % x3为总种群数目减去迁移保护的种群数目 
    x3 = x2 - x1; 
    plot(t, x3, '-', 'linewidth', 1.5); 
    hold on 
    % x4为功能性灭绝阈值 
    x4 = repmat(500, 1, 51); 
    plot(t, x4, 'r--', 'linewidth', 1); 
    legends = ["Total number of observations" "Number of migration protection" "Predicted total number" "Number under natural conditions" "Functional extinction threshold"]; 
    legend(legends, 'FontName', 'Times New Roman', 'FontSize', 11); 
    xlabel('Year', 'FontName', 'Times New Roman', 'FontSize', 11); 
    ylabel('Yangtze Finless Porpoise Population(Unit: Head)', 'FontName', 'Times New Roman', 'FontSize', 11); 
    axis([1991 2041 0 3000]); 
    % 制表 
    % writematrix([t' x1' x2' x3'], 'data.xlsx'); 
end 
% 由代码part1确定的拟合函数 
% x为相对1991年的差值，f(x)*1000为预测的种群总数 
function ret = f(x) 
    a = 0.34765; 
    b = 0.1972; 
    c = -4.8873; 
    d = 1.028273819; 
    ret = a./(b+exp(a.*x+c))+d; 
end
```
{% endspoiler %}

至此完成了全部拟合过程，其实也没很复杂，只是第一次操作，对MATLAB函数运用不是很灵活，下面记录些常用的函数

```matlab
% 在同一个figure中绘制多个子图
tiledlayout(1, 2); 
ax1 = nexttile; 
bar(ax1, s1); 
ax2 = nexttile; 
bar(ax2, s2); 

% 离散Gamma函数
gampdf(x, a, b);

% 将矩阵导出为Excel表格，文件名的后缀要用.xlsx或.xls
% writematrix(矩阵名称, '文件名.xlsx', 'Range', '矩阵输入的左上角对应Excel中的单元格,横轴为A-Z,纵轴为1,2,3...');
writematrix(m, 'Leslie.xlsx', 'Range', 'D1');

% 对x,y轴加标签，标题也是可以的，设置字体，字体大小
xlabel('Year', 'FontName', 'Times New Roman', 'FontSize', 11);
ylabel('Total Number of Populations(Unit: Head)', 'FontName', 'Times New Roman', 'FontSize', 11); 

% x,y轴范围限制，[x左端点 x右端点 y左端点 y右端点]
axis([1991 2021 5 105]);

% 同一个图像中有多个曲线，对不同曲线进行标注，方法是创建一个字符向量，从左到右，分别代表绘制曲线的顺序
legends = string(0.7:0.1:1.3);
legend(legends);

% 设置曲线颜色
p = plot(x, y, '-'); 
p.Color = '#EDB120'; % 好像还可以用RGB设置

% 设置曲线宽度，参数'linewidth'
plot(t, x3, '-', 'linewidth', 1.5); 
```

最后要感谢队友们的共同努力😆，共同完成整篇论文（英文论文语法使用，排版和格式做的是真的好）（不然上面整的都是摆设~(>_<。)＼）。
