-- AlterTable
ALTER TABLE `KeuanganProker` MODIFY `targetAnggaran` DECIMAL(65, 30) NULL DEFAULT 0,
    MODIFY `danaTerkumpul` DECIMAL(65, 30) NULL DEFAULT 0,
    MODIFY `totalPengeluaran` DECIMAL(65, 30) NULL DEFAULT 0;
