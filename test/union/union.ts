// import test from 'jtm';
// import { object, Schema } from 'typea';
// import { operator, models } from 'typeq';

// const schema = new Schema([
//    ...object({
//       id: Number,
//       keywords: Object,
//       email: String,
//       area: String,
//       state: Boolean,
//       createdAt: Date,
//       updatedAt: Date,
//       list: Array
//    })
// ]);

// const { $in, $as } = operator;
// const { tasksUser } = models;

// test('union', async t => {

//    const result = await tasksUser()
//       .select('id', 'keywords', $as("email", "xx"))
//       .where({
//          id: $in(50, 51),
//          keywords: {}
//       })
//       .or({
//          'id': 5,
//          'email': "adb@qq.com"
//       })
//       .and({
//          'id': 5,
//          "keywords": {}
//       })
//       .or({ 'id': 5 })
//       .limit(10)

//    const { error, data } = schema.verify(result);

//    if (error) {
//       throw TypeError(error);
//    } else {
//       t.ok(data)
//    }

// })