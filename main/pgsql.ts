import Queue from './queue.js';

export default function (queue: typeof Queue) {

  queue.insert(ctx => {

    const { schema, table } = ctx.options;

    const KEYS = ctx.KEYS.join(',');

    const VALUESARRAY = [];

    for (const item of ctx.VALUES) {
      VALUESARRAY.push(`(${item.join(', ')})`);
    }

    const VALUES = VALUESARRAY.join(', ');

    const { ON } = ctx;

    const RETURNING = ctx.RETURNING.length ? ` RETURNING ${ctx.RETURNING.join(', ')}` : '';

    ctx.SQL = `INSERT INTO "${schema}"."${table}" (${KEYS}) VALUES ${VALUES}${ON}${RETURNING}`;

  })

  queue.find(ctx => {

    const { schema, table } = ctx.options;

    const SELECT = ctx.SELECT.length ? ctx.SELECT.join(', ') : '*';

    const WHERE = ctx.WHERE.length ? ` WHERE ${ctx.WHERE.join('')}` : '';

    const GROUP = ctx.GROUP.length ? ` GROUP BY ${ctx.GROUP.join(', ')}` : '';

    const ORDER = ctx.ORDER.length ? ` ORDER BY ${ctx.ORDER.join(', ')}` : '';

    const OFFSET = ctx.OFFSET ? ` OFFSET ${Number(ctx.OFFSET)}` : '';

    const LIMIT = ctx.LIMIT ? ` LIMIT ${Number(ctx.LIMIT)}` : '';

    ctx.SQL = `SELECT ${SELECT} FROM "${schema}"."${table}"${WHERE}${GROUP}${ORDER}${OFFSET}${LIMIT}`;

  })

  queue.update(ctx => {

    ctx.SET.push(`"updatedAt" = now()`);

    const SET = ctx.SET.join(', ');

    const WHERE = ctx.WHERE.length ? ` WHERE ${ctx.WHERE.join('')}` : '';

    const RETURNING = ctx.RETURNING.length ? ` RETURNING ${ctx.RETURNING.join(', ')}` : '';

    const { schema, table } = ctx.options;

    ctx.SQL = `UPDATE "${schema}"."${table}" SET ${SET}${WHERE}${RETURNING}`;

  })

  queue.delete(ctx => {

    const WHERE = ctx.WHERE.length ? ` WHERE ${ctx.WHERE.join('')}` : '';

    const RETURNING = ctx.RETURNING.length ? ` RETURNING ${ctx.RETURNING.join(', ')}` : '';

    const { schema, table } = ctx.options;

    ctx.SQL = `DELETE FROM "${schema}"."${table}"${WHERE}${RETURNING}`;

  })

}
