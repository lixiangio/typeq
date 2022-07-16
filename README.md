# typeq

适用于 Postgresql 和 CockroachDB 数据库的简单、轻量级 ORM。

## 特性

- 采用数据模型与数据库连接池分离设计，支持嵌入或独立部署两种方案可选。

- 在拆分部署模式下，可改善 Serverless 环境下的冷启动速度，并提高数据库连接池的复用率；

- 为多租户、多数据库、分布式场景提供更灵活的模型切换与复用支持；

- 支持为 JSON 类型字段建模，提供 JSON 数据结构、类型的深层校验功能；

- 支持为 JSONB 类型自动创建独立的自增序列，为嵌套数据查询提供唯一索引；

- 支持创建虚拟表模型，即将已有的单个或多个模型，通过映射、裁切为新的虚拟模型；

- 支持扩展自定义运算符函数、自定义数据类型验证器；

- 支持可扩展的查询任务流，可实现 SQL 请求时拦截、转发、改写等定制化功能；

- 支持 Schema、表结构同步，将数据模型中表结构、索引等信息同步至表实体；

- 保留类似 SQL 的语法特征，使用函数链风格的查询表达式，简洁、直观、易于读写；

## Install

```sh
npm install typeq
```

## Example

```ts
import { Schema, Model, queue, operator } from "typepg";
import pgclient from "typepg/pgclient";

const client = pgclient({
  default: {
    host: "localhost",
    database: "demo",
    user: "postgres",
    password: "******",
    port: 5432,
  },
});

queue.use(client); // 将数据库客户端实例添加至查询队列

const { integer, string, boolean, email, jsonb } = Schema.types;

/** 定义表结构模型 */

const schema = new Schema({
  id: integer({ primaryKey: true }),
  uid: integer,
  keywords: {
    state: boolean,
    area: string,
    createdAt: timestamp,
  },
  list: [
    {
      id: integer({ sequence: true }),
      state: boolean,
      address: [
        {
          id: integer({ sequence: true }),
          name: string,
          createdAt: timestamp({ default: "now()" }),
          updatedAt: timestamp({ default: "now()" }),
        },
      ],
      test: {
        state: boolean,
        name: string,
      },
      createdAt: timestamp({ default: "now()" }),
      updatedAt: timestamp({ default: "now()" }),
    },
  ],
  area: string({ min: 10, max: 100 }),
  state: boolean({ default: true }),
  modes: jsonb,
  email: email,
  createdAt: timestamp({ default: "now()" }),
  updatedAt: timestamp({ default: "now()" }),
});

const tasks = new Model("tasks", schema);

const { $as, $in } = operator; // 查询操作符

/** 基于数据模型的结构化查询 */
const list = await tasks
  .select("id", "email", "keywords", $as("uid", "tid"))
  .where({ id: $in(50, 51) })
  .and({ keywords: {} })
  .or({ id: 5 })
  .order({
    id: "desc",
    uid: "desc",
  })
  .limit(10);
```

<!--
## 为什么要做这个项目？

由于主流 ORM 倾向于广泛兼容各种类型的数据库，但是受 SQL 语法兼容性、复杂性、数据库版本差异等诸多因素的影响，不得不在功能和兼容性之间做出取舍，也只能做到跨平台一部分代码兼容。在实际应用中，很多通用 ORM 在面对某些复杂的或边缘查询用例时可读性差，代码看起来也显得很鸡肋。因此，Typeq 不打算追求大而全，未来将专注于以 Postgresql 数据库作为主要的适配目标，优化常见的高频查询用例，期望在性能和开发体验之间找到合适的平衡点，对于复杂用例建议使用 SQL 查询。 -->

## 连接数据库

> 配置参数与 pg 模块兼容，更多参数细节请参考 [node-postgres 文档](https://node-postgres.com/)

```ts
import { queue } from "typepg";
import pgclient from "typepg/pgclient";

const client = pgclient({
  default: {
    host: string, // 主机名
    database: string, // 数据库名
    username: string, // 用户名
    password: string, // 密码
    port: number, // 端口
    logger: boolean, // 打印 sql 日志，可选
    connectionString: string, // 字符串连接参数，可选
  },
});

queue.use(client);
```

## 添加模型

```ts
const model = new Model(name: string, model: object);
```

- name string - 模型名称
-
- model object - 模型实例

## 模型同步

模型与数据表之间支持三种同步模式：

### 默认模式

> 无参数时会尝试创建新的数据表，当指定的表已存在时请求被拒绝，不做任何操作。

```js
client().sync("public.user");
```

### 增量模式

> 在已有表上新增字段，该模式只会添加新的列，不改变已有列和数据。

```js
client().sync("user", "increment");
```

### 重置模式（危险）

> 删除已有的数据表重新构建表结构。

#### 示例

```js
// 同步 schema 为public下的 user 表
client().sync("public.user");

// 使用重构模式，删除并重建 user 表（未指定 schema，默认为 public）
client().sync("public.user", "rebuild");

// 使用批量增量模式，批量同步 public.admin 下所有的表
client().syncAll("public.admin", "rebuild");
```

### 批量同步指定 public 中的所有模型

```js
client().syncAll("public", "increment");
```

## 函数链

函数链提供了一种更加便捷、严谨和安全的 sql 编码方式，主要目的是尽可能避免 SQL 注入。

### insert 函数链

#### model.insert(data)

插入新数据

### find 函数链

#### model.find(condition)

- condition object - and 过滤条件

查询多条记录

#### model.findOne(condition)

- condition object - and 过滤条件

查询单条记录

#### model.findPk(id: number)

- id - 主键 id

查询主键 id

#### model.order(options: object)

- options - 排序字段

#### model.offset(value: number)

- value - 限定查询结果的起始位置

#### model.limit(value: number)

- value - 限制返回结果数量

### update 函数链

#### model.update(condition).set(data: object | object[])

更新数据，用合并的方式更新 json、jsonb 类型

#### model.updatePk(id).set(data: object | object[])

更新指定主键的数据

### delete 函数链

#### model.delete(condition)

删除多条数据

#### model.deletePk(id: number)

删除指定主键的数据

### 通用函数链

#### 逻辑函数链 where(condition).and(condition).or(condition)

逻辑函数链同时适用于 find、update、delete 操作。支持多个 options 参数，每个 options 内的子节点之间为 and 关系，options 与 options 之间为 or 关系

该设计方案的优点是结构简单、逻辑清晰、易解析。缺点是仅支持双层嵌套逻辑关系，但可满足大多数逻辑应用场景。

- condition - and 条件集合

```js
model.where(condition, ...).or(condition, ...).and(condition, ...);
```

### return 函数链

增删改查操作均支持 return 操作，用于定义返回列

#### return(...fields: string[])

返回指定字段

#### \_return(...fields: string[])

不返回指定字段

## 操作符函数

### 查询函数

> 用于 options.where 属性中，作为数据筛选条件，包含逻辑运算符、比较运算符等。

### 原生 sql 运算符

#### $sql()

添加原生 SQL 字符串，内置单引号转义。

### 比较运算符

#### $eq(value: any)

等于

#### $ne(value: any)

不等于

#### $gte()

#### $gt()

#### $lte()

#### $lt()

### 其它操作符

#### $not()

#### $is()

#### $in()

#### $notIn()

#### $like()

#### $notIn()

#### $notLike()

#### $iLike()

#### $notILike()

#### $regexp()

#### $regexp()

#### $regexp()

#### $regexp()

#### $notRegexp()

#### $iRegexp()

#### $notIRegexp()

#### $between()

#### $notBetween()

#### $overlap()

#### $contains()

#### $contained()

#### $adjacent()

#### $strictLeft()

#### $strictRight()

#### $noExtendRight()

#### $noExtendLeft()

#### $any()

#### $all()

#### $values()

#### $col()

#### $placeholder()

#### $join()

#### $raw()

### Update 函数

> 用于 json 类型数据的插入、合并、删除操作

#### $merge()

#### $set()

#### $insert()

#### $insertByPath()

#### $insertFirst()
