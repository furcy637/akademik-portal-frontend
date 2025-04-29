require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schemas
const EvaluationSchema = new mongoose.Schema({
  juryId: mongoose.Schema.Types.ObjectId,
  applicationId: mongoose.Schema.Types.ObjectId,
  score: Number,
  comments: String,
});

const Evaluation = mongoose.model('Evaluation', EvaluationSchema);

// API Routes

// 1. Değerlendirme Kaydetme
app.post('/api/jury/evaluations', async (req, res) => {
  const evaluation = new Evaluation(req.body);
  await evaluation.save();
  res.status(201).json(evaluation);
});

// 2. Değerlendirme Detaylarını Getirme
app.get('/api/jury/evaluations/:id', async (req, res) => {
  const { id } = req.params;
  const evaluation = await Evaluation.findById(id);
  if (!evaluation) return res.status(404).json({ error: 'Evaluation not found' });
  res.json(evaluation);
});

app.listen(PORT, () => {
  console.log(`Jury API is running on http://localhost:${PORT}`);
});