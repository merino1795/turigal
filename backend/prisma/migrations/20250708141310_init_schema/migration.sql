/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "preferred_language" TEXT NOT NULL DEFAULT 'es',
ADD COLUMN     "profile_image_url" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "PropertyOwner" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "companyName" TEXT,
    "contactName" TEXT NOT NULL,
    "phone" TEXT,
    "taxId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "permissions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "propertyType" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "totalRooms" INTEGER NOT NULL DEFAULT 1,
    "maxGuests" INTEGER NOT NULL,
    "amenities" JSONB,
    "houseRules" TEXT,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "qrCodeData" TEXT NOT NULL,
    "images" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "roomType" TEXT,
    "maxGuests" INTEGER NOT NULL DEFAULT 2,
    "pricePerNight" DECIMAL(65,30),
    "qrCodeData" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "roomId" TEXT,
    "bookingReference" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "guestsCount" INTEGER NOT NULL,
    "guestDetails" JSONB,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "bookingStatus" TEXT NOT NULL DEFAULT 'confirmed',
    "specialRequests" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "checkInTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "identityDocumentUrl" TEXT,
    "selfieUrl" TEXT,
    "digitalSignature" TEXT,
    "deviceInfo" JSONB,
    "locationCoordinates" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "verifiedById" TEXT,
    "notes" TEXT,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckOut" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "checkInId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "checkOutTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roomConditionPhotos" JSONB,
    "damagesReported" TEXT,
    "additionalCharges" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "guestSignature" TEXT,
    "staffNotes" TEXT,
    "processedById" TEXT NOT NULL,

    CONSTRAINT "CheckOut_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "cleanlinessRating" INTEGER NOT NULL,
    "locationRating" INTEGER NOT NULL,
    "valueRating" INTEGER NOT NULL,
    "serviceRating" INTEGER NOT NULL,
    "comment" TEXT,
    "photos" JSONB,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "responseFromOwner" TEXT,
    "responseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyOwner_email_key" ON "PropertyOwner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Property_qrCodeData_key" ON "Property"("qrCodeData");

-- CreateIndex
CREATE UNIQUE INDEX "Room_qrCodeData_key" ON "Room"("qrCodeData");

-- CreateIndex
CREATE UNIQUE INDEX "Room_propertyId_roomNumber_key" ON "Room"("propertyId", "roomNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingReference_key" ON "Booking"("bookingReference");

-- CreateIndex
CREATE UNIQUE INDEX "CheckIn_bookingId_key" ON "CheckIn"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckOut_bookingId_key" ON "CheckOut"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckOut_checkInId_key" ON "CheckOut"("checkInId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "PropertyOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "PropertyOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckOut" ADD CONSTRAINT "CheckOut_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckOut" ADD CONSTRAINT "CheckOut_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "CheckIn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckOut" ADD CONSTRAINT "CheckOut_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckOut" ADD CONSTRAINT "CheckOut_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "PropertyOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
