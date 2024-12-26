/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `SMSToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SMSToken_phone_key" ON "SMSToken"("phone");
