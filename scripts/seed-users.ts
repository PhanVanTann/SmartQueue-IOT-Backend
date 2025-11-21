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

  const SeedUserSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, default: 'user' },
    },
    { timestamps: true }
  );
  const UserModel = mongoose.models.User || mongoose.model('User', SeedUserSchema);

  const users = [
    { username: 'alice', password: 'pass123', role: 'user' },
    { username: 'bob', password: 'pass123', role: 'user' },
    { username: 'charlie', password: 'pass123', role: 'user' },
  ];

  let created = 0;
  for (const u of users) {
    const exists = await UserModel.findOne({ username: u.username });
    if (exists) {
      console.log(`Skip existing user '${u.username}'`);
      continue;
    }
    const hashed = bcrypt.hashSync(u.password, 10);
    await new UserModel({ username: u.username, password: hashed, role: u.role }).save();
    console.log(`Created user '${u.username}' (role=${u.role})`);
    created++;
  }

  console.log(`Done. Created ${created} new users.`);
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
