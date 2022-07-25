import test from 'jtm';
import sync from 'typeq/sync';
import models from '../models/index.js';

const { tasks } = models;

const options = { client: 'default', schema: 'public' };

test('createTable', async t => {

   await sync(tasks).createTable(options);

});

test('rebuildTable', async t => {

   await sync(tasks).rebuildTable(options);

});


test('column', async t => {

   await sync(tasks).addColumn(options);

   await sync(tasks).removeColumn(options);

});


test('index', async t => {

   await sync(tasks).creatSequence(options);

   await sync(tasks).uniqueIndex(options);

});

test('comment', async t => {

   await sync(tasks).creatComment(options);

});