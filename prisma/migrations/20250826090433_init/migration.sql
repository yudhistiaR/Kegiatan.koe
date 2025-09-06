-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `npm` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NULL,
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
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_kerja` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `ketuaPelaksanaId` VARCHAR(191) NOT NULL,
    `proker_name` VARCHAR(191) NOT NULL,
    `proker_desc` TEXT NOT NULL,
    `proker_start` DATETIME(3) NOT NULL,
    `proker_end` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proker_divisi` (
    `id` VARCHAR(191) NOT NULL,
    `proker_id` VARCHAR(191) NOT NULL,
    `divisi_org_id` VARCHAR(191) NOT NULL,
    `kordinatorId` VARCHAR(191) NOT NULL,
    `divisi_name` VARCHAR(191) NOT NULL,
    `divisi_desc` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_divisi` (
    `id` VARCHAR(191) NOT NULL,
    `divisi_id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `anggota_jabatan` ENUM('KORDINATOR', 'SEKERTARIS', 'STAFF') NOT NULL DEFAULT 'STAFF',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `anggota_divisi_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tugas` (
    `id` VARCHAR(191) NOT NULL,
    `divisiId` VARCHAR(191) NULL,
    `prokerId` VARCHAR(191) NULL,
    `orgId` VARCHAR(191) NULL,
    `tugas_name` VARCHAR(191) NOT NULL,
    `priority` ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    `tugas_description` VARCHAR(191) NOT NULL,
    `tugas_status` ENUM('TODO', 'INPROGRESS', 'REVIEW', 'DONE') NOT NULL,
    `start` DATETIME(3) NULL,
    `end` DATETIME(3) NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `Tugas_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rab` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `divisiId` VARCHAR(191) NOT NULL,
    `prokerId` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `total_revisi` INTEGER NULL DEFAULT 0,
    `status` ENUM('PENDING', 'REJECTED', 'APPROVED') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `rab_id_key`(`id`),
    UNIQUE INDEX `rab_divisiId_key`(`divisiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListRab` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `harga` VARCHAR(191) NOT NULL,
    `jumlah` VARCHAR(191) NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `rabId` VARCHAR(191) NULL,

    UNIQUE INDEX `ListRab_id_key`(`id`),
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
    `status` ENUM('PENDING', 'REJECTED', 'APPROVED') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `SumberDana_id_key`(`id`),
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
ALTER TABLE `program_kerja` ADD CONSTRAINT `program_kerja_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_kerja` ADD CONSTRAINT `program_kerja_ketuaPelaksanaId_fkey` FOREIGN KEY (`ketuaPelaksanaId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Organisasi_member` ADD CONSTRAINT `Organisasi_member_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Organisasi_member` ADD CONSTRAINT `Organisasi_member_organisasiId_fkey` FOREIGN KEY (`organisasiId`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proker_divisi` ADD CONSTRAINT `proker_divisi_kordinatorId_fkey` FOREIGN KEY (`kordinatorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proker_divisi` ADD CONSTRAINT `proker_divisi_proker_id_fkey` FOREIGN KEY (`proker_id`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proker_divisi` ADD CONSTRAINT `proker_divisi_divisi_org_id_fkey` FOREIGN KEY (`divisi_org_id`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_divisi` ADD CONSTRAINT `anggota_divisi_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `proker_divisi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_divisi` ADD CONSTRAINT `anggota_divisi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_prokerId_fkey` FOREIGN KEY (`prokerId`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_divisiId_fkey` FOREIGN KEY (`divisiId`) REFERENCES `proker_divisi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rab` ADD CONSTRAINT `rab_divisiId_fkey` FOREIGN KEY (`divisiId`) REFERENCES `proker_divisi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rab` ADD CONSTRAINT `rab_prokerId_fkey` FOREIGN KEY (`prokerId`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rab` ADD CONSTRAINT `rab_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListRab` ADD CONSTRAINT `ListRab_rabId_fkey` FOREIGN KEY (`rabId`) REFERENCES `rab`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SumberDana` ADD CONSTRAINT `SumberDana_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organisasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SumberDana` ADD CONSTRAINT `SumberDana_prokerId_fkey` FOREIGN KEY (`prokerId`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
