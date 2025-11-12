const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../db');
const { authMiddleware, adminOnly, moderOnly, moderOrAdmin } = require('../middleware/auth');

const router = express.Router();

// валид
const commentValidation = [
  body('text').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('pageId').isInt({ min: 1 }).withMessage('Valid page ID is required'),
  body('parentId').optional().isInt({ min: 1 }).withMessage('Valid parent comment ID is required')
];

const bannedWords = ['дурак', 'тупой', 'идиот', 'ненавижу'];

// все комментарии
router.get('/all', authMiddleware, moderOrAdmin, async (req, res) => {
  try {
    const { pageId, flaggedOnly } = req.query;

    const where = {};

    if (!isNaN(parseInt(pageId))) {
      where.pageId = parseInt(pageId);
    }

    if (flaggedOnly === 'true') {
      where.isFlagged = true;
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        _count: { select: { replies: true } },
        user: { select: { id: true, name: true, role: true } },
        page: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ comments });
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// комментарии для страницы
router.get('/page/:pageId', authMiddleware, async (req, res) => {
  try {
    const pageId = parseInt(req.params.pageId);
    if (isNaN(pageId)) {
      return res.status(400).json({ message: 'Invalid page ID' });
    }

    const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'MODER';

    const comments = await prisma.comment.findMany({
      where: {
        pageId,
        parentId: null,
        ...(isAdmin ? {} : { isFlagged: false }) // 👈 фильтрация для обычных
      },
      include: {
        user: { select: { id: true, name: true } },
        replies: {
          where: isAdmin ? {} : { isFlagged: false }, // 👈 фильтрация вложенных
          include: {
            _count: { select: { replies: true } },
            user: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// создание (только авториз)
router.post('/', authMiddleware, commentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { text, pageId, parentId } = req.body;
    const lowerText = text.toLowerCase();
    const containsBanned = bannedWords.some(word => lowerText.includes(word));

    // существует ли страница
    const page = await prisma.page.findUnique({
      where: { id: parseInt(pageId) }
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    // если это ответ на комментарий, проверяем существование родительского комментария
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parseInt(parentId) }
      });

      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        pageId: parseInt(pageId),
        userId: req.user.id,
        parentId: parentId ? parseInt(parentId) : null,
        isFlagged: containsBanned
      },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    });

    if (containsBanned) {
      return res.status(201).json({
        message: 'Комментарий отправлен на модерацию',
        flagged: true,
        comment
      });
    }

    res.status(201).json({
      message: 'Comment created successfully',
      flagged: false,
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/approve', authMiddleware, moderOrAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await prisma.comment.update({
      where: { id },
      data: { isFlagged: false }
    });
    res.json({ message: 'Comment approved succesfully', updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// удаление
router.delete('/:id', authMiddleware, moderOrAdmin, async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }

    // существует ли
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
