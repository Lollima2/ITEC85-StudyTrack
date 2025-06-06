// server/index.js
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Connect to MongoDB Atlas
const uri = process.env.ATLAS_URI;
console.log('MongoDB URI available:', !!uri);
console.log('MongoDB URI (first 15 chars):', uri ? uri.substring(0, 15) + '...' : 'undefined');

const client = new MongoClient(uri);
let db;

async function startServer() {
  try {
    // Connect to MongoDB with timeout
    console.log('Attempting to connect to MongoDB...');
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 5000ms')), 5000)
      )
    ]);
    console.log('Connected to MongoDB Atlas successfully');
    
    // Get database reference
    db = client.db();
    console.log('Using database:', db.databaseName);
    
    // List collections to verify connection
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Make db available to request handlers
    app.use((req, res, next) => {
      req.db = db;
      next();
    });
    
    // Import and use routes AFTER db connection is established
    const authRoutes = require('./routes/auth');
    app.use('/auth', authRoutes);

    // Add AcadTask routes
    const acadTaskRoutes = require('./routes/AcadTask');
    app.use('/acadtasks', acadTaskRoutes);
    
    // Serve static files from the uploads directory
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    console.error('Error details:', err.message);
    
    // Start server anyway for testing
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (WITHOUT DATABASE CONNECTION)`);
      console.log('WARNING: Database operations will fail');
    });
  }
}

// Start the server
startServer();
