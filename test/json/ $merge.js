import test from 'jtm';
import { Schema, operator } from 'typea';
import { model } from 'typeq';

const { tasks } = model;
const { $merge } = operator;

test('update $merge', async t => {

   const result = await tasks
      .update({ id: 90 })
      .set({
         "keywords": $merge({
            "area": "5'68",
            "state": false
         })
      });

   const types = Schema({
      id: Number,
      keywords: Object,
      email: String,
      area: String,
      state: Boolean,
      createdAt: Date,
      updatedAt: Date,
      list: Array
   });

   const { error, data } = types.verify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data);
   }

})