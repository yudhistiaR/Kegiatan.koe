/*
  Warnings:

  - You are about to drop the `Keuangan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pendanaan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Keuangan` DROP FOREIGN KEY `Keuangan_orgId_fkey`;

-- DropForeignKey
ALTER TABLE `Keuangan` DROP FOREIGN KEY `Keuangan_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Pendanaan` DROP FOREIGN KEY `Pendanaan_orgId_fkey`;

-- DropForeignKey
ALTER TABLE `Pendanaan` DROP FOREIGN KEY `Pendanaan_prokerId_fkey`;

-- DropTable
DROP TABLE `Keuangan`;

-- DropTable
DROP TABLE `Pendanaan`;

-- CreateTable
CREATE TABLE `KeuanganProker` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `targetAnggaran` DECIMAL(65, 30) NULL,
    `danaTerkumpul` DECIMAL(65, 30) NULL,
    `totalPengeluaran` DECIMAL(65, 30) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `KeuanganProker_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SumberDana` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `prokerId` VARCHAR(191) NOT NULL,
    `sumber` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `jumlah` DECIMAL(65, 30) NOT NULL,
    `kontak` VARCHAR(191) NULL,
    `catatan` TEXT NULL,

    UNIQUE INDEX `SumberDana_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KeuanganProker` ADD CONSTRAINT `KeuanganProker_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KeuanganProker` ADD CONSTRAINT `KeuanganProker_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SumberDana` ADD CONSTRAINT `SumberDana_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SumberDana` ADD CONSTRAINT `SumberDana_prokerId_fkey` FOREIGN KEY (`prokerId`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
