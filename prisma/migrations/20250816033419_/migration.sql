/*
  Warnings:

  - You are about to drop the column `org_id` on the `Tugas` table. All the data in the column will be lost.
  - You are about to drop the column `proker_id` on the `Tugas` table. All the data in the column will be lost.
  - You are about to drop the column `anggota_name` on the `anggota_divisi` table. All the data in the column will be lost.
  - You are about to alter the column `anggota_jabatan` on the `anggota_divisi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `divisi_kordinator` on the `proker_divisi` table. All the data in the column will be lost.
  - Added the required column `priority` to the `Tugas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `anggota_divisi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Tugas` DROP FOREIGN KEY `Tugas_proker_id_fkey`;

-- DropIndex
DROP INDEX `Tugas_proker_id_fkey` ON `Tugas`;

-- AlterTable
ALTER TABLE `Tugas` DROP COLUMN `org_id`,
    DROP COLUMN `proker_id`,
    ADD COLUMN `divisiId` VARCHAR(191) NULL,
    ADD COLUMN `end` DATETIME(3) NULL,
    ADD COLUMN `priority` ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    ADD COLUMN `prokerId` VARCHAR(191) NULL,
    ADD COLUMN `start` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `anggota_divisi` DROP COLUMN `anggota_name`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    MODIFY `anggota_jabatan` ENUM('KORDINATOR', 'SEKERTARIS', 'STAFF') NOT NULL DEFAULT 'STAFF';

-- AlterTable
ALTER TABLE `proker_divisi` DROP COLUMN `divisi_kordinator`;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `clerkId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `npm` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `universitas` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `telpon` VARCHAR(191) NULL,
    `tanggal_lahir` DATE NULL,
    `jenis_kelamin` VARCHAR(191) NULL,
    `profileImg` TEXT NULL,
    `bio` TEXT NULL,
    `label` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_clerkId_key`(`clerkId`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organisasi` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `image_url` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Organisasi_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organisasi_member` (
    `id` VARCHAR(191) NOT NULL,
    `organisasiId` VARCHAR(191) NOT NULL,
    `clerkMemId` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Organisasi_member_clerkMemId_key`(`clerkMemId`),
    UNIQUE INDEX `Organisasi_member_memberId_key`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rab` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NULL,
    `divisiId` VARCHAR(191) NULL,
    `prokerId` VARCHAR(191) NULL,
    `nama` VARCHAR(191) NOT NULL,
    `harga` VARCHAR(191) NOT NULL,
    `jumlah` VARCHAR(191) NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `rab_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notulensi` (
    `id` VARCHAR(191) NOT NULL,
    `divisiId` VARCHAR(191) NULL,
    `org_id` VARCHAR(191) NULL,
    `prokerId` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `date` DATE NULL,
    `time` TIME NULL,
    `location` VARCHAR(191) NULL,
    `agenda` VARCHAR(191) NULL,
    `attendees` VARCHAR(191) NULL,
    `content` TEXT NULL,

    UNIQUE INDEX `notulensi_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AnggotaDivisiToTugas` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AnggotaDivisiToTugas_AB_unique`(`A`, `B`),
    INDEX `_AnggotaDivisiToTugas_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Organisasi_member` ADD CONSTRAINT `Organisasi_member_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Organisasi_member` ADD CONSTRAINT `Organisasi_member_organisasiId_fkey` FOREIGN KEY (`organisasiId`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_divisi` ADD CONSTRAINT `anggota_divisi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_prokerId_fkey` FOREIGN KEY (`prokerId`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_divisiId_fkey` FOREIGN KEY (`divisiId`) REFERENCES `proker_divisi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rab` ADD CONSTRAINT `rab_divisiId_fkey` FOREIGN KEY (`divisiId`) REFERENCES `proker_divisi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rab` ADD CONSTRAINT `rab_prokerId_fkey` FOREIGN KEY (`prokerId`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rab` ADD CONSTRAINT `rab_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notulensi` ADD CONSTRAINT `notulensi_divisiId_fkey` FOREIGN KEY (`divisiId`) REFERENCES `proker_divisi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notulensi` ADD CONSTRAINT `notulensi_org_id_fkey` FOREIGN KEY (`org_id`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notulensi` ADD CONSTRAINT `notulensi_prokerId_fkey` FOREIGN KEY (`prokerId`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AnggotaDivisiToTugas` ADD CONSTRAINT `_AnggotaDivisiToTugas_A_fkey` FOREIGN KEY (`A`) REFERENCES `anggota_divisi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AnggotaDivisiToTugas` ADD CONSTRAINT `_AnggotaDivisiToTugas_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tugas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
