/*
  Warnings:

  - Added the required column `org_id` to the `Tugas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tugas` ADD COLUMN `org_id` VARCHAR(191) NOT NULL;
