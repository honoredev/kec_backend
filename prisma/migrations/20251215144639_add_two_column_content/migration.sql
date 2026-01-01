-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "left_column_content" TEXT,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "right_column_content" TEXT,
ADD COLUMN     "shares" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "fun_content" ALTER COLUMN "image_url" DROP NOT NULL;
