import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, ArrowRight, Users, Calendar, MapPin, Star, Shield, Heart } from 'lucide-react';

const HomePage = () => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-16">
      {/* hero */}
      <section className="text-center py-20 relative overflow-hidden">
        {/* background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 via-orange-100/30 to-yellow-100/50 dark:from-red-900/20 dark:via-orange-900/10 dark:to-yellow-900/20 pointer-events-none z-0"></div>
        <div className="absolute top-10 left-10 text-6xl opacity-10 dark:opacity-5">⭐</div>
        <div className="absolute top-20 right-20 text-4xl opacity-10 dark:opacity-5">🏆</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 dark:opacity-5">🛡️</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-10 dark:opacity-5">⚔️</div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              <Star className="h-4 w-4" />
              <span>1941-1945 • {t('gpw')}</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              {t('pageTitle')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            {language === 'ru' 
              ? '80 страниц, которые расскажут вам о самых важных событиях, героях, городах и артефактах Великой Отечественной Войны. Память о подвиге народа живет вечно.'
              : '80 pages that will tell you about the most important events, heroes, cities and artifacts of the Great Patriotic War. The memory of the people\'s feat lives forever.'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/pages"
              className="group bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg px-10 py-4 rounded-xl flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <BookOpen className="h-6 w-6 group-hover:animate-pulse" />
              <span className="font-semibold">
                {language === 'ru' ? 'Начать чтение' : 'Start Reading'}
              </span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {language === 'ru' ? 'Что вас ждет' : 'What awaits you'}
            </span>
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 text-lg">
            {language === 'ru' 
              ? 'Погрузитесь в историю Великой Отечественной Войны через уникальные материалы'
              : 'Immerse yourself in the history of the Great Patriotic War through unique materials'
            }
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-red-100 dark:border-red-800">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                {language === 'ru' ? 'Города-герои' : 'Hero Cities'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                {language === 'ru' 
                  ? 'Познакомьтесь с городами, которые проявили невероятное мужество и стойкость в годы войны.'
                  : 'Get acquainted with cities that showed incredible courage and resilience during the war years.'
                }
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-red-100 dark:border-red-800">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                {language === 'ru' ? 'Герои войны' : 'War Heroes'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                {language === 'ru' 
                  ? 'Узнайте о выдающихся полководцах, солдатах и тружениках тыла, которые приблизили Победу.'
                  : 'Learn about outstanding commanders, soldiers and home front workers who brought Victory closer.'
                }
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-red-100 dark:border-red-800">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                {language === 'ru' ? 'Память народа' : 'People\'s Memory'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                {language === 'ru' 
                  ? 'Изучите письма, артефакты и памятники, которые хранят память о великом подвиге.'
                  : 'Study letters, artifacts and monuments that preserve the memory of the great feat.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* categories */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {language === 'ru' ? 'Категории историй' : 'Story Categories'}
            </span>
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 text-lg">
            {language === 'ru' 
              ? 'Исследуйте различные аспекты Великой Отечественной Войны'
              : 'Explore different aspects of the Great Patriotic War'
            }
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: language === 'ru' ? 'Город' : 'City', icon: '🏰', count: 20, color: 'from-red-500 to-red-600' },
              { name: language === 'ru' ? 'Герой' : 'Hero', icon: '👑', count: 20, color: 'from-orange-500 to-orange-600' },
              { name: language === 'ru' ? 'Событие' : 'Event', icon: '⚔️', count: 20, color: 'from-yellow-500 to-yellow-600' },
              { name: language === 'ru' ? 'Письмо' : 'Letter', icon: '📜', count: 10, color: 'from-red-600 to-pink-600' },
              { name: language === 'ru' ? 'Памятник' : 'Monument', icon: '🗿', count: 5, color: 'from-orange-600 to-red-600' },
              { name: language === 'ru' ? 'Артефакт' : 'Artifact', icon: '💎', count: 5, color: 'from-yellow-600 to-orange-600' },
            ].map((category) => (
              <Link
                key={category.name}
                to="/pages"
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.count} {language === 'ru' ? 'страниц' : 'pages'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* call to action */}
      <section className="text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 via-orange-100/30 to-yellow-100/50 dark:from-red-900/20 dark:via-orange-900/10 dark:to-yellow-900/20"></div>
        <div className="absolute top-10 left-10 text-6xl opacity-10 dark:opacity-5">🏆</div>
        <div className="absolute top-20 right-20 text-4xl opacity-10 dark:opacity-5">⭐</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 dark:opacity-5">🛡️</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-10 dark:opacity-5">⚔️</div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              {language === 'ru' ? 'Готовы начать путешествие?' : 'Ready to start the journey?'}
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-12 leading-relaxed">
            {language === 'ru' 
              ? 'Присоединяйтесь к тысячам читателей, которые уже открыли для себя удивительную историю Великой Победы. Память о подвиге народа живет вечно.'
              : 'Join thousands of readers who have already discovered the amazing history of the Great Victory. The memory of the people\'s feat lives forever.'
            }
          </p>
          <Link
            to="/pages"
            className="group bg-gradient-to-r from-red-600 to-orange-600 text-white text-xl px-12 py-5 rounded-2xl inline-flex items-center space-x-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <BookOpen className="h-7 w-7 group-hover:animate-pulse" />
            <span className="font-bold">
              {language === 'ru' ? 'Читать истории' : 'Read Stories'}
            </span>
            <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
