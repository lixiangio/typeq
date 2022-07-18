import test from 'jtm';
import { operator, models } from 'typeq';

const { tasks } = models;
const { $insertByPath, } = operator;

test('update $insertByPath', async t => {

   const result = await tasks
      .updatePk(1)
      .set({ list: $insertByPath('{1}', { "state": false }) })
      .or({ id: 4 });

   t.ok(result.id);

})