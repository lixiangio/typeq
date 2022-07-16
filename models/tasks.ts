import { Schema, Model } from "typeq";

const { integer, boolean, char, string, timestamp, optional, jsonb, email, isMobilePhone } = Schema.types;

export const schema = new Schema({
  id: integer({ primaryKey: true }),
  uid: integer({
    comment: "user id",
    uniqueIndex: true
  }),
  keywords: optional({
    state: boolean,
    area: char({
      comment: "地址",
      optional: true,
      length: 200
    }),
    createdAt: timestamp({ default: `' || now() || '` }),
  }),
  list: [
    {
      // id: integer({ sequence: true }),
      address: optional([
        {
          // id: integer({ sequence: true }),
          name: string({ min: 2, max: 10, }),
          createdAt: timestamp({ default: `' || now() || '` }),
          updatedAt: timestamp({ default: `' || now() || '` }),
        }
      ]),
      test: {},
      state: boolean,
      createdAt: timestamp({ default: `' || now() || '` }),
      updatedAt: timestamp({ default: `' || now() || '` }),
    }
  ],
  area: string({ comment: "地址" }),
  modes: {},
  // email,
  // ids: [integer({ min: 0, max: 100 })],
  state: boolean({ 'default': true }),
  createdAt: timestamp({ default: 'now()' }),
  updatedAt: timestamp({ default: 'now()' }),
});

// console.log(schema);

export default new Model('tasks', schema);
