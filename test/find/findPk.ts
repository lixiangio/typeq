import test from 'jtm';
import { Schema } from 'typea';
import { tasks } from '../../models/index.js';

const schema = new Schema({
   id: Number,
   keywords: Object,
})

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