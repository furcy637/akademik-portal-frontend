require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schemas
const AnnouncementSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const JobPostingSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: 'Aktif' },
  applicationDeadline: Date,
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);
const JobPosting = mongoose.model('JobPosting', JobPostingSchema);

// API Routes

// 1. Duyuruları Listeleme
app.get('/api/admin/announcements', async (req, res) => {
  const announcements = await Announcement.find();
  res.json(announcements);
});

// 2. Yeni Duyuru Ekleme
app.post('/api/admin/announcements', async (req, res) => {
  const announcement = new Announcement(req.body);
  await announcement.save();
  res.status(201).json(announcement);
});

// 3. Duyuru Güncelleme
app.put('/api/admin/announcements/:id', async (req, res) => {
  const { id } = req.params;
  const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedAnnouncement) return res.status(404).json({ error: 'Announcement not found' });
  res.json(updatedAnnouncement);
});

// 4. İlanları Listeleme
app.get('/api/admin/job-postings', async (req, res) => {
  const jobPostings = await JobPosting.find();
  res.json(jobPostings);
});

// 5. Yeni İlan Ekleme
app.post('/api/admin/job-postings', async (req, res) => {
  const jobPosting = new JobPosting(req.body);
  await jobPosting.save();
  res.status(201).json(jobPosting);
});

// 6. İlan Güncelleme
app.put('/api/admin/job-postings/:id', async (req, res) => {
  const { id } = req.params;
  const updatedJobPosting = await JobPosting.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedJobPosting) return res.status(404).json({ error: 'Job posting not found' });
  res.json(updatedJobPosting);
});

app.listen(PORT, () => {
  console.log(`Admin API is running on http://localhost:${PORT}`);
});