import { Type } from 'typeq';
import isMobilePhone from 'typeq/validator/isMobilePhone.js';
import isEmail from 'typeq/validator/isEmail.js';

// ---------------------扩展类型---------------------

export const email = Type('varchar(100)', {
  type(value: string) {
    if (isEmail(String(value))) {
      return { value: `'${value}'` };
    } else {
      return { error: `值必须为 email 类型，实际赋值为 '${value}'` };
    }
  }
})

export const mobilePhone = Type('varchar(100)', {
  type(value: string) {
    if (isMobilePhone(String(value), 'zh-CN')) {
      return { value: `'${value}'` };
    } else {
      return { error: `值必须为 mobile phone ，实际赋值为 '${value}'` };
    }
  }
})
