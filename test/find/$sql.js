import test from 'jtm';
import { Schema, Utility } from 'typea';
import { models, operator } from 'typeq';
const { union } = Utility;
const { tasks } = models;
const { $sql } = operator;
test('sql', async (t) => {
    const result = await tasks.findOne({ id: $sql(`in(1, 120, '170')`) });
    // console.log(result)
    const schema = new Schema({
        id: Number,
        keywords: Object,
        // email: String,
        area: String,
        state: Boolean,
        // createdAt: union(Date, null),
        // updatedAt: union(Date, null),
        list: Array
    });
    const { error, data } = schema.verify(result);
    if (error) {
        throw TypeError(error);
    }
    else {
        t.ok(data);
    }
});
