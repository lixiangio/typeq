import test from 'jtm';
import { operator, model } from 'typeq';

const { $insert } = operator;
const { tasks } = model;

test('update $insert', async t => {

   const result = await tasks
      .update({ id: 4 })
      .set({
         "area": '555',
         "list": $insert('list', "{0}", { "state": true })
      })

   t.ok(result.id);

   // console.log(result);

});
