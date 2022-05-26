---
title: Pandas数据处理实例
hide: false
math: true
category:
  - Python
tags:
  - pandas
abbrlink: 34253
date: 2022-05-25 23:26:06
index_img:
banner_img:
---

这里列一些使用pandas包做数据处理的例子.

数据格式:

填报规则: 请在对应姓名后面按照志愿优先次序按数字1~5进行填写.

```
| 姓名  | 数学 | 人工智能  | 计算机  | 软件工程  | 大数据管理  |
-----------------------------------------------------------
| 名称1 |  1   |     2    |    3   |    4     |     5      |
| 名称2 |  1   |     2    |    3   |    4     |     5      |
| 名称3 |  3   |     1    |    5   |    4     |     2      |
| 名称4 |  1   |     2    |    3   |    4     |     5      |
   ...  
```

## 录取统计

每种学科录取人数有上限, 数学25人, 其他学科10人.

第一种以排名优先录取. (以排名作为第一排序索引, 志愿作为第二索引)
```python
import pandas as pd
df = pd.read_excel('强基计划分流填报.xlsx', dtype=object)  # dtype=object 可以将数字以整数形式读入(默认小数)
tot = [25, 10, 10, 10, 10]  # 录取人数上限
idx = {'数学': 0, '人工智能': 1, '计算机': 2, '软件工程': 3, '大数据管理': 4}  # 每种专业对应hash值
n, m = df.shape  # 获取dataframe行数和列数
choose = []  # 最终录取结果
for i in range(n):
    row = df.iloc[i]  # 取出第i行
    for j in range(6):
        name = row['姓名']  # 取出当前行姓名
        if j == 5:  # 如果没有剩余专业
            choose.append([name, '没有剩余专业可选'])
            break
        try:  # 查找第j+1个志愿, 避免报错停止程序
            sub = row[row.values == j+1].index[0]
        except:
            print('{}没有填写第{}志愿'.format(name, j+1))
            break
        index = idx[sub]  # 获取志愿编号
        if tot[index]:  # 如果该志愿有剩余, 则进行录取
            tot[index] -= 1
            choose.append([name, sub, '第'+str(j+1)+'志愿'])
            break
ans = pd.DataFrame(choose)  # 最后将list转化为dataframe格式数据
ans.rename(columns={0: '姓名', 1: '专业', 2: ''}, inplace=True)  # 以姓名, 专业作为列索引, inplace表示原地修改
ans.to_excel('填报结果.xlsx', index=False)  # 输出刅excel中, 且不输出左侧索引值
print(ans)
```

第二种以志愿优先录取. (以志愿作为排序的第一索引, 排名作为第二索引)

主要思路: 先以姓名作为行索引值, 顺着取出每一列, 将每一列中的志愿从小到大排序, 由于是以姓名作为行索引, 所以姓名也会跟着排序, 但相同的值就会随机排序, 所以需要加上与排名成正相关的小数位, 这样排序就会以志愿作为第一顺序, 排名作为第二顺序. 

过程中利用set记录该同学是否已经被录取过.

```python
import pandas as pd
df = pd.read_excel('强基计划分流填报.xlsx')
df = df.set_index('姓名')  # 以姓名作为索引值, 而不是0,1,2,...
tot = [25, 10, 10, 10, 10]
idx = {'数学': 0, '人工智能': 1, '计算机': 2, '软件工程': 3, '大数据管理': 4}
n, m = df.shape
choose = []
name = set(df.index)  # 用集合set记录全部名称, 用于判断是否已经被录取
for i in range(n):
    row = df.iloc[i]
    for j in range(5):
        df.iloc[i, j] += i / n - 1  # 将志愿加上和排名递增的小数部分
for num in range(5):  # 当前计算第num+1志愿
    for sub in idx:  # 取出sub学科列
        col = df.loc[:, sub].sort_values()  # 以志愿排序
        col = col[(col >= num) & (col < num+1)]  # 用布尔切片取出num+1志愿的同学
        for t in col.index:  # 由排名先后依次录取
            if tot[idx[sub]] == 0:  # 若录取满额, 结束
                break
            if t in name:  # 如果该同学还未被录取过
                choose.append([t, sub, '第'+str(num+1)+'志愿'])  # 进行录取
                name.remove(t)
                tot[idx[sub]] -= 1

ans = pd.DataFrame(choose, columns=['姓名', '专业', ''])  # 保存到dataframe中
ans.to_excel('填报结果.xlsx', index=False)  # 输出为excel表格
print(ans)
```
