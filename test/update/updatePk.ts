import test from 'jtm';
import { models, operator } from 'typeq';

const { tasks } = models;
// const { $in, } = operator;

test('update', async t => {

  const result = await tasks
    .updatePk(6)
    .set({
      keywords: {
        area: `888`,
        state: true
      },
      // area: "11",
      area: null,
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
      // area: "11",
      area: null,
      state: true
    });

  t.ok(result === null);

});
