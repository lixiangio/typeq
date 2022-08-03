import test from 'jtm';
import { operator } from 'typeq';
import { tasks } from '../../models/index.js';

const { $insertFirst } = operator;

test('update $insertFirst', async t => {

   const result = await tasks
      .updatePk(1)
      .set({
         list: $insertFirst({
            "area": "ggg'gggg'gg",
            "state": false
         })
      })
      .return('id', 'list');

   console.log(result.id)

})