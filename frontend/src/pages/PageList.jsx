import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, User, MessageCircle } from 'lucide-react';
import { pagesAPI, categoriesAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import PageCard from '../components/PageCard';
import { useLocation } from 'react-router-dom';

const PageList = () => {
  const { t } = useLanguage();
  const [pages, setPages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategoryId = queryParams.get('categoryId') || '';
  const [filters, setFilters] = useState({
    search: '',
    categoryId: initialCategoryId,
    page: 1,
  });
  const [pagination, setPagination] = useState({});
  const inputRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const isFirstRun = useRef(true);
  


  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: debouncedSearch,
        page: 1,
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearch]);

    useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    const isInitial = isFirstRun.current;
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setIsFetching(true);
      }
      const [pagesResponse, categoriesResponse] = await Promise.all([
        pagesAPI.getPages(filters),
        categoriesAPI.getCategories(),
      ]);

      setPages(pagesResponse.data.pages);
      setPagination(pagesResponse.data.pagination);
      setCategories(categoriesResponse.data);
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error('Error fetching data:', err);
    } finally {
if (isInitial) {
        setLoading(false);
        isFirstRun.current = false;
      } else {
        setIsFetching(false);
      }
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setDebouncedSearch(value);
  };


  const handleCategoryChange = (e) => {
    setFilters(prev => ({
      ...prev,
      categoryId: e.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

if (loading && pages.length === 0) {
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
          onClick={fetchData}
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
      <div className="text-center">
        <h1 className="text-4xl font-bold text-light mb-4">
          {t('pagesTitle')}
        </h1>
        <p className="text-lg dark:text-gray-300 max-w-2xl mx-auto">
          {t('pagesDescription')}
        </p>
      </div>

      {/* filters */}
      <div className="bg-white dark:bg-gray-800/90 rounded-xl shadow-sm border border-gray-200 p-6 dark:border-gray-600">
        <div className="flex flex-col md:flex-row gap-4">
          {/* search */}
          <div className="flex-1">
            <div className="relative ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 " />
              <input
                ref={inputRef}
                type="text"
                placeholder={t('pagesSearch')}
                value={debouncedSearch}
                onChange={handleSearchChange}
                className="input-field pl-10 dark:bg-gray-700/90"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isFetching && <div className="animate-spin h-4 w-4 border-b-2 border-gray-400 rounded-full" />}
            </div>
            </div>
          </div>

          {/* ctg filter */}
          <div className="md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filters.categoryId}
                onChange={handleCategoryChange}
                className="input-field pl-10 appearance-none dark:bg-gray-700/90"
              >
                <option value="">{t('pagesFilterByCategory')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category._count.pages})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* results info */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">
          {t('pagesFound')}: <span className="font-semibold">{pagination.total || 0}</span>
        </p>
        {filters.search && (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {t('search')}: "{filters.search}"
          </p>
        )}
      </div>

      {/* pg grid */}
      {pages.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <PageCard key={page.id} page={page} />
            ))}
          </div>

          {/* pagination */}
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
          )}
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

export default PageList;
