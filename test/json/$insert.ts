import test from 'jtm';
import { operator, models } from 'typeq';

const { $insert } = operator;
const { tasks } = models;

test('update $insert', async t => {

   const { id } = await tasks
      .updatePk(1)
      .set({
         "area": '555',
         "list": $insert('list', "{0}", { "state": true })
      })
      .return('id');

   t.ok(id === 1);

});
