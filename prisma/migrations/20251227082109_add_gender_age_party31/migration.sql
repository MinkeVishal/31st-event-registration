-- CreateTable
CREATE TABLE "party31User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT '',
    "age" INTEGER NOT NULL DEFAULT 0,
    "paymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "transactionID" TEXT,
    "token" TEXT NOT NULL DEFAULT '',
    "qrCode" TEXT NOT NULL DEFAULT '',
    "screenshot" TEXT NOT NULL DEFAULT '',
    "referral" TEXT NOT NULL DEFAULT '',
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "party31User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "party31User_email_key" ON "party31User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "party31User_phone_key" ON "party31User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "party31User_transactionID_key" ON "party31User"("transactionID");
