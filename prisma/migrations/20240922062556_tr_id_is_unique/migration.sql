/*
  Warnings:

  - A unique constraint covering the columns `[transactionID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "transactionID" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_transactionID_key" ON "User"("transactionID");
