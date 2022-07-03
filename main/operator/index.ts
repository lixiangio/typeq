import { safetyKey, sqlString, safetyJson } from '../safety.js';
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
    return () => `"${safetyKey(field)}" AS "${alias.replace(/"/g, "")}"`;
  },
  $count() { return () => `count(*)::integer`; },
  $eq(value: number) {
    return () => `= ${sqlString(value)}`
  },
  $ne(value: number) {
    return () => `!= ${sqlString(value)}`;
  },
  $gte(value: number) {
    return () => `>= ${sqlString(value)}`
  },
  $gt(value: number) {
    return () => `> ${sqlString(value)}`
  },
  $lte(value: number) {
    return () => `<= ${sqlString(value)}`
  },
  $lt(value: number) {
    return () => `< ${sqlString(value)}`
  },
  $not(value) {
    return () => `IS NOT ${sqlString(value)}`
  },
  $in(...values) {
    values = values.map(value => sqlString(value));
    return () => `IN (${values.join(`, `)})`;
  },
  $notIn(...values) {
    values = values.map(value => sqlString(value))
    return () => `NOT IN (${values.join(`, `)})`
  },
  /**
   * 范围匹配
   * @param start 起始值
   * @param end 结束值
   */
  $scope(start: number, end: number) {
    return (field) => `>= ${sqlString(start)} AND "${safetyKey(field)}" < ${sqlString(end)}`;
  },
  /**
   * 仅用于range范围数据类型
   * @param start 起始值
   * @param end 结束值
   */
  $range(start: number, end: number) {
    return function () {
      return [sqlString(start), sqlString(end)];
    }
  },
  $is(value) {
    return function () {
      return `IS ${sqlString(value)}`
    }
  },
  $like(value: string) {
    return function () {
      return `LIKE ${sqlString(value)}`
    }
  },
  $notLike(value: string) {
    return function () {
      return `NOT LIKE ${sqlString(value)}`
    }
  },
  $iLike(value) {
    return function () {
      return `ILIKE ${sqlString(value)}`
    }
  },
  $notILike(value) {
    return function () {
      return `NOT ILIKE ${sqlString(value)}`
    }
  },
  $regexp(value) {
    return function () {
      return `~ ${sqlString(value)}`;
    }
  },
  $notRegexp(value) {
    return function () {
      return `!~ ${sqlString(value)}`;
    }
  },
  $iRegexp(value) {
    return function () {
      return `~* ${sqlString(value)}`;
    }
  },
  $notIRegexp(value) {
    return function () {
      return `!~* ${sqlString(value)}`;
    }
  },
  $between(value) {
    return function () {
      return `BETWEEN ${sqlString(value)}`;
    }
  },
  $notBetween(value) {
    return function () {
      return `NOT BETWEEN ${sqlString(value)}`;
    }
  },
  $overlap(value) {
    return function () {
      return `&& ${sqlString(value)}`;
    }
  },
  $contains(value) {
    return function () {
      return `@> '${safetyJson(value)}'`;
    }
  },
  $contained(value) {
    return function () {
      return `<@ '${safetyJson(value)}'`;
    }
  },
  $adjacent(value) {
    return function () {
      return `-|- ${sqlString(value)}`
    }
  },
  $strictLeft(value) {
    return function () {
      return `<< ${sqlString(value)}`
    }
  },
  $strictRight(value) {
    return function () {
      return `>> ${sqlString(value)}`
    }
  },
  $noExtendRight(value) {
    return function () {
      return `&< ${sqlString(value)}`
    }
  },
  $noExtendLeft(value) {
    return function () {
      return `&> ${sqlString(value)}`
    }
  },
  ...jsonb,
}