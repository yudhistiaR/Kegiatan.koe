/*
  Warnings:

  - You are about to drop the column `keuanganProkerId` on the `SumberDana` table. All the data in the column will be lost.
  - You are about to drop the `KeuanganProker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `KeuanganProker` DROP FOREIGN KEY `KeuanganProker_orgId_fkey`;

-- DropForeignKey
ALTER TABLE `KeuanganProker` DROP FOREIGN KEY `KeuanganProker_prokerId_fkey`;

-- DropForeignKey
ALTER TABLE `SumberDana` DROP FOREIGN KEY `SumberDana_keuanganProkerId_fkey`;

-- DropIndex
DROP INDEX `SumberDana_keuanganProkerId_fkey` ON `SumberDana`;

-- AlterTable
ALTER TABLE `SumberDana` DROP COLUMN `keuanganProkerId`;

-- DropTable
DROP TABLE `KeuanganProker`;
