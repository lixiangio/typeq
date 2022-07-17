import test from 'jtm';
import { operator, models } from 'typeq';

const { $insertFirst } = operator;
const { tasks } = models;

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