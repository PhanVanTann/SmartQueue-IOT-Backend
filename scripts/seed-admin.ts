import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

async function main() {
  const mongoUrl = process.env.MONGO_URL as string;
  const dbName = process.env.MONGO_DB_NAME as string;
  if (!mongoUrl || !dbName) {
    console.error('Missing MONGO_URL or MONGO_DB_NAME in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUrl, { dbName });
  // Define a lightweight schema locally to avoid TS type conflicts
  const SeedUserSchema = new mongoose.Schema(
    {
      username: { type: String, required: true },
      password: { type: String, required: true },
      role: { type: String, default: 'admin' },
    },
    { timestamps: true }
  );
  const UserModel = mongoose.model('User', SeedUserSchema);

  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existing = await UserModel.findOne({ username });
  if (existing) {
    console.log(`Admin user '${username}' already exists.`);
    await mongoose.disconnect();
    return;
  }

  const hashed = bcrypt.hashSync(password, 10);
  const doc = new UserModel({ username, password: hashed, role: 'admin' });
  await doc.save();
  console.log(`Seeded admin user '${username}' with password '${password}'.`);
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
