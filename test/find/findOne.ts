import test from 'jtm';
import { Schema } from 'typea';
import { models } from 'typeq';

const { tasks } = models;

const schema = new Schema({
   id: Number,
   keywords: Object,
   // email: String,
   area: String,
   state: Boolean,
   // createdAt: String,
   // updatedAt: String,
   list: Array
});

test('findOne', async t => {

   const result = await tasks
      .findOne({ id: 1, })
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