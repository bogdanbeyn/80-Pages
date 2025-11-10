const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const categoryRoutes = require('./routes/categories');
const commentRoutes = require('./routes/comments');
const uploadRoutes = require('./routes/upload');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://frontend-production-39fb.up.railway.app', 'https://www.bogdanbeyn.online'] 
    : ['http://localhost:4173', 'http://localhost:5000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// стат файлы
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// роуты
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '[Server. MADE BY BOGDANBEYN] Server is running' });
});

app.get('/', (req, res) => {
  res.send('Backend is alive');
});


// err handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: '[Server. MADE BY BOGDANBEYN] Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: '[Server. MADE BY BOGDANBEYN] Route not found' });
});

app.listen(PORT, () => {
  console.log(`[MADE BY BOGDANBEYN] Server running on port ${PORT}`);
  console.log(`[MADE BY BOGDANBEYN] Uploads directory: ${path.join(__dirname, '../uploads')}`);
});
