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
    '[{"address": [{"name": ' abc ',"createdAt": now(),"updatedAt": now()}],"test": {},"state": true,"createdAt": now(),"updatedAt": now()},{"address": [{"name": ' || now() || ',"createdAt": now(),"updatedAt": now()},{"name": ' pppp ',"createdAt": now(),"updatedAt": now()}],"test": {},"state": false,"createdAt": now(),"updatedAt": now()}]'::jsonb,
    now(),
    '{}'::jsonb,
    false,
    now(),
    now()
  )
RETURNING "id",
  "uid"