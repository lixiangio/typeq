import test from 'jtm';
import { operator } from 'typeq';
import models from '../../models/index.js';

const { tasks } = models;
// const { $in, } = operator;

test('update', async t => {

  const result = await tasks
    .updatePk(1)
    .set({
      keywords: {
        area: '888',
        state: true
      },
      area: "11",
      state: true
    })

  t.ok(result.id, result.message);

})


test('updatePk null', async t => {

  const result = await tasks
    .updatePk(111111111)
    .set({
      keywords: {
        area: `888`,
        state: true
      },
      area: "11",
      state: true
    });

  t.ok(result === null);

});
