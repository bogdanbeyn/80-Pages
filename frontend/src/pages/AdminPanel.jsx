import React, { useState, useEffect, useContext } from 'react';
import { pagesAPI, commentsAPI, usersAPI, uploadAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ModalConfirm from '../components/Modal/ModalConfirm';
import ModalForm from '../components/Modal/ModalForm';
import { Edit, Trash2, Eye, MessageCircle, Calendar, User, Trash, DeleteIcon, PowerIcon, CheckIcon, XIcon, SquarePenIcon } from 'lucide-react';

const AdminPanel = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('pages');
  const [pages, setPages] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
  title: '',
  message: '',
  onConfirm: () => {}
});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState(null);


  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await pagesAPI.getPages({ limit: 100 });
      setPages(response.data.pages);
      const commentsResponse = await commentsAPI.getAllComments({});
      setComments(commentsResponse.data.comments);
      const userResponse = await usersAPI.getAllUsers();
      setUsers(userResponse.data);
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (pageId) => {
    try {
      await pagesAPI.deletePage(pageId);
      setPages(pages.filter(page => page.id !== pageId));
    } catch (err) {
      setError(language === 'ru' ? 'Ошибка при удалении страницы' : 'Deleting page error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsAPI.deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError(language === 'ru' ? 'Ошибка при удалении комментария' : 'Deleting comment error');
    }
  };

  const handleDisableUser = async (userId) => {
    try {
      await usersAPI.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(language === 'ru' ? 'Ошибка при отключении пользователя' : 'Disabling user error');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await usersAPI.deleteUserPerm(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(language === 'ru' ? 'Ошибка при удалении пользователя' : 'Deleting user error');
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

    const categoryMap = {
    city: { ru: 'Город', en: 'City'},
    hero: { ru: 'Герой', en: 'Hero' },
    event: { ru: 'Событие', en: 'Event'},
    letter: { ru: 'Письмо', en: 'Letter'},
    monument: { ru: 'Памятник', en: 'Monument' },
    artifact: { ru: 'Артефакт', en: 'Artifact' },
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


const openConfirmModal = ({ title, message, onConfirm }) => {
  setModalConfig({ title, message, onConfirm });
  setModalOpen(true);
};

const openEditModal = (page) => {
  setPageToEdit({
    ...page,
    category: page.category.name || '',
    content: page.content || '',
    imagePath: page.imagePath || ''
  });
  setEditModalOpen(true);
};

const handleUpdatePage = async (formData) => {
  try {
    let imagePath = formData.imagePath;

    if (formData.imageFile) {
      const uploadRes = await uploadAPI.uploadImage(formData.imageFile instanceof FormData
        ? formData.imageFile
        : (() => {
            const fd = new FormData();
            fd.append('image', formData.imageFile);
            return fd;
          })()
      );
      imagePath = uploadRes.data.imagePath;
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      categoryId: parseInt(formData.categoryId),
      imagePath
    };

    await pagesAPI.updatePage(pageToEdit.id, payload);
    setPages(prev => prev.map(p => (p.id === pageToEdit.id ? { ...p, ...payload } : p)));
    setEditModalOpen(false);
    setPageToEdit(null);
  } catch (err) {
    setError('Ошибка при обновлении страницы');
  }
};

  const getImagePath = (path) => {
        if (!path) return null;
        
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path; 
        }
        
        return `http://localhost:5000${path}`;
    };




  const headersPages = language === 'ru'
  ? ['Название', 'Автор', 'Категория', 'Дата', 'Комментарии', 'Действия']
  : ['Title', 'Author', 'Category', 'Date', 'Comments', 'Actions'];

  const headersComments = language === 'ru'
  ? ['Комментарий', 'Автор', 'Страница', 'Дата', 'Действия']
  : ['Comment', 'Author', 'Page', 'Date', 'Actions'];

  const headersUsers = language === 'ru'
  ? ['Имя', 'Почта', 'Роль', 'Комментарии', 'Дата регистрации', 'Статус', 'Действия']
  : ['Name', 'Email', 'Role', 'Comments', 'Registration date', 'Status', 'Actions'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    
    <div className="space-y-8">
      <ModalConfirm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={t('delete')}
        cancelText={t('cancel')}
      />
      <ModalForm
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setPageToEdit(null);
        }}
        onSubmit={handleUpdatePage}
        initialData={pageToEdit}
        title={t('editPageTitle')}
        confirmText={t('save')}
        cancelText={t('cancel')}
      />

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
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            {t('users')} ({users.length})
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
                              src={getImagePath(page.imagePath)}
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
                            <a
                              href={`/pages/${page.id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >{page.title}</a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                      {page.createdBy.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-gray-500 dark:text-gray-800">
                      {(() => {
                        const key = getCategoryKey(page.category?.name);
                        return language === 'ru' ? categoryMap[key].ru : categoryMap[key].en;
                      })()}
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
                        <button
                          onClick={() => openEditModal(page)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <SquarePenIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openConfirmModal({
                          title: t('confirmPageDelete'),
                          message: t('deleteWarning'),
                          onConfirm: async () => {
                            await handleDeletePage(page.id);
                            setModalOpen(false);
                          }
                        })}
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
      ) : activeTab === 'comments' ? (
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
                      <a
                        href={`/pages/${comment.page.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >{comment.page.title}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {language === 'ru' ? formatDateRu(comment.createdAt) : formatDateEn(comment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openConfirmModal({
                          title: t('confirmCommentDelete'),
                          message: t('deleteWarning'),
                          onConfirm: async () => {
                            await handleDeleteComment(comment.id);
                            setModalOpen(false);
                          }
                        })}
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
        ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800/90 dark:border-gray-600">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800">
<tr>
        {headersUsers.map(h => (
          <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
        ))}
      </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-700/90">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md dark:text-gray-300 ">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400 ">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user._count?.comments || 0}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {language === 'ru' ? formatDateRu(user.createdAt) : formatDateEn(user.createdAt)}
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.isDisable ? <XIcon className='h-4 w-4'/>  : <CheckIcon className='h-4 w-4'/>}
                    </td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex space-x-2">
                        <button
                          onClick={() => openConfirmModal({
                          title: t('confirmUserDisabling'),
                          message: t('disableWarning'),
                          onConfirm: async () => {
                            await handleDeleteUser(user.id);
                            setModalOpen(false);
                          }
                        })}
                          className="text-red-600 hover:text-red-900"
                        >
                          <PowerIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openConfirmModal({
                          title: t('confirmUserDelete'),
                          message: t('deleteWarning'),
                          onConfirm: async () => {
                            await handleDeleteUser(user.id);
                            setModalOpen(false);
                          }
                        })}
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
