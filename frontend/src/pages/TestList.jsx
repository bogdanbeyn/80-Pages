import React, { useEffect, useState } from 'react';
import { testsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const TestList = () => {
  const {t, language} = useLanguage();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await testsAPI.getAllTests();
        setTests(res.data.tests);
      } catch (err) {
        console.error('Ошибка загрузки тестов:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

if (loading && tests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={useEffect}
          className="btn-primary"
        >
          Попробовать снова
        </button>
      </div>
    );
  }


  const headers = language === 'ru' ? ['Название теста', 'Сложность*', 'Последний результат', 'Действие'] : ['title', 'Difficulty*', 'Last result', 'Action'];
 
  return (
        <div className="space-y-8">
      {/* head */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-light mb-4">
          {t('testsTitle')}
        </h1>
        <p className="text-lg dark:text-gray-300 max-w-2xl mx-auto">
          {t('testsDescription')}
        </p>
      </div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800/90 dark:border-gray-600">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {headers.map(h => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-700/90">
            {tests.map(test => (
              <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                  {test.title}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                  {test.difficulty ? test.difficulty : language === 'ru' ? 'Не выявлена' : 'Not identified'}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                  {user && test.lastResult
                    ? `${test.lastResult.score}/${test.lastResult.total}`
                    : user
                      ? (language==='ru' ? 'Нет результатов' : 'No results')
                      : '—'}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user ? (
                    <Link
                      to={`/tests/${test.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {language === 'ru' ? 'Начать тест' : 'Start the test'}
                    </Link>
                  ) : (
                    <span className='text-gray-900 dark:text-gray-300'>{language === 'ru' ? 'Для прохождения теста нужно ' : 'To start the test you need to '}<Link
                      to="/login"
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {language === 'ru' ? 'авторизоваться' : 'log in'}
                    </Link></span>
                    
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      <div>{language === 'ru' ? `* вычисляется по формуле: ` : '* calculated by the formula: '}<b><i>Difficulty=Round((Questions_Count×0.7)+(Average_Fail_  Rate×0.3))</i></b></div>
    </div>
  );
};

export default TestList;
