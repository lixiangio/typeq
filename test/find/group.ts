import test from 'jtm';
import { operator } from 'typeq';
import { tasks } from '../../models/index.js';

const { $in } = operator;

test('find group', async t => {

   const result = await tasks
      .find({
         id: $in(1, 34),
         // area: $in(
         //    "Kareem.Kerluke@yahoo.com",
         //    "Janae.Kiehn95@yahoo.com"
         // )
      })
      .group('area', 'id')
      .order({
         'id': "desc",
         "keywords": "desc"
      });

   t.ok(result[0]);

})