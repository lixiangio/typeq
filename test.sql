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
      '{"state": false,"area": "\\k''k''kk\"k<script\n\t type=\"text/javascript\" src=\"/app.js\"></script>","createdAt": "' || now() || '"}'
    ),
    json(
      '[{"address": [{"name": "aa","createdAt": "' || now() || '","updatedAt": "' || now() || '"}],"test": {},"state": true,"createdAt": "' || now() || '","updatedAt": "' || now() || '"},{"address": [{"name": "' || now() || '","createdAt": "' || now() || '","updatedAt": "' || now() || '"},{"name": "bbbb","createdAt": "' || now() || '","updatedAt": "' || now() || '"}],"test": {},"state": false,"createdAt": "' || now() || '","updatedAt": "' || now() || '"}]'
    ),
    'xxx',
    '{}'::jsonb,
    false,
    now(),
    now()
  )
RETURNING *