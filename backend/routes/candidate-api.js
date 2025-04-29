require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3003;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schemas
const ApplicationSchema = new mongoose.Schema({
  candidateId: mongoose.Schema.Types.ObjectId,
  jobPostingId: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: 'Beklemede' },
  details: String,
});

const JobPostingSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Application = mongoose.model('Application', ApplicationSchema);
const JobPosting = mongoose.model('JobPosting', JobPostingSchema);

// API Routes

// 1. İş İlanlarını Listeleme
app.get('/api/candidate/job-postings', async (req, res) => {
  const jobPostings = await JobPosting.find();
  res.json(jobPostings);
});

// 2. Başvuruları Listeleme
app.get('/api/candidate/applications', async (req, res) => {
  const { candidateId } = req.query;
  const applications = await Application.find({ candidateId });
  res.json(applications);
});

// 3. Yeni Başvuru Yapma
app.post('/api/candidate/applications', async (req, res) => {
  const application = new Application(req.body);
  await application.save();
  res.status(201).json(application);
});

app.listen(PORT, () => {
  console.log(`Candidate API is running on http://localhost:${PORT}`);
});