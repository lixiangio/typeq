import test from 'jtm';
import { client } from 'typeq';
import { Schema, object, string, boolean } from 'typea';
test('query insert', async (t) => {
    const result = await client().query(`INSERT INTO "public"."tasks" ("id","uid","keywords","list","area","modes","state","createdAt","updatedAt") VALUES (DEFAULT, 6, ('{"state":false}')::jsonb, ('[]')::jsonb, now(), '{}'::jsonb, false, DEFAULT, DEFAULT) RETURNING "id", "uid", "state"`);
    const schema = new Schema([
        ...object({
            id: Number,
            uid: Number,
            state: Boolean
        })
    ]);
    const { value, error } = schema.verify(result.rows);
    t.ok(value, error);
});
test('query select', async (t) => {
    const result = await client().query(`SELECT * FROM "tasks" WHERE id = 1 LIMIT 1`);
    const schema = new Schema([
        ...object({
            id: Number,
            uid: Number,
            state: boolean,
            keywords: {
                area: string,
                state: boolean
            },
            list: [...object],
        })
    ]);
    const { value, error } = schema.verify(result.rows);
    t.ok(value, error);
});
