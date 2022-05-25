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

这里列一些对pandas包做数据处理的例子.

## 录取统计

每种学科录取人数有上限, 数学25人, 其他学科10人.

第一种以排名优先录取.
```python
import pandas as pd
df = pd.read_excel('强基计划分流填报.xlsx', dtype=object)
tot = [25, 10, 10, 10, 10]
idx = {'数学': 0, '人工智能': 1, '计算机': 2, '软件工程': 3, '大数据管理': 4}
n, m = df.shape
choose = []
for i in range(n):
    row = df.iloc[i]
    for j in range(6):
        name = row['姓名']
        if j == 5:
            choose.append([name, '没有剩余专业可选'])
            break
        try:
            sub = row[row.values == j+1].index[0]
        except:
            print('{}没有填写第{}志愿'.format(name, j+1))
            break
        index = idx[sub]
        if tot[index]:
            tot[index] -= 1
            choose.append([name, sub, '第'+str(j+1)+'志愿'])
            break
ans = pd.DataFrame(choose)
ans.rename(columns={0: '姓名', 1: '专业', 2: ''}, inplace=True)
ans.to_excel('填报结果.xlsx', index=False)
print(ans)
```

第二种以志愿优先录取.
```python
import pandas as pd
df = pd.read_excel('强基计划分流填报.xlsx')
df = df.set_index('姓名')
tot = [25, 10, 10, 10, 10]
idx = {'数学': 0, '人工智能': 1, '计算机': 2, '软件工程': 3, '大数据管理': 4}
n, m = df.shape
choose = []
name = set(df.index)
for i in range(n):
    row = df.iloc[i]
    for j in range(5):
        df.iloc[i, j] += i / n - 1
for num in range(5):
    for sub in idx:
        col = df.loc[:, sub].sort_values()
        col = col[(col >= num) & (col < num+1)]
        for t in col.index:
            if tot[idx[sub]] == 0:
                break
            if t in name:
                choose.append([t, sub, '第'+str(num+1)+'志愿'])
                name.remove(t)
                tot[idx[sub]] -= 1

ans = pd.DataFrame(choose, columns=['姓名', '专业', ''])
ans.to_excel('填报结果.xlsx', index=False)
print(ans)
```
