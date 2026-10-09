import { Router } from 'express';
import OpenAI from 'openai';
import requireAuth from '../middleware/auth.js';
import LearningActivity from '../models/LearningActivity.js';

const router = Router();
router.use(requireAuth);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askModel(instructions, input) {
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    instructions,
    input
  });
  const text = response.output_text?.trim();
  if (!text) throw Object.assign(new Error('The AI returned an empty response. Please try again.'), { status: 502 });
  return text;
}

function parseJson(text) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(cleaned); }
  catch { throw Object.assign(new Error('The AI response could not be formatted. Please try again.'), { status: 502 }); }
}

router.get('/history', async (req, res, next) => {
  try {
    const items = await LearningActivity.find({ user: req.user._id })
      .sort({ createdAt: -1 }).limit(20).select('type prompt result createdAt');
    res.json({ items });
  } catch (err) { next(err); }
});

router.post('/tutor', async (req, res, next) => {
  try {
    const question = String(req.body.question || '').trim();
    if (question.length < 3 || question.length > 6000) return res.status(400).json({ message: 'Question must be between 3 and 6,000 characters.' });
    const answer = await askModel(
      'You are EduAI, a patient educational tutor. Explain concepts clearly for students. Use headings and examples when helpful. Encourage understanding rather than simply giving unexplained answers. If a question is unsafe or unrelated to learning, respond appropriately.',
      question
    );
    const item = await LearningActivity.create({ user: req.user._id, type: 'tutor', prompt: question, result: answer });
    res.json({ answer, activityId: item._id });
  } catch (err) { next(err); }
});

router.post('/notes', async (req, res, next) => {
  try {
    const topic = String(req.body.topic || '').trim();
    const sourceText = String(req.body.text || '').trim();
    if (topic.length < 2 && sourceText.length < 30) return res.status(400).json({ message: 'Enter a topic or at least 30 characters of study text.' });
    if (topic.length > 300 || sourceText.length > 10000) return res.status(400).json({ message: 'Topic or text is too long.' });
    const input = `Topic: ${topic || 'Summarize the supplied study text'}\n\nStudy text:\n${sourceText || '(No source text supplied. Create a concise topic overview.)'}`;
    const notes = await askModel(
      'You are EduAI Study Notes. Produce accurate, concise study notes in Markdown with a short overview, key concepts, definitions, and a quick revision section. Do not invent citations or claim to have read material not supplied.',
      input
    );
    const item = await LearningActivity.create({ user: req.user._id, type: 'notes', prompt: topic || sourceText.slice(0, 250), result: notes });
    res.json({ notes, activityId: item._id });
  } catch (err) { next(err); }
});

router.post('/quiz', async (req, res, next) => {
  try {
    const topic = String(req.body.topic || '').trim();
    const count = Math.min(10, Math.max(3, Number.parseInt(req.body.count, 10) || 5));
    if (topic.length < 2 || topic.length > 300) return res.status(400).json({ message: 'Enter a topic between 2 and 300 characters.' });
    const raw = await askModel(
      `Create exactly ${count} educational multiple-choice questions for the supplied topic. Return ONLY valid JSON in this schema: {"questions":[{"question":"...","options":["A","B","C","D"],"answerIndex":0,"explanation":"..."}]}. answerIndex must be 0-3. Keep options plausible and explanations concise.`,
      topic
    );
    const data = parseJson(raw);
    if (!Array.isArray(data.questions) || data.questions.length === 0) throw Object.assign(new Error('The AI did not return valid quiz questions. Please try again.'), { status: 502 });
    const questions = data.questions.slice(0, count).map(q => ({
      question: String(q.question || ''),
      options: Array.isArray(q.options) ? q.options.slice(0, 4).map(String) : [],
      answerIndex: Math.min(3, Math.max(0, Number(q.answerIndex) || 0)),
      explanation: String(q.explanation || '')
    })).filter(q => q.question && q.options.length === 4);
    const item = await LearningActivity.create({ user: req.user._id, type: 'quiz', prompt: topic, result: questions });
    res.json({ questions, activityId: item._id });
  } catch (err) { next(err); }
});

export default router;
