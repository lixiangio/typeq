import { operator, } from 'typeq';
const { $sql } = operator;
export const admin0 = {
    uid: 6,
    mobilePhone: '18555555556',
    // email: 'abs@xx.cc',
    area: $sql('now()'),
};
