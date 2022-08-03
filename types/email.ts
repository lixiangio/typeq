import { createType, Schema, methodKey } from 'typeq';
import isEmail from './validator/isEmail.js';

const { outputs } = Schema.types.text;

const methods = {
  ...createType.baseMethods,
  type(value: string) {
    if (isEmail(value)) {
      return { value };
    } else {
      return { error: `值必须为 email 类型，实际赋值为 '${value}'` };
    }
  }
}

export default function email(options: {
  default?: string
  comment?: string,
  optional?: boolean
  uniqueIndex?: boolean
}) {

  return createType('varchar(100)', options, methods, outputs);

}

email.outputs = outputs;
email[methodKey] = methods.type;
Object.defineProperty(email, 'name', { value: 'varchar(100)' });
