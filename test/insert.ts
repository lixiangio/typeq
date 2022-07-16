import test from 'jtm';
import { Schema } from 'typea';
import { models } from 'typeq';
import { tasks0, tasks1, tasks2 } from '../data/tasks.js';
import { admin0 } from '../data/admin.js';

const { tasks, admin } = models;

const options = { schema: 'public' };

test('insert', async t => {

  const [item] = await tasks(options)
    .insert(tasks0)
    .return('id');

  t.ok(item.id);

});

test('insert multiple', async t => {

  const result = await tasks(options)
    .insert(tasks0, tasks2)
    .return('id', 'uid');

  const schema = new Schema([
    { id: Number, uid: 6 },
    { id: Number, uid: 6 }
  ])

  const { value, error } = schema.verify(result);

  t.ok(value, error);

});

test('insert admin', async t => {

  const result = await admin(options)
    .insert(admin0)
    .return('id', 'name')

  const schema = new Schema({ id: Number, name: String })

  const { value, error } = schema.verify(result[0])

  t.ok(value, error);

});

test('insert conflict nothing', async t => {

  const result = await tasks(options)
    .insert(tasks1)
    .conflict("id");

    t.ok(result.length === 0);

});

test('insert conflict update', async t => {

  const result = await tasks(options)
    .insert(tasks1)
    .conflict("id", true)

  const schema = new Schema({ id: Number });

  const { value, error } = schema.verify(result[0])

  t.ok(value, error);

});


test('insert return', async t => {

  const result = await tasks()
    .insert(tasks2)
    .return('uid', 'state')

  const schema = new Schema({
    uid: Number,
    state: Boolean
  });

  const { value, error } = schema.verify(result[0]);

  t.ok(value, error);

});
