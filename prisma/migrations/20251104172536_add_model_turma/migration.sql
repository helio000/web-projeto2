/*
  Warnings:

  - Made the column `arteMarcial` on table `turma` required. This step will fail if there are existing NULL values in that column.
  - Made the column `professorId` on table `turma` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `turma` DROP FOREIGN KEY `Turma_professorId_fkey`;

-- DropIndex
DROP INDEX `Turma_professorId_fkey` ON `turma`;

-- AlterTable
ALTER TABLE `turma` MODIFY `arteMarcial` VARCHAR(191) NOT NULL,
    MODIFY `professorId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Planejamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `diaSemana` VARCHAR(191) NOT NULL,
    `atividade` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `professorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Turma` ADD CONSTRAINT `Turma_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Planejamento` ADD CONSTRAINT `Planejamento_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
