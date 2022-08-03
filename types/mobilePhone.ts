import { createType, Schema, methodKey } from 'typeq';
import isMobilePhone from './validator/isMobilePhone.js';

const { outputs } = Schema.types.text;

const methods = {
  ...createType.baseMethods,
  type(value: string) {
    if (isMobilePhone(value, 'zh-CN')) {
      return { value };
    }
    else {
      return { error: `值必须为 mobile phone 类型，实际赋值为 '${value}'` };
    }
  }
}

export default function mobilePhone(options: {
  default?: string
  comment?: string,
  optional?: boolean
  uniqueIndex?: boolean
}) {

  return createType('varchar(100)', options, methods, outputs);

}

mobilePhone.outputs = outputs;
mobilePhone[methodKey] = methods.type;
Object.defineProperty(mobilePhone, 'name', { value: 'varchar(100)' });
