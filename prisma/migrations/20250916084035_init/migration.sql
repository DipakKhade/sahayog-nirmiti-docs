-- CreateEnum
CREATE TYPE "USER_TYPE" AS ENUM ('ADMIN', 'SUPPLIER');

-- CreateTable
CREATE TABLE "USER" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "USER_TYPE" NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "vendorCode" TEXT,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DOCUMENT" (
    "id" SERIAL NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "purchaseOrderNo" TEXT NOT NULL,
    "partNo" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DOCUMENT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_username_key" ON "USER"("username");

-- AddForeignKey
ALTER TABLE "DOCUMENT" ADD CONSTRAINT "DOCUMENT_userId_fkey" FOREIGN KEY ("userId") REFERENCES "USER"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
