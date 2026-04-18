// =================================================
// 📌 Connect to MongoDB Database
// =================================================

import mongoose from "mongoose"; 

// --------------------
// 🔗 MongoDB Connection Function
// --------------------
const connectMongoose = async () => {
    try {
//      ------------------Establishing connection with MongoDb------------------  
        const connect = await mongoose.connect(process.env.MONGO_URI);

//      ------------------Consoling to backend------------------        
        console.log(`🚀 Server connected with MongoDB: ${connect.connection.host}`);
    } 
//      ------------------Error Handling------------------    
    catch (error) {
        // Log error and exit the process forcefully if failed
        console.log(`❌ MongoDB Connection Error: ${error}`);
        process.exit(1);
    }
};

export default connectMongoose;
