import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testArticleCreation() {
  try {
    // Test basic connection
    console.log('Testing database connection...');
    const userCount = await prisma.user.count();
    console.log(`Users in database: ${userCount}`);
    
    const categoryCount = await prisma.category.count();
    console.log(`Categories in database: ${categoryCount}`);
    
    // Create test user if needed
    let author = await prisma.user.findFirst();
    if (!author) {
      author = await prisma.user.create({
        data: {
          name: 'Test Author',
          email: 'test@example.com',
          passwordHash: 'test123'
        }
      });
      console.log('Test author created');
    }
    
    // Create test category if needed
    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Test Category',
          slug: 'test-category',
          description: 'Test category description'
        }
      });
      console.log('Test category created');
    }
    
    // Test article creation with minimal data
    const testArticle = await prisma.article.create({
      data: {
        title: 'Test Article',
        slug: 'test-article-' + Date.now(),
        content: 'This is a test article content.',
        excerpt: 'Test excerpt',
        authorId: author.id,
        categoryId: category.id,
        status: 'published'
      }
    });
    
    console.log('Test article created successfully:', testArticle.id);
    
    // Clean up test article
    await prisma.article.delete({ where: { id: testArticle.id } });
    console.log('Test article deleted');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testArticleCreation();