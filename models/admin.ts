import { Schema, Model } from 'typeq';
import email from 'typeq/types/email.js';
import mobilePhone from 'typeq/types/mobilePhone.js';

const { integer, string, char } = Schema.types;

export const admin = new Schema({
   id: integer({ primaryKey: true }),
   name: char({
      uniqueIndex: true,
      comment: "名称"
   }),
   address: [string],
   mobilePhone: mobilePhone({ uniqueIndex: true }),
   email: email({ uniqueIndex: true }),
});

export default new Model('admin', admin);
