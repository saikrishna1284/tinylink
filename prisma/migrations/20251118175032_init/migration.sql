/*
  Warnings:

  - The primary key for the `Link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clickCount` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `original` on the `Link` table. All the data in the column will be lost.
  - The `id` column on the `Link` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[shortCode]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullUrl` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortCode` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Link_code_key";

-- AlterTable
ALTER TABLE "Link" DROP CONSTRAINT "Link_pkey",
DROP COLUMN "clickCount",
DROP COLUMN "code",
DROP COLUMN "original",
ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fullUrl" TEXT NOT NULL,
ADD COLUMN     "lastClicked" TIMESTAMP(3),
ADD COLUMN     "shortCode" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Link_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Link_shortCode_key" ON "Link"("shortCode");
