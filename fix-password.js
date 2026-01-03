import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function updateAdminPassword() {
  try {
    console.log('🔄 Updating admin password...');
    
    const correctPassword = 'Ik@r!tA_MeD1a#2026$';
    
    // Hash the correct password
    const hashedPassword = await bcrypt.hash(correctPassword, SALT_ROUNDS);
    
    // Update the admin account
    await prisma.user.update({
      where: { email: 'ikarita@media.com' },
      data: {
        passwordHash: hashedPassword
      }
    });
    
    console.log('✅ Admin password updated successfully!');
    console.log('📧 Email: ikarita@media.com');
    console.log('🔑 Password: Ik@r!tA_MeD1a#2026$');
    
    // Test the new password
    const testMatch = await bcrypt.compare(correctPassword, hashedPassword);
    console.log('🔐 Password test:', testMatch ? '✅ WORKS' : '❌ FAILED');
    
  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();