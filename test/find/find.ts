import test from 'jtm';
import { Schema, Utility, object, string } from 'typea';
import { operator, models } from 'typeq';

const { union } = Utility;

const { $as } = operator;
const { tasks } = models;

const options = {
  client: "default",
  schema: 'public',
  table: 'tasks',
  partition: '01'
};

test('return', async t => {

  const result = await tasks(options)
    .find()
    .offset(1)
    .limit(3)
    .return('id', 'keywords', 'list', $as("area", "xx"), 'createdAt');

  const schema = new Schema([
    ...object({
      id: Number,
      keywords: Object,
      xx: union(string, null),
    })
  ]);

  const { data, error } = schema.verify(result);

  t.ok(data, error);

})

test('_return', async t => {

  const result = await tasks(options)
    .find({ "uid": '6' })
    .limit(2)
    .order({
      "id": "desc",
      "keywords": "desc"
    })
    ._return('keywords', 'createdAt')

  const schema = new Schema([
    ...object({
      id: Number,
      uid: 6,
      list: [],
      area: String,
      modes: {},
      state: false
    })
  ]);

  const { data, error } = schema.verify(result);

  t.ok(data, error);

})
