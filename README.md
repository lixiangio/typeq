# typeq

适用于 Postgresql、CockroachDB、Materialize 数据库的简单、轻量级 ORM。

> 该项目基于 [ormv](https://github.com/lixiangio/ormv) 重构，目前处于开发阶段

## 特性

- 支持为 JSON、JSONB 类型字段建模，提供 JSON 数据结构与类型的深层校验；

- 支持为 JSONB 类型自动创建独立的自增序列，为嵌套数据查询提供唯一索引；

- 采用数据模型与数据库连接池分离设计，支持集成部署或独立部署两种可选方案。

- 在独立部署模式下，可改善 Serverless 环境下的冷启动速度，并提高数据库连接池的复用率；

- 为多租户、多数据库、分布式场景提供更灵活的模型切换与复用支持；

- 使用简洁、直观、可嵌套的数据模型，通过类型函数声明，确保字段命名安全、无冲突；

- 支持创建虚拟表模型，将已有的单个或多个模型，通过映射、裁切为新的虚拟模型；

- 支持扩展自定义运算符函数、自定义数据类型验证器；

- 支持可扩展的查询任务流，可实现 SQL 请求拦截、转发、改写等定制化需求；

- 支持将数据模型中数据结构、索引、自增序列等信息同步至表实体；

- 保留类似 SQL 的语法特征，使用函数链风格的查询表达式，简洁、直观、易于读写；

## Install

```sh
npm install typeq
```

## Example

```ts
import { Client, Schema, Model, operator } from "typepg";
import pgclient from "@typeq/pg";

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
      id: integer({ sequence: "list.$.id" }),
      state: boolean,
      address: [
        {
          id: integer({ sequence: "list.$.address.$.id" }),
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

/** 连接数据库 */
const client = new Client(
  "default",
  pgclient({
    host: "localhost",
    database: "demo",
    user: "postgres",
    password: "******",
    port: 5432,
  })
);

const { $as, $in } = operator; // 查询操作符

/** 插入数据 */
const [item] = await tasks(options).insert(data).return("id");

/** 查询查询 */
const result = await tasks
  .select("id", "email", "keywords", $as("uid", "tid"))
  .where({ id: $in(50, 51) })
  .and({ keywords: {} })
  .or({ id: 5 })
  .order({ uid: "desc" })
  .limit(20);

/** 更新数据 */
const result = await tasks.update({ id: 1 }).set(data).return("id");

/** 删除数据 */
const result = await tasks.delete({ id: 1 });
```

<!--
## 为什么要做这个项目？

由于主流 ORM 倾向于广泛兼容各种类型的数据库，但是受 SQL 语法兼容性、复杂性、数据库版本差异等诸多因素的影响，不得不在功能和兼容性之间做出取舍，也只能做到跨平台一部分代码兼容。在实际应用中，很多通用 ORM 在面对某些复杂的或边缘查询用例时可读性差，代码看起来也显得很鸡肋。因此，Typeq 不打算追求大而全，未来将专注于以 Postgresql 数据库作为主要的适配目标，优化常见的高频查询用例，期望在性能和开发体验之间找到合适的平衡点，对于复杂用例建议使用 SQL 查询。 -->

## 连接数据库

> 配置参数与 pg 模块兼容，更多参数细节请参考 [node-postgres 文档](https://node-postgres.com/)

```ts
import pgclient from "typepg/pgclient";

const client = pgclient({
  host: string, // 主机名
  database: string, // 数据库名
  username: string, // 用户名
  password: string, // 密码
  port: number, // 端口
  logger: boolean, // 打印 sql 日志，可选
  connectionString: string, // 字符串连接参数，可选
});
```

## 添加模型

```ts
const schema = new Schema({ [field: name]: Type });
const model = new Model(name: string, schema: Schema);
```

- name - 实体表名称
- schema - 模式实例

## 模型同步

### 创建表

> 无参数时会尝试创建新的数据表，当指定的表已存在时请求被拒绝，不做任何操作。

```js
sync(model: Model).createTable(options);
```

### 重置表（危险）

> 删除已有的数据表重新构建表结构。

#### 示例

```js
// 同步 schema 为 public 下的 user 表
sync(model: Model).rebuildTable("public.user");

// 使用重构模式，删除并重建 user 表（未指定 schema 时，默认为 public）
sync(model: Model).rebuildTable("public.user");

// 使用批量增量模式，批量同步 public.admin 下所有的表
sync(model: Model).rebuildTable("public.admin");
```

### 字段同步

> 在已有表上新增字段，该模式只会添加新的列，不改变已有列和数据。

```js
sync(model: Model).addColumn(options);

sync(model: Model).removeColumn(options);
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
model.where(condition, condition, ...).or(condition, condition, ...).and(condition, condition, ...);
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
