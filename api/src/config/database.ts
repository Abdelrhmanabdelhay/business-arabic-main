import mongoose from 'mongoose';
import { config } from './environment';

export const connectDatabase = async (): Promise<void> => {
  console.log('🔗 Attempting to connect to MongoDB...');
  
  try {
    // Simple and compatible MongoDB connection options
    const connectionOptions = {
      // Basic connection settings
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      
      // Pool settings
      maxPoolSize: 10,
      minPoolSize: 5,
      
      // Retry settings
      retryWrites: true,
    };

    // Set Mongoose options
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(config.mongoUri, connectionOptions);
    
    // Hide credentials in log
    const safeUri = config.mongoUri.replace(/\/\/.*@/, '//***:***@');
    console.log('✅ Connected to MongoDB:', safeUri);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('\n🔧 Connection troubleshooting:');
    console.log('1. MongoDB Atlas SSL issues are common on Windows');
    console.log('2. Install Docker Desktop and use: docker compose up -d');
    console.log('3. Or install MongoDB Community Edition locally');
    console.log('4. Swagger documentation available at: http://localhost:3000/api-docs\n');
    
    // Don't exit in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️  Server running without database for API testing');
      console.log('📚 Visit: http://localhost:3000/api-docs to test endpoints\n');
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('🔗 MongoDB connection established');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});