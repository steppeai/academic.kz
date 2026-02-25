"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlobeIcon,
  UserIcon,
  Search,
  Heart,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Check,
} from "lucide-react";

const MOCK_PROGRAMS = [
  {
    id: 1,
    title: "Urban Environment and Climate Change",
    type: "M.Sc.",
    format: "Full-time",
    attendance: "On Campus",
    university: "Erasmus University Rotterdam",
    location: "Роттердам, Нидерланды",
    price: "11 595 737 ₸",
    duration: "1 год",
    match: 95,
    isBolashak: true,
    rating: 4.2,
    reviews: 109,
    discipline: "Инженерия",
  },
  {
    id: 2,
    title: "Project Management",
    type: "M.Sc.",
    format: "Full-time",
    attendance: "On Campus",
    university: "University of the West of England",
    location: "Бристоль, Великобритания",
    price: "12 094 771 ₸",
    duration: "1 год",
    match: 88,
    isBolashak: false,
    rating: 4.4,
    reviews: 103,
    discipline: "Бизнес",
  },
  {
    id: 3,
    title: "Data Science and Artificial Intelligence",
    type: "M.Sc.",
    format: "Part-time",
    attendance: "Online",
    university: "Stanford University",
    location: "Стэнфорд, США",
    price: "18 500 000 ₸",
    duration: "2 года",
    match: 98,
    isBolashak: true,
    rating: 4.9,
    reviews: 342,
    discipline: "IT",
  },
];

const FILTER_OPTIONS = {
  discipline: [
    "IT и Data Science",
    "Бизнес и Управление",
    "Инженерия",
    "Медицина и Здравоохранение",
    "Гуманитарные науки",
  ],
  location: [
    "США",
    "Великобритания",
    "Европа (ЕС)",
    "Азия (Сингапур, Гонконг)",
    "Австралия и Канада",
  ],
  tuitionFee: [
    "Полное финансирование (Гранты)",
    "До 5 000 000 ₸",
    "5 000 000 - 10 000 000 ₸",
    "10 000 000 - 15 000 000 ₸",
    "Более 15 000 000 ₸",
  ],
  duration: ["1 год", "1.5 года", "2 года", "Более 2 лет"],
  language: ["Английский", "Испанский", "Немецкий", "Французский", "Китайский"],
  deadlines: [
    "Открыт прием (Ближайшие 30 дней)",
    "Ближайшие 3 месяца",
    "Осень 2026",
    "Весна 2027",
  ],
};

const FILTER_CATEGORIES = [
  { id: "discipline", label: "Дисциплина", icon: <GraduationCap size={18} /> },
  { id: "location", label: "Локация", icon: <MapPin size={18} /> },
  {
    id: "tuitionFee",
    label: "Стоимость обучения",
    icon: <span className="font-bold text-gray-500 text-sm">₸</span>,
  },
  { id: "duration", label: "Длительность", icon: <Clock size={18} /> },
  { id: "language", label: "Язык обучения", icon: <GlobeIcon size={18} /> },
  { id: "deadlines", label: "Дедлайны", icon: <Calendar size={18} /> },
];

export default function SearchPage() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Programmes");
  const [isBolashakOnly, setIsBolashakOnly] = useState(false);

  const [openFilters, setOpenFilters] = useState({
    discipline: true,
    location: true,
    tuitionFee: false,
    duration: false,
    language: false,
    deadlines: false,
  });

  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAccordion = (key) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleOption = (categoryId, option) => {
    setSelectedOptions((prev) => {
      const categorySet = new Set(prev[categoryId] || []);
      if (categorySet.has(option)) {
        categorySet.delete(option);
      } else {
        categorySet.add(option);
      }
      return { ...prev, [categoryId]: Array.from(categorySet) };
    });
  };

  const filteredPrograms = useMemo(() => {
    return MOCK_PROGRAMS.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.university.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBolashak = isBolashakOnly ? p.isBolashak : true;
      return matchSearch && matchBolashak;
    });
  }, [searchQuery, isBolashakOnly]);

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans relative">
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-slate-900 via-slate-800/80 to-transparent pointer-events-none z-0" />

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
            <button className="hidden md:flex items-center space-x-1 hover:text-blue-300 transition-colors text-sm font-medium">
              <GlobeIcon className="w-4 h-4" />
              <span>RU</span>
            </button>
            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all border border-white/20">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Войти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 relative z-10">
        <div className="mb-8">
          <div className="text-gray-300 text-sm mb-4">
            Главная &gt; Программы
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Программы магистратуры со всего мира
          </h1>

          <div className="flex gap-6 border-b border-gray-300/30 pb-[-1px]">
            {["Programmes", "Universities", "Scholarships"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-base font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab === "Programmes"
                  ? "Программы"
                  : tab === "Universities"
                    ? "Университеты"
                    : "Стипендии"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-t-md"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <aside className="w-full lg:w-[300px] shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="p-5 border-b border-gray-100 bg-blue-50/50">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setIsBolashakOnly(!isBolashakOnly)}
                >
                  <span className="font-semibold text-blue-900">
                    Грант «Болашак»
                  </span>
                  <div
                    className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${isBolashakOnly ? "bg-blue-600" : "bg-gray-300"}`}
                  >
                    <motion.div
                      layout
                      className="bg-white w-3 h-3 rounded-full shadow-sm"
                      animate={{ x: isBolashakOnly ? 20 : 0 }}
                    />
                  </div>
                </div>
              </div>

              {FILTER_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <button
                    onClick={() => toggleAccordion(category.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-gray-700 font-medium text-sm">
                      <span className="text-gray-400 w-5 flex justify-center">
                        {category.icon}
                      </span>
                      {category.label}
                    </div>
                    {openFilters[category.id] ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFilters[category.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5 overflow-hidden"
                      >
                        <div className="space-y-3 pt-1">
                          {FILTER_OPTIONS[category.id].map((option, i) => {
                            const isSelected = (
                              selectedOptions[category.id] || []
                            ).includes(option);
                            return (
                              <label
                                key={i}
                                className="flex items-start gap-3 cursor-pointer group"
                              >
                                <div
                                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0
                                  ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300 group-hover:border-blue-400"}
                                `}
                                >
                                  {isSelected && (
                                    <Check
                                      size={12}
                                      strokeWidth={3}
                                      className="text-white"
                                    />
                                  )}
                                </div>
                                <span
                                  className={`text-sm transition-colors ${isSelected ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
                                >
                                  {option}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white p-2 rounded-full shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow">
              <div className="pl-5 pr-3 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Специальность, страна или университет..."
                className="flex-grow bg-transparent border-none outline-none py-3 text-gray-800 text-base placeholder-gray-400"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-medium transition-colors ml-2">
                Найти
              </button>
            </div>

            <div className="flex justify-between items-end mt-2">
              <h2 className="text-gray-600 font-medium">
                Найдено программ:{" "}
                <span className="text-gray-900 font-bold">
                  {filteredPrograms.length}
                </span>
              </h2>
              <button className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-gray-900">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
                Сортировать
              </button>
            </div>

            <motion.div layout className="space-y-4">
              <AnimatePresence>
                {filteredPrograms.map((program) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={program.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {program.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                            {program.type}
                          </span>
                          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                            {program.format}
                          </span>
                          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                            {program.attendance}
                          </span>
                          {program.isBolashak && (
                            <span className="text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                              <CheckCircle2 size={12} /> Болашак
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 border border-gray-200 shrink-0">
                            {program.university.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {program.university}
                            </p>
                            <p className="text-sm text-gray-500">
                              {program.location}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end justify-between min-w-[200px]">
                        <div className="flex justify-between w-full md:w-auto items-center md:items-start gap-4 mb-4 md:mb-0">
                          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <span>Совпадение</span>
                            <span className="font-bold text-green-600">
                              {program.match}%
                            </span>
                          </div>
                          <button className="text-gray-400 hover:text-red-500 transition-colors">
                            <Heart size={24} />
                          </button>
                        </div>
                        <div className="text-left md:text-right w-full mt-auto">
                          <p className="text-lg font-bold text-gray-900">
                            {program.price}
                          </p>
                          <p className="text-sm text-gray-500">
                            / год • {program.duration}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="text-yellow-400">★</span>{" "}
                        {program.rating} ({program.reviews})
                      </div>
                      <a
                        href="#"
                        className="text-blue-600 font-medium text-sm hover:text-blue-700 hover:underline"
                      >
                        Подробнее о программе
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
