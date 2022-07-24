import { createType } from 'typeq';
import isEmail from '../validator/isEmail.js';

interface Options {
  default?: string
  comment?: string,
  optional?: boolean
  uniqueIndex?: boolean
}

export function email(options: Options) {

  return createType('varchar(100)', options, {
    ...createType.baseMethods,
    type(value: string) {
      if (isEmail(String(value))) {
        return { value: `'${value}'` };
      } else {
        return { error: `值必须为 email 类型，实际赋值为 '${value}'` };
      }
    }
  },
    {
      /** 输出为 SQL */
      sql(value: unknown) { return { value }; },
      /** 输出为 JSON */
      json(value: string) { return { value }; }
    });

}