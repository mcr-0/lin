/*
  Warnings:

  - You are about to drop the column `datetime` on the `Postback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Postback" DROP COLUMN "datetime",
ADD COLUMN     "og_datetime" TIMESTAMP(3);
