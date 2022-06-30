import test from 'jtm';
import { client } from 'typeq';
import { Schema, object, string } from 'typea';

test('query insert', async t => {

   const result = await client().query(`INSERT INTO "public"."tasks" ("id","uid","keywords","list","area","modes","state","createdAt","updatedAt") VALUES (DEFAULT, 6, ('{"state":false}')::jsonb, ('[]')::jsonb, now(), '{}'::jsonb, false, DEFAULT, DEFAULT) RETURNING "id", "uid", "state"`);

   const schema = new Schema([
      ...object({
         id: Number,
         uid: Number,
         state: Boolean
      })
   ]);

   const { data, error } = schema.verify(result.rows)

   t.ok(data, error);

})

test('query select', async t => {

   const result = await client().query(`SELECT * FROM "tasks" WHERE id = 1 LIMIT 1`);

   const schema = new Schema([
      ...object({
         id: Number,
         uid: Number,
         state: Boolean,
         keywords: {
            area: string,
            state: false
         },
         list: [...object],
      })
   ]);

   const { data, error } = schema.verify(result.rows)

   t.ok(data, error);

})

test('test', async t => {

   const result = await client().query(`INSERT INTO "public"."tasks" (
      "id",
      "uid",
      "keywords",
      "list",
      "area",
      "modes",
      "state",
      "createdAt",
      "updatedAt"
    )
  VALUES (
      DEFAULT,
      6,
      '{}'::jsonb,
      '[{"id": ' || nextval('public.tasks_list') || ',"address":  [{"id": ' || nextval('public.tasks_list') || ',"name": 111,"createdAt": now(),"updatedAt": now()}] ,"test": {},"state": true,"createdAt": now(),"updatedAt": now()},{"id": ' || nextval('public.tasks_list') || ',"address": [{"id": ' || nextval('public.tasks_list') || ',"name": X688df,"createdAt": now(),"updatedAt": now()},{"id": ' || nextval('public.tasks_list') || ',"name": pppp,"createdAt": now(),"updatedAt": now()}] ,"test": {},"state": false,"createdAt": now(),"updatedAt": now()}]'::jsonb,
      now(),
      '{}'::jsonb,
      false,
      now(),
      now()
    )
  RETURNING "id",
    "uid"`);


   console.log(result)

   t.ok(result);

})

