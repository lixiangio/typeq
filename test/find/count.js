import test from 'jtm';
import { Schema } from 'typea';
import { models } from 'typeq';
const { tasks } = models;
test('find & count', async (t) => {
    const chain = tasks.find({ 'id': 1, });
    const count = chain.count(true);
    const result = await Promise.all([chain, count]);
    const schema = new Schema([
        [
            {
                id: 1,
                uid: Number,
                keywords: {
                    area: String,
                    state: Boolean
                },
                list: [...Object],
                area: String,
                state: Boolean,
                modes: {},
                ids: null
            }
        ],
        { count: 1 }
    ]);
    const { data, error } = schema.verify(result);
    t.ok(data, error);
});
test('count，仅统计总量', async (t) => {
    const result = await tasks
        .find({ 'id': 1, })
        .count();
    const schema = new Schema({ count: 1 });
    const { data, error } = schema.verify(result);
    t.ok(data, error);
});
