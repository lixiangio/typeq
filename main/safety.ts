/**
 * 表字段级安全过滤器
 */

const keyReg = /"/g;
const valueReg = /'/g;

/**
 * 键名双引号过滤，将 key 中的双引号替换为空，防止截断注入
 * @param entity 
 */
export function safetyKey(entity: string): string {

  const safetyKey = entity.replace(keyReg, "");
  return safetyKey.split('.').join('"."');

}

/**
 * 将字符串中的单引号替换为双单引号，防止截断注入
 * 在 SQL 中两个连续的单引号会被视为普通的单引号字符
 * @param string 不安全的字符串
 */
export function sqlString(string: string | number): string {

  return String(string).replace(valueReg, "''");

}

/**
 * 将 SQL 字符串 JSON 语法中的双引号、反斜杠等特殊保留字符替换为合法的 SQL JSON 字符串值
 * @param sql SQL 字符串
 */
export function jsonString(sql: string) {

  return sql.replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/"/g, '\\"');

}


/**
 * 将 JSON 对象转换为 SQL 字符串
 * @param entity 
 */
export function safetyJson(entity: object): string {

  return JSON.stringify(entity).replace(valueReg, "''");

}
