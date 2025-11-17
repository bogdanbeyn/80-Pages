const express = require('express');
const prisma = require('../db');
const { authMiddleware, adminOnly, moderOnly } = require('../middleware/auth');

const router = express.Router();

// все пользователи (для админки)
router.get('/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany(
      {
        include:{
          _count: {
            select: {comments: true}
          }
        },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // существует ли
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(existingUser.isDeleted == true){
            await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted:false
      }
    });
    } else {

    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted:true
      }
    });}

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// удаление
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // существует ли
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'User deleted permanently' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
