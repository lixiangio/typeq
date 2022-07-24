import { VModel } from "typeq";
import tasks from './tasks.js'

export default new VModel(tasks, {
  uid: "id",
  userid: "uid",
  keywords: "keywords",
  list: "list",
  area: "area",
  state: "state"
});
