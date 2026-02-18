import React, { useState } from 'react';
import { User, Calendar, Reply, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { commentsAPI } from '../services/api';

const CommentList = ({ comments, pageId, onCommentAdded }) => {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDateRu = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateEn = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-EN', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReply = async (parentId) => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      await commentsAPI.createComment({
        text: replyText.trim(),
        pageId,
        parentId
      });
      
      setReplyText('');
      setReplyingTo(null);
      onCommentAdded && onCommentAdded();
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-3">💬</div>
        <p className="text-gray-600 dark:text-gray-400">{t('noComments')}</p>
      </div>
    );
  }

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="flex items-start space-x-3">
        {/* avatar */}
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-primary-600" />
        </div>
        
        {/* comment content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-gray-400">
              {comment.user.name}
            </h4>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{language === 'ru' ? formatDateRu(comment.createdAt) : formatDateEn(comment.createdAt)}</span>
            </div>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-3 dark:text-gray-200 
               break-words 
               max-w-full 
               overflow-hidden">
            {comment.text}
          </p>

          {/* reply button */}
          {isAuthenticated && !isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <Reply className="h-4 w-4" />
              <span>{t('reply')}</span>
            </button>
          )}

          {/* reply form */}
          {replyingTo === comment.id && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t('writeReply')}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows="3"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => handleReply(comment.id)}
                  disabled={loading || !replyText.trim()}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-3 w-3" />
                  <span>{loading ? t('sending') : t('send')}</span>
                </button>
              </div>
            </div>
          )}

          {/* replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        (comment.parentId ? '' :
        <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
          <CommentItem comment={comment} />
        </div>)
      ))}
    </div>
  );
};

export default CommentList;
