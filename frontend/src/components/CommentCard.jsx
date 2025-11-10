import React, { useState} from 'react';
import { Calendar, User, MessageCircle, BookIcon, TrashIcon } from 'lucide-react';
import { commentsAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const CommentCard = ({ comment, onDelete }) => {
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
    <div className="comment-card p-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{comment.user?.name || 'Аноним'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(comment.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{comment._count.replies}</span>
          </div>
          <button
            onClick={() => onDelete(comment.id)}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-900 text-sm mb-4 dark:text-gray-300 mt-4">
        {comment.text}
      </p>
      <div className="flex items-center text-sm text-gray-500 mb-3 hover:text-red-600">
        <BookIcon className='h-4 w-4 mr-1'/>
        <a href={`/pages/${comment.page.id}`}>{comment.page.title}</a>
      </div>
    </div>
  );
};


export default CommentCard;
