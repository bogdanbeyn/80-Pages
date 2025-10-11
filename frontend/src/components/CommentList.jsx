import React from 'react';
import { User, Calendar } from 'lucide-react';

const CommentList = ({ comments }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-3">💬</div>
        <p className="text-gray-600">Пока нет комментариев. Будьте первым!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
          <div className="flex items-start space-x-3">
            {/* avatar ph */}
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            
            {/* comm content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-900">
                  {comment.user.name}
                </h4>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {comment.text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
