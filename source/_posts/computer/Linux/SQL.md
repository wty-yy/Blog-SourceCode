---
title: SQL 笔记
hide: true
math: true
abbrlink: 1234
date: 2024-03-03 21:24:59
index\_img:
banner\_img:
category:
 - SQL
tags:
---

# SQL 笔记

> 本文参考Mick的《SQL基础教程》，基于[PostgreSQL](https://www.postgresql.org/)对SQL进行入门学习。

## 前置芝士

### 背景故事

第一个问题，数据库（Database, DB）和Excel表格有什么区别？

解释：当前普遍使用的数据库称为关系数据库（Relation Database, RDB）和普通二维表格没什么结构上区别，只是对每一列有特定的格式要求；但是DB的管理系统（Database Management System, DBMS）通常具有这些功能：支持多人时时修改、高效地并行检索、支持数据回滚、安全。综上，银行不会拿Excel去存储每个用户的各种信息，而是使用DBMS。

> 注：上述这种基于关系数据的管理系统称为**关系数据管理系统（Relational Database Management System, RDBMS）**；值得注意的是，还有一种不像Excel表格的数据库格式叫层次数据库（Hierarchical Database, HDB），这是古老数据库格式，当前用的不多。

DBMS的交互方法：和ChatGPT对话类似，首先连接上DBMS服务器，你向DBMS发出指令，DBMS处理指令后，从硬盘中的数据集里面检索需要的信息，最后将结果返回给你，所以实际操作起来就和解释性语言很像（但解释的机器可能都不是你自己这台）。

**SQL（Structured Query Language）**只是一种**和RDBMS交互的指令标准**（和opencv一样，他们只是一种标准），该标准由ANSI（美国国家标准协会）或ISO（国际标准化组织）进行修订。但是在具体的DBMS实现中，这些指令很可能不够好用，所以会产生一些特殊指令，不过标准SQL大部分的RDBMS应该都能支持。

具有代表性的RDBMS包括：Oracle Database, SQL Server (Micosoft), DB2 (IBM), PostgreSQL (OpenSource), MySQL (OpenSource)

> 由于下述我们只讨论关系数据集RDB，所以简写为DB。

### SQL 基本概念

在DBMS中按照存储数据集合的大小，从大到小分别为：**数据集（Database）、表（table）、单元格（cell）**。每个单元格由行（row）列（column）唯一确定，另外，在DBMS中**列**也被称为**字段（field）或属性（attribute）**，**行**也被称为**记录（record）**。

SQL 中的关键字（keyword）可分为以下三种：

- **DDL（Data definition Language，数据定义语言）**，用于创建或删除database, table；指令包含 `CREATE, DROP, ALTER` 等。
- **DML （Data Manipulation Language，数据操纵语言）**，用于查询或修改record；指令包含 `SELECT, INSERT, UPDATE, DELETE` 等。
- **DCL （Data Control Language，数据控制语言）**，用于确认或回滚之前的修改，并可以对用户权限进行修改；指令包含 `COMMIT, ROLLBACK, GRANT, REVOKE` 等。

> 实际操作中 SQL 大部分命令都是DML。

#### 代码规范

**所有SQL指令按分号结束**，尽管 SQL **不区分关键字大小写**（`SELECT=select`，但是我看大家还都写的大写），我们还是按照下述规范实现：

- 关键字全部大写，表名首字母大写，其余全部小写

## PostgreSQL 安装方法

首先下载对应操作系统的安装包，Win 用户在安装中会要求输入用户名密码，后续不用再自己创建用户；

本地部署 SQL 需要修改配置文件，Win 的配置文件在安装目录下 `.\data\postgresql.conf`，Linux 的配置文件在 `/etc/postgresql/<version>/main/postgresql.conf`，将文件打开后找到 `listen_addresses = 'localhost'` 将前面的 `#` 号注释掉即可。

然后重启 PostgreSQL 服务，Win 服务重启方法 `Win + R` 打开“运行”对话框，输入 `services.msc` 回车，找到 `postgresql` 开头的服务，右键选择“重新启动”即可；Linux 服务重启方法，输入 `sudo systemctl restart postgresql.service` 回车即可。

Linux用户在 `sudo apt install postgresql` 安装完 PostgreSQL 后需要以 `sudo` 权限进入超级用户，其用户名 `postgres`：

```shell
sudo -u postgres psql  # 进入psql交互命令界面
```

首先我们创建一个新的超级用户（先用上述命令进入交互界面）

```sql
CREATE USER <user_name> WITH PASSWORD '<password>' SUPERUSER;  # 创建一个带有密码的超级用户
ALTER ROLE <user_name> WITH SUPERUSER;  # 如果之前创建过用户，则可以修改其权限为超级用户
SELECT rolname FROM pg_authid;  # 查看当前全部用户名
```

下面测试一下，先用超级用户创建数据集：

```sql
CREATE DATABASE <database_name>;  # 创建新的数据集
SELECT datname FROM pg_database;  # 查看当前数据集列表
\c <database_name>  # 切换数据集
\q  # 退出交互界面
```

然后在 Shell 中使用新创建的用户登入：

```sql
psql -U <user_name> -d <database_name>  # 使用新创建的用户登入新创建的数据集
```

这样的好处在于可以在VSCode中下载 [PostgreSQL](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres) 插件来更加方便的书写 SQL 命令，缺点是不能输入 `\c, \q, \d` 这类非 SQL 指令。
