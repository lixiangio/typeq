import test from 'jtm';
import { Schema } from 'typea';
import { operator } from 'typeq';
import models from '../../models/index.js';

const { tasks } = models;
const { $merge } = operator;

test('update $merge', async t => {

  const result = await tasks
    .updatePk(1)
    .set({
      "keywords": $merge({
        "area": "5'68",
        "state": false
      })
    })
    .return('id', 'keywords');

  const types = new Schema({
    id: Number,
    keywords: {
      "area": String,
      "state": Boolean
    }
  });

  const { value, error } = types.verify(result);

  t.ok(value, error);

})