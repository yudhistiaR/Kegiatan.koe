/*
  Warnings:

  - You are about to drop the column `userId` on the `KeuanganProker` table. All the data in the column will be lost.
  - Added the required column `prokerId` to the `KeuanganProker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `KeuanganProker` DROP FOREIGN KEY `KeuanganProker_userId_fkey`;

-- DropIndex
DROP INDEX `KeuanganProker_userId_fkey` ON `KeuanganProker`;

-- AlterTable
ALTER TABLE `KeuanganProker` DROP COLUMN `userId`,
    ADD COLUMN `prokerId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `KeuanganProker` ADD CONSTRAINT `KeuanganProker_prokerId_fkey` FOREIGN KEY (`prokerId`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
