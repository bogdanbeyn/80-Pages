import React, { useState, useEffect, useContext } from 'react';
import { pagesAPI, commentsAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { Edit, Trash2, Eye, MessageCircle, Calendar, User } from 'lucide-react';

const AdminPanel = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('pages');
  const [pages, setPages] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'pages') {
        const response = await pagesAPI.getPages({ limit: 100 });
        setPages(response.data.pages);
      } else {
        // получаем все комментарии через новый API
        const response = await commentsAPI.getAllComments();
        setComments(response.data);
      }
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту страницу?')) {
      return;
    }

    try {
      await pagesAPI.deletePage(pageId);
      setPages(pages.filter(page => page.id !== pageId));
    } catch (err) {
      setError('Ошибка при удалении страницы');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      return;
    }

    try {
      await commentsAPI.deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError('Ошибка при удалении комментария');
    }
  };

  const formatDateRu = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const formatDateEn = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-EN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const headersPages = language === 'ru'
  ? ['Название', 'Автор', 'Категория', 'Дата', 'Комментарии', 'Действия']
  : ['Title', 'Author', 'Category', 'Date', 'Comments', 'Actions'];

  const headersComments = language === 'ru'
  ? ['Комментарий', 'Автор', 'Страница', 'Дата', 'Действия']
  : ['Comment', 'Author', 'Page', 'Date', 'Actions'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* head */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('admin')} {t('panel')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('managePagesAndComments')}
        </p>
      </div>

      {/* tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pages'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            {t('pages')} ({pages.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'comments'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            {t('comments')} ({comments.length})
          </button>
        </nav>
      </div>

      {/* err msgs */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* content */}
      {activeTab === 'pages' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800/90 dark:border-gray-600">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800">

                      <tr>
        {headersPages.map(h => (
          <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
        ))}
      </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-700/90">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {page.imagePath ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={`http://localhost:5000${page.imagePath}`}
                              alt={page.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              📄
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate dark:text-gray-300">
                            {page.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                      {page.createdBy.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-gray-500 dark:text-gray-800">
                        {page.category.name}
                      </span>

                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {language === 'ru' ? formatDateRu(page.createdAt) : formatDateEn(page.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {page._count?.comments || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <a
                          href={`/pages/${page.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800/90 dark:border-gray-600">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800">
<tr>
        {headersComments.map(h => (
          <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
        ))}
      </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-700/90">
                {comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md dark:text-gray-300 ">
                        {comment.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400 ">
                      {comment.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {comment.page.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {language === 'ru' ? formatDateRu(comment.createdAt) : formatDateEn(comment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* empt state */}
      {((activeTab === 'pages' && pages.length === 0) || 
        (activeTab === 'comments' && comments.length === 0)) && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">
            {activeTab === 'pages' ? '📄' : '💬'}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">
            {activeTab === 'pages' ? t('noPages') : t('noCommentsFnd')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {activeTab === 'pages' 
              ? t('noPagesDescAdm')
              : t('noCommentsDescAdm')
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
