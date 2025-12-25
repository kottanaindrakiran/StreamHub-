const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    console.log('--- Testing Authentication API ---');

    // 1. Test Login (Backdoor)
    try {
        console.log('1. Attempting Login (kottanasrinu8@gmail.com)...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: 'kottanasrinu8@gmail.com',
            password: 'Iloveu@143'
        });
        console.log('✅ Login Success:', loginRes.data.email, loginRes.data.role);
    } catch (error) {
        console.error('❌ Login Failed:', error.response ? error.response.data : error.message);
    }

    // 2. Test Register (New User)
    const randomUser = `testuser${Math.floor(Math.random() * 1000)}`;
    try {
        console.log(`2. Attempting Register (${randomUser}@test.com)...`);
        const registerRes = await axios.post(`${API_URL}/register`, {
            name: 'Test User',
            email: `${randomUser}@test.com`,
            password: 'password123',
            role: 'editor'
        });
        console.log('✅ Register Success:', registerRes.data.email);
    } catch (error) {
        console.error('❌ Register Failed:', error.response ? error.response.data : error.message);
    }
};

testAuth();
