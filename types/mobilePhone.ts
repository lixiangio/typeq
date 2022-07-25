import { createType } from 'typeq';
import isMobilePhone from '../validator/isMobilePhone.js';

interface Options {
  default?: string
  comment?: string,
  optional?: boolean
  uniqueIndex?: boolean
}

export function mobilePhone(options: Options) {

  const output = {
    /** 输出为 SQL */
    sql(value: unknown) { return { value }; },
    /** 输出为 JSON */
    json(value: string) { return { value }; }
  }

  return createType('varchar(100)', options, {
    ...createType.baseMethods,
    type(value) {
      if (isMobilePhone(String(value), 'zh-CN')) {
        return { value: `'${value}'` };
      }
      else {
        return { error: `值必须为 mobile phone ，实际赋值为 '${value}'` };
      }
    }
  }, output);

}