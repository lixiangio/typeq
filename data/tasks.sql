INSERT INTO "public"."tasks" (
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
    DEFAULT,
    '[{"id": ' || nextval('public.tasks_list') || ',"address": [{"id": ' || nextval('public.tasks_list') || ',"name": 111,"createdAt": now(),"updatedAt": now()}],"test": {},"state": true,"createdAt": now(),"updatedAt": now()},{"id": ' || nextval('public.tasks_list') || ',"address": [{"id": ' || nextval('public.tasks_list') || ',"name": X688df,"createdAt": now(),"updatedAt": now()},{"id": ' || nextval('public.tasks_list') || ',"name": pppp,"createdAt": now(),"updatedAt": now()}],"test": {},"state": false,"createdAt": now(),"updatedAt": now()}]'::jsonb,
    now(),
    '{}'::jsonb,
    false,
    now(),
    now()
  )
RETURNING "id", "uid"