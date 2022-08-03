import test from 'jtm';
import { strict as t } from 'assert';
import { Collection } from 'typeq';
import { tasks } from '../models/index.js';
import { tasks0 } from '../data/tasks.js';


test('collection sqls', async () => {

  const collection = new Collection();

  await tasks(collection)
    .insert(tasks0)
    .return('id');

  const [sql] = collection.sqls;

  t.ok(sql);

})

test('collection.query', async () => {

  const collection = new Collection();

  tasks(collection)
    .select('id', 'keywords', 'list', 'createdAt')
    .offset(1)
    .limit(1);

  tasks(collection).updatePk(1);

  const [r1, r2] = await collection.query();

  t.ok(r1.rows.length === 1 && r2.rows.length === 1);

})


test('collection.all', async () => {

  const collection = new Collection();

  tasks(collection)
    .select('id', 'keywords', 'list', 'createdAt')
    .offset(1)
    .limit(3);

  tasks(collection).updatePk(1);

  const sql = await collection.sql();

  t.ok(sql);

})
