-- AlterTable
ALTER TABLE "User" ADD COLUMN     "branch" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "division" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "paymentStatus" BOOLEAN NOT NULL DEFAULT false;
