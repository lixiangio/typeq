import test from 'jtm';
import { Schema } from 'typea';
import { operator } from 'typeq';
import models from '../models/index.js';
import { tasks2 } from '../data/tasks.js';

const { tasks } = models;
const { $in } = operator;

test('delete', async t => {

   const [{ id }] = await tasks
      .insert(tasks2)
      .return('id');

   const result = await tasks.delete({ id });

   t.deepEqual(result, { rowCount: 1 });

})

test('delete $in', async t => {

   const insertData = await tasks
      .insert(tasks2, tasks2, tasks2)
      .return('id');

   const [a, b, c] = insertData;

   const result = await tasks
      .delete({ id: $in(a.id, b.id, c.id) })
      .or({ id: 3 })
      .return('id');

   t.deepEqual(insertData, result);

})

test('deletePk', async t => {

   const [{ id }] = await tasks
      .insert(tasks2)
      .return('id');

   const result: any = await tasks
      .deletePk(id);

   t.deepEqual(result.id, id);

})

test('deletePk null', async t => {

   const result = await tasks.deletePk(99999999);

   t.deepEqual(result, null);

})

test('deletePk & return', async t => {

   const [{ id }] = await tasks.insert(tasks2);

   const result = await tasks
      .deletePk(id)
      .return('id', 'uid', 'state')

   const schema = new Schema({
      id: Number,
      uid: Number,
      state: Boolean
   });

   const { value, error } = schema.verify(result)

   t.ok(value, error);

})

test('deletePk & _return', async t => {

   const [{ id }] = await tasks
      .insert(tasks2)
      .return('id');

   const result = await tasks
      .deletePk(id)
      ._return('uid', 'state', "createdAt", "updatedAt");

   const schema = new Schema({
      id: Number,
      keywords: { state: false },
      list: [],
      area: String,
      modes: {},
   });

   const { value, error } = schema.verify(result)

   t.ok(value, error);

});
