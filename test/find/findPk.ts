import test from 'jtm';
import { Schema } from 'typea';
import { models } from 'typeq';

const schema = new Schema({
   id: Number,
   keywords: Object,
})

const { tasks } = models;

test('findPk ', async t => {

   const result = await tasks({ "schema": "public" })
      .findPk(1)
      .return('id', 'keywords');

   const { error, data } = schema.verify(result)

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data);
   }

})