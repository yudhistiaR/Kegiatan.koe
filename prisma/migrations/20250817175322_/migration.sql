-- CreateTable
CREATE TABLE `Pendanaan` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `prokerId` VARCHAR(191) NOT NULL,
    `sumberDana` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `jumlahDana` VARCHAR(191) NOT NULL,
    `kontak` VARCHAR(191) NOT NULL,
    `catatan` TEXT NOT NULL,

    UNIQUE INDEX `Pendanaan_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pendanaan` ADD CONSTRAINT `Pendanaan_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pendanaan` ADD CONSTRAINT `Pendanaan_prokerId_fkey` FOREIGN KEY (`prokerId`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
