const app = require('./src/app');
const connectDB = require('./src/db/db');
const env = require('./src/config/env');

(async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`server is running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
