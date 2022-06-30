import test from 'jtm';
import { operator, model } from 'typeq';

const { $insertFirst } = operator;
const { tasks } = model;

test('update $insertFirst', async t => {

   const result = await tasks
      .update({ id: 4 })
      .set({
         list: $insertFirst({
            "area": "ggg'gggg'gg",
            "state": false
         })
      });

   console.log(result.rowCount);

})