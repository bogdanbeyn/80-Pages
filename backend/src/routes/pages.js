const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// валид
const pageValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('categoryId').isInt({ min: 1 }).withMessage('Valid category ID is required'),
  body('imagePath').trim().notEmpty().withMessage('Image path is required')
];

// все страницы с пагин
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const categoryId = req.query.categoryId;
    const search = req.query.search;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        include: {
          category: true,
          createdBy: {
            select: { id: true, name: true }
          },
          _count: {
            select: { comments: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.page.count({ where })
    ]);

    res.json({
      pages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/by-comments', async (req, res) => {
  try {
    const pages = await prisma.page.findMany({
      include: {
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        comments: {
          _count: 'desc'
        }
      },
      take: 100
    });

    res.json({ pages });
  } catch (error) {
    console.error('Get pages by comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// страница по id
router.get('/:id', async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    
    if (isNaN(pageId)) {
      return res.status(400).json({ message: 'Invalid page ID' });
    }

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        category: true,
        createdBy: {
          select: { id: true, name: true }
        },
        comments: {
          where: { parentId: null }, // только родительские комментарии
          include: {
            user: {
              select: { id: true, name: true }
            },
            replies: {
              include: {
                user: {
                  select: { id: true, name: true }
                }
              },
              orderBy: { createdAt: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// создание (только admin)
router.post('/', authMiddleware, adminOnly, pageValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, content, categoryId, imagePath } = req.body;

    // существует ли
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const page = await prisma.page.create({
      data: {
        title,
        content,
        imagePath,
        categoryId: parseInt(categoryId),
        createdById: req.user.id
      },
      include: {
        category: true,
        createdBy: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json({
      message: 'Page created successfully',
      page
    });
  } catch (error) {
    console.error('Create page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// обновление (только admin)
router.put('/:id', authMiddleware, adminOnly, pageValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const pageId = parseInt(req.params.id);
    const { title, content, categoryId, imagePath } = req.body;

    if (isNaN(pageId)) {
      return res.status(400).json({ message: 'Invalid page ID' });
    }

    // существует ли страница
    const existingPage = await prisma.page.findUnique({
      where: { id: pageId }
    });

    if (!existingPage) {
      return res.status(404).json({ message: 'Page not found' });
    }

    // существует ли категория
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const page = await prisma.page.update({
      where: { id: pageId },
      data: {
        title,
        content,
        imagePath,
        categoryId: parseInt(categoryId)
      },
      include: {
        category: true,
        createdBy: {
          select: { id: true, name: true }
        }
      }
    });

    res.json({
      message: 'Page updated successfully',
      page
    });
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// удаление (только admin)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);

    if (isNaN(pageId)) {
      return res.status(400).json({ message: 'Invalid page ID' });
    }

    // существует ли страница
    const existingPage = await prisma.page.findUnique({
      where: { id: pageId }
    });

    if (!existingPage) {
      return res.status(404).json({ message: 'Page not found' });
    }

    await prisma.page.delete({
      where: { id: pageId }
    });

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
