/*
  Warnings:

  - Made the column `created_at` on table `Keuangan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Keuangan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Keuangan` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;
