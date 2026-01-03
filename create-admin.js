import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function createOrUpdateAdmin() {
  try {
    console.log('🔄 Updating existing seeded admin account...');
    
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    
    // Update the existing seeded admin account
    const admin = await prisma.user.upsert({
      where: { email: 'uwimana.erick@kec.com' },
      update: {
        passwordHash: hashedPassword,
        name: 'KEC Administrator',
        role: 'admin'
      },
      create: {
        name: 'KEC Administrator',
        email: 'uwimana.erick@kec.com',
        passwordHash: hashedPassword,
        role: 'admin'
      }
    });

    // Also create/update admin@kec.com
    await prisma.user.upsert({
      where: { email: 'admin@kec.com' },
      update: {
        passwordHash: hashedPassword,
        name: 'KEC Administrator',
        role: 'admin'
      },
      create: {
        name: 'KEC Administrator',
        email: 'admin@kec.com',
        passwordHash: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Admin accounts updated with bcrypt encryption!');
    console.log('📧 Email: uwimana.erick@kec.com OR admin@kec.com');
    console.log('🔑 Password: Set from environment variable');
    
  } catch (error) {
    console.error('❌ Error updating admin account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOrUpdateAdmin();