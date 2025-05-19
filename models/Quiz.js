import mongoose from 'mongoose'

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true }
})

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true }
})

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema)
