-- CreateTable
CREATE TABLE `program_kerja` (
    `id` VARCHAR(191) NOT NULL,
    `org_id` VARCHAR(191) NOT NULL,
    `proker_name` VARCHAR(191) NOT NULL,
    `proker_author` VARCHAR(191) NOT NULL,
    `proker_desc` TEXT NOT NULL,
    `proker_start` DATETIME(3) NOT NULL,
    `proker_end` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proker_divisi` (
    `id` VARCHAR(191) NOT NULL,
    `proker_id` VARCHAR(191) NOT NULL,
    `divisi_org_id` VARCHAR(191) NOT NULL,
    `divisi_name` VARCHAR(191) NOT NULL,
    `divisi_kordinator` VARCHAR(191) NOT NULL,
    `divisi_desc` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_divisi` (
    `id` VARCHAR(191) NOT NULL,
    `divisi_id` VARCHAR(191) NOT NULL,
    `anggota_name` VARCHAR(191) NOT NULL,
    `anggota_jabatan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `anggota_divisi_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `proker_divisi` ADD CONSTRAINT `proker_divisi_proker_id_fkey` FOREIGN KEY (`proker_id`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_divisi` ADD CONSTRAINT `anggota_divisi_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `proker_divisi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
