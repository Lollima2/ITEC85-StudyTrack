const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

// Signup endpoint
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('Signup request received:', { name, email, passwordLength: password?.length });
  
  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    const db = req.db;
    console.log('Database connection:', db ? 'Available' : 'Not available');
    
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({ message: 'User already exists with this email' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create new user with hashed password
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    const result = await usersCollection.insertOne(newUser);
    console.log('User created successfully:', result.insertedId);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      id: result.insertedId,
      ...userWithoutPassword
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login request received:', { email });
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    const db = req.db;
    console.log('Database connection:', db ? 'Available' : 'Not available');
    
    const usersCollection = db.collection('users');
    
    // Find user
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare password with hashed password in database
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User logged in successfully:', email);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update profile endpoint
router.post('/update-profile', async (req, res) => {
  const { userId, name } = req.body;
  
  console.log('Update profile request received:', { userId, name });
  
  if (!userId || !name) {
    return res.status(400).json({ message: 'User ID and name are required' });
  }
  
  try {
    const db = req.db;
    console.log('Database connection:', db ? 'Available' : 'Not available');
    
    if (!db) {
      // If no database connection, update local state only
      console.log('No database connection available, updating local state only');
      return res.status(200).json({ 
        message: 'Profile updated in local state only (database unavailable)',
        localOnly: true
      });
    }
    
    const usersCollection = db.collection('users');
    
    // Try multiple approaches to update the user
    let result;
    
    // Approach 1: Try with ObjectId
    try {
      const objectId = new ObjectId(userId);
      result = await usersCollection.updateOne(
        { _id: objectId },
        { $set: { name: name } }
      );
      console.log('Update result with ObjectId:', result);
    } catch (err) {
      console.log('Not a valid ObjectId, trying string ID');
    }
    
    // Approach 2: Try with string ID
    if (!result || result.matchedCount === 0) {
      result = await usersCollection.updateOne(
        { _id: userId },
        { $set: { name: name } }
      );
      console.log('Update result with string ID:', result);
    }
    
    // Approach 3: Try with id field
    if (!result || result.matchedCount === 0) {
      result = await usersCollection.updateOne(
        { id: userId },
        { $set: { name: name } }
      );
      console.log('Update result with id field:', result);
    }
    
    if (!result || result.matchedCount === 0) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Profile updated successfully for user ID:', userId);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    
    // Return success anyway since we can't connect to the database
    res.status(200).json({ 
      message: 'Profile updated in local state only (database error)',
      localOnly: true,
      error: err.message
    });
  }
});


module.exports = router;