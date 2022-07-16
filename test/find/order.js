import test from 'jtm';
import { operator, models } from 'typeq';
const { $as } = operator;
const { tasks } = models;
test('order', async (t) => {
    const result = await tasks
        .select('id', 'keywords', $as("area", "xx"))
        .order({
        "id": "desc",
        "keywords": "desc"
    })
        .limit(3);
    // console.log(result)
    t.ok(result[0]);
});
