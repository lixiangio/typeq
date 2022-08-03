import { client } from './main/index.js';
import { type ModelFn } from './main/model.js';
import { type Options, methodKey } from './main/common.js';


/**
* 数据模型同步
*/
export default class Sync {
  model: ModelFn
  defaultOptions = { client: 'default', schema: 'public', table: undefined }
  /**
  * @param model 数据模型实例
  */
  constructor(model: ModelFn) {

    this.model = model;
    this.defaultOptions.table = model.name;

  }
  /**
   * 提取模型字段信息，合成 SQL 字符串
   */
  private fieldsToSQL(): string {

    const { fields, primaryKey } = this.model.schema;

    const sqlArray = [];

    for (const name in fields) {

      const item = fields[name];

      if (item.primaryKey) {

        sqlArray.push(`"${name}" SERIAL`);
        sqlArray.push(`PRIMARY KEY ("${primaryKey}")`);

      } else {

        const { default: Default, type } = item;

        const _default = Default ? ` DEFAULT ${Default}` : '';

        sqlArray.push(`"${name}" ${type}${_default}`);

      }

    }

    return sqlArray.join(', ');

  }
  /**
   * 创建表结构
   * @param options 表路径选项
   */
  async createTable(options?: Options) {

    options = { ...this.defaultOptions, ...options };

    const { schema, table } = options;

    const sql = `CREATE TABLE IF NOT EXISTS "${schema}"."${table}" (${this.fieldsToSQL()});`;

    await client(options.client).query(sql);

    await this.uniqueIndex(options);

    await this.creatSequence(options);

    await this.creatComment(options);

  }
  /** 
   * 重构表结构，危险操作，重构模式会强制删除表结构，清空表内数据
   * @param options 表路径选项
   */
  async rebuildTable(options?: Options) {

    options = { ...this.defaultOptions, ...options };

    const { schema, table } = options;

    const sql = `DROP TABLE IF EXISTS "${schema}"."${table}" CASCADE;CREATE TABLE "${schema}"."${table}" (${this.fieldsToSQL()});`;

    await client(options.client).query(sql);

    await this.creatComment(options);

    await this.uniqueIndex(options);

    await this.creatSequence(options);

  }
  /**
   * 创建序列 id
   * @param options 表路径选项
   */
  async creatSequence(options: Options) {

    options = { ...this.defaultOptions, ...options };

    const { schema, table } = options;

    const sequence: string[] = [];

    /**
    * 递归 type tree，提取序列名称
    * @param node 递归节点
    */
    function extractSequence(node: any) {

      if (toString.call(node) === '[object Object]') {

        if (node[methodKey]) {

          if (node.struct) {

            extractSequence(node.struct);

          } else {

            const { options } = node;

            if (options && options.sequence) {
              sequence.push(options.sequence);
            }

          }

        } else {

          for (const name in node) {
            extractSequence(node[name]);
          }

        }

      } else if (Array.isArray(node)) {

        extractSequence(node[0]);

      }

    }

    const { fields } = this.model.schema;

    for (const name in fields) {
      const { struct } = fields[name];
      if (struct) {
        extractSequence(struct);
      }
    }

    const sqlArray = [];

    for (const path of sequence) {

      sqlArray.push(`CREATE SEQUENCE IF NOT EXISTS "${schema}"."${table}.${path}"`);

    }

    const sql = sqlArray.join('; ');

    await client(options.client).query(sql);

  }
  /**
   * 添加字段
   * @param options 表路径选项
   */
  async addColumn(options?: Options) {

    await this.column({ ...this.defaultOptions, ...options }, true, false);

  }
  /**
   * 移除字段
   * @param options 表路径选项
   */
  async removeColumn(options?: Options) {

    await this.column({ ...this.defaultOptions, ...options }, false, true);

  }
  /**
   * 根据模型自动新增和删除字段
   * @param options 配置选项
   * @param add 新增字段
   * @param remove 删除字段
   */
  private async column(options: Options, add = true, remove = false) {

    const { schema, table } = options;

    const sql = `select column_name, data_type, is_nullable from information_schema.columns where table_schema='${schema}' and table_name='${table}';`;

    const { rows } = await client(options.client).query(sql);

    if (rows.length === 0) return;

    const fieldsMap = {};

    for (const item of rows) {
      fieldsMap[item.column_name] = true;
    }

    const sqlArray = [];
    const { fields } = this.model.schema;

    if (add === true) {

      // 字段不存在时自动创建
      for (const field in fields) {

        if (fieldsMap[field] === undefined) {

          const item = fields[field];
          const { type, default: Default, comment } = item;
          const _default = Default ? ` DEFAULT ${Default}` : '';

          sqlArray.push(`ALTER TABLE "${schema}"."${table}" ADD COLUMN "${field}" ${type}${_default}`);

          if (comment) {

            sqlArray.push(`COMMENT ON COLUMN "${schema}"."${table}"."${field}" IS '${comment}'`);

          }

        }

      }

    }

    if (remove === true) {

      // 字段不存在时自动删除
      for (const name in fieldsMap) {

        if (fields[name] === undefined) {

          sqlArray.push(`alter table "${schema}"."${table}" drop column if exists "${name}"`);

        }

      }

    }

    if (sqlArray.length) {

      const sql = sqlArray.join('; ')

      return await client(options.client).query(sql);

    }

    await this.uniqueIndex(options);

    await this.creatSequence(options);

  }
  /**
   * 创建唯一索引
   * @param options 表路径选项
   */
  async uniqueIndex(options?: Options) {

    const { schema, table, client: cname } = { ...this.defaultOptions, ...options };

    const sqlArray = [];

    const { fields } = this.model.schema;

    for (const field in fields) {

      const item = fields[field];

      if (item.uniqueIndex === true) {
        sqlArray.push(`CREATE UNIQUE INDEX IF NOT EXISTS "${field}_unique" ON "${schema}"."${table}" USING btree ("${field}" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST)`);
      }

    }

    const sql = sqlArray.join('; ');

    await client(cname).query(sql);

  }
  /**
   *  添加 SQL 注释
   * @param options 表路径选项
   */
  async creatComment(options: Options) {

    const { schema, table, client: cname } = { ...this.defaultOptions, ...options };

    let sql = '';

    const { fields } = this.model.schema;

    for (const field in fields) {

      const options = fields[field];

      if (options.comment) {

        sql += `COMMENT ON COLUMN "${schema}"."${table}"."${field}" IS '${options.comment}';`;

      }

    }

    await client(cname).query(sql);

  }
}