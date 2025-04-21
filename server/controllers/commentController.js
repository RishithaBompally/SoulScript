const getComments = async (req, res) => {
    try {
      const comments = await Comment.find({ blogId: req.params.id }).populate('userId', 'username');
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get comments' });
    }
  };
  const blog = await Blog.findById(blogId).populate('comments.userId', 'username');
