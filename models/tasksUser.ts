import { VModel } from 'typeq';
import tasks from './tasks.js';
import user from './user.js';

export default new VModel({
   fields: {
      tid: "a.id",
      keywords: "a.keywords",
      list: "a.list",
      area: "a.area",
      state: "a.state",
      createdAt: "a.createdAt",
      uid: "b.id",
      name: "b.name",
      image: "b.image",
      phone: "b.phone",
      email: "b.email",
      userAge: "b.age",
      userCreatedAt: "b.createdAt",
   },
   from: { a: tasks, b: user },
   join: 'innerJoin',
   on: { 'a.uid': 'b.id' }
});

// 'tasks as a innerJoin user as b on a.uid === b.id'
