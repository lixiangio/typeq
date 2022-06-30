import { safetyKey, safetyValue, safetyJson } from '../safety.js';
import jsonb from './jsonb.js';

type Func = () => string;

export default {
  /** 
   * 原生 SQL 查询
   * @param sql SQL 字符串
   */
  $sql(sql: string) { return () => sql; },
  /**
   * 定义别名
   * @param field 原名
   * @param alias 别名
   */
  $as(field: string, alias: string): Func {
    return () => `${safetyKey(field)} AS "${alias.replace(/"/g, "")}"`;
  },
  $count() { return () => `count(*)::integer`; },
  $eq(value: number) {
    return () => `= ${safetyValue(value)}`
  },
  $ne(value: number) {
    return () => `!= ${safetyValue(value)}`;
  },
  $gte(value: number) {
    return () => `>= ${safetyValue(value)}`
  },
  $gt(value: number) {
    return () => `> ${safetyValue(value)}`
  },
  $lte(value: number) {
    return () => `<= ${safetyValue(value)}`
  },
  $lt(value: number) {
    return () => `< ${safetyValue(value)}`
  },
  $not(value) {
    return () => `IS NOT ${safetyValue(value)}`
  },
  $in(...values) {
    values = values.map(value => safetyValue(value));
    return () => `IN (${values.join(`, `)})`;
  },
  $notIn(...values) {
    values = values.map(value => safetyValue(value))
    return () => `NOT IN (${values.join(`, `)})`
  },
  /**
   * 范围匹配
   * @param start 起始值
   * @param end 结束值
   */
  $scope(start: number, end: number) {
    return (field) => `>= ${safetyValue(start)} AND ${safetyKey(field)} < ${safetyValue(end)}`;
  },
  /**
   * 仅用于range范围数据类型
   * @param start 起始值
   * @param end 结束值
   */
  $range(start: number, end: number) {
    return function () {
      return [safetyValue(start), safetyValue(end)];
    }
  },
  $is(value) {
    return function () {
      return `IS ${safetyValue(value)}`
    }
  },
  $like(value: string) {
    return function () {
      return `LIKE ${safetyValue(value)}`
    }
  },
  $notLike(value: string) {
    return function () {
      return `NOT LIKE ${safetyValue(value)}`
    }
  },
  $iLike(value) {
    return function () {
      return `ILIKE ${safetyValue(value)}`
    }
  },
  $notILike(value) {
    return function () {
      return `NOT ILIKE ${safetyValue(value)}`
    }
  },
  $regexp(value) {
    return function () {
      return `~ ${safetyValue(value)}`
    }
  },
  $notRegexp(value) {
    return function () {
      return `!~ ${safetyValue(value)}`
    }
  },
  $iRegexp(value) {
    return function () {
      return `~* ${safetyValue(value)}`
    }
  },
  $notIRegexp(value) {
    return function () {
      return `!~* ${safetyValue(value)}`
    }
  },
  $between(value) {
    return function () {
      return `BETWEEN ${safetyValue(value)}`
    }
  },
  $notBetween(value) {
    return function () {
      return `NOT BETWEEN ${safetyValue(value)}`
    }
  },
  $overlap(value) {
    return function () {
      return `&& ${safetyValue(value)}`
    }
  },
  $contains(value) {
    return function () {
      return `@> ${safetyJson(value)}`
    }
  },
  $contained(value) {
    return function () {
      return `<@ ${safetyJson(value)}`
    }
  },
  $adjacent(value) {
    return function () {
      return `-|- ${safetyValue(value)}`
    }
  },
  $strictLeft(value) {
    return function () {
      return `<< ${safetyValue(value)}`
    }
  },
  $strictRight(value) {
    return function () {
      return `>> ${safetyValue(value)}`
    }
  },
  $noExtendRight(value) {
    return function () {
      return `&< ${safetyValue(value)}`
    }
  },
  $noExtendLeft(value) {
    return function () {
      return `&> ${safetyValue(value)}`
    }
  },
  ...jsonb,
}