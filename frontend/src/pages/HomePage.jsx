import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Users, Calendar, MapPin } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* hero */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Добро пожаловать в мир истории Великой Победы
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            80 страниц, которые расскажут вам о самых важных событиях, героях, 
            городах и артефактах, сформировавших великую историю нашей страны и соседей.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pages"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <BookOpen className="h-5 w-5" />
              <span>Начать чтение</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Что вас ждет
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Города и места
              </h3>
              <p className="text-gray-600">
                Познакомьтесь с древними городами, крепостями и памятными местами, 
                которые сыграли важную роль в истории.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Великие личности
              </h3>
              <p className="text-gray-600">
                Узнайте о выдающихся правителях, полководцах, ученых и деятелях культуры, 
                которые изменили ход истории.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Исторические события
              </h3>
              <p className="text-gray-600">
                Изучите ключевые события, битвы, реформы и переломные моменты, 
                которые сформировали нашу современность.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ctgs */}
      <section className="py-16 bg-white rounded-2xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Категории историй
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Город', icon: '🏰', count: 20 },
              { name: 'Герой', icon: '👑', count: 20 },
              { name: 'Событие', icon: '⚔️', count: 20 },
              { name: 'Письмо', icon: '📜', count: 10 },
              { name: 'Памятник', icon: '🗿', count: 5 },
              { name: 'Артефакт', icon: '💎', count: 5 },
            ].map((category) => (
              <Link
                key={category.name}
                to="/pages"
                className="group p-6 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors duration-200 text-center"
              >
                <div className="text-4xl mb-3 group-hover:animate-bounce-gentle">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.count} страниц
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* action */}
      <section className="text-center py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Готовы начать путешествие?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Присоединяйтесь к тысячам читателей, которые уже открыли для себя 
            удивительную историю Великой Победы с помощью нашего ресурса.
          </p>
          <Link
            to="/pages"
            className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
          >
            <BookOpen className="h-5 w-5" />
            <span>Читать истории</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
