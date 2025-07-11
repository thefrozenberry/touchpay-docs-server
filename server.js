const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const docsRouter = require('./routes/docs');

const app = express();
const PORT = process.env.PORT || 6000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ripun:basumatary@cluster0.buf7x9h.mongodb.net/ApiDoc?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/docs', docsRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
