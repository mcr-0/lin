/*
  Warnings:

  - A unique constraint covering the columns `[xata_id]` on the table `Postback` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Postback" ADD COLUMN     "createdat" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
ADD COLUMN     "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_version" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "offer_id" DROP NOT NULL,
ALTER COLUMN "session_ip" DROP NOT NULL,
ALTER COLUMN "payout" DROP NOT NULL,
ALTER COLUMN "datetime" DROP NOT NULL,
ALTER COLUMN "datetime" DROP DEFAULT,
ALTER COLUMN "datetime" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Postback__pgroll_new_xata_id_key" ON "Postback"("xata_id");
