import test from 'jtm';
import { operator, model } from 'typeq';

const { tasks } = model;
const { $insertByPath, } = operator;

test('update $insertByPath', async t => {

   const result = await tasks
      .update({ id: 4 })
      .set({ list: $insertByPath('{1}', { "state": false }) })
      .or({ id: 4 })

   t.ok(result.id);

   // console.log(result);

})