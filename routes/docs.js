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

// GET /api/docs/status-codes
router.get('/status-codes', (req, res) => {
  res.json([
    { code: 200, label: 'OK', meaning: 'Success', description: 'Standard response for successful requests.' },
    { code: 201, label: 'Created', meaning: 'Resource Created', description: 'Used after creating a resource (like user registration).' },
    { code: 202, label: 'Accepted', meaning: 'Queued or Processing', description: 'Request accepted but not fully processed yet.' },
    { code: 400, label: 'Bad Request', meaning: 'Invalid request', description: 'Something is wrong with the input.' },
    { code: 401, label: 'Unauthorized', meaning: 'Missing or invalid auth', description: 'User is not authenticated (e.g., missing token).' },
    { code: 403, label: 'Forbidden', meaning: 'Authenticated but no permission', description: 'You do not have access to this resource.' },
    { code: 404, label: 'Not Found', meaning: 'Resource missing', description: 'The requested resource (like a user or record) does not exist.' },
    { code: 409, label: 'Conflict', meaning: 'Duplicate or conflict', description: 'E.g., user already exists or record conflict.' },
    { code: 422, label: 'Unprocessable Entity', meaning: 'Validation error', description: 'Input was understood but had semantic errors.' },
    { code: 500, label: 'Internal Server Error', meaning: 'Unexpected error', description: 'Server crashed or unexpected condition.' },
    { code: 503, label: 'Service Unavailable', meaning: 'Server down or overloaded', description: 'Try again later.' }
  ]);
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