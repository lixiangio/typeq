import { VModel } from "typeq";
import tasks from './tasks.js'

export default new VModel({
  fields: {
    uid: "id",
    userid: "uid",
    keywords: "keywords",
    list: "list",
    area: "area",
    state: "state"
  },
  from: tasks
});
