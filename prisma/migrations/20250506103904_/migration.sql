-- CreateTable
CREATE TABLE `Tugas` (
    `id` VARCHAR(191) NOT NULL,
    `proker_id` VARCHAR(191) NULL,
    `tugas_name` VARCHAR(191) NOT NULL,
    `tugas_description` VARCHAR(191) NOT NULL,
    `tugas_status` ENUM('TODO', 'INPROGRESS', 'REVIEW', 'DONE') NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `Tugas_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_proker_id_fkey` FOREIGN KEY (`proker_id`) REFERENCES `program_kerja`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
