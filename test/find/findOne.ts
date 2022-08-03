import test from 'jtm';
import { Schema, string, Utility } from 'typea';
import { tasks } from '../../models/index.js';

const { union } = Utility;

const schema = new Schema({
   id: Number,
   keywords: Object,
   email: union(string, null),
   area: String,
   state: Boolean,
   // createdAt: String,
   // updatedAt: String,
   list: Array
});

test('findOne', async t => {

   const result = await tasks
      .findOne({ id: 1 })
      .order({
         "id": "desc",
         "keywords": "desc"
      });

   t.ok(result.id === 1);

});


test('findOne()', async t => {

   const result = await tasks
      .findOne()
      .order({
         "id": "desc",
         "keywords": "desc"
      });

   const { error, data } = schema.verify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data);
   }

});