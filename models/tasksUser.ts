import { VSchema, VModel } from 'typeq';
import tasks from './tasks.js';
import user from './user.js';

const vschema = new VSchema({
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
}, { a: tasks, b: user });

export default new VModel('tasksUser', vschema, 'a innerJoin b on a.uid === b.id');
