import { safetySQL, jsonToSql } from '../safety.js';
import jsonb from './jsonb.js';

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
  $as(field: string, alias: string) {
    return () => `"${field.split('.').join('"."')}" AS "${alias}"`;
  },
  $count() { return () => 'count(*)::integer'; },
  $eq(value: number) {
    return () => `= ${safetySQL(value)}`
  },
  $ne(value: number) {
    return () => `!= ${safetySQL(value)}`;
  },
  $gte(value: number) {
    return () => `>= ${safetySQL(value)}`
  },
  $gt(value: number) {
    return () => `> ${safetySQL(value)}`
  },
  $lte(value: number) {
    return () => `<= ${safetySQL(value)}`
  },
  $lt(value: number) {
    return () => `< ${safetySQL(value)}`
  },
  $not(value) {
    return () => `IS NOT ${safetySQL(value)}`
  },
  $in(...values) {
    values = values.map(value => safetySQL(value));
    return () => `IN (${values.join(`, `)})`;
  },
  $notIn(...values) {
    values = values.map(value => safetySQL(value))
    return () => `NOT IN (${values.join(`, `)})`
  },
  /**
   * 范围匹配
   * @param start 起始值
   * @param end 结束值
   */
  $scope(start: number, end: number) {
    return (field: string) => `>= ${safetySQL(start)} AND ${field.split('.').join('"."')} < ${safetySQL(end)}`;
  },
  /**
   * 仅用于range范围数据类型
   * @param start 起始值
   * @param end 结束值
   */
  $range(start: number, end: number) {
    return () => [safetySQL(start), safetySQL(end)];
  },
  $is(value) {
    return () => `IS ${safetySQL(value)}`;
  },
  $like(value: string) {
    return () => `LIKE ${safetySQL(value)}`;
  },
  $notLike(value: string) {
    return () => `NOT LIKE ${safetySQL(value)}`;
  },
  $iLike(value) {
    return () => `ILIKE ${safetySQL(value)}`;
  },
  $notILike(value) {
    return () => `NOT ILIKE ${safetySQL(value)}`
  },
  $regexp(value) {
    return () => `~ ${safetySQL(value)}`;
  },
  $notRegexp(value) {
    return () => `!~ ${safetySQL(value)}`;
  },
  $iRegexp(value) {
    return () => `~* ${safetySQL(value)}`;
  },
  $notIRegexp(value) {
    return () => `!~* ${safetySQL(value)}`;
  },
  $between(value) {
    return () => `BETWEEN ${safetySQL(value)}`;
  },
  $notBetween(value) {
    return () => `NOT BETWEEN ${safetySQL(value)}`;
  },
  $overlap(value) {
    return () => `&& ${safetySQL(value)}`;
  },
  $contains(value) {
    return () => `@> '${jsonToSql(value)}'`;
  },
  $contained(value) {
    return () => `<@ '${jsonToSql(value)}'`;
  },
  $adjacent(value) {
    return () => `-|- ${safetySQL(value)}`;
  },
  $strictLeft(value) {
    return () => `<< ${safetySQL(value)}`;

  },
  $strictRight(value) {
    return () => `>> ${safetySQL(value)}`;

  },
  $noExtendRight(value) {
    return () => `&< ${safetySQL(value)}`;

  },
  $noExtendLeft(value) {
    return () => `&> ${safetySQL(value)}`;
  },
  ...jsonb,
}