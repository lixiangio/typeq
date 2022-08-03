import test from 'jtm';
import { Schema, Utility, object, string } from 'typea';
import { operator } from 'typeq';
import { tasks } from '../../models/index.js';

const { union } = Utility;
const { $as } = operator;

const options = {
  client: "default",
  schema: 'public',
  table: 'tasks',
  partition: '01'
};

test('select', async t => {

  const result = await tasks(options)
    .select('id', 'keywords', 'list', $as("area", "xx"), 'createdAt')
    .offset(1)
    .limit(3);

  const schema = new Schema([
    ...object({
      id: Number,
      keywords: Object,
      xx: union(string, null),
    })
  ]);

  const { value, error } = schema.verify(result);

  t.ok(value, error);

})

test('_return', async t => {

  const result = await tasks(options)
    .find({ "uid": 6 })
    .limit(2)
    .order({
      "id": "desc",
      "keywords": "desc"
    })
    ._return('keywords', 'createdAt');

  const schema = new Schema([
    ...object({
      id: Number,
      uid: Number,
      list: [...object],
      area: String,
      modes: {},
      state: Boolean
    })
  ]);

  const { value, error } = schema.verify(result);

  t.ok(value, error);

})
