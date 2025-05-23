import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  image: String,
  role: { type: String, enum: ['user','admin'], default: 'user' }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
