import { Type } from 'typeq';
import isMobilePhone from '../validator/isMobilePhone.js';
export const mobilePhone = Type('varchar(100)', {
    ...Type.baseMethods,
    type(value) {
        if (isMobilePhone(String(value), 'zh-CN')) {
            return { value: `'${value}'` };
        }
        else {
            return { error: `值必须为 mobile phone ，实际赋值为 '${value}'` };
        }
    }
});
