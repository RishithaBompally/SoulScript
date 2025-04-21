const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: String,
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default:[]
  }],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default:[]
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
