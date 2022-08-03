import type { CTX } from './common.js';
import { Client } from './client.js';

export default function (client: Client) {

  client.insertQueue.push((ctx: CTX) => {

    const KEYS = ctx.KEYS.join(',');

    const VALUESARRAY = [];

    for (const item of ctx.VALUES) {
      VALUESARRAY.push(`(${item.join(', ')})`);
    }

    const VALUES = VALUESARRAY.join(', ');

    const { ON } = ctx;

    const RETURNING = ctx.RETURNING.length ? ` RETURNING ${ctx.RETURNING.join(', ')}` : '';

    const { schema, table } = ctx.options;

    ctx.SQL = `INSERT INTO "${schema}"."${table}" (${KEYS}) VALUES ${VALUES}${ON}${RETURNING}`;

  })

  client.findQueue.push((ctx: CTX) => {

    const SELECT = ctx.SELECT.length ? ctx.SELECT.join(', ') : '*';

    const WHERE = ctx.WHERE.length ? ` WHERE ${ctx.WHERE.join('')}` : '';

    const GROUP = ctx.GROUP.length ? ` GROUP BY ${ctx.GROUP.join(', ')}` : '';

    const ORDER = ctx.ORDER.length ? ` ORDER BY ${ctx.ORDER.join(', ')}` : '';

    const OFFSET = ctx.OFFSET ? ` OFFSET ${Number(ctx.OFFSET)}` : '';

    const LIMIT = ctx.LIMIT ? ` LIMIT ${Number(ctx.LIMIT)}` : '';

    const { schema, table } = ctx.options;

    ctx.SQL = `SELECT ${SELECT} FROM "${schema}"."${table}"${WHERE}${GROUP}${ORDER}${OFFSET}${LIMIT}`;

  })

  client.updateQueue.push((ctx: CTX) => {

    ctx.SET.push(`"updatedAt" = now()`);

    const SET = ctx.SET.join(', ');

    const WHERE = ctx.WHERE.length ? ` WHERE ${ctx.WHERE.join('')}` : '';

    const RETURNING = ctx.RETURNING.length ? ` RETURNING ${ctx.RETURNING.join(', ')}` : '';

    const { schema, table } = ctx.options;

    ctx.SQL = `UPDATE "${schema}"."${table}" SET ${SET}${WHERE}${RETURNING}`;

  })

  client.deleteQueue.push((ctx: CTX) => {

    const WHERE = ctx.WHERE.length ? ` WHERE ${ctx.WHERE.join('')}` : '';

    const RETURNING = ctx.RETURNING.length ? ` RETURNING ${ctx.RETURNING.join(', ')}` : '';

    const { schema, table } = ctx.options;

    ctx.SQL = `DELETE FROM "${schema}"."${table}"${WHERE}${RETURNING}`;

  })

}
