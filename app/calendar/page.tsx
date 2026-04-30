"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Calendar as CalendarIcon, ArrowRight, Bell, BellOff, ExternalLink } from "lucide-react";
import { useCompareStore } from "@/lib/compare-store";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const generateGoogleCalendarUrl = (title: string, dateStr: string) => {
  const d = new Date(dateStr);
  const start = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  // add 1 day for full day event
  const endD = new Date(d);
  endD.setDate(endD.getDate() + 1);
  const end = endD.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const text = encodeURIComponent(`Срок подачи: ${title}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&sf=true&output=xml`;
};

const getDeadlineStatus = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(dateStr);
  deadline.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / DAY_IN_MS);

  if (diffDays < 0) {
    return {
      label: "Срок подачи прошёл",
      className: "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
      dotClassName: "bg-red-500",
    };
  }

  if (diffDays === 0) {
    return {
      label: "Последний день подачи",
      className: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
      dotClassName: "bg-amber-500",
    };
  }

  if (diffDays <= 14) {
    return {
      label: `Осталось ${diffDays} дн.`,
      className: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
      dotClassName: "bg-amber-500",
    };
  }

  return {
    label: `Осталось ${diffDays} дн.`,
    className: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    dotClassName: "bg-brand-600",
  };
};

export default function CalendarPage() {
  const { favorites, reminders, toggleFavorite, clearReminder } = useCompareStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div className="mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Календарь сроков подачи
        </motion.h1>
        <p className="text-ink-500 dark:text-ink-400">Следите за сроками подачи документов по выбранным программам</p>
      </div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800"
        >
          <CalendarIcon className="w-12 h-12 text-ink-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">Календарь пуст</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">Вы пока не добавили ни одной программы.</p>
          <Link href="/programs">
            <div className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
              Перейти к программам <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4 relative before:absolute before:inset-y-0 before:left-6 before:w-px before:bg-ink-200 dark:before:bg-ink-800">
          {favorites.map((p, i) => {
            const status = getDeadlineStatus(p.deadline);
            const reminderDays = reminders[p.id] ?? [];
            const hasReminders = reminderDays.length > 0;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-14"
              >
                <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-4 border-white dark:border-ink-950 ${status.dotClassName}`} />
              
                <div className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-5 card-hover flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-bold text-brand-600 dark:text-brand-400">
                        {p.deadlineLabel}
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          hasReminders
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                            : "border-ink-200 bg-ink-50 text-ink-500 dark:border-ink-800 dark:bg-ink-950 dark:text-ink-400"
                        }`}
                      >
                        {hasReminders ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
                        {hasReminders ? `Напоминания: ${reminderDays.join(", ")} дн.` : "Без напоминаний"}
                      </span>
                    </div>
                    <Link href={`/programs/${p.id}`}>
                      <h3 className="text-lg font-semibold text-ink-900 dark:text-white hover:underline mb-1">
                        {p.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-ink-500 dark:text-ink-400">{p.university} • {p.city}</p>
                  </div>
                
                  <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                    {hasReminders && (
                      <>
                        <Link
                          href={`/programs/${p.id}`}
                          className="flex items-center gap-1.5 text-xs text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/15 font-semibold px-3 py-2 rounded-lg transition-colors border border-brand-100 dark:border-brand-500/20"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          Изменить напоминания
                        </Link>
                        <button
                          onClick={() => clearReminder(p.id)}
                          className="flex items-center gap-1.5 text-xs text-ink-600 bg-ink-50 hover:bg-ink-100 dark:bg-ink-950 dark:text-ink-300 dark:hover:bg-ink-800 font-semibold px-3 py-2 rounded-lg transition-colors border border-ink-200 dark:border-ink-800"
                        >
                          <BellOff className="w-3.5 h-3.5" />
                          Выключить напоминания
                        </button>
                      </>
                    )}
                    <a
                      href={generateGoogleCalendarUrl(p.title, p.deadline)}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-white bg-ink-900 dark:bg-white dark:text-ink-900 hover:bg-brand-600 dark:hover:bg-brand-500 font-semibold px-3 py-2 rounded-lg transition-colors"
                    >
                    Добавить в Google Календарь <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => toggleFavorite(p)}
                      className="flex items-center gap-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-3 py-2 rounded-lg transition-colors font-medium border border-transparent hover:border-red-200 dark:hover:border-red-900"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
