"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, ArrowRight, ExternalLink, Award, Globe, Filter, Loader2 } from "lucide-react";

const generateGoogleCalendarUrl = (title: string, dateStr: string) => {
  const d = new Date(dateStr);
  const start = d.toISOString().replace(/-|:|\\.\\d\\d\\d/g, "");
  const endD = new Date(d);
  endD.setDate(endD.getDate() + 1);
  const end = endD.toISOString().replace(/-|:|\\.\\d\\d\\d/g, "");
  const text = encodeURIComponent("Дедлайн подачи: " + title);
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + text + "&dates=" + start + "/" + end + "&sf=true&output=xml";
};

const getDaysLeft = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

export default function CalendarPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "kz" | "foreign">("all");
  const [bolashakOnly, setBolashakOnly] = useState(false);

  useEffect(() => {
    fetch("/api/programs?limit=100&sort=deadline")
      .then(r => r.json())
      .then(d => {
        const withDeadline = (d.data || []).filter((p: any) => p.deadline);
        setPrograms(withDeadline);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs
    .filter(p => filter === "kz" ? p.isKazakh : filter === "foreign" ? !p.isKazakh : true)
    .filter(p => bolashakOnly ? p.bolashak : true);

  // Группируем по месяцу
  const grouped = filtered.reduce((acc: Record<string, any[]>, p) => {
    const month = new Date(p.deadline).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
    if (!acc[month]) acc[month] = [];
    acc[month].push(p);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Календарь дедлайнов
        </h1>
        <p className="text-ink-500 dark:text-ink-400">Все дедлайны программ магистратуры в одном месте</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex gap-1 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl p-1">
          {([["all","Все"],["kz","🇰🇿 KZ"],["foreign","🌍 Зарубеж"]] as const).map(([v, label]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={"px-3 py-1.5 text-sm font-medium rounded-lg transition-colors " + (filter === v ? "bg-brand-600 text-white" : "text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800")}>
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-ink-700 dark:text-ink-300">Только Болашак</span>
          <div onClick={() => setBolashakOnly(!bolashakOnly)} className={"w-9 h-5 rounded-full relative transition-colors cursor-pointer " + (bolashakOnly ? "bg-amber-500" : "bg-ink-200 dark:bg-ink-700")}>
            <div className={"absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform " + (bolashakOnly ? "translate-x-4" : "translate-x-0.5")} />
          </div>
        </label>
        <span className="text-sm text-ink-400 dark:text-ink-500 ml-auto">
          {filtered.length} программ
        </span>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-24 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800">
          <CalendarIcon className="w-12 h-12 text-ink-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">Программы не найдены</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">Попробуй изменить фильтры</p>
          <Link href="/programs" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
            Все программы <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(grouped).map(([month, progs], gi) => (
            <motion.div key={month} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.08 }}>
              {/* Month header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-ink-900 dark:text-white capitalize">{month}</h2>
                <div className="flex-1 h-px bg-ink-200 dark:bg-ink-800" />
                <span className="text-sm text-ink-400">{progs.length} программ</span>
              </div>

              {/* Programs */}
              <div className="flex flex-col gap-3 relative before:absolute before:inset-y-0 before:left-5 before:w-px before:bg-ink-100 dark:before:bg-ink-800">
                {progs.map((p, i) => {
                  const daysLeft = getDaysLeft(p.deadline);
                  const isUrgent = daysLeft <= 14 && daysLeft >= 0;
                  const isPast = daysLeft < 0;

                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="relative pl-12">
                      <div className={"absolute left-3.5 top-5 w-3 h-3 rounded-full border-2 border-white dark:border-ink-950 " +
                        (isPast ? "bg-ink-300" : isUrgent ? "bg-red-500" : "bg-brand-600")} />

                      <div className={"bg-white dark:bg-ink-900 border rounded-2xl p-4 transition-all hover:shadow-md " +
                        (isPast ? "border-ink-100 dark:border-ink-800 opacity-60" : isUrgent ? "border-red-200 dark:border-red-500/30" : "border-ink-200 dark:border-ink-800")}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-2">
                              {p.bolashak && <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Award className="w-3 h-3" /> Болашак</span>}
                              {!p.isKazakh && <span className="text-xs text-ink-500 dark:text-ink-400 bg-ink-100 dark:bg-ink-800 px-2 py-0.5 rounded-full flex items-center gap-1"><Globe className="w-3 h-3" />{p.country}</span>}
                              {isUrgent && !isPast && <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full animate-pulse">🔥 {daysLeft} дн. осталось</span>}
                              {isPast && <span className="text-xs text-ink-400 bg-ink-100 dark:bg-ink-800 px-2 py-0.5 rounded-full">Истёк</span>}
                              {!isPast && !isUrgent && <span className="text-xs text-ink-400 dark:text-ink-500">{daysLeft} дн. осталось</span>}
                            </div>

                            <Link href={"/programs/" + p.id}>
                              <h3 className="font-semibold text-ink-900 dark:text-white hover:text-brand-600 transition-colors mb-1">
                                {p.titleRu || p.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-ink-500 dark:text-ink-400">{p.universityName} · {p.city}</p>
                            <p className={"text-sm font-bold mt-1 " + (isPast ? "text-ink-400" : isUrgent ? "text-red-600 dark:text-red-400" : "text-brand-600 dark:text-brand-400")}>
                              {formatDate(p.deadline)}
                            </p>
                          </div>

                          {!isPast && (
                            <a href={generateGoogleCalendarUrl(p.titleRu || p.title, p.deadline)}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-ink-900 dark:bg-white dark:text-ink-900 hover:bg-brand-600 dark:hover:bg-brand-500 px-3 py-2 rounded-lg transition-colors shrink-0">
                              <CalendarIcon className="w-3.5 h-3.5" /> Google Календарь
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
