// One-off seed: creates an admin user if none exists.
// Usage: node src/scripts/seed-admin.js [email] [password]
const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/user.model');

(async () => {
  const [, , email = 'admin@tourist.com', password = 'adminpass'] = process.argv;
  await mongoose.connect(env.MONGO_URI);
  const exists = await User.findOne({ email });
  if (exists) {
    exists.role = 'admin';
    await exists.save();
    console.log(`Promoted existing user to admin: ${email} (id=${exists._id})`);
  } else {
    const admin = await User.create({ name: 'Admin', email, password, role: 'admin' });
    console.log(`Created admin: ${email} (id=${admin._id})`);
  }
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
