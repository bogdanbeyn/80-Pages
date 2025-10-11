import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, MessageCircle, ArrowRight } from 'lucide-react';

const PageCard = ({ page }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Город': '🏰',
      'Герой': '👑',
      'Событие': '⚔️',
      'Письмо': '📜',
      'Памятник': '🗿',
      'Артефакт': '💎',
    };
    return icons[categoryName] || '📄';
  };

  return (
    <Link to={`/pages/${page.id}`} className="group">
      <div className="page-card">
        {/* img */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {page.imagePath ? (
            <img
              src={`http://localhost:5000${page.imagePath}`}
              alt={page.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-6xl"
            style={{ display: page.imagePath ? 'none' : 'flex' }}
          >
            {getCategoryIcon(page.category.name)}
          </div>
          
          {/* ctg badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-gray-900/90 dark:text-gray-300">
              {page.category.name}
            </span>
          </div>
        </div>

        {/* content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors dark:text-gray-300">
            {page.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 dark:text-gray-400">
            {page.content}
          </p>

          {/* meta info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{page.createdBy.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(page.createdAt)}</span>
              </div>
            </div>
            
            {page._count?.comments > 0 && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{page._count.comments}</span>
              </div>
            )}
          </div>

          {/* read more */}
          <div className="mt-4 flex items-center text-primary-600 font-medium group-hover:text-primary-700">
            <span>Читать далее</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PageCard;
