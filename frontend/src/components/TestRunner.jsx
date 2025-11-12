import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { testsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const TestRunner = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [test, setTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      const res = await testsAPI.getTest(id);
      setTest(res.data);
        

    };
    fetchTest();
  }, [id]);

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

    const handleSubmitAnswer = () => {
    const currentQuestion = test.questions[currentIndex];
    const newAnswer = {
        questionId: currentQuestion.id,
        answerId: selectedAnswer
    };

    if (currentIndex + 1 < test.questions.length) {
        setAnswers([...answers, newAnswer]);
        setSelectedAnswer(null);
        setCurrentIndex(currentIndex + 1);
    } else {
        // финальный ответ + отправка
        const finalAnswers = [...answers, newAnswer];
        submitTest(finalAnswers);
    }
    };


    const submitTest = async (finalAnswers) => {
    const res = await testsAPI.submitTest(id, { answers: finalAnswers });
    setResult(res.data);
    setSubmitted(true);
    };


  

  if (!test || !test.questions || test.questions.length === 0) {
  return <div className="text-center py-10 text-gray-400">Загрузка теста или нет вопросов…</div>;
}

  const currentQuestion = test.questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white dark:bg-gray-800/90 rounded-xl shadow-sm border border-gray-300 dark:border-gray-600 p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{test.title}</h2>

      {!submitted ? (
        <>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {language === 'ru' ? 'Вопрос' : 'Question'} {currentIndex + 1} / {test.questions.length}
          </div>
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {currentQuestion.text}
          </div>

          <div className="space-y-3">
            {currentQuestion.answers.map((a) => (
              <button
                key={a.id}
                onClick={() => handleAnswerSelect(a.id)}
                className={`w-full text-left px-4 py-2 rounded-lg border ${
                  selectedAnswer === a.id
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-800/30'
                    : 'border-gray-300 dark:border-gray-600'
                } text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                {a.text}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer == null}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {language === 'ru' ? 'Ответить' : 'Submit'}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {language === 'ru' ? 'Ваш результат' : 'Your result'}: {result.score} / {result.total}
          </div>
          <div className="mt-4 text-gray-600 dark:text-gray-300">
            {language === 'ru' ? 'Спасибо за прохождение!' : 'Thanks for completing the test!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestRunner;
