import test from 'jtm';
import { strict as t } from 'assert';
import { models, stopQuery } from 'typeq';
import { tasks0 } from '../data/tasks.js';

const { tasks } = models;

test('stop insert', async () => {

  const tasksPromis = tasks
    .insert(tasks0)
    .return('id');

  const ctx = await stopQuery(tasksPromis);

  t.ok(ctx.SQL);

})

test('stop find', async () => {

  const ctx = await stopQuery(tasks
    .select('id', 'keywords', 'list', 'createdAt')
    .offset(1)
    .limit(3));

  t.ok(ctx.SQL);

})

test('stop update', async () => {

  const tasksPromis = tasks.updatePk(1);

  const ctx = await stopQuery(tasksPromis);

  t.ok(ctx.SQL);

})