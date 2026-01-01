import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  try {
    // Check if columns exist and add them if they don't
    await prisma.$executeRaw`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'left_column_content') THEN
          ALTER TABLE articles ADD COLUMN left_column_content TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'right_column_content') THEN
          ALTER TABLE articles ADD COLUMN right_column_content TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'likes') THEN
          ALTER TABLE articles ADD COLUMN likes INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'shares') THEN
          ALTER TABLE articles ADD COLUMN shares INTEGER DEFAULT 0;
        END IF;
      END $$;
    `;
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();