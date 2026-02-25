"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link'

// --- Иконки (SVG) ---
const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const GlobeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const ArrowRight = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

export default function AcademiMainPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showBolashakModal, setShowBolashakModal] = useState(false);

  // Логика изменения хедера при скролле (от прозрачного к слегка размытому)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Анимации
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-200">
      {/* HEADER: Прозрачный по умолчанию, добавляет backdrop-blur при скролле */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-black/60 backdrop-blur-md border-white/10 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
          <div className="text-2xl font-bold tracking-tighter">
            Academi<span className="text-blue-400">.kz</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a
              href="#universities"
              className="hover:text-blue-300 transition-colors"
            >
              Университеты
            </a>
            <a
              href="#bolashak"
              className="hover:text-blue-300 transition-colors"
            >
              Гранты
            </a>
            <a
              href="#mentorship"
              className="hover:text-blue-300 transition-colors"
            >
              Услуги
            </a>
          </nav>

          <div className="flex items-center space-x-6">
            {/* Выбор языка - добавлена недостающая функция */}
            <button className="hidden md:flex items-center space-x-1 hover:text-blue-300 transition-colors text-sm font-medium">
              <GlobeIcon />
              <span>RU</span>
            </button>
            {/* Профиль / Вход */}
            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all border border-white/20">
              <UserIcon />
              <span className="text-sm font-medium">Войти</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION: Полноэкранный блок с фоновым изображением и минималистичным поиском */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-6">
        {/* Фоновое изображение высокого качества */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1974&auto=format&fit=crop"
            alt="Students on campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto mt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Откройте двери в <br /> лучшие университеты мира
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto font-light"
          >
            Единая платформа для поиска программ магистратуры, контроля
            дедлайнов и подготовки документов.
          </motion.p>

          {/* МИНИМАЛИСТИЧНЫЙ ПОИСК */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 shadow-2xl transition-all focus-within:bg-white/20">
              <div className="pl-4 text-white">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Специальность, страна или университет..."
                className="w-full bg-transparent border-none text-white placeholder-gray-300 px-4 py-3 focus:outline-none text-lg"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-blue-600/30">
                Найти
              </button>
            </div>

            {/* Ссылка на расширенный поиск с фильтрами */}
            <div className="mt-4">
              <a
                href="#advanced-search"
                className="text-gray-300 hover:text-white text-sm flex items-center justify-center space-x-1 transition-colors"
              >
                <span>Или используйте расширенный поиск с фильтрами</span>
                <ArrowRight />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROMINENT БАННЕР БОЛАШАК: Журнальный стиль */}
      <section id="bolashak" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            {/* Левая часть: Изображение */}
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
                  alt="Oxford University Library"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
                />
              </div>
              {/* Плашка поверх фото */}
              <div className="absolute -bottom-8 -right-8 bg-blue-900 text-white p-8 rounded-3xl shadow-xl max-w-xs hidden md:block">
                <div className="text-4xl font-bold mb-2">2026</div>
                <div className="text-blue-200 text-sm">
                  Год приема заявок на государственную стипендию открыт.
                </div>
              </div>
            </div>

            {/* Правая часть: Контент */}
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <span>🇰🇿</span>
                <span>Специальная программа</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Государственная <br /> стипендия «Болашак»
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Получите 100% финансирование на обучение в ведущих вузах мира.
                Наша платформа автоматически отбирает программы, подходящие под
                критерии гранта, и помогает собрать правильный пакет документов.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-1 mr-3">
                    ✓
                  </div>
                  <span className="text-gray-700">
                    Проверка вашего GPA и языковых сертификатов на соответствие.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-1 mr-3">
                    ✓
                  </div>
                  <span className="text-gray-700">
                    Актуальный список из 200+ рекомендованных университетов.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-1 mr-3">
                    ✓
                  </div>
                  <span className="text-gray-700">
                    Четкий таймлайн: от сдачи IELTS до заседания комиссии.
                  </span>
                </li>
              </ul>

              <Link
                href="/bolashak"
                className="group inline-flex items-center space-x-3 bg-gray-900 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all"
              >
                <span>Подробнее о требованиях</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ОСТАЛЬНЫЕ ФУНКЦИИ (Features) - Чистый, минималистичный дизайн */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Всё для успешного зачисления
            </h2>
            <p className="text-gray-600 text-lg">
              Инструменты, которые экономят месяцы подготовки и снижают риск
              отказа из-за бюрократических ошибок.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <SearchIcon />
              </div>
              <h3 className="text-xl font-bold mb-3">Глубокая фильтрация</h3>
              <p className="text-gray-500 leading-relaxed">
                Ищите программы по стоимости, языку, дедлайнам и вероятности
                поступления на основе вашего профиля.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Умные чек-листы</h3>
              <p className="text-gray-500 leading-relaxed">
                Система генерирует индивидуальный список документов для каждой
                выбранной программы.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Трекинг дедлайнов</h3>
              <p className="text-gray-500 leading-relaxed">
                Синхронизация с календарем и email-уведомления о приближающихся
                сроках подачи заявок.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* МОДАЛКА БОЛАШАК (Остается для демонстрации перехода) */}
      <AnimatePresence>
        {showBolashakModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-10 max-w-2xl w-full relative"
            >
              <button
                onClick={() => setShowBolashakModal(false)}
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                ✕
              </button>
              <h2 className="text-3xl font-bold mb-4">
                Детали программы «Болашак»
              </h2>
              <p className="text-gray-600 mb-8">
                Этот раздел будет реализован как отдельная страница согласно 4-й
                неделе плана.
              </p>
              <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                Здесь будет подробная информация о квотах, GPA и вузах
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
