import test from 'jtm';
import { operator } from 'typeq';
import { Schema, object, string } from 'typea';
import models from '../../models/index.js';

const { tasks } = models;
const { $in } = operator;

const setData = {
  area: '11',
  keywords: {
    area: `7'7`,
    state: true
  },
  list: [
    {
      'state': true,
      'address': [
        {
          name: 'xx123'
        },
        {
          name: '666'
        }
      ]
    },
    {
      'id': 6,
      'state': true,
      'address': [
        {
          id: 99,
          name: 'xx123'
        },
        {
          name: '666'
        }
      ]
    }
  ],
  state: true
};

test('update', async t => {

  const result = await tasks
    .update({ "id": 1 })
    .set(setData);

  t.deepEqual(result, { rowCount: 1 });

})

test('update and or', async t => {

  const result = await tasks()
    .update({ "id": 1 })
    .and({ "id": $in(1, 8, 9) })
    .or({ "area": "11" })
    .set(setData)
    .return("id", "area", "list", "keywords")

  const schema = new Schema([
    ...object({
      id: Number,
      keywords: Object,
      area: string,
    })
  ]);

  const { value, error } = schema.verify(result);

  t.ok(value, error);

})

test('update().return()', async t => {

  const result = await tasks()
    .update({ "id": 7 })
    .set({
      area: "11",
      state: false
    })
    .return("id", "area", "list", "keywords")

  const schema = new Schema([
    ...object({
      id: Number,
      keywords: Object,
      area: string,
    })
  ]);

  const { value, error } = schema.verify(result);

  t.ok(value, error);

})

test('update()._return()', async t => {

  const result = await tasks
    .update({ "id": 1, "area": "11" })
    .set({
      area: "11",
      keywords: {
        area: `7'7`,
        state: true
      },
      state: true
    })
    ._return("keywords", 'uid', 'list', 'ids');

  const schema = new Schema([
    ...object({
      id: Number,
      area: string,
      modes: {},
      state: Boolean,
    })
  ]);

  const { value, error } = schema.verify(result);

  t.ok(value, error);

})