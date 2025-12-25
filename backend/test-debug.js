const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    console.log('--- Debug Auth Test ---');
    try {
        console.log('1. Login Admin...');
        const res = await axios.post(`${API_URL}/login`, {
            email: 'kottanasrinu8@gmail.com',
            password: 'Iloveu@143'
        });
        console.log('✅ SUCCESS:', res.status, res.data);
    } catch (err) {
        console.log('❌ FAIL:', err.response ? err.response.status : 'No Response');
        if (err.response) console.log(JSON.stringify(err.response.data, null, 2));
    }
};

testAuth();
