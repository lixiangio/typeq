import test from 'jtm';
import { Schema, object } from 'typea';
import { operator, Transaction } from 'typeq';
import { tasks } from '../models/index.js';

const schema = new Schema([
  ...object({
    id: Number,
    keywords: Object,
    xx: String,
  })
]);

const { $in, $as } = operator;

test('transaction', async t => {

  const transaction = new Transaction('default');

  await transaction.connect();

  const result = await tasks(transaction)
    .select('id', 'keywords', $as("area", "xx"), 'createdAt')
    .offset(2)
    .limit(3);

  await tasks(transaction)
    .update({
      // area: "11",
      area: '123',
      state: true
    })
    .and({ "id": $in(6, 8, 9) })
    .or({ "area": "11" })
    .return("id", "area", "list", "keywords");

  // await transaction.rollback();

  await transaction.commit();

  transaction.release();

  const { value, error } = schema.verify(result);

  t.ok(value, error);

});
