/*
  Warnings:

  - You are about to alter the column `correo` on the `Usuarios` table. The data in that column could be lost. The data in that column will be cast from `VarChar(150)` to `VarChar(60)`.

*/
-- AlterTable
ALTER TABLE "Usuarios" ALTER COLUMN "correo" SET DATA TYPE VARCHAR(60);
