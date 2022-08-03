import test from 'jtm';
import { operator } from 'typeq';
import { tasks } from '../../models/index.js';

const { $insert } = operator;

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
