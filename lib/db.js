// /lib/db.js
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) throw new Error('Defina MONGODB_URI em .env.local');

const URI = process.env.MONGODB_URI;
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(URI).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}