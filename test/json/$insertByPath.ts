import test from 'jtm';
import { operator } from 'typeq';
import { tasks } from '../../models/index.js';

const { $insertByPath, } = operator;

test('update $insertByPath', async t => {

   const result = await tasks
      .updatePk(1)
      .set({ list: $insertByPath('{1}', { "state": false }) })
      .or({ id: 4 });

   t.ok(result.id);

})