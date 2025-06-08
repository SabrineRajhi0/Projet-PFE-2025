const axios = require('axios');

// Define the user credentials
const loginData = {
  email: 'admin@example.com',  // Replace with your admin credentials
  password: 'admin123'         // Replace with your admin password
};

// Login and get token
async function login() {
  try {
    const response = await axios.post('http://localhost:8087/auth/login', loginData);
    return response.data.accessToken;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    return null;
  }
}

// Check user data with token
async function getUserData(token) {
  try {
    const response = await axios.get('http://localhost:8087/users/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Users count:', response.data.length);
    
    if (response.data && response.data.length > 0) {
      console.log('\nChecking createdAt field for all users:');
      response.data.forEach((user, index) => {
        console.log(`User ${index + 1}: ID=${user.id}, Email=${user.email}`);
        console.log(`  createdAt=${user.createdAt}`);
        console.log(`  createdAt is ${user.createdAt ? 'defined' : 'undefined'}`);
        
        if (user.createdAt) {
          const date = new Date(user.createdAt);
          console.log(`  Formatted date: ${date.toLocaleString()}`);
        }
        console.log('-------------------');
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Error getting user data:', error.response?.data || error.message);
    return null;
  }
}

// Main function
async function run() {
  console.log('Starting test script...');
  const token = await login();
  
  if (!token) {
    console.log('Failed to login, cannot continue test');
    return;
  }
  
  console.log('Successfully logged in');
  await getUserData(token);
}

// Run the test
run().catch(err => console.error('Unhandled error:', err));
