-- CreateTable
CREATE TABLE "tones" (
    "tone_id" SERIAL NOT NULL,
    "tone_name" TEXT NOT NULL,
    "tone_prompt" TEXT NOT NULL,
    "tone_strength" INTEGER NOT NULL DEFAULT 50,
    "emoji_allowed" BOOLEAN NOT NULL DEFAULT true,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tones_pkey" PRIMARY KEY ("tone_id")
);

-- CreateTable
CREATE TABLE "user_tone_overrides" (
    "override_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "preset_key" INTEGER,
    "tone_name" TEXT,
    "tone_prompt" TEXT,
    "tone_strength" INTEGER,
    "emoji_allowed" BOOLEAN,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_tone_overrides_pkey" PRIMARY KEY ("override_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tones_tone_name_key" ON "tones"("tone_name");

-- CreateIndex
CREATE INDEX "user_tone_overrides_user_id_idx" ON "user_tone_overrides"("user_id");

-- CreateIndex
CREATE INDEX "user_tone_overrides_preset_key_idx" ON "user_tone_overrides"("preset_key");

-- AddForeignKey
ALTER TABLE "user_tone_overrides" ADD CONSTRAINT "user_tone_overrides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tone_overrides" ADD CONSTRAINT "user_tone_overrides_preset_key_fkey" FOREIGN KEY ("preset_key") REFERENCES "tones"("tone_id") ON DELETE SET NULL ON UPDATE CASCADE;
