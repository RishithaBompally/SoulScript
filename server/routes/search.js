const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Search by title or content
router.get('/', async (req, res) => {
  const { q, tag, category } = req.query;
  const filter = {};

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
    ];
  }

  if (tag) filter.tags = tag;
  if (category) filter.category = category;

  const blogs = await Blog.find(filter);
  res.json(blogs);
});

module.exports = router;
