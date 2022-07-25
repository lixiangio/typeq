import test from 'jtm';
import { strict as t } from 'assert';
import { stopQuery } from 'typeq';
import models from '../models/index.js';
import { tasks0 } from '../data/tasks.js';

const { tasks } = models;

test('stop insert', async () => {

  const insertPromis = tasks
    .insert(tasks0)
    .return('id');

  await stopQuery(insertPromis);

  t.ok(insertPromis.ctx.SQL);

})

test('stop find', async () => {

  const ctx = await stopQuery(tasks
    .select('id', 'keywords', 'list', 'createdAt')
    .offset(1)
    .limit(3));

  t.ok(ctx.SQL);

})

test('stop update', async () => {

  const updatePromis = tasks.updatePk(1);

  await stopQuery(updatePromis);

  t.ok(updatePromis.ctx.SQL);

})