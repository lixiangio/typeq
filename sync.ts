import { query } from './main/index.js';
import { methodKey, type Paths } from './main/common.js';
import type { ModelFn } from './main/model.js';

/**
* 同步单个模型
* @param model 数据模型
*/
export default function sync(model: ModelFn) {

  const { fields, primaryKey } = model.schema;

  const defaultPaths = { client: 'default', schema: 'public', table: model.name };

  /**
   * 提取模型字段信息，合成 SQL
   */
  function fieldsToSQL() {

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

  return {
    /**
     * 创建表结构
     * @param paths 表路径选项
     */
    async createTable(paths?: Paths) {

      paths = { ...defaultPaths, ...paths };

      const { schema, table } = paths;

      const SQL = `CREATE TABLE IF NOT EXISTS "${schema}"."${table}" (${fieldsToSQL()});`;

      await query({ paths, SQL });

      await this.uniqueIndex(paths);

      await this.creatSequence(paths);

      await this.creatComment(paths);

    },
    /** 
     * 重构表结构
     * @param paths 表路径选项
     */
    async rebuildTable(paths?: Paths) {

      paths = { ...defaultPaths, ...paths };

      const { schema, table } = paths;

      const SQL = `DROP TABLE IF EXISTS "${schema}"."${table}" CASCADE;CREATE TABLE "${schema}"."${table}" (${fieldsToSQL()});`;

      await query({ paths, SQL });

      await this.creatComment(paths);

      await this.uniqueIndex(paths);

      await this.creatSequence(paths);

    },
    /**
     * 创建序列 id
     * @param paths 表路径选项
     */
     async creatSequence(paths: Paths) {

      paths = { ...defaultPaths, ...paths };
      
      const { schema, table } = paths;

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

      const SQL = sqlArray.join('; ');

      await query({ paths, SQL });

    },
    /**
     * 添加字段
     * @param paths 表路径选项
     */
    async addColumn(paths?: Paths) {

      await this.increment({ ...defaultPaths, ...paths }, true, false);

    },
    /**
     * 移除字段
     * @param paths 表路径选项
     */
    async removeColumn(paths?: Paths) {

      await this.increment({ ...defaultPaths, ...paths }, false, true);

    },
    /**
     * 增量更新，根据模型自动新增和删除字段
     * @param paths 配置选项
     * @param add 新增字段
     * @param remove 删除字段
     */
    async increment(paths: Paths, add = true, remove = false) {

      const { schema, table } = paths;

      const SQL = `select column_name, data_type, is_nullable from information_schema.columns where table_schema='${schema}' and table_name='${table}';`;

      const { rows } = await query({ paths, SQL });

      if (rows.length === 0) return;

      const fieldsMap = {};

      for (const item of rows) {
        fieldsMap[item.column_name] = true;
      }

      const sqlArray = [];

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

        const SQL = sqlArray.join('; ')

        return await query({ paths, SQL });

      }

      await this.uniqueIndex(paths);

      await this.creatSequence(paths);

    },
    /**
     * 创建唯一索引
     * @param paths 表路径选项
     */
    async uniqueIndex(paths?: Paths) {

      paths = { ...defaultPaths, ...paths };
      
      const { schema, table } = paths;

      const sqlArray = [];

      for (const field in fields) {

        const item = fields[field];

        if (item.uniqueIndex === true) {
          sqlArray.push(`CREATE UNIQUE INDEX IF NOT EXISTS "${field}_unique" ON "${schema}"."${table}" USING btree ("${field}" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST)`);
        }

      }

      const SQL = sqlArray.join('; ');

      await query({ paths, SQL });

    },
    /**
     *  添加 SQL 注释
     * @param paths 表路径选项
     */
    async creatComment(paths: Paths) {

      paths = { ...defaultPaths, ...paths };

      const { schema, table } = paths;

      let SQL = '';

      for (const field in fields) {

        const options = fields[field];

        if (options.comment) {

          SQL += `COMMENT ON COLUMN "${schema}"."${table}"."${field}" IS '${options.comment}';`;

        }

      }

      await query({ paths, SQL });

    },
  };

}
