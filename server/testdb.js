const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

// Test MongoDB connection
async function testConnection() {
  // Try local connection first
  let uri = 'mongodb://localhost:27017/StudyTrack';
  let client = new MongoClient(uri);
  
  try {
    console.log('Attempting to connect to local MongoDB...');
    await client.connect();
    const db = client.db();
    console.log('✅ Successfully connected to local MongoDB');
    console.log('Database name:', db.databaseName);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check if users collection exists
    const usersCollection = collections.find(c => c.name === 'users');
    if (usersCollection) {
      // Count users
      const userCount = await db.collection('users').countDocuments();
      console.log(`Found ${userCount} users in the database`);
      
      // Show sample user (if any)
      if (userCount > 0) {
        const sampleUser = await db.collection('users').findOne({});
        console.log('Sample user (without password):', {
          id: sampleUser._id,
          name: sampleUser.name,
          email: sampleUser.email,
          createdAt: sampleUser.createdAt
        });
      }
    } else {
      console.log('No users collection found. It will be created when the first user signs up.');
    }
  } catch (localErr) {
    console.error('❌ Failed to connect to local MongoDB:', localErr.message);
    
    // Try Atlas connection as fallback
    try {
      await client.close();
      
      uri = process.env.ATLAS_URI;
      if (!uri) {
        console.error('❌ No ATLAS_URI found in config.env');
        process.exit(1);
      }
      
      console.log('Attempting to connect to MongoDB Atlas...');
      client = new MongoClient(uri);
      await client.connect();
      const db = client.db();
      console.log('✅ Successfully connected to MongoDB Atlas');
      console.log('Database name:', db.databaseName);
      
      // List collections
      const collections = await db.listCollections().toArray();
      console.log('Collections:', collections.map(c => c.name));
    } catch (atlasErr) {
      console.error('❌ Failed to connect to MongoDB Atlas:', atlasErr.message);
      console.error('Please check your connection strings and ensure MongoDB is running.');
    }
  } finally {
    await client.close();
  }
}

testConnection().catch(console.error);