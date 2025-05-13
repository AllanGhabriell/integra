import mongoose from 'mongoose'
const ResultadoSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: Number,
  score: Number,
  createdAt: { type: Date, default: Date.now }
})
export default mongoose.models.Resultado || mongoose.model('Resultado', ResultadoSchema)
