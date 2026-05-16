CREATE TABLE IF NOT EXISTS "operational_config" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "operational_config_pkey" PRIMARY KEY ("key")
);
