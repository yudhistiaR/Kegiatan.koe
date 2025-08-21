-- AlterTable
ALTER TABLE `SumberDana` ADD COLUMN `keuanganProkerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `SumberDana` ADD CONSTRAINT `SumberDana_keuanganProkerId_fkey` FOREIGN KEY (`keuanganProkerId`) REFERENCES `KeuanganProker`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
