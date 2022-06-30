import test from 'jtm';
import { Schema, object } from 'typea';
import { operator, models } from 'typeq';

const { $in, $as } = operator;
const { tasksUser } = models;

test('find', async t => {

   const result = await tasksUser({ schema: 'sz' })
      .find({
         'id': $in(50, 51),
         'keywords': {}
      })
      .limit(1)

   // console.log(result);

   const schema = new Schema([{
      id: Number,
      keywords: Object,
      xx: String,
   }])

   const { error, data } = schema.verify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data);
   }

})


test('select', async t => {

   const result = await tasksUser
      .find()
      .where({
         id: $in(50, 51),
         keywords: {}
      })
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .offset(0)
      .limit(3)
      .return(
         'id',
         'uid',
         'keywords',
         'image',
         'phone',
         $as("email", "xx"),
         'createdAt',
         'updatedAt'
      )

   // console.log(result);

   const schema = new Schema([{
      id: Number,
      keywords: Object,
      xx: String,
   }]);

   const { error, data } = schema.verify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})


test('order offset limit', async t => {

   const result = await tasksUser.find()
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .offset(0)
      .limit(3)

   const schema = new Schema([{
      id: Number,
      keywords: Object,
      xx: String,
   }]);

   const { error, data } = schema.verify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})

test('no select', async t => {

   const result = await tasksUser.find()
      .where({ "email": "adb@qq.com" })
      .order({
         "id": "desc",
         "keywords": "desc"
      })

   const schema = new Schema([
      ...object({ "email": "adb@qq.com" })
   ]);

   const { error, data } = schema.verify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})