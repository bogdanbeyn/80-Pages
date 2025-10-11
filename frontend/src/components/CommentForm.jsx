import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { commentsAPI } from '../services/api';
import { Send } from 'lucide-react';

const CommentForm = ({ pageId, onCommentAdded }) => {
  const { isAuthenticated } = useAuth();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Комментарий не может быть пустым');
      return;
    }

    if (text.length > 1000) {
      setError('Комментарий слишком длинный (максимум 1000 символов)');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await commentsAPI.createComment({
        text: text.trim(),
        pageId: parseInt(pageId),
      });

      setText('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при добавлении комментария');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 mb-4">
          Войдите в систему, чтобы оставить комментарий
        </p>
        <a
          href="/login"
          className="btn-primary"
        >
          Войти
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Добавить комментарий
          </label>
          <textarea
            id="comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Поделитесь своими мыслями..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {text.length}/1000 символов
            </span>
            {error && (
              <span className="text-xs text-red-600">{error}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{loading ? 'Отправка...' : 'Отправить'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
