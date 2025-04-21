const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const path = require('path');
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // parses incoming JSON payloads

// ✅ MongoDB connection
mongoose.connect('mongodb://localhost:27017/blogging', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes); // Important: /api/blogs must match what frontend is calling
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ✅ Root test route (optional for basic testing)
app.get('/', (req, res) => {
  res.send('🚀 Blog API is running!');
});

// ✅ Catch-all route for unknown endpoints (good practice)
app.use((req, res) => {
  res.status(404).json({ message: '❌ API route not found' });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
