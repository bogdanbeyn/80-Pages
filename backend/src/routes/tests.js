const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

const testValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question required'),
  body('questions.*.text').trim().isLength({ min: 1 }).withMessage('Question text required'),
  body('questions.*.answers').isArray({ min: 4 }).withMessage('Each question must have 4 answers'),
  body('questions.*.answers.*.text').trim().isLength({ min: 1 }).withMessage('Answer text required'),
  body('questions.*.answers').custom(arr => arr.filter(a => a.isCorrect).length === 1)
    .withMessage('Each question must have exactly 1 correct answer')
];

// создание
router.post('/', authMiddleware, adminOnly, testValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { title, questions } = req.body;

    const test = await prisma.test.create({
      data: {
        title,
        questions: {
          create: questions.map(q => ({
            text: q.text,
            answers: {
              create: q.answers.map(a => ({
                text: a.text,
                isCorrect: a.isCorrect
              }))
            }
          }))
        }
      },
      include: {
        questions: { include: { answers: true } }
      }
    });

    res.status(201).json({ message: 'Test created successfully', test });
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// список тестов
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tests = await prisma.test.findMany({
      include: {
        questions: true,
        results: true
      }
    });

    const testsWithMeta = tests.map(t => {
      const questionsCount = t.questions.length;

      const lastResult = t.results
        .filter(r => r.userId === req.user.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;

      let averageFailRate = 0;
      if (t.results.length > 0) {
        const scores = t.results.map(r => r.score / r.total);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        averageFailRate = 1 - avgScore;
      }

      let difficulty = '';
      if (t.results.length > 5) {
        difficulty = Math.min(
          5,
          Math.max(
            1,
            Math.round((questionsCount / 5) + (averageFailRate * 5))
          )
        );
      }

      return {
        ...t,
        lastResult,
        difficulty
      };
    });

    res.json({ tests: testsWithMeta });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





// получение теста по айди с вопросами
router.get('/:id', async (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            answers: { select: { id: true, text: true } } 
          }
        }
      }
    });

    if (!test) return res.status(404).json({ message: 'Test not found' });

    res.json(test);
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// отправка результата
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    const { answers } = req.body;

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: { include: { answers: true } }
      }
    });

    if (!test) return res.status(404).json({ message: 'Test not found' });

    let score = 0;
    const total = test.questions.length;

    const userAnswers = answers.map(ans => {
      const question = test.questions.find(q => q.id === ans.questionId);
      const answer = question?.answers.find(a => a.id === ans.answerId);
      const isCorrect = answer?.isCorrect || false;
      if (isCorrect) score++;
      return { questionId: ans.questionId, answerId: ans.answerId, isCorrect };
    });


    console.log('Создаём TestResult:', {
  userId: req.user.id,
  testId,
  score,
  total,
  answers: userAnswers
});

    const result = await prisma.testResult.create({
      data: {
        userId: req.user.id,
        testId,
        score,
        total,
        answers: {
          create: userAnswers.map(ua => ({
            questionId: ua.questionId,
            answerId: ua.answerId,
            isCorrect: ua.isCorrect
          }))
        }
      },
      include: { answers: true }
    });

    res.json({ score, total, resultId: result.id });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// результаты пользователя
router.get('/:id/results', authMiddleware, async (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    const results = await prisma.testResult.findMany({
      where: { testId, userId: req.user.id },
      include: { answers: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ results });
  } catch (error) {
    console.error('Get test results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
