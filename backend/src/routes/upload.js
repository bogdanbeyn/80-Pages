const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// настройка multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // создание папки, если она не существует
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // генерация уникального имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `image-${uniqueSuffix}${ext}`);
  }
});

// фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // лимит 5 метров
  },
  fileFilter: fileFilter
});

// загрузка (только авториз)
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // относит путь
    const imagePath = `/uploads/${req.file.filename}`;

    res.json({
      message: 'Image uploaded successfully',
      imagePath: imagePath,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// удаление (только авториз)
router.delete('/:filename', authMiddleware, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', filename);

    // существует ли файл
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

//обработка ошибок multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
  }
  
  if (error.message === 'Only image files (JPEG, PNG, GIF, WebP) are allowed!') {
    return res.status(400).json({ message: error.message });
  }
  
  res.status(500).json({ message: 'Upload error' });
});

module.exports = router;
