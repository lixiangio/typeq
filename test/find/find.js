import test from 'jtm';
import { operator, models } from 'typeq';
import { Schema, Utility, object, string } from 'typea';
const { union } = Utility;
const { $as } = operator;
const { tasks } = models;
const options = {
    client: "default",
    schema: 'public',
    table: 'tasks',
    partition: '01'
};
test('select', async (t) => {
    const result = await tasks(options)
        .select('id', 'keywords', 'list', $as("area", "xx"), 'createdAt')
        .offset(1)
        .limit(3);
    const schema = new Schema([
        ...object({
            id: Number,
            keywords: Object,
            xx: union(string, null),
        })
    ]);
    const { value, error } = schema.verify(result);
    t.ok(value, error);
});
test('_return', async (t) => {
    const result = await tasks(options)
        .find({ "uid": 6 })
        .limit(2)
        .order({
        "id": "desc",
        "keywords": "desc"
    })
        ._return('keywords', 'createdAt');
    const schema = new Schema([
        ...object({
            id: Number,
            uid: 6,
            list: [...object],
            area: String,
            modes: {},
            state: false
        })
    ]);
    const { value, error } = schema.verify(result);
    t.ok(value, error);
});
