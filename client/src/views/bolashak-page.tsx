"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlaneTakeoff, Scale, Wallet } from "lucide-react";

// --- Иконки ---
// --- ПРЕМИАЛЬНЫЕ ИКОНКИ (SVG) ---

// Хедер
export const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

export const GlobeIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
    />
  </svg>
);

// Калькулятор и Списки
export const CheckCircle = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const DocumentIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

export const CalendarIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
    />
  </svg>
);

// --- ИКОНКИ ДЛЯ ТРЕБОВАНИЙ (Замена Эмодзи) ---

export const AcademicCapIcon = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
    />
  </svg>
);

export const LanguageIcon = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
    />
  </svg>
);

export const CertificateIcon = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-1.81.688l1.15 5.071c.11.48-.39.81-.82.564L12 17.532a.562.562 0 00-.54 0l-4.42 2.78c-.43.27-.93-.06-.82-.544l1.15-5.071a.563.563 0 00-.181-.688l-4.204-3.602c-.38-.325-.178-.948.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
    />
  </svg>
);

export const EnvelopeOpenIcon = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);
// --- Мок-данные университетов (Week 4 UI / Week 9 Prep) ---
const MOCK_UNIVERSITIES = [
  {
    id: 1,
    name: "Massachusetts Institute of Technology (MIT)",
    country: "США",
    image: "./mit.jpg",
    rank: "#1 в мире",
  },
  {
    id: 2,
    name: "University of Oxford",
    country: "Великобритания",
    image: "./ox.jpg",
    rank: "#3 в мире",
  },
  {
    id: 3,
    name: "National University of Singapore (NUS)",
    country: "Сингапур",
    image: "./nus.jpg",
    rank: "#8 в мире",
  },
];

export default function BolashakPage() {
  const [scrolled, setScrolled] = useState(false);

  // Состояния калькулятора
  const [gpa, setGpa] = useState(3.0);
  const [ielts, setIelts] = useState(6.5);
  const [hasOffer, setHasOffer] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const isEligible = gpa >= 3.0 && ielts >= 6.5 && hasOffer;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-200">
      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? "bg-black/70 backdrop-blur-md border-white/10 py-4" : "bg-transparent border-transparent py-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
          <div className="text-2xl font-bold tracking-tighter cursor-pointer">
            Academi<span className="text-blue-400">.kz</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="/" className="hover:text-blue-300 transition-colors">
              Главная
            </a>
            <a
              href="#universities"
              className="hover:text-blue-300 transition-colors"
            >
              Университеты
            </a>
            <a
              href="#bolashak"
              className="text-blue-400 font-bold border-b-2 border-blue-400 pb-1"
            >
              Гранты
            </a>
          </nav>
          <div className="flex items-center space-x-6">
            <button className="hidden md:flex items-center space-x-1 hover:text-blue-300 transition-colors text-sm font-medium">
              <GlobeIcon />
              <span>RU</span>
            </button>
            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all border border-white/20">
              <UserIcon />
              <span className="text-sm font-medium">Войти</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 flex flex-col justify-center items-center text-center px-6 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop"
            alt="Library studying"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-white"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto mt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-blue-600/20 border border-blue-400/30 backdrop-blur-md text-blue-100 px-5 py-2 rounded-full text-sm font-semibold mb-6 uppercase tracking-widest"
          >
            <span>🇰🇿 Государственная программа</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight shadow-sm"
          >
            Стипендия «Болашак»
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Полное финансирование магистратуры за рубежом. Изучите требования,
            проверьте свои шансы и выберите утвержденный университет.
          </motion.p>
        </div>
      </section>

      {/* 1. КРИТЕРИИ ОТБОРА И ТРЕБОВАНИЯ (Eligibility) - Явно выделенный блок */}
      <section className="relative z-20 py-16 px-6 max-w-7xl mx-auto -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12"
        >
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Основные требования к кандидатам
            </h2>
            <p className="text-gray-600">
              Прежде чем подавать заявку, убедитесь, что вы соответствуете
              базовым критериям государственной комиссии.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="text-blue-600 mb-4">
                <AcademicCapIcon />
              </div>
              <h3 className="font-bold text-lg mb-2">GPA от 3.0</h3>
              <p className="text-sm text-gray-600">
                Средний балл диплома бакалавра должен быть не менее 3.0 из 4.0
                (или эквивалент).
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="text-blue-600 mb-4">
                <LanguageIcon />
              </div>
              <h3 className="font-bold text-lg mb-2">IELTS от 6.5</h3>
              <p className="text-sm text-gray-600">
                Наличие действующего сертификата, подтверждающего уровень
                владения иностранным языком.
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="text-blue-600 mb-4">
                <CertificateIcon />
              </div>
              <h3 className="font-bold text-lg mb-2">Сертификат КАЗТЕСТ</h3>
              <p className="text-sm text-gray-600">
                Подтверждение уровня владения государственным языком (уровень В1
                и выше).
              </p>
            </div>
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-200 rounded-full opacity-50 blur-xl"></div>
              <div className="text-emerald-600 mb-4 relative z-10">
                <EnvelopeOpenIcon />
              </div>
              <h3 className="font-bold text-lg mb-2 relative z-10">
                Unconditional Offer
              </h3>
              <p className="text-sm text-emerald-800 relative z-10">
                Безусловное приглашение на академическое обучение от зарубежного
                вуза из списка.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. УМНЫЙ КАЛЬКУЛЯТОР (Delighter Feature) */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-3xl shadow-sm p-8 md:p-12 border border-gray-200">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Автоматическая проверка шансов
              </h2>
              <p className="text-gray-500 mb-8 text-sm">
                Введите свои показатели, чтобы система определила вашу
                готовность к подаче заявки.
              </p>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-gray-700">
                      Ваш средний балл (GPA)
                    </label>
                    <span className="font-bold text-blue-600">
                      {gpa.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="4.0"
                    step="0.01"
                    value={gpa}
                    onChange={(e) => setGpa(parseFloat(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-gray-700">
                      Балл IELTS
                    </label>
                    <span className="font-bold text-blue-600">
                      {ielts.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="9.0"
                    step="0.5"
                    value={ielts}
                    onChange={(e) => setIelts(parseFloat(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <label className="flex items-start space-x-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasOffer}
                    onChange={() => setHasOffer(!hasOffer)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span className="text-gray-700 font-medium text-sm">
                    У меня есть безусловное приглашение (Unconditional offer) от
                    университета из утвержденного списка
                  </span>
                </label>
              </div>
            </div>

            <div
              className={`w-full md:w-1/2 rounded-2xl p-8 flex flex-col justify-center transition-all duration-500 ${isEligible ? "bg-emerald-50 border border-emerald-200 shadow-inner" : "bg-gray-50 border border-gray-200"}`}
            >
              {isEligible ? (
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-900 mb-3">
                    Вы подходите!
                  </h3>
                  <p className="text-emerald-800/80 mb-6">
                    Ваши показатели соответствуют всем строгим требованиям. Вы
                    можете претендовать на грант.
                  </p>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium w-full transition-colors flex justify-center items-center space-x-2">
                    <DocumentIcon />
                    <span>Создать пакет документов</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                  <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">
                    !
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Не хватает данных
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Для участия в программе требуется минимальный GPA 3.0, IELTS
                    от 6.5 и наличие приглашения (Offer). Подтяните результаты
                    или получите приглашение от вуза.
                  </p>
                  <button className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium w-full transition-colors">
                    Как получить Unconditional Offer?
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. РЕКОМЕНДОВАННЫЕ УНИВЕРСИТЕТЫ (Мок-данные) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Утвержденные университеты
              </h2>
              <p className="text-gray-600">
                Грант выделяется только на обучение в топовых вузах из списка,
                ежегодно утверждаемого Министерством.
              </p>
            </div>
            <button className="hidden md:block text-blue-600 font-medium hover:underline">
              Смотреть весь список (200+) &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_UNIVERSITIES.map((uni, index) => (
              <motion.div
                key={uni.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={uni.image}
                    alt={uni.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    {uni.rank}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-blue-600 mb-2">
                    {uni.country}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                    {uni.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Одобрено Болашак</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="mt-8 md:hidden w-full py-4 bg-gray-100 text-gray-800 rounded-xl font-medium">
            Смотреть весь список (200+)
          </button>
        </div>
      </section>

      {/* 4. ИНФОРМАЦИЯ И СРОКИ */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Левая колонка: Что покрывает грант */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Условия и финансирование
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Wallet />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    100% покрытие обучения
                  </h4>
                  <p className="text-slate-400">
                    Государство полностью оплачивает стоимость академического
                    обучения в выбранном университете.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <PlaneTakeoff />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    Перелет и стипендия
                  </h4>
                  <p className="text-slate-400">
                    Оплачивается авиаперелет (туда и обратно), медицинская
                    страховка, а также выплачивается ежемесячная стипендия на
                    проживание.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Scale />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    Обязательства (Отработка)
                  </h4>
                  <p className="text-slate-400">
                    Выпускник обязан вернуться в Казахстан и непрерывно
                    отработать по специальности от 3 до 5 лет.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка: Дедлайны (User Story 2) */}
          <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-2">Дедлайны приема 2026</h2>
            <p className="text-slate-400 mb-8">
              Прием документов осуществляется через портал eGov.kz
            </p>

            <div className="space-y-4">
              <div className="bg-slate-700/50 p-5 rounded-2xl flex items-center justify-between border border-slate-600">
                <div>
                  <h4 className="font-bold text-white mb-1">Первый поток</h4>
                  <p className="text-sm text-slate-400">Основной набор</p>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 font-bold">Апр - Май</div>
                  <div className="text-xs uppercase tracking-wider text-emerald-400 mt-1">
                    Открыто
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-5 rounded-2xl flex items-center justify-between border border-slate-600 opacity-60">
                <div>
                  <h4 className="font-bold text-white mb-1">Второй поток</h4>
                  <p className="text-sm text-slate-400">Резервный набор</p>
                </div>
                <div className="text-right">
                  <div className="text-slate-300 font-bold">Июл - Авг</div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 mt-1">
                    Ожидается
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
