---
title: 几何问题
hide: false
math: true
abbrlink: 54309
date: 2023-06-06 16:16:35
index\_img:
banner\_img:
category:
tags:
---

## 几何相关算法

### 向量命名空间

用`pt`命令空间内的`Point`类，实现基本的向量加减乘除运算，大小比较`<`以及相等`==`判断，内积`dot`和外积`cross`，向量长度`length`，向量夹角`angle`，向量旋转`rotate`，以及一些求交点，判断是否正规相交，判断是否点在线段上的函数。

```cpp
#include <cmath>
#include <string>
#include <cassert>

namespace pt {  // 创建pt向量命名空间
    const double EPS = 1e-10;
    const double PI = std::acos(-1);
    int sign(double x) { return std::fabs(x) < EPS ? 0 : (x < 0 ? -1 : 1); }
    struct Point {
        double x, y;
        Point(double x=0, double y=0):x(x), y(y) {}
        Point operator + (Point rhs) { return Point(x + rhs.x, y + rhs.y); }
        Point operator - (Point rhs) { return Point(x - rhs.x, y - rhs.y); }
        Point operator * (double rhs) { return Point(x * rhs, y * rhs); }
        Point operator / (double rhs) { return Point(x / rhs, y / rhs); }
        bool operator < (Point rhs) { return sign(x-rhs.x) == 0 ? sign(y-rhs.y) == -1 : x < rhs.x; }  // 可用于排序去重
        bool operator == (Point rhs) { return sign(x-rhs.x) == 0 && sign(y-rhs.y) == 0; }
        double dot(Point rhs) { return x * rhs.x + y * rhs.y; }
        double cross(Point rhs) { return x * rhs.y - y * rhs.x; }
        void print(std::string s = "") { printf("%s(%.2lf, %.2lf)", s.c_str(), x, y); }
    };
    double dot(Point A, Point B) { return A.x * B.x + A.y * B.y; }
    double cross(Point A, Point B) { return A.x * B.y - A.y * B.x; }
    double length(Point A) { return std::sqrt(dot(A, A)); }
    double angle(Point A, Point B) { return std::acos(dot(A, B) / length(A) / length(B)); }
    Point rotate(Point A, double rad) { return Point(A.x*std::cos(rad)-A.y*std::sin(rad), A.x*std::sin(rad)+A.y*std::cos(rad)); }
    Point line_intersection(Point A, Point u, Point B, Point v) {  // 求直线A+tu和B+tv的交点
        assert(sign(cross(u, v)) != 0);
        Point w = A - B;
        return A + u * cross(v, w) / cross(u, v);
    }
    bool segment_proper_intersection(Point A1, Point A2, Point B1, Point B2) {  // 判断线段A1A2是否与B1B2正规相交(不包含端点相交)
        double c1 = cross(A2-A1, B1-A1), c2 = cross(A2-A1, B2-A1);
        double c3 = cross(B2-B1, A1-B1), c4 = cross(B2-B1, A2-B1);
        return sign(c1*c2) == -1 && sign(c3*c4) == -1;
    }
    bool on_segment(Point P, Point A, Point B) {  // 判断P在线段AB内部(不包含端点)
        Point PA = A-P, PB = B-P;
        return sign(dot(PA, PB)) == -1 && sign(cross(PA, PB)) == 0;
    }
}
using namespace pt;
```

### 常用拓扑定理

#### 平面上的Euler定理

设图 $G$ 的顶点数、区域数（包括外部区域）、边数分别为 $V, F, E$，记 $G$ 的信息为 $(V,F,E)$，则有 $V+F = E+2$。

**思路**：利用到 $G$ 的生成树 $T$，和 $G$ 的对偶图 $G'$ 和与 $T$ 对应的 $G'$ 上的对偶生成树 $T'$，利用生成树的性质证明该定理。主要需要证明对偶图的存在唯一性（同构意义下），以及 $T'$ 满足树的定义（没有环且链接全部的 $G'$ 中全部顶点）。

**证明**：首先给出对偶图的定义，若 $G$ 的信息满足 $(V,F,E)$，则可通过以下方法构造对偶图 $G'$ 的构造，且 $G'$ 的顶点数为 $F$：

1. 将 $G$ 的每个区域作为 $G'$ 中的顶点。
2. 对于 $G$ 中的任意两个区域 $A,B$，如果 $A,B$ 之间存在至少一个边，则在图 $G'$ 中连接 $(A,B)$。

这样生成 $G'$ 的存在唯一性由上述构造方法可知。对于 $G$ 中不属于 $T$ 上的边 $e$，断言 $e$ 一定划分了 $G$ 的两个区域（反证法，利用 $T$ 是树），也就是 $e$ 在 $G'$ 中存在对应的边，全体满足此性质的边构成 $T'$。

下面证明 $T'$ 是树：

- $T'$ 中无环，反证法，如果有环，则 $T$ 一定不是树，因为由环围成的区域对应 $G$ 中的点，该点一定不在 $T$ 中，与 $T$ 连接 $G$ 中全部节点矛盾。
- $T'$ 连接 $G'$ 的全部节点，如果节点 $A$ 不在 $T'$ 中，则说明在 $G$ 中围成区域 $A$ 的边都在 $T$ 中，这与 $T$ 无环矛盾。

综上，我们得到 $T'$ 是 $G'$ 中的树。记 $E(T')$ 为 $T'$ 中的边数，则由 $T'$ 的构造方法可知 $E(T) + E(T') = E$，由树的性质可知 $E(T) = V-1, E(T') = F-1$，结合上面两式可知 $V+F=E+2$。

**QED**

下图中，黑色边为图 $G$，红色边为 $T$ 和 $T'$，铅笔给出了图 $G'$。

![平面Euler定理](/figures/geometry.assets/plane_Euler_theorem.jpg)
