const sqlReg = /'/g;

/**
 * 单引号通过双单转义，输出安全的sql字符串
 * 双引号通过反斜杠转义，输出合法的json字符串值
 * @param {string} origin 
 */
function safetyString(origin) {

  const sqlValue = origin.replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(sqlReg, "''").replace(/"/g, '\\"');

  return `"${sqlValue}"`;

}


console.log(safetyString(`\\k'k'kk"k<script\n\t type="text/javascript" src="/app.js"></script>`));
