// middleware/auth.js

const authMiddleware = (req, res, next) => {
    const userId = req.body.author || req.headers['x-user-id'];
  
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
    }
  
    next();
  };
  
  module.exports = authMiddleware;
  
  