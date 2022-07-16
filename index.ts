import { queue } from 'typeq';
import pgclient from 'typeq/pgclient';
import config from './config/localhost.js'
import  './models/index.js';

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
