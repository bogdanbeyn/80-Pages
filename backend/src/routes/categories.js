const express = require('express');
const prisma = require('../db');

const router = express.Router();

// все категории
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { pages: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// категория по id
router.get('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        pages: {
          include: {
            createdBy: {
              select: { id: true, name: true }
            },
            _count: {
              select: { comments: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
