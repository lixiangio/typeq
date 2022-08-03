import test from 'jtm';
import { Schema, object } from 'typea';
import { tasks } from '../../models/index.js';

const { string } = Schema.types;

test('find & count', async t => {

   const findPromise = tasks.find({ 'id': 1, })

   const countPromise = findPromise.count(true);

   const [list, count] = await Promise.all([findPromise, countPromise]);

   t.deepEqual(count, { count: 1 });

   const schema = new Schema([
      {
         id: 1,
         uid: Number,
         keywords: {
            area: string({ optional: true }),
            state: Boolean
         },
         list: [...object],
         area: String,
         state: Boolean,
         modes: {},
      }
   ]);

   const { value, error } = schema.verify(list);

   t.ok(value, error);

})

test('count，仅统计总量', async t => {

   const result = await tasks
      .find({ 'id': 1, })
      .count()

   const schema = new Schema({ count: 1 });

   const { value, error } = schema.verify(result);

   t.ok(value, error);

})