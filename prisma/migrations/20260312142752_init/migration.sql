/*
  Warnings:

  - You are about to drop the column `viewCount` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "viewCount",
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "viewCount",
ADD COLUMN     "favoriteCount" INTEGER NOT NULL DEFAULT 0;
