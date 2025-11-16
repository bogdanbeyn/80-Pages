import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { testsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const TestRunner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t, language } = useLanguage();

    const [test, setTest] = useState(null);
    const [currentIndex, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => {
                navigate('/tests'); 
            }, 10000); 

            return () => clearTimeout(timer);
        }
    }, [submitted, navigate]);

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
            setCurrentQuestion(currentIndex + 1);
        } else {
            const finalAnswers = [...answers, newAnswer];
            submitTest(finalAnswers);
        }
    };

    const submitTest = async (finalAnswers) => {
        const res = await testsAPI.submitTest(id, { answers: finalAnswers });
        setResult(res.data);
        setSubmitted(true);
    };

    const handleGoBack = () => {
        navigate('/tests');
    };

    if (!test || !test.questions || test.questions.length === 0) {
        return <div className="text-center py-10 text-gray-400">{t('loadingTest')}</div>;
    }

    const currentQuestion = test.questions[currentIndex];

    const submitButtonText = t('submitAnswer') || (language === 'ru' ? 'Ответить' : 'Submit');
    const goBackButtonText = t('backToTests') || (language === 'ru' ? 'Вернуться к тестам' : 'Back to Tests');

    return (
        <div className="max-w-2xl mx-auto mt-8 bg-white dark:bg-gray-800/90 rounded-xl shadow-sm border border-gray-300 dark:border-gray-600 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{test.title}</h2>

            {!submitted ? (
                <>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {t('question')} {currentIndex + 1} / {test.questions.length}
                    </div>
                    <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {currentQuestion.text}
                    </div>

                    <div className="space-y-3">
                        {currentQuestion.answers.map((a) => (
                            <button
                                key={a.id}
                                onClick={() => handleAnswerSelect(a.id)}
                                className={`w-full text-left px-4 py-2 rounded-lg border transition-all duration-200 ${
                                    selectedAnswer === a.id
                                        ? 'border-red-600 bg-red-100 dark:bg-red-900/50 shadow-md'
                                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                } text-gray-800 dark:text-gray-100`}
                            >
                                {a.text}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={selectedAnswer == null}
                            className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-md disabled:opacity-50"
                        >
                            {submitButtonText}
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-10">
                    <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
                        {t('yourResult')}: {result.score} / {result.total}
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {t('thanksForTest')}
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={handleGoBack}
                            className="btn-primary" 
                        >
                            {goBackButtonText}
                        </button>
                    </div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                         {t('redirectMessage')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TestRunner;