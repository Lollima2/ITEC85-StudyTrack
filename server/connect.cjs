const { MongoClient } = require('mongodb');
require('dotenv').config({path:"./config.env"});

async function main(){
    const uri = process.env.ATLAS_URI;
    const client = new MongoClient(uri);

    try{
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        
        // Get the database
        const db = client.db("StudyTrack");
        
        // List all collections in the database
        const collections = await db.listCollections().toArray();
        console.log("Collections in StudyTrack database:");
        collections.forEach(collection => console.log(collection.name));
        
        // If you want to access a specific collection, use this:
        // const myCollection = db.collection("yourCollectionName");
        // const documents = await myCollection.find({}).toArray();
        // console.log(documents);
    }catch(e){
        console.error("MongoDB connection error:", e);
    }finally{
        await client.close();
        console.log("MongoDB connection closed");
    }
}

main()