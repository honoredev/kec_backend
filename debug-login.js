import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugLogin() {
  try {
    console.log('🔍 Debugging login process...');
    
    const email = 'ikarita@media.com';
    const password = 'Ik@r!tA_MeD1a#2026$';
    
    // Find admin user
    const admin = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true
      }
    });
    
    console.log('📊 Admin found:', admin ? 'YES' : 'NO');
    if (admin) {
      console.log('👤 Admin details:');
      console.log('  - ID:', admin.id);
      console.log('  - Email:', admin.email);
      console.log('  - Name:', admin.name);
      console.log('  - Role:', admin.role);
      console.log('  - Hash:', admin.passwordHash);
      
      // Test password
      console.log('🔐 Testing password...');
      console.log('  - Input password:', password);
      
      const isValid = await bcrypt.compare(password, admin.passwordHash);
      console.log('  - Password match:', isValid ? '✅ YES' : '❌ NO');
      
      // Test with environment variable
      const envPassword = process.env.ADMIN_PASSWORD;
      console.log('  - Env password:', envPassword);
      
      if (envPassword) {
        const envMatch = await bcrypt.compare(envPassword, admin.passwordHash);
        console.log('  - Env password match:', envMatch ? '✅ YES' : '❌ NO');
      }
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();