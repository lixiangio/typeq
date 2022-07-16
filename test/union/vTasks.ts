// import test from 'jtm';
// import { Schema } from 'typea';
// import { models } from 'typeq';

// const { vTasks } = models;

// test('select', async t => {

//   const result = await vTasks()
//     .select('id', 'keywords', 'createdAt')
//     .offset(2)
//     .limit(3)

//   const schema = new Schema([{
//     id: Number,
//     keywords: Object,
//     xx: String,
//   }]);

//   const { value, error } = schema.verify(result);

//   t.ok(value, error);

// });

// test('insert', async t => {

//   const result = await vTasks()
//     .insert({
//       // 'id': 8,
//       'name': '小明',
//       'age': 10,
//       'image': './abc.jpg',
//       'phone': '1856666666',
//       'password': '12323',
//       'email': 'abs@xx.cc',
//     })

//   // console.log(result)

//   t.ok(result.id, result.error);

// });

