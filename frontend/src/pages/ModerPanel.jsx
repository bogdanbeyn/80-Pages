import React, { useState, useEffect, useRef } from 'react';
import { commentsAPI, pagesAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import CommentCard from '../components/CommentCard';
import ModalConfirm from '../components/Modal/ModalConfirm';
import { Search, Filter, Calendar, User, MessageCircle, BookIcon } from 'lucide-react';

const ModerPanel = () => {
  const { t } = useLanguage();
  const [comments, setComments] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const initialPageId = queryParams.get('pageId') || '';
  const [filters, setFilters] = useState({
    pageId: initialPageId,
    page: 1,
  });
const [modalOpen, setModalOpen] = useState(false);
const [commentToDelete, setCommentToDelete] = useState(null);

  const fetchPages = async () => {
    try {
      const response = await pagesAPI.getPagesByComments();
      setPages(response.data.pages);
    } catch (err) {
      console.error('Ошибка загрузки страниц:', err);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

const fetchComments = async (pageId = filters.pageId) => {
  try {
    setIsFetching(true);

    const params = {};
    if (pageId) {
      params.pageId = pageId;
    }

    const response = await commentsAPI.getAllComments(params);
    setComments(Array.isArray(response?.data?.comments) ? response.data.comments : []);
  } catch (err) {
    console.error('Ошибка загрузки комментариев:', err);
    setComments([]);
  } finally {
    setIsFetching(false);
  }
};

useEffect(() => {
  fetchPages();
}, []);


useEffect(() => {
  fetchComments(filters.pageId); // всегда вызывается
}, [filters.pageId]);


  const handlePageSelectChange = (e) => {
    setFilters(prev => ({
      ...prev,
      pageId: e.target.value,
      page: 1
    }));
  };

  const handleDeleteComment = async (commentId) => {
  try {
    await commentsAPI.deleteComment(commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
    fetchPages();
  } catch (err) {
    console.error('Ошибка удаления комментария:', err);
    setError(t('deleteError'));
  }
};

const openConfirmModal = (comment) => {
  setCommentToDelete(comment);
  setModalOpen(true);
};

const confirmDelete = async () => {
  if (!commentToDelete) return;
  await handleDeleteComment(commentToDelete.id);
  setModalOpen(false);
};



if (loading) {
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
          onClick={fetchComments}
          className="btn-primary"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* head */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('moder')} {t('panel')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('manageComments')}
        </p>
      </div>

      
      <div className="bg-white dark:bg-gray-800/90 rounded-xl shadow-sm border border-gray-200 p-6 dark:border-gray-600">
            <div className="relative">
              <BookIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filters.pageId}
                onChange={handlePageSelectChange}
                className="input-field pl-10 appearance-none dark:bg-gray-700/90"
              >
                <option value="">{t('commentsFilterByPage')}</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title} ({page._count.comments})
                  </option>
                ))}
              </select>
        </div>
      </div>

      {/* results info 
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">
          {t('pagesFound')}: <span className="font-semibold">{pagination.total || 0}</span>
        </p>
        {filters.search && (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {t('search')}: "{filters.search}"
          </p>
        )}
      </div>*/}

      {/* pg grid */}
      {comments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comments.map((comment) => (
              <CommentCard comment={comment} onDelete={() => openConfirmModal(comment)} />
              
            ))}
            
            <ModalConfirm
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={confirmDelete}
              title={t('confirmCommentDelete')}
              message={t('deleteWarning')}
              confirmText={t('delete')}
              cancelText={t('cancel')}
            />
          </div>

          {/* pagination 
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800/90 dark:text-gray-300 dark:border-gray-600"
              >
                {t('back')}
              </button>
              
              {Array.from({ length: Math.min(7, pagination.pages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      filters.page === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800/90 dark:border-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === pagination.pages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800/90 dark:border-gray-600 dark:text-gray-300"
              >
                {t('next')}
              </button>
            </div>
          )}*/}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">
            {t('noPages')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('noPagesDesc')}
          </p>
        </div>
      )}
    </div>
    
  );

  
};

export default ModerPanel;
