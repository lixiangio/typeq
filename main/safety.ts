/**
 * 表字段级安全过滤器
 */

const keyReg = /"/g;
const valueReg = /'/g;

/**
 * 键名双引号过滤，将 key 中的双引号替换为空，防止截断注入
 * @param origin 
 */
export function safetyKey(origin: string): string {

  const safetyKey = origin.replace(keyReg, "");
  const fieldKey = safetyKey.split('.').join('"."');

  return `"${fieldKey}"`;

}

/**
 * 将字符串中的单引号替换为双单引号，防止截断注入
 * 在 SQL 中两个连续的单引号会被视为普通的单引号字符
 * @param origin
 */
export function safetyValue(origin: string): string {

  // const safetyValue = String(origin).replace(valueReg, "''");

  return String(origin).replace(valueReg, "''");

}

/**
 * json 转 SQL 字符串
 * @param origin 
 */
export function safetyJson(origin: object): string {

  const safetyJson = JSON.stringify(origin).replace(valueReg, "''");

  return `'${safetyJson}'`;

}
