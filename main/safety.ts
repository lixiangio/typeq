/**
 * 表字段级安全过滤器
 */
 export const valueReg = /'/g;

/**
 * 将 SQL 字符串中的单引号替换为双单引号(两个连续的单引号会被视为普通的单引号字符)，防止截断注入
 * @param string 不安全的字符串
 */
export function safetySQL(string: string | number): string {

  return String(string).replace(valueReg, "''");

}


/**
 * 将 JSON 对象转换为安全的 SQL 字符串
 * @param entity 
 */
export function jsonToSql(entity: object): string {

  return JSON.stringify(entity).replace(valueReg, "''");

}
