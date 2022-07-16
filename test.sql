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
    json(
      '{"state": false,"area": "\k''kkk"k<script
         type="text/javascript" src="/app.js"></script>","createdAt": "' || now() || '"}'
    ),
    json(
      '[{"address": [{"name": "aa","createdAt": "' || now() || '","updatedAt": "' || now() || '"}],"state": true,"createdAt": "' || now() || '","updatedAt": "' || now() || '"},{"address": [{"name": "now()","createdAt": "' || now() || '","updatedAt": "' || now() || '"},{"name": "bbbb","createdAt": "' || now() || '","updatedAt": "' || now() || '"}],"state": false,"createdAt": "' || now() || '","updatedAt": "' || now() || '"}]'
    ),
    'xxx',
    '{}'::jsonb,
    false,
    now(),
    now()
  )
RETURNING "id"