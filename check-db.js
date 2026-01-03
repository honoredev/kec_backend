import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database users...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        name: true
      }
    });
    
    console.log('📊 Found users:', users);
    
    // Check if ikarita@media.com exists
    const admin = await prisma.user.findUnique({
      where: { email: 'ikarita@media.com' }
    });
    
    if (admin) {
      console.log('✅ ikarita@media.com exists');
    } else {
      console.log('❌ ikarita@media.com NOT found');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();