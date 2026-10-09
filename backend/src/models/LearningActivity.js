import mongoose from 'mongoose';

const learningActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['tutor', 'notes', 'quiz'], required: true },
  prompt: { type: String, required: true, maxlength: 12000 },
  result: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

export default mongoose.model('LearningActivity', learningActivitySchema);
