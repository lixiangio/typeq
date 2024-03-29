import { type ModelFn } from './model.js';
import findChain, { type FindPromise } from './chain/find.js';
import type { Options, Data, $Client } from './common.js';

interface Struct { [name: string]: any }

export class VSchema {
  /**
   * 虚拟模式
   * @param struct 表结构体
   * @param schema Schema 类的实例
   */
  constructor(struct: Struct, model: ModelFn | { [name: string]: ModelFn }) {

  }
}

/**
 * 虚拟模型类
 */
export class VModel {
  fields = {};
  keys = {};
  schema = 'public';
  /**
   * @param name 虚拟模型或视图名称
   * @param schema Schema 类的实例
   */
  constructor(name, schema: object, xx?) {

    // const { joinType } = options;

    // this.models = models;

    // if (joinType === 'innerJoin') {
    //   this.joinType = "INNER JOIN";
    // } else if (joinType === 'leftJoin') {
    //   this.joinType = "LEFT JOIN";
    // } else if (joinType === 'rightJoin') {
    //   this.joinType = "RIGHT JOIN";
    // }

    // const allFields = {};
    // const nameIndex = {};

    // for (const model of models) {

    //   const { name: modelName } = model;
    //   nameIndex[modelName] = model;

    //   const { fields } = model;

    //   for (const fieldName in fields) {

    //     const options = fields[fieldName];
    //     const fieldPath = `${modelName}.${fieldName}`;

    //     allFields[fieldPath] = {
    //       modelName,
    //       fieldName,
    //       options
    //     }

    //   }

    // }

    // this.name = `"${this.models[0].name}_${joinType}_${this.models[1].name}"`;

    // const { keys, fields } = this;
    // const { select: originSelect } = options;

    // for (const alias in originSelect) {

    //   const modelNameOrAlias = originSelect[alias];

    //   const fieldPath = `${modelNameOrAlias}.${alias}`;

    //   const fieldInfo = allFields[fieldPath];

    //   if (fieldInfo) {

    //     const { modelName, fieldName, options } = fieldInfo;

    //     if (keys[fieldName] === undefined) {

    //       keys[fieldName] = `"${modelName}"."${fieldName}"`;
    //       fields[fieldName] = options;


    //     } else {

    //       throw new Error(`${modelName}复合模型中“${fieldName}”字段存在命名冲突`);

    //     }

    //   }

    //   // 尝试别名匹配
    //   else if (allFields[modelNameOrAlias]) {

    //     const fieldInfo = allFields[modelNameOrAlias];

    //     const { modelName, fieldName, options } = fieldInfo;

    //     if (keys[alias] === undefined) {

    //       keys[alias] = `"${modelName}"."${fieldName}" AS "${alias}"`;
    //       fields[alias] = options;

    //     } else {

    //       throw new Error(`"${modelName}"复合模型中"${alias}"字段存在命名冲突`);

    //     }

    //   } else {

    //     throw new Error(`${this.name}复合模型中未找到“${fieldPath}”字段`);

    //   }

    // }

    // const select = [];

    // for (const name in keys) {
    //   select.push(keys[name]);
    // }

    // this.$select = {
    //   key: "SELECT",
    //   value: select.join()
    // }

    // const on = [];

    // const { joinOn } = options;

    // if (joinOn === undefined) {
    //   throw new Error(`${this.name}复合模型缺少on选项`);
    // }

    // for (const field1 in joinOn) {

    //   const keys = [];
    //   const field2 = joinOn[field1];

    //   for (const item of [field1, field2]) {

    //     const [modelName, field] = item.split('.');
    //     const model = nameIndex[modelName];

    //     if (model) {
    //       if (model.fields[field]) {
    //         keys.push(`"${modelName}"."${field}"`);
    //       } else {
    //         throw new Error(`${this.name}复合模型中“on.${item}”字段不存在`);
    //       }
    //     } else {
    //       throw new Error(`${this.name}复合模型中“on.${item}”字段不存在`);
    //     }

    //   }

    //   const [k1, k2] = keys;

    //   on.push(`${k1} = ${k2}`);

    // }

    // this.on = {
    //   key: "ON",
    //   value: on.join(' AND ')
    // };

  }
  // select(...fields): FindPromise {

  //   const chain = findChain<Data[] | null>(this, ctx=>{

  //   });

  //   chain.result = (data) => data.rows;

  //   return chain.return(...fields);

  // }
  // /**
  //  * 查询多条
  //  * @param  {Object} condition 
  //  */
  // find(condition): FindPromise {

  //   const chain = findChain(this);

  //   if (condition) {
  //     chain.where(condition);
  //   }

  //   chain.result = (data) => data.rows;

  //   return chain;

  // }
  // /**
  //  * 查询单条
  //  * @param  {Object} condition
  //  */
  // findOne(condition): FindPromise {

  //   const chain = findChain(this);

  //   if (condition) {
  //     chain.where(condition);
  //   }

  //   chain.limit(1);

  //   chain.result = (data) => data.rows[0] || null;

  //   return chain;

  // }
  // /**
  //  * 查询主键
  //  * @param id 
  //  */
  // findPk(id: number): FindPromise {

  //   const chain = findChain<>(this);

  //   const { primaryKey } = this;

  //   if (primaryKey) {
  //     chain.where({ [primaryKey]: id });
  //   } else {
  //     throw new Error(`模型中未定义主键`);
  //   }

  //   chain.limit(1);

  //   chain.result = (data) => data.rows[0] || null;

  //   return chain;

  // }
  /**
   * 查询数据总量
   */
  // count() {

  //   const chain = findChain(this);

  //   return chain.count();

  // }
};
