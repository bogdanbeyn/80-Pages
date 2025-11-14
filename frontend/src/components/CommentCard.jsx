import React from 'react';
import {
  Calendar,
  User,
  MessageCircle,
  BookIcon,
  TrashIcon,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CommentCard = ({ comment, onDelete, onApprove }) => {
  const { language } = useLanguage();

  const formatDate = (dateString) => {
    const locale = language === 'ru' ? 'ru-RU' : 'en-EN';
    return new Date(dateString).toLocaleDateString(locale, {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comment-card p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-800/90 dark:border-gray-700">
      {/* meta */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-gray-500">
        {/* author + date + replies */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{language === 'ru'? 'Автор' : 'Author'}: {comment.user?.name ? comment.user?.name : language === 'ru' ? 'Аноним' : 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(comment.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{language === 'ru' ? 'Ответов' : 'Replies'}: {comment._count.replies}</span>
          </div>
        </div>

        {/* кнопки модерации */}
        <div className="flex items-center gap-2">
          {comment.isFlagged ? (
            <>
              <button
                onClick={() => onApprove(comment.id)}
                className="text-green-600 hover:text-green-800"
                title={language === 'ru' ? 'Одобрить комментарий' : 'Approve comment'}
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="text-red-600 hover:text-red-900"
                title={language === 'ru' ? 'Удалить комментарий' : 'Delete comment'}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-red-600 hover:text-red-900"
              title={language === 'ru' ? 'Удалить комментарий' : 'Delete comment'}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* текст */}
      <p className="text-gray-900 text-sm mb-4 dark:text-gray-300 mt-4 break-words whitespace-pre-wrap">
        {comment.text}
      </p>

      {/* источник */}
      <div className="flex items-center text-sm text-gray-500 mb-3 hover:text-red-600">
        <BookIcon className="h-4 w-4 mr-1" />
        <a href={`/pages/${comment.page.id}`} className="truncate max-w-full">
          {comment.page.title}
        </a>
      </div>

      {/* предупреждение */}
      {comment.isFlagged && (
        <div className="mt-2 text-sm text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 px-4 py-2 rounded-md flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span className="break-words">
            {language === 'ru'
              ? 'Комментарий ожидает модерации'
              : 'Comment is under moderation'}
          </span>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
