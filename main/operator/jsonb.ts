import { jsonToSql } from '../safety.js';

/**
 * 数据更新运算符
 */
export default {
  /**
   * 查找包含的对象，从 jsonb 中筛选符合条件的数据
   * @param value 一个或多个值
   */
  $includes(value: object | any[]) {
    return () => `@> '${jsonToSql(value)}'::jsonb`;
  },
  /**
   * 合并 json 对象
   */
  $merge(value: object) {
    return function (field: string) {
      return `"${field}" || '${jsonToSql(value)}'::jsonb`;
    }
  },
  /**
   * 设置 json 对象，支持 jsonb_set 所有功能的完整版本
   */
  $set(path: string, value, missing = true) {
    return function (field: string) {
      const json = jsonToSql(value);
      return `jsonb_set("${field}", '${path}', '${json}'::jsonb, ${missing})`
    }
  },
  /**
   * 插入 json 对象，支持 jsonb_insert 所有功能的完整版本
   */
  $insert(field: string, path: string, value, after = false) {
    return function () {
      const json = jsonToSql(value);
      return `jsonb_insert("${field}", '${path}', '${json}'::jsonb, ${after})`;
    }
  },
  /**
   * 通过 path 插入 jsonb 对象，省略after配置的简化操作符
   */
  $insertByPath(path: string, value) {
    return function (field: string) {
      const json = jsonToSql(value);
      return `jsonb_insert("${field}", '${path}', '${json}'::jsonb)`;
    }
  },
  /**
   * 在第一个元素前插入 json 对象，预设 path 为起始位置的极简操作符
   */
  $insertFirst(value) {
    return function (field: string) {
      const json = jsonToSql(value);
      return `jsonb_insert("${field}", '{0}', '${json}'::jsonb)`;
    }
  },
}
