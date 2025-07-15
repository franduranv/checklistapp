require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/checklist-app';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const unitRoutes = require('./routes/units');
const checklistRoutes = require('./routes/checklists');

app.use('/api/auth', authRoutes.router);
app.use('/api/units', unitRoutes);
app.use('/api/checklists', checklistRoutes);

app.get('/', (req, res) => {
  res.send('Checklist App Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 