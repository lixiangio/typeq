import { Client } from 'typeq';
import pgclient from '@typeq/pg';
import './models/index.js';

const configs = {
  'default': {
    host: 'localhost',
    database: 'test',
    username: 'postgres',
    password: 'M2Idiftre&34FS',
    port: 5532,
  },
  'user': {
    host: 'localhost',
    database: 'user',
    username: 'postgres',
    password: 'M2Idiftre&34FS',
    port: 5532,
  }
};

for (const name in configs) {

  const config = configs[name];
  const client = new Client(name, pgclient(config));

  // client.before(ctx => {
  //   console.log('before');
  // });

  client.after(ctx => {
    console.log(`\x1b[33m[PGSQL] ${ctx.SQL}\x1b[39m`);
  });

}
