import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeDatabase() {
  try {
    // Create default user if none exists
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@kec.com',
          passwordHash: 'defaultpassword',
          role: 'admin'
        }
      });
      console.log('Default user created');
    }

    // Create default categories if none exist
    const categoryCount = await prisma.category.count();
    if (categoryCount === 0) {
      const categories = [
        { name: 'General', slug: 'general', description: 'General news and articles' },
        { name: 'Politics', slug: 'politics', description: 'Political news and updates' },
        { name: 'Sports', slug: 'sports', description: 'Sports news and events' },
        { name: 'Technology', slug: 'technology', description: 'Technology and innovation' },
        { name: 'Business', slug: 'business', description: 'Business and economy' },
        { name: 'Entertainment', slug: 'entertainment', description: 'Entertainment and culture' },
        { name: 'Health', slug: 'health', description: 'Health and wellness' },
        { name: 'Education', slug: 'education', description: 'Education and learning' },
        { name: 'Environment', slug: 'environment', description: 'Environmental news' },
        { name: 'Rwanda', slug: 'rwanda', description: 'Rwanda news and updates' }
      ];

      for (const category of categories) {
        await prisma.category.create({ data: category });
      }
      console.log('Default categories created');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();