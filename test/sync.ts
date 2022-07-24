import test from 'jtm';
import sync from 'typeq/sync';
import { models } from 'typeq';

const { tasks } = models;

test('sync', async t => {

   const options = { client: 'default', schema: 'public' };

   await sync(tasks).createTable(options);

   await sync(tasks).addColumn(options);

   // await sync(tasks).removeColumn(options);

   await sync(tasks).creatSequence(options);

});
