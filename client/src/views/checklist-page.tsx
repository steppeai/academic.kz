"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CircularProgress = ({ percentage }) => {
  const size = 160;
  const stroke = 12;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  // Dark tip arc length (small segment at the end of blue)
  const tipLen = circumference * 0.045;

  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const blueLen = animated ? (percentage / 100) * circumference : 0;
  const transition = "stroke-dasharray 1.3s cubic-bezier(0.4,0,0.2,1)";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Gray track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />

        {/* Blue filled arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#2563eb"
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={`${Math.max(0, blueLen - tipLen / 2)} ${circumference}`}
          style={{ transition }}
        />

        {/* Dark tip at the end of blue arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#1e293b"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${animated ? tipLen : 0} ${circumference}`}
          strokeDashoffset={animated ? -(blueLen - tipLen) : 0}
          style={{ transition }}
        />
      </svg>
      <motion.span
        className="absolute text-3xl font-bold text-gray-900"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {percentage}%
      </motion.span>
    </div>
  );
};

const StatusBar = ({ status }) => {
  if (status === "done") {
    return (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
        style={{
          backgroundColor: "#d1fae5",
          color: "#065f46",
          width: "fit-content",
        }}
      >
        <span>✓</span>
        <span>Выполнено</span>
      </motion.div>
    );
  }
  if (status === "progress") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="rounded-full px-4 py-1.5 text-sm font-medium text-center"
        style={{ backgroundColor: "#dbeafe", color: "#1e40af", minWidth: 160 }}
      >
        В процессе
      </motion.div>
    );
  }
  return null;
};

const DocumentCard = ({ icon, title, description, status, delay, checked }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-2xl p-5"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 32,
              height: 32,
              backgroundColor: checked ? "#eff6ff" : "#f9fafb",
              color: checked ? "#1d4ed8" : "#6b7280",
            }}
          >
            {icon}
          </div>
        </div>
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="text-xs font-bold tracking-widest px-3 py-1 rounded-full border"
          style={{ color: "#374151", borderColor: "#d1d5db", fontSize: 10 }}
        >
          ОБЯЗАТЕЛЬНО
        </motion.span>
      </div>
      <h3
        className="font-semibold text-gray-900 mb-1"
        style={{ fontFamily: "'Sora', sans-serif", fontSize: 15 }}
      >
        {title}
      </h3>
      <p className="text-xs text-gray-400 mb-3" style={{ lineHeight: 1.5 }}>
        {description}
      </p>
      {status && (
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm">↻</span>
          <StatusBar status={status} />
        </div>
      )}
    </motion.div>
  );
};

const GlobeIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function AcademiDashboard() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f3ede3", fontFamily: "'Inter', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-black/60 backdrop-blur-md border-white/10 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 flex justify-between items-center transition-colors duration-300 ${scrolled ? "text-white" : "text-gray-900"}`}
        >
          <div
            className="text-2xl font-bold tracking-tighter"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Academik<span className="text-blue-400"></span>
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
              <GlobeIcon />
              <span>RU</span>
            </button>
            <button
              className={`flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-full transition-all border ${scrolled ? "bg-white/10 hover:bg-white/20 border-white/20" : "bg-black/10 hover:bg-black/15 border-black/20"}`}
            >
              <UserIcon />
              <span className="text-sm font-medium">Войти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ paddingTop: 80 }}
        className="px-8 pb-4 flex items-center gap-2 text-sm text-gray-500"
      >
        <span>🎓</span>
        <span>Master of Computer Science, Назарбаев Университет</span>
      </motion.div>

      {/* Main Content */}
      <div className="px-8 pb-12 flex gap-6 w-full">
        {/* Left Card - Document Readiness */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-3xl p-8 flex flex-col items-center"
          style={{
            width: 380,
            minWidth: 340,
            boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
          }}
        >
          <h2
            className="text-lg font-semibold text-gray-800 mb-6"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Готовность документов
          </h2>

          <CircularProgress percentage={25} />

          <div className="w-full mt-8 space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200"
            >
              <span className="text-sm text-gray-600">Собрано:</span>
              <span className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-0.5 rounded-lg border border-gray-200">
                1 / 5
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200"
            >
              <span className="text-sm text-gray-600">Осталось времени:</span>
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="text-sm font-medium px-3 py-0.5 rounded-lg border"
                style={{
                  backgroundColor: "#fff7ed",
                  color: "#c2410c",
                  borderColor: "#fed7aa",
                }}
              >
                14 дней
              </motion.span>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02, backgroundColor: "#dbeafe" }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}
          >
            Соберите все документы
          </motion.button>
        </motion.div>

        {/* Right Section */}
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Обязательные
          </motion.h2>

          <div className="space-y-4">
            <DocumentCard
              delay={0.4}
              checked={false}
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="Мотивационное письмо"
              description="Эссе (SOP) на 500-1000 слов о ваших академических целях и планах."
              status="progress"
            />

            <DocumentCard
              delay={0.55}
              checked={true}
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#1d4ed8"
                  strokeWidth={2.5}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
              title="Официальный транскрипт"
              description="Диплом бакалавра с приложением оценок, переведенный на английский."
              status="done"
            />

            <DocumentCard
              delay={0.7}
              checked={false}
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              }
              title="IELTS / TOEFL"
              description="Сертификат английского языка (общий балл не ниже 6.5)."
              status={null}
            />

            <DocumentCard
              delay={0.85}
              checked={false}
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              }
              title="Рекомендательное письмо"
              description="2 письма от преподавателей или работодателей на английском языке."
              status={null}
            />

            <DocumentCard
              delay={1.0}
              checked={false}
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              }
              title="CV / Резюме"
              description="Академическое или профессиональное резюме на английском языке."
              status={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
