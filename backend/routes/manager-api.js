require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schemas
const JurorSchema = new mongoose.Schema({
  name: String,
  role: String,
});

const CriterionSchema = new mongoose.Schema({
  name: String,
  weight: Number,
});

const Juror = mongoose.model('Juror', JurorSchema);
const Criterion = mongoose.model('Criterion', CriterionSchema);

// API Routes

// 1. Jüri Üyelerini Listeleme
app.get('/api/manager/jurors', async (req, res) => {
  const jurors = await Juror.find();
  res.json(jurors);
});

// 2. Yeni Jüri Üyesi Ekleme
app.post('/api/manager/jurors', async (req, res) => {
  const juror = new Juror(req.body);
  await juror.save();
  res.status(201).json(juror);
});

// 3. Kriterleri Listeleme
app.get('/api/manager/criteria', async (req, res) => {
  const criteria = await Criterion.find();
  res.json(criteria);
});

// 4. Yeni Kriter Ekleme
app.post('/api/manager/criteria', async (req, res) => {
  const criterion = new Criterion(req.body);
  await criterion.save();
  res.status(201).json(criterion);
});

app.listen(PORT, () => {
  console.log(`Manager API is running on http://localhost:${PORT}`);
});