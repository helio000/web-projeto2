/*
  Warnings:

  - You are about to drop the `planejamento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `planejamento` DROP FOREIGN KEY `Planejamento_professorId_fkey`;

-- DropForeignKey
ALTER TABLE `turma` DROP FOREIGN KEY `Turma_professorId_fkey`;

-- DropIndex
DROP INDEX `Turma_professorId_fkey` ON `turma`;

-- AlterTable
ALTER TABLE `turma` MODIFY `arteMarcial` VARCHAR(191) NULL,
    MODIFY `professorId` INTEGER NULL;

-- DropTable
DROP TABLE `planejamento`;

-- AddForeignKey
ALTER TABLE `Turma` ADD CONSTRAINT `Turma_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
