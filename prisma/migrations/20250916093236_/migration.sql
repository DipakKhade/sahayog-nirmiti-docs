/*
  Warnings:

  - You are about to drop the `DOCUMENT` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `USER` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DOCUMENT" DROP CONSTRAINT "DOCUMENT_userId_fkey";

-- DropTable
DROP TABLE "DOCUMENT";

-- DropTable
DROP TABLE "USER";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "USER_TYPE" NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "vendorCode" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "purchaseOrderNo" TEXT NOT NULL,
    "partNo" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
