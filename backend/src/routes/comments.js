const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// валид
const commentValidation = [
  body('text').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('pageId').isInt({ min: 1 }).withMessage('Valid page ID is required')
];

// комментарии для страницы
router.get('/page/:pageId', async (req, res) => {
  try {
    const pageId = parseInt(req.params.pageId);
    
    if (isNaN(pageId)) {
      return res.status(400).json({ message: 'Invalid page ID' });
    }

    const comments = await prisma.comment.findMany({
      where: { pageId },
      include: {
        user: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(comments);
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

    const { text, pageId } = req.body;

    // существует ли
    const page = await prisma.page.findUnique({
      where: { id: parseInt(pageId) }
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        pageId: parseInt(pageId),
        userId: req.user.id
      },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// удаление (только admin)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
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
