import mongoose from 'mongoose';

console.log("process.env.MONGO_URI", process.env.MONGO_URI);

const connectDB = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI as string,{
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
