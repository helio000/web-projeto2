-- CreateTable
CREATE TABLE `planejamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `diaSemana` VARCHAR(191) NOT NULL,
    `atividade` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `professorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `planejamento` ADD CONSTRAINT `planejamento_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
