import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { categoriesAPI } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';


const ModalForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  title = '',
  confirmText = '',
  cancelText = ''
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    imagePath: '',
    imageFile: null,
    categoryId: '' 
  });

const [useFileUpload, setUseFileUpload] = useState(true);
const {t, language} = useLanguage()
const [categories, setCategories] = useState([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getCategories();
      setCategories(res.data.categories);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };
  fetchCategories();
}, []);


useEffect(() => {
  if (!initialData) return;

  setFormData({
    title: initialData?.title || '',
    content: initialData?.content || '',
    imagePath: initialData?.imagePath || '',
    categoryId: String(initialData?.category?.id || ''),
    imageFile: null
  });
}, [initialData]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-2xl w-full relative">


        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('title')}</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('category')}</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="input-field w-full"
              required
            >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat.id} value={String(cat.id)}>
                    {(() => {
                        const key = getCategoryKey(cat.name);
                        return language === 'ru' ? categoryMap[key].ru : categoryMap[key].en;
                      })()}
                    </option>
                ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('image')}</label>
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={useFileUpload}
                  onChange={() => setUseFileUpload(true)}
                />
                <span>{t('file')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!useFileUpload}
                  onChange={() => setUseFileUpload(false)}
                />
                <span>URL</span>
              </label>
            </div>

            {useFileUpload ? (
            <input
                key="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field w-full"
              />

            ) : (
              <input
                key="path-input"
                type="text"
                name="imagePath"
                value={formData.imagePath}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="https://example.com/image.jpg"
              />
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('content')}</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="input-field w-full h-40 resize-y"
              placeholder={t('contentTip')}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ModalForm;