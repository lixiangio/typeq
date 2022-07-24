CREATE TABLE IF NOT EXISTS "public"."tasks" (
  "id" SERIAL,
  PRIMARY KEY ("id"),
  "uid" integer,
  "keywords" object DEFAULT '{}'::jsonb,
  "list" jsonb DEFAULT '[]'::jsonb,
  "area" varchar,
  "modes" object DEFAULT '{}'::jsonb,
  "state" boolean DEFAULT true,
  "createdAt" timestamp DEFAULT now(),
  "updatedAt" timestamp DEFAULT now()
);