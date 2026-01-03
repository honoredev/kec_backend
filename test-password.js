import bcrypt from 'bcrypt';

async function testPassword() {
  const storedHash = '$2b$12$QTpWidpNY7vqsO24UGimcOrOJXfatXM8rSfBXo4XuCWvTURwocYvG';
  const testPassword = process.env.ADMIN_PASSWORD || 'Ik@r!tA_MeD1a#2026$';
  
  console.log('🔐 Testing password...');
  console.log('Password:', testPassword);
  
  const isMatch = await bcrypt.compare(testPassword, storedHash);
  
  if (isMatch) {
    console.log('✅ Password matches! Login should work.');
  } else {
    console.log('❌ Password does NOT match the stored hash.');
  }
}

testPassword();