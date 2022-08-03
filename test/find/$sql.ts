import test from 'jtm';
import { Schema, Utility, string } from 'typea';
import { operator } from 'typeq';
import { tasks } from '../../models/index.js';

const { union } = Utility;

const { $sql } = operator;

test('sql', async t => {

   const result = await tasks.findOne({ id: $sql(`in(1, 120, '170')`) });

   const schema = new Schema({
      id: Number,
      keywords: Object,
      email: string({ optional: true }),
      area: String,
      state: Boolean,
      // createdAt: union(Date, null),
      // updatedAt: union(Date, null),
      list: Array
   })

   const { error, data } = schema.verify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data);
   }

})