import Find from './chain/find.js';

/**
 * 虚拟模型类
 */
export default class VModel {
  fields = {};
  keys = {};
  schema = 'public';
  /**
   * @param options 模型选项
   * @param client 客户端
   */
  constructor(options: object, models: object | Function, join: object) {

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
  select(...fields): Find {

    const chain = new Find(this);

    chain.result = (data) => data.rows;

    return chain.return(...fields);

  }
  /**
   * 查询多条
   * @param  {Object} condition 
   */
  find(condition): Find {

    const chain = new Find(this);

    if (condition) {
      chain.where(condition);
    }

    chain.result = (data) => data.rows;

    return chain;

  }
  /**
   * 查询单条
   * @param  {Object} condition
   */
  findOne(condition): Find {

    const chain = new Find(this);

    if (condition) {
      chain.where(condition);
    }

    chain.limit(1);

    chain.result = (data) => data.rows[0] || null;

    return chain;

  }
  /**
   * 查询主键
   * @param id 
   */
  findPk(id: number): Find {

    const chain = new Find(this);

    const { primaryKey } = this;

    if (primaryKey) {
      chain.where({ [primaryKey]: id });
    } else {
      throw new Error(`模型中未定义主键`);
    }

    chain.limit(1);

    chain.result = (data) => data.rows[0] || null;

    return chain;

  }
  /**
   * 查询数据总量
   */
  count() {

    const chain = new Find(this);

    return chain.count();

  }
};
