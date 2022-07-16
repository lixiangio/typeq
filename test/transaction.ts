// import test from 'jtm';
// import { Schema } from 'typea';
// import { createTransaction, operator, models, } from 'typeq';

// const schema = new Schema([{
//   id: Number,
//   keywords: Object,
//   xx: String,
// }])

// const { $in, $as } = operator;
// const { tasks } = models;

// test('transaction', async t => {

//   const transaction = await createTransaction();

//   const result = await tasks({ transaction })
//     .select('id', 'keywords', $as("area", "xx"), 'createdAt')
//     .offset(2)
//     .limit(3)

//   await tasks({ transaction })
//     .update({
//       // area: "11",
//       area: null,
//       state: true
//     })
//     .where({ "id": $in(6, 8, 9) })
//     .or({ "area": "11" })
//     .return("id", "area", "list", "keywords")

//   // transaction.rollback();
//   await transaction.commit();

//   const { value, error } = schema.verify(result);

//   t.ok(value, error);

// });
