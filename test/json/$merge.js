import test from 'jtm';
import { Schema } from 'typea';
import { models, operator } from 'typeq';
const { tasks } = models;
const { $merge } = operator;
test('update $merge', async (t) => {
    const result = await tasks
        .update({ id: 1 })
        .set({
        "keywords": $merge({
            "area": "5'68",
            "state": false
        })
    });
    console.log(result);
    const types = new Schema({
        id: Number,
        keywords: Object,
        email: String,
        area: String,
        state: Boolean,
        createdAt: Date,
        updatedAt: Date,
        list: Array
    });
    const { error, data } = types.verify(result);
    t.ok(data, error);
});
