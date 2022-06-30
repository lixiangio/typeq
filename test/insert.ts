import test from 'jtm';
import { Schema } from 'typea';
import { models } from 'typeq';
import { tasks0, tasks1, tasks2 } from '../data/tasks.js';
import { admin0 } from '../data/admin.js';

const { tasks, admin } = models;

const options = { schema: 'public' };

test('insert', async t => {

  const result = await tasks(options)
    .insert(tasks0)
    .return('id', 'uid');

  t.ok(result.id);

});

test('insert multiple', async t => {

  const result = await tasks(options)
    .insert([tasks0, tasks2])
    .return('id', 'uid');

  const schema = new Schema([
    { id: Number, uid: 6 },
    { id: Number, uid: 6 }
  ])

  const { data, error } = schema.verify(result)

  t.ok(data, error);

});

test('insert admin', async t => {

  const result = await admin(options)
    .insert(admin0)
    .return('id', 'mobilePhone')

  const schema = new Schema({ id: Number, mobilePhone: String })

  const { data, error } = schema.verify(result)

  t.ok(data, error);

});

test('insert conflict pk', async t => {

  const result = await tasks(options)
    .insert(tasks1)
    .conflict()

  t.ok(result === null);

});

test('insert conflict nothing', async t => {

  const result = await tasks(options)
    .insert(tasks1)
    .conflict("id")

  t.ok(result === null);

});

test('insert conflict update', async t => {

  const result = await tasks(options)
    .insert(tasks1)
    .conflict("id", true)

  const schema = new Schema({ id: Number });

  const { data, error } = schema.verify(result)

  t.ok(data, error);

});


test('insert return', async t => {

  const result = await tasks()
    .insert(tasks2)
    .return('uid', 'state')

  const schema = new Schema({ uid: Number, state: Boolean });

  const { data, error } = schema.verify(result);

  t.ok(data, error);

});
