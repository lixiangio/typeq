import { safetyJson } from '../safety.js';

/**
 * 数据更新运算符
 */
export default {
  /**
   * 合并 jsonb 对象
   */
  $merge(value: object) {
    return function (field: string) {
      const json = safetyJson(value);
      return `"${field}" || '${json}'::jsonb`;
    }
  },
  /**
   * 设置 jsonb 对象，支持 jsonb_set 所有功能的完整版本
   */
  $set(path: string, value, missing = true) {
    return function (field: string) {
      const json = safetyJson(value);
      return `jsonb_set("${field}", '${path}', '${json}'::jsonb, ${missing})`
    }
  },
  /**
   * 插入 jsonb 对象，支持 jsonb_insert 所有功能的完整版本
   */
  $insert(field: string, path: string, value, after = false) {
    return function () {
      const json = safetyJson(value);
      return `jsonb_insert("${field}", '${path}', '${json}'::jsonb, ${after})`;
    }
  },
  /**
   * 通过 path 插入 jsonb 对象，省略after配置的简化操作符
   */
  $insertByPath(path: string, value) {
    return function (field: string) {
      const json = safetyJson(value);
      return `jsonb_insert("${field}", '${path}', '${json}'::jsonb)`;
    }
  },
  /**
   * 在第一个元素前插入 jsonb 对象，预设 path 为起始位置的极简操作符
   */
  $insertFirst(value) {
    return function (field: string) {
      const json = safetyJson(value);
      return `jsonb_insert("${field}", '{0}', '${json}'::jsonb)`;
    }
  },
  /**
   * 包含匹配，仅适用于j sonb 数组类型
   * @param values 一个或多个值
   */
  $includes(...values) {
    return () => `@> '${safetyJson(values)}'::jsonb`;
  },
}
