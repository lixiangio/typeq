import { Schema, Model } from 'typeq';
import email from 'typeq/types/email.js';

const { integer, string } = Schema.types;

const schema = new Schema({
  'id': integer({ primaryKey: true }),
  'type': string({
    'comment': "用户类型",
    'optional': false,
    set(v: string) { return v; }
  }),
  'name': string({
    'comment': "用户名",
    'optional': false
  }),
  'age': integer({ comment: "年龄" }),
  'image': string({ comment: "头像" }),
  'phone': string({ comment: "手机号" }),
  'password': string({ comment: "密码" }),
  'email': email({ comment: "邮箱" }),
});

export default new Model('user', schema);
