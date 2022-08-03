import test from 'jtm';
import Sync from 'typeq/sync';
import { tasks, admin } from '../models/index.js';

const options = { client: 'default', schema: 'public' };

const tasksSync = new Sync(tasks);

test('sync table', async t => {

   await tasksSync.createTable(options);

});


// 危险操作，重构模式会强制删除表结构，清空表内数据
// test('rebuild table', async t => {

//    await tasksSync.rebuildTable(options);

// });


test('sync column', async t => {

   await tasksSync.addColumn(options);
   await tasksSync.removeColumn(options);

   const adminSync = new Sync(admin);

   await adminSync.addColumn(options);
   await adminSync.removeColumn(options);

});

test('sync unique index', async t => {

   await tasksSync.creatSequence(options);
   await tasksSync.uniqueIndex(options);

});

test('sync comment', async t => {

   await tasksSync.creatComment(options);

});
