/*
  Warnings:

  - You are about to drop the column `verifiedById` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `processedById` on the `CheckOut` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CheckIn" DROP CONSTRAINT "CheckIn_verifiedById_fkey";

-- DropForeignKey
ALTER TABLE "CheckOut" DROP CONSTRAINT "CheckOut_processedById_fkey";

-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "verifiedById",
ADD COLUMN     "verifiedByOwnerId" TEXT,
ADD COLUMN     "verifiedByUserId" TEXT;

-- AlterTable
ALTER TABLE "CheckOut" DROP COLUMN "processedById",
ADD COLUMN     "processedByOwnerId" TEXT,
ADD COLUMN     "processedByUserId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "business_phone" TEXT,
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "permissions" JSONB,
ADD COLUMN     "tax_id" TEXT;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_verifiedByOwnerId_fkey" FOREIGN KEY ("verifiedByOwnerId") REFERENCES "PropertyOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckOut" ADD CONSTRAINT "CheckOut_processedByUserId_fkey" FOREIGN KEY ("processedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckOut" ADD CONSTRAINT "CheckOut_processedByOwnerId_fkey" FOREIGN KEY ("processedByOwnerId") REFERENCES "PropertyOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
