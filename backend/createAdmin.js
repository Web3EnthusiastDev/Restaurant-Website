import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  { name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: "user" }, cartData: { type: Object, default: {} } },
  { minimize: false }
);
const User = mongoose.models.user || mongoose.model("user", userSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URL);
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashed = await bcrypt.hash("admin1234", salt);
  await User.findOneAndUpdate(
    { email: "admin@bhawalpur.com" },
    { name: "Admin", email: "admin@bhawalpur.com", password: hashed, role: "admin" },
    { upsert: true, new: true }
  );
  console.log("Admin user ready — email: admin@bhawalpur.com  password: admin1234");
  await mongoose.disconnect();
}

run().catch(console.error);
