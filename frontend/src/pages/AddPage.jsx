import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { pagesAPI, categoriesAPI, uploadAPI } from '../services/api';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';

const AddPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: '',
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, выберите изображение');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер файла не должен превышать 5MB');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Название обязательно';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Название должно содержать минимум 3 символа';
    }

    if (!formData.content.trim()) {
      errors.content = 'Содержание обязательно';
    } else if (formData.content.trim().length < 10) {
      errors.content = 'Содержание должно содержать минимум 10 символов';
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Выберите категорию';
    }

    if (!imageFile) {
      errors.image = 'Загрузите изображение';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', imageFile);
      
      const uploadResponse = await uploadAPI.uploadImage(formDataUpload);
      const imagePath = uploadResponse.data.imagePath;

      const pageData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: parseInt(formData.categoryId),
        imagePath: imagePath,
      };

      await pagesAPI.createPage(pageData);
      
      navigate('/pages', { 
        state: { message: 'Страница успешно создана!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании страницы');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* head */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/pages')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Назад к списку</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Добавить новую страницу
          </h1>
          <p className="text-gray-600 mt-2">
            Создайте новую историческую страницу для коллекции
          </p>
        </div>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {/* title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Название страницы *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-field ${validationErrors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Введите название страницы"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* cat */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={`input-field ${validationErrors.categoryId ? 'border-red-300 focus:ring-red-500' : ''}`}
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {validationErrors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.categoryId}</p>
              )}
            </div>

            {/* content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Содержание *
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                value={formData.content}
                onChange={handleChange}
                className={`input-field resize-none ${validationErrors.content ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Расскажите историю..."
              />
              {validationErrors.content && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.content}</p>
              )}
            </div>

            {/* img upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Изображение *
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Нажмите для загрузки изображения
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF до 5MB
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {validationErrors.image && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
              )}
            </div>
          </div>
        </div>

        {/* err msgs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* submit btn */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/pages')}
            className="btn-secondary"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{loading ? 'Создание...' : 'Создать страницу'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPage;
