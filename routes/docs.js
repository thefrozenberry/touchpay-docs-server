const express = require('express');
const ApiDoc = require('../models/ApiDoc');
const router = express.Router();

// GET /api/docs?search=...
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter = {
        $or: [
          { api_title: regex },
          { method: regex },
          { endpoint: regex }
        ]
      };
    }
    const docs = await ApiDoc.find(filter).sort({ title: 1, subtitle: 1, api_title: 1 });
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// GET /api/docs/sidebar
router.get('/sidebar', async (req, res, next) => {
  try {
    const docs = await ApiDoc.find({}, '_id title subtitle api_title').sort({ title: 1, subtitle: 1, api_title: 1 });
    // Group by title and subtitle
    const sidebar = [];
    const titleMap = {};
    docs.forEach(doc => {
      if (!titleMap[doc.title]) {
        titleMap[doc.title] = { title: doc.title, subtitles: [] };
        sidebar.push(titleMap[doc.title]);
      }
      let subtitleObj = titleMap[doc.title].subtitles.find(s => s.subtitle === doc.subtitle);
      if (!subtitleObj) {
        subtitleObj = { subtitle: doc.subtitle, apis: [] };
        titleMap[doc.title].subtitles.push(subtitleObj);
      }
      subtitleObj.apis.push({ _id: doc._id, api_title: doc.api_title });
    });
    res.json(sidebar);
  } catch (err) {
    next(err);
  }
});

// GET /api/docs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await ApiDoc.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// POST /api/docs
router.post('/', async (req, res, next) => {
  try {
    const doc = new ApiDoc(req.body);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// PUT /api/docs/:id
router.put('/:id', async (req, res, next) => {
  try {
    const doc = await ApiDoc.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// DELETE /api/docs/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await ApiDoc.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 