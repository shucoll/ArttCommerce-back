import dotenv from 'dotenv';
import { setDefaultResultOrder } from 'dns';
import db from './config/databaseConfig.js';
import sequelizeSync from './config/sequelizeSyncConfig.js';
import app from './app.js';

setDefaultResultOrder('ipv4first');
dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION - shutting down');
  console.error(err);
  process.exit(1);
});

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await db.authenticate();
    console.log('Database connected…');

    sequelizeSync();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION – shutting down');
      console.error(err);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();
