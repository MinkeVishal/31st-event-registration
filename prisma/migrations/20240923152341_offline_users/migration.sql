-- CreateTable
CREATE TABLE "offlineUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "division" TEXT NOT NULL DEFAULT '',
    "branch" TEXT NOT NULL DEFAULT '',
    "rollNo" TEXT NOT NULL DEFAULT '',
    "paymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "transactionID" TEXT,
    "token" TEXT NOT NULL DEFAULT '',
    "qrCode" TEXT NOT NULL DEFAULT '',
    "screenshot" TEXT NOT NULL DEFAULT '',
    "volenteer" TEXT NOT NULL DEFAULT '',
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offlineUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "offlineUser_email_key" ON "offlineUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "offlineUser_phone_key" ON "offlineUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "offlineUser_transactionID_key" ON "offlineUser"("transactionID");
