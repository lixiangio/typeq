import test from 'jtm';
import { models, stop } from 'typeq';
import { tasks0 } from '../data/tasks.js';

const { tasks } = models;

test('stop insert', async t => {

  const tasksPromis = tasks
    .insert(tasks0)
    .return('id');

  const { SQL } = await stop(tasksPromis);

  t.ok(SQL);

})

test('stop find', async t => {

  const { SQL } = await stop(tasks
    .select('id', 'keywords', 'list', 'createdAt')
    .offset(1)
    .limit(3));

  t.ok(SQL);

})

test('stop update', async t => {

  const tasksPromis = tasks.updatePk(1);

  const { SQL } = await stop(tasksPromis);

  t.ok(SQL);

})