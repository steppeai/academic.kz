"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, MapPin, Clock, Award, Globe,
  Calendar, BarChart2, CheckCircle2,
  Bell, ExternalLink, X,
} from "lucide-react";
import { PROGRAMS } from "@/lib/data";
import { useAuthStore } from "@/lib/auth-store";
import { useCompareStore } from "@/lib/compare-store";

const TABS = ["Обзор", "Требования", "Документы", "Сроки", "Вопросы"] as const;
const REMINDER_OPTIONS = [30, 14, 7, 1];

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const program = PROGRAMS.find((p) => p.id === id);
  if (!program) notFound();

  const [tab, setTab] = useState<typeof TABS[number]>("Обзор");
  const [checked, setChecked] = useState<string[]>([]);
  const [modal, setModal] = useState<"auth" | "reminder" | null>(null);
  const [selectedReminderDays, setSelectedReminderDays] = useState<number[]>([30, 7]);
  const [submitted, setSubmitted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { items, favorites, reminders, add, remove, toggleFavorite, setReminder } = useCompareStore();
  const inCompare = items.some((p) => p.id === program.id);
  const inFavorites = favorites.some((p) => p.id === program.id);
  const activeReminderDays = reminders[program.id] ?? [];
  const hasReminders = activeReminderDays.length > 0;

  const toggleDoc = (doc: string) =>
    setChecked((prev) => (prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]));

  const progress = Math.round((checked.length / program.documents.length) * 100);

  const openReminderModal = () => {
    if (!user) {
      setModal("auth");
      return;
    }

    setSelectedReminderDays(activeReminderDays.length > 0 ? activeReminderDays : [30, 7]);
    setSubmitted(false);
    setModal("reminder");
  };

  const handleCalendarClick = () => {
    if (!user) {
      setModal("auth");
      return;
    }

    toggleFavorite(program);
  };

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReminderDays.length === 0) return;

    setReminder(program, selectedReminderDays);
    setSubmitted(true);
    setTimeout(() => { setModal(null); setSubmitted(false); }, 1400);
  };

  const toggleReminderDay = (day: number) => {
    setSelectedReminderDays((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day].sort((a, b) => b - a),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-ink-950 dark:bg-[#070a12] dark:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/programs" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6 dark:text-ink-400 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Назад к каталогу
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-ink-200 p-6 mb-5 shadow-sm dark:bg-ink-950 dark:border-ink-800"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {program.bolashak && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-900 dark:bg-amber-500/15 dark:text-amber-300">
                  <Award className="w-3 h-3" /> Болашак
                </span>
              )}
              <span className="tag-pill dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/20">{program.field}</span>
              <span className="tag-pill dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/20">{program.degree}</span>
              {program.tags.map((t) => (
                <span key={t} className="tag-pill dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/20">{t}</span>
              ))}
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-ink-900 mb-2 leading-snug dark:text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {program.title}
            </h1>
            <p className="text-ink-500 mb-4 dark:text-ink-400">{program.university}</p>
            <div className="flex flex-wrap gap-4 text-sm text-ink-500 dark:text-ink-400">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{program.city}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{program.duration}</span>
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" />{program.language.join(", ")}</span>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-ink-200 overflow-hidden shadow-sm dark:bg-ink-950 dark:border-ink-800"
          >
            {/* Tab bar */}
            <div className="flex border-b border-ink-100 overflow-x-auto dark:border-ink-800">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    tab === t ? "text-brand-600 dark:text-brand-300" : "text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
                  }`}
                >
                  {tab === t && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full"
                    />
                  )}
                  {t}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {tab === "Обзор" && (
                  <motion.div key="overview"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <p className="text-ink-600 leading-relaxed dark:text-ink-300">{program.description}</p>
                  </motion.div>
                )}
                {tab === "Требования" && (
                  <motion.div key="req"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <ul className="flex flex-col gap-3">
                      {program.requirements.map((r, i) => (
                        <motion.li
                          key={r}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 text-sm text-ink-700 dark:text-ink-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                          {r}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {tab === "Документы" && (
                  <motion.div key="docs"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    {/* Progress */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="font-medium text-ink-700 dark:text-ink-200">Прогресс сбора</span>
                        <span className="font-bold text-brand-600 dark:text-brand-300">{checked.length}/{program.documents.length}</span>
                      </div>
                      <div className="progress-bar dark:bg-ink-800">
                        <motion.div
                          className="progress-bar-fill"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      {program.documents.map((doc, i) => {
                        const done = checked.includes(doc);
                        return (
                          <motion.li
                            key={doc}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <input type="checkbox" className="sr-only" checked={done} onChange={() => toggleDoc(doc)} />
                              <motion.div whileTap={{ scale: 0.9 }}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${done ? "border-brand-500 bg-brand-500" : "border-ink-300 group-hover:border-brand-400 dark:border-ink-700 dark:group-hover:border-brand-400"}`}
                              >
                                {done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                </motion.div>}
                              </motion.div>
                              <span className={`text-sm transition-colors ${done ? "line-through text-ink-400 dark:text-ink-500" : "text-ink-700 dark:text-ink-200"}`}>
                                {doc}
                              </span>
                            </label>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
                {tab === "Сроки" && (
                  <motion.div key="deadlines"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4 dark:bg-amber-500/10 dark:border-amber-500/20">
                      <Calendar className="w-8 h-8 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-ink-900 dark:text-white">Срок подачи</div>
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-300" style={{ fontFamily: "var(--font-display)" }}>
                          {program.deadlineLabel}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-ink-500 leading-relaxed dark:text-ink-400">
                      Убедитесь, что документы готовы заранее. Рекомендуем начать подготовку за 4–6 недель до срока подачи.
                    </p>
                  </motion.div>
                )}
                {tab === "Вопросы" && (
                  <motion.div key="questions"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <div className="flex flex-col gap-3">
                      <div className="border border-ink-200 bg-white dark:bg-ink-900 dark:border-ink-800 rounded-xl p-4">
                        <div className="font-semibold text-sm text-ink-900 mb-1 dark:text-white">Какая это степень обучения?</div>
                        <p className="text-sm text-ink-500 dark:text-ink-400">{program.degree}, длительность программы — {program.duration}.</p>
                      </div>
                      <div className="border border-ink-200 bg-white dark:bg-ink-900 dark:border-ink-800 rounded-xl p-4">
                        <div className="font-semibold text-sm text-ink-900 mb-1 dark:text-white">На каком языке проходит обучение?</div>
                        <p className="text-sm text-ink-500 dark:text-ink-400">{program.language.join(", ")}.</p>
                      </div>
                      <div className="border border-ink-200 bg-white dark:bg-ink-900 dark:border-ink-800 rounded-xl p-4">
                        <div className="font-semibold text-sm text-ink-900 mb-1 dark:text-white">Когда дедлайн подачи?</div>
                        <p className="text-sm text-ink-500 dark:text-ink-400">Срок подачи: {program.deadlineLabel}. Добавьте программу в календарь, чтобы отслеживать дедлайн.</p>
                      </div>
                      <div className="border border-ink-200 bg-white dark:bg-ink-900 dark:border-ink-800 rounded-xl p-4">
                        <div className="font-semibold text-sm text-ink-900 mb-1 dark:text-white">Какие документы смотреть в первую очередь?</div>
                        <p className="text-sm text-ink-500 dark:text-ink-400">Начните с вкладки “Документы”: там полный список для этой программы и чекбоксы для отслеживания подготовки.</p>
                      </div>
                      <div className="border border-ink-200 bg-white dark:bg-ink-900 dark:border-ink-800 rounded-xl p-4">
                        <div className="font-semibold text-sm text-ink-900 mb-1 dark:text-white">Подходит ли программа для Болашак?</div>
                        <p className="text-sm text-ink-500 dark:text-ink-400">{program.bolashak ? "Да, программа отмечена как подходящая для Болашак." : "В текущих данных программа не отмечена как подходящая для Болашак."}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          {/* Cost card */}
          <div className="bg-white rounded-2xl border border-ink-200 p-5 shadow-sm dark:bg-ink-950 dark:border-ink-800">
            <div className="text-2xl font-bold text-ink-900 mb-0.5 dark:text-white" style={{ fontFamily: "var(--font-display)" }}>
              {program.costLabel}
            </div>
            <div className="text-sm text-ink-400 mb-5 dark:text-ink-500">в год</div>

            <div className="flex flex-col gap-2">
              <button
                onClick={openReminderModal}
                className={`w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors ${
                  hasReminders ? "bg-emerald-600 hover:bg-emerald-700" : "bg-brand-600 hover:bg-brand-700"
                }`}
              >
                <Bell className="w-4 h-4" />
                {hasReminders ? "Напоминания включены" : "Напомнить о сроке подачи"}
              </button>
              <button
                onClick={() => inCompare ? remove(program.id) : add(program)}
                className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl border transition-colors ${
                  inCompare
                    ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-transparent"
                    : "bg-ink-50 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-ink-200 dark:border-ink-800 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-700 dark:hover:text-brand-400"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                {inCompare ? "В сравнении ✓" : "Сравнить"}
              </button>
              
              <button
                onClick={handleCalendarClick}
                className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl border transition-colors ${
                  inFavorites
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-transparent"
                    : "bg-ink-50 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-ink-200 dark:border-ink-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                }`}
              >
                <Calendar className="w-4 h-4" />
                {inFavorites ? "В календаре ✓" : "Добавить в календарь"}
              </button>
              <a
                href={program.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-ink-900 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors hover:bg-ink-800 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-200"
              >
                Подать заявку
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-2xl border border-ink-200 p-5 shadow-sm dark:bg-ink-950 dark:border-ink-800">
            <h4 className="font-semibold text-ink-900 text-sm mb-3 dark:text-white">Информация</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                ["Город", program.city],
                ["Степень", program.degree],
                ["Длительность", program.duration],
                ["Язык", program.language.join(", ")],
                ["Студенты", program.students.toLocaleString("ru")],
                ["Болашак", program.bolashak ? "✓ Подходит" : "✗ Нет"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-ink-500 dark:text-ink-400">{k}</span>
                  <span className={`font-medium ${k === "Болашак" && program.bolashak ? "text-amber-600 dark:text-amber-300" : "text-ink-800 dark:text-ink-100"}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Deadline reminder modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={(e) => e.target === e.currentTarget && setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl border border-ink-200 p-6 max-w-sm w-full shadow-2xl dark:bg-ink-950 dark:border-ink-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-ink-900 dark:text-white">
                  {modal === "auth" ? "Войдите в аккаунт" : "Напоминания о дедлайне"}
                </h3>
                <button onClick={() => setModal(null)} className="text-ink-400 hover:text-ink-700 dark:text-ink-500 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modal === "auth" ? (
                <div>
                  <p className="text-sm leading-6 text-ink-500 mb-5 dark:text-ink-400">
                    Войдите, чтобы сохранить программу в календарь и включить напоминания о сроке подачи.
                  </p>
                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={() => router.push("/auth")}
                      className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-brand-700 transition-colors"
                    >
                      Войти
                    </button>
                    <button
                      type="button"
                      onClick={() => setModal(null)}
                      className="w-full border border-ink-200 bg-ink-50 text-ink-700 font-semibold py-2.5 rounded-xl text-sm transition-colors hover:bg-ink-100 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : !submitted ? (
                <form onSubmit={handleReminderSubmit}>
                  <p className="text-sm leading-6 text-ink-500 mb-4 dark:text-ink-400">
                    Напоминания будут привязаны к аккаунту <span className="font-semibold text-ink-800 dark:text-ink-100">{user?.email}</span>. Программа также появится в календаре.
                  </p>
                  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                    Дедлайн:{" "}
                    <strong className="text-amber-600 dark:text-amber-300">{program.deadlineLabel}</strong>.
                  </div>
                  <div className="mb-5 grid grid-cols-2 gap-2">
                    {REMINDER_OPTIONS.map((day) => {
                      const selected = selectedReminderDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleReminderDay(day)}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                            selected
                              ? "border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
                              : "border-ink-200 bg-ink-50 text-ink-600 hover:bg-ink-100 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
                          }`}
                        >
                          за {day} {day === 1 ? "день" : "дн."}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="submit"
                    disabled={selectedReminderDays.length === 0}
                    className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-brand-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Сохранить напоминания
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-center py-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-ink-900 dark:text-white">Готово!</p>
                  <p className="text-sm text-ink-500 mt-1 dark:text-ink-400">Программа добавлена в календарь, напоминания включены.</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
