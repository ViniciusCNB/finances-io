/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `Despesa` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Investimento` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Receita` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Despesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "valor" REAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "observacao" TEXT,
    "forma_pagamento" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Despesa" ("categoria", "createdAt", "data", "descricao", "forma_pagamento", "id", "observacao", "updatedAt", "valor") SELECT "categoria", "createdAt", "data", "descricao", "forma_pagamento", "id", "observacao", "updatedAt", "valor" FROM "Despesa";
DROP TABLE "Despesa";
ALTER TABLE "new_Despesa" RENAME TO "Despesa";
CREATE TABLE "new_Investimento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "quantidade" REAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "instituicao" TEXT NOT NULL,
    "data_compra" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Investimento" ("createdAt", "data_compra", "descricao", "id", "instituicao", "quantidade", "tipo", "updatedAt", "valor") SELECT "createdAt", "data_compra", "descricao", "id", "instituicao", "quantidade", "tipo", "updatedAt", "valor" FROM "Investimento";
DROP TABLE "Investimento";
ALTER TABLE "new_Investimento" RENAME TO "Investimento";
CREATE TABLE "new_Receita" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "valor" REAL NOT NULL,
    "observacao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Receita" ("createdAt", "data", "descricao", "id", "observacao", "updatedAt", "valor") SELECT "createdAt", "data", "descricao", "id", "observacao", "updatedAt", "valor" FROM "Receita";
DROP TABLE "Receita";
ALTER TABLE "new_Receita" RENAME TO "Receita";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
