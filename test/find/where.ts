import test from 'jtm';
import { Schema, object } from 'typea';
import { operator, models } from 'typeq';

const { tasks } = models;
const { $in, $as, $scope, $includes } = operator;

// console.log($in(565, 787)())

const schema = new Schema([
  ...object({
    id: Number,
    keywords: Object,
    xx: Boolean,
  })
]);

test('where.or.and', async t => {

  const result = await tasks
    .select('id', 'keywords', $as("state", "xx"))
    .where(
      {
        state: true,
        keywords: {}
      },
      {
        state: false
      }
    )
    .or({
      'id': 5,
      'state': false,
    })
    .and({ 'id': 5 })
    .or({ id: 5 })
    .limit(3);

  const { data, error } = schema.verify(result);

  t.ok(data, error);

})

test('or', async t => {

  const result = await tasks
    .select('id', 'keywords', $as("state", "xx"))
    .where({
      keywords: $includes({ state: false })
    })
    .or({ 'id': $in(50, 51) })
    .limit(3)
    .then(data => data)

  const { data, error } = schema.verify(result);

  t.ok(data, error);

})

test('$scope', async t => {

  const result = await tasks
    .select('id', 'keywords', $as("state", "xx"))
    .where({
      'id': $scope(1, 100),
      'state': true
    })
    .or({
      'id': 5,
      'state': false,
    })
    .limit(10);

  const { data, error } = schema.verify(result);

  t.ok(data, error);

})