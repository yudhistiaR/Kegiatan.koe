-- DropForeignKey
ALTER TABLE `Keuangan` DROP FOREIGN KEY `Keuangan_userId_fkey`;

-- DropIndex
DROP INDEX `Keuangan_userId_fkey` ON `Keuangan`;

-- AlterTable
ALTER TABLE `Keuangan` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Keuangan` ADD CONSTRAINT `Keuangan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
