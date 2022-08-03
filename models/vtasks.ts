import { VModel, VSchema } from "typeq";
import tasks from './tasks.js'

const vschema = new VSchema({
  uid: "id",
  userid: "uid",
  keywords: "keywords",
  list: "list",
  area: "area",
  state: "state"
}, tasks);

export default new VModel('vtasks', vschema);
