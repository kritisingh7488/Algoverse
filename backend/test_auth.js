const axios = require('axios');

async function testAuth() {
    let loginToken = '';
    try {
        console.log('Testing E2E Authentication...');
        const uniqueEmail = `test_${Date.now()}@example.com`;
        
        console.log(`1. Registering user ${uniqueEmail}...`);
        const registerResponse = await axios.post('http://localhost:5000/api/v1/auth/register', {
            fullName: 'Test User',
            username: `testuser_${Date.now()}`,
            email: uniqueEmail,
            password: 'password123'
        });
        
        if (registerResponse.data.success && registerResponse.data.data.token) {
            console.log('✅ Registration successful. Token received.');
        } else {
            console.error('❌ Registration failed:', registerResponse.data);
            process.exit(1);
        }

        console.log('2. Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
            email: uniqueEmail,
            password: 'password123'
        });

        if (loginResponse.data.success && loginResponse.data.data.token) {
            console.log('✅ Login successful. Token received.');
            loginToken = loginResponse.data.data.token;
        } else {
            console.error('❌ Login failed:', loginResponse.data);
            process.exit(1);
        }

        console.log('3. Fetching User Profile...');
        const profileResponse = await axios.get('http://localhost:5000/api/v1/auth/me', {
            headers: {
                Authorization: `Bearer ${loginToken}`
            }
        });

        if (profileResponse.data.success && profileResponse.data.data.user.email === uniqueEmail) {
            console.log('✅ Profile fetch successful.');
        } else {
            console.error('❌ Profile fetch failed:', profileResponse.data);
            process.exit(1);
        }

        console.log('All E2E tests passed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ E2E Test failed:', error.response ? JSON.stringify(error.response.data) : error.message);
        process.exit(1);
    }
}

testAuth();
