/*
  Warnings:

  - A unique constraint covering the columns `[organisasiId,clerkMemId]` on the table `Organisasi_member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Organisasi_member_organisasiId_clerkMemId_key` ON `Organisasi_member`(`organisasiId`, `clerkMemId`);
