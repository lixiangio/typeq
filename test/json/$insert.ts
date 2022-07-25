import test from 'jtm';
import { operator } from 'typeq';
import models from '../../models/index.js';

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
