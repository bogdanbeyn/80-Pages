import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, MessageCircle, ArrowLeft, Heart } from 'lucide-react';
import { pagesAPI } from '../services/api';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import { useLanguage } from '../contexts/LanguageContext';

const PageDetail = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await pagesAPI.getPage(id);
      setPage(response.data);
    } catch (err) {
      setError('Страница не найдена');
      console.error('Error fetching page:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateRu = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const formatDateEn = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-EN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

const categoryMap = {
    city: { ru: 'Город', en: 'City', icon: '🏰' },
    hero: { ru: 'Герой', en: 'Hero', icon: '👑' },
    event: { ru: 'Событие', en: 'Event', icon: '⚔️' },
    letter: { ru: 'Письмо', en: 'Letter', icon: '📜' },
    monument: { ru: 'Памятник', en: 'Monument', icon: '🗿' },
    artifact: { ru: 'Артефакт', en: 'Artifact', icon: '💎' },
  };

  const normalize = (s) => String(s || '').trim().toLowerCase();

  const getCategoryKey = (name) => {
    const n = normalize(name);
    const found = Object.keys(categoryMap).find((k) => {
      const { ru, en } = categoryMap[k];
      return [normalize(ru), normalize(en)].includes(n);
    });
    return found || 'city';
  };

  const getCategoryIcon = (categoryName) => {
    const key = getCategoryKey(categoryName);
    return categoryMap[key]?.icon || '📄';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="text-center py-16">
        <div className="text-red-600 text-6xl mb-4">📄</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('pageNotFound')}</h2>
        <p className="text-gray-600 mb-6">{error || 'Запрашиваемая страница не существует'}</p>
        <Link to="/pages" className="btn-primary">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* back btn */}
      <Link
        to="/pages"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors dark:text-gray-300 dark:hover:text-primary-600"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t('back')}</span>
      </Link>

      {/* art head */}
      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800/90 dark:border-gray-600">
        {/* img */}
        <div className="relative h-64 md:h-80 bg-gray-200">
          {page.imagePath ? (
            <img
              src={`http://localhost:5000${page.imagePath}`}
              alt={page.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-8xl "
            style={{ display: page.imagePath ? 'none' : 'flex' }}
          >
            {getCategoryIcon(page.category.name)}
          </div>
          
          {/* ctg badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white backdrop-blur-sm text-gray-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-gray-900/90 dark:text-gray-300">
              {(() => {
                const key = getCategoryKey(page.category?.name);
                return language === 'ru' ? categoryMap[key].ru : categoryMap[key].en;
              })()}
            </span>
          </div>
        </div>

        {/* content */}
        <div className="p-8">
          {/* title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 dark:text-gray-100">
            {page.title}
          </h1>

          {/* meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{t('author')}: {page.createdBy.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{t('published')}: {language === 'ru' ? formatDateRu(page.createdAt) : formatDateEn(page.createdAt)}</span>
            </div>
            {page.comments?.length > 0 && (
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>{t('comments')}: {page.comments.length}</span>
              </div>
            )}
          </div>

          {/* art content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap dark:text-gray-300">
              {page.content}
            </div>
          </div>

        </div>
      </article>

      {/* comment sect */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 dark:bg-gray-800/90 dark:border-gray-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-300">
          {t('comments')} ({page.comments?.length || 0})
        </h2>
        
        <CommentList 
          comments={page.comments || []} 
          pageId={page.id} 
          onCommentAdded={fetchPage} 
        />
        <CommentForm pageId={page.id} onCommentAdded={fetchPage} />
      </div>
    </div>
  );
};

export default PageDetail;
