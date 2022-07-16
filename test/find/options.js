import test from 'jtm';
import { Schema, object } from 'typea';
import { models } from 'typeq';
const { tasks } = models;
test('schema ', async (t) => {
    const options = { client: "default", schema: 'public', partition: '01' };
    const result = await tasks(options)
        .select('id', 'keywords')
        .limit(3);
    const schema = new Schema([
        ...object({
            id: Number,
            keywords: Object,
        })
    ]);
    const { error, data } = schema.verify(result);
    if (error) {
        throw TypeError(error);
    }
    else {
        t.ok(data);
    }
});
