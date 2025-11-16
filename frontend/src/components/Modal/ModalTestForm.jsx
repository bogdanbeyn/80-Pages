import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const ModalTestForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  title = '',
  confirmText = '',
  cancelText = ''
}) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    title: '',
    questions: [
      {
        text: '',
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }
    ]
  });

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      title: initialData?.title || '',
      questions: (initialData?.questions || []).map(q => ({
        text: q.text || '',
        answers: (q.answers && q.answers.length > 0)
          ? q.answers.map(a => ({
              text: a.text || '',
              isCorrect: !!a.isCorrect
            }))
          : [
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false }
            ]
      }))
    });
  }, [initialData]);


  const handleTitleChange = (e) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  };

  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].text = value;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].answers[aIndex].text = value;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleCorrectSelect = (qIndex, aIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.map((ans, idx) => ({
      ...ans,
      isCorrect: idx === aIndex
    }));
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          answers: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ]
        }
      ]
    }));
  };
const validateForm = () => {
  for (const q of formData.questions) {
    if (!q.text.trim()) return 'Каждый вопрос должен иметь текст';
    if (!Array.isArray(q.answers) || q.answers.length < 4) return 'Каждый вопрос должен иметь 4 варианта';
    if (q.answers.some(a => !a.text.trim())) return 'Все варианты должны быть заполнены';
    if (q.answers.filter(a => a.isCorrect).length !== 1) return 'В каждом вопросе должен быть один правильный ответ';
  }
  return null;
};

const handleSubmit = (e) => {
  e.preventDefault();
  const errorMsg = validateForm();
  if (errorMsg) {
    alert(errorMsg); 
    return;
  }
  onSubmit(formData);
};


  if (!isOpen) return null;

  return ReactDOM.createPortal(
<div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
  <div className="flex justify-center items-start min-h-screen pt-10 px-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-3xl w-full relative">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('testTitle')}</label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="input-field w-full"
              required
            />
          </div>

          {formData.questions.map((q, qIndex) => (
            <div key={qIndex} className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('question')} {qIndex + 1}
              </label>
              <input
                type="text"
                value={q.text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="input-field w-full"
                required
              />

              <div className="space-y-2">
                {q.answers.map((a, aIndex) => (
                  <div key={aIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={a.text}
                      onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`${t('option')} ${aIndex + 1}`}
                      required
                    />
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={a.isCorrect}
                      onChange={() => handleCorrectSelect(qIndex, aIndex)}
                    />
                    <span className="text-sm">{t('correct')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="btn-secondary mt-2"
          >
            + {t('addQuestion')}
          </button>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              {cancelText}
            </button>
            <button type="submit" className="btn-primary">
              {confirmText}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalTestForm;
