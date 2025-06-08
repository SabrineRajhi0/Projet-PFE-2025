const axios = require('axios');

// Define the URL and admin credentials
const baseUrl = 'http://localhost:8087';
const loginData = {
  email: 'admin@admin.com',  // Updated with likely admin credentials
  password: 'admin'         // Updated with likely admin password
};

// Login and get access token
async function login() {
  try {
    console.log('Attempting to login...');
    const response = await axios.post(`${baseUrl}/auth/login`, loginData);
    console.log('Login successful');
    return response.data.accessToken;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error('Failed to login');
  }
}

// Get all users
async function getAllUsers(token) {
  try {
    console.log('Fetching all users...');
    const response = await axios.get(`${baseUrl}/users/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Retrieved ${response.data.length} users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw new Error('Failed to fetch users');
  }
}

// Main function
async function main() {
  try {
    // Login
    const token = await login();
    
    // Get all users
    const users = await getAllUsers(token);
    
    // Check createdAt field for each user
    console.log('\nUser Data:');
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(` - ID: ${user.id}`);
      console.log(` - Email: ${user.email}`);
      console.log(` - Name: ${user.prenom} ${user.nom}`);
      console.log(` - Role: ${user.role}`);
      console.log(` - Has createdAt: ${user.createdAt !== undefined ? 'Yes' : 'No'}`);
      console.log(` - createdAt value: ${user.createdAt || 'undefined'}`);
      
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        console.log(` - Formatted date: ${date.toLocaleString()}`);
      }
    });
    
    console.log('\nTest completed successfully');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the main function
main();
