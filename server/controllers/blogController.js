const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const User = require('../models/User');

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, content, category, userId} = req.body;
    const image=req.file ?req.file.filename:null;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const blog = new Blog({
      title,
      content,
      category,
      author: userId, // ✅ correct field
      image,
      likes: [],
      saves: [],
      comments: [],
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username') // populate author with just username
      .populate('comments.userId', 'username'); // populate commenter with username

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs.' });
  }
};

// Get blogs by category
const getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const blogs = await Blog.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching category blogs:', err);
    res.status(500).json({ message: 'Failed to fetch category blogs' });
  }
};

// Get blogs by user
const getUserBlogs = async (req, res) => {
  const { userId } = req.params;
  try {
    const blogs = await Blog.find({ author: userId }).populate('author', 'username');
    if (!blogs) return res.status(404).json({ message: 'No blogs found for this user' });
    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching user blogs:', err);
    res.status(500).json({ message: 'Failed to fetch user blogs' });
  }
};

// Get a blog by ID
const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id)
      .populate('author', 'username')
      .populate('comments.userId', 'username');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch blog' });
  }
};
// Like or unlike a blog
const likeBlog = async (req, res) => {
  try {
    const { userId } = req.body;
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    console.log(`Blog found: ${blog.title}, likes: ${blog.likes.length}`); // Add logging to track the blog data

    // Handle likes toggle
    blog.likes = blog.likes || [];
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const index = blog.likes.findIndex(id => id.equals(userObjectId));

    if (index === -1) {
      blog.likes.push(userObjectId); // Add the like
    } else {
      blog.likes.splice(index, 1); // Remove the like
    }

    await blog.save();
    console.log(`Updated likes: ${blog.likes.length}`); // Log the updated likes
    res.status(200).json({ likes: blog.likes });
  } catch (err) {
    console.error('🔥 Error in likeBlog:', err);
    res.status(500).json({ message: 'Server error while liking blog', error: err.message });
  }
};

// Save or unsave a blog
const saveBlog = async (req, res) => {
  try {
    const { userId } = req.body;
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    console.log(`Blog found: ${blog.title}, saves: ${blog.saves.length}`); // Add logging to track the blog data

    // Handle saves toggle
    blog.saves = blog.saves || [];
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const index = blog.saves.findIndex(id => id.equals(userObjectId));

    if (index === -1) {
      blog.saves.push(userObjectId); // Add the save
    } else {
      blog.saves.splice(index, 1); // Remove the save
    }

    await blog.save();
    console.log(`Updated saves: ${blog.saves.length}`); // Log the updated saves
    res.status(200).json({ saves: blog.saves });
  } catch (err) {
    console.error('🔥 Error in saveBlog:', err);
    res.status(500).json({ message: 'Server error while saving blog', error: err.message });
  }
};

// Add a comment
const addComment = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const comment = {
      userId,
      text,
      createdAt: new Date(),
    };

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.comments.push(comment);
    await blog.save();

    console.log(`New comment added, total comments: ${blog.comments.length}`); // Log the new comment count
    res.status(200).json({ comments: blog.comments });
  } catch (err) {
    console.error('🔥 Error in addComment:', err);
    res.status(500).json({ message: 'Server error while commenting', error: err.message });
  }
};
module.exports = {
  createBlog,
  getAllBlogs,
  getBlogsByCategory,
  getUserBlogs,  // Make sure this is exported correctly
  getBlogById,
  likeBlog,
  saveBlog,
  addComment
};
