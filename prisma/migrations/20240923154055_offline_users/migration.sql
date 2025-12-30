/*
  Warnings:

  - You are about to drop the column `qrCode` on the `offlineUser` table. All the data in the column will be lost.
  - You are about to drop the column `screenshot` on the `offlineUser` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `offlineUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "offlineUser" DROP COLUMN "qrCode",
DROP COLUMN "screenshot",
DROP COLUMN "token";
