import { operator } from 'typeq';

const { $sql } = operator;

const random = Math.trunc(Math.random() * 10000);

export const admin0 = {
  uid: 6,
  name: `dog ${random}`,
  mobilePhone: `18555551111`,
  email: `${random}abs@xx.cc`,
  area: $sql('now()'),
}