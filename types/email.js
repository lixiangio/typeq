import { Type } from 'typeq';
import isEmail from '../validator/isEmail.js';
export const email = Type('varchar(100)', {
    ...Type.baseMethods,
    type(value) {
        if (isEmail(String(value))) {
            return { value: `'${value}'` };
        }
        else {
            return { error: `值必须为 email 类型，实际赋值为 '${value}'` };
        }
    }
});
