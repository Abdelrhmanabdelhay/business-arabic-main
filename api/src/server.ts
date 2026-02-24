import app from './app';
import { connectDatabase } from './config/database';
import { config } from './config/environment';
import Logger from './utils/logger';

const PORT: string | number = config.port;

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  Logger.error('UNCAUGHT EXCEPTION! Occurred 💥 Shutting down...', {
    error: err,
  });
  console.log(err.name, err.message);
  process.exit(1);
});

// Database connection
connectDatabase().then(() => {
  Logger.info('Database connected successfully');
});

console.log('🔗 Initializing database connection...');
console.log(`📚 Swagger documentation available at: http://localhost:${PORT}/api-docs`);
console.log('🌐 API endpoints available for testing\n');

const server = app.listen(PORT, () => {
  Logger.info(
    `Server in ${config.nodeEnv} mode started successfully using port ${PORT}`
  );
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  Logger.error('UNHANDLED REJECTION! Occurred 💥 Server Shutting down...', {
    error: err,
  });
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
    process.exit(0);
  });
});