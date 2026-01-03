import fetch from 'node-fetch';

async function testLocalLogin() {
  try {
    console.log('🧪 Testing admin login locally...');
    
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ikarita@media.com',
        password: 'Ik@r!tA_MeD1a#2026$'
      }),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Local login works!');
    } else {
      console.log('❌ Local login failed');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testLocalLogin();