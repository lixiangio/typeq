import test from 'jtm';
import { Schema, Utility, object } from 'typea';
import { operator, models } from 'typeq';
const { union } = Utility;
const { $as } = operator;
const { tasks } = models;
test('select', async (t) => {
    const result = await tasks
        .select('id', 'keywords', $as("area", "xx"), 'createdAt')
        .offset(2)
        .limit(3);
    const schema = new Schema([
        ...object({
            id: Number,
            keywords: Object,
            xx: union(String, null),
        })
    ]);
    const { value, error } = schema.verify(result);
    t.ok(value, error);
});
