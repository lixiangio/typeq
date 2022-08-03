import { Schema, Model } from "typeq";
import email from 'typeq/types/email.js';
import mobilePhone from 'typeq/types/mobilePhone.js';

const { integer, boolean, char, text, timestamp, optional } = Schema.types;

const schema = new Schema({
  id: integer({ primaryKey: true }),
  uid: integer({
    comment: "user id",
    uniqueIndex: true
  }),
  keywords: {
    state: boolean,
    area: char({
      comment: "地址",
      optional: true,
      length: 200
    }),
    createdAt: timestamp({ default: 'now()' }),
  },
  list: [
    {
      id: integer({
        sequence: 'list.$.id',
        comment: "自增序列",
      }),
      address: optional([
        {
          id: integer({ sequence: 'list.$.address.$.id' }),
          name: text({ min: 2, max: 10, }),
          createdAt: timestamp({ default: 'now()' }),
          updatedAt: timestamp({ default: 'now()' }),
        }
      ]),
      state: boolean,
      createdAt: timestamp({ default: 'now()' }),
      updatedAt: timestamp({ default: 'now()' }),
    }
  ],
  area: text({
    comment: "地址",
    set(v: string) { return v; }
  }),
  modes: {},
  email: email({
    optional: true,
    uniqueIndex: true,
  }),
  mobilePhone: mobilePhone({ optional: true }),
  ids: [integer({ min: 0, max: 100 })],
  state: boolean({ 'default': true }),
  createdAt: timestamp({ default: 'now()' }),
  updatedAt: timestamp({ default: 'now()' }),
});

export default new Model('tasks', schema);
