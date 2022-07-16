import { queue } from 'typeq';
import pgclient from 'typeq/pgclient';
import user from './user.js';
import admin from './admin.js';
import tasks from './tasks.js';
import vtasks from './vtasks.js';
import tasksUser from './tasksUser.js';
import config from '../config/localhost.js'

export default {
  user,
  admin,
  tasks,
  vtasks,
  tasksUser
};

// queue.before(ctx => {
//   console.log('before');
// })

queue.insert(ctx => {
  console.log(`\x1b[33m[PGSQL] ${ctx.SQL}\x1b[39m`);
})

queue.find(ctx => {
  console.log(`\x1b[33m[PGSQL] ${ctx.SQL}\x1b[39m`);
})

queue.update(ctx => {
  console.log(`\x1b[33m[PGSQL] ${ctx.SQL}\x1b[39m`);
})

queue.delete(ctx => {
  console.log(`\x1b[33m[PGSQL] ${ctx.SQL}\x1b[39m`);
})

// queue.after(ctx => {
//   console.log(`\x1b[33m[SQL] ${ctx.SQL}\x1b[39m`);
// })

queue.use(pgclient(config));
