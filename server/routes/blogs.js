const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const blogController = require('../controllers/blogController');

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Routes
router.post('/', upload.single('image'), blogController.createBlog); // Use multer for image
router.get('/', blogController.getAllBlogs);
router.get('/category/:category', blogController.getBlogsByCategory);
router.get('/user/:userId', blogController.getUserBlogs); // Get blogs by user
router.get('/:id', blogController.getBlogById); // Get blog by ID
router.put('/:id/like', blogController.likeBlog); // Like or unlike a blog
router.put('/:id/save', blogController.saveBlog); // Save or unsave a blog
router.post('/:id/comment', blogController.addComment); // Add a comment to a blog

module.exports = router;
