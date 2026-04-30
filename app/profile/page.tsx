"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  BarChart2,
  Bell,
  BookOpen,
  CalendarDays,
  FileCheck,
  Globe2,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  User,
  Wallet,
} from "lucide-react";
import { PROGRAMS } from "@/lib/data";
import { type StudyProfile, useAuthStore } from "@/lib/auth-store";
import { useCompareStore } from "@/lib/compare-store";
import { getChecklistStats, useChecklistStore } from "@/lib/checklist-store";

const FIELD_OPTIONS = ["IT", "Бизнес", "Право", "Финансы", "Педагогика", "Инженерия"];
const CITY_OPTIONS = ["Астана", "Алматы", "Шымкент", "Караганда", "Зарубеж"];
const LANGUAGE_OPTIONS = ["Английский", "Казахский", "Русский"];

const PROFILE_KEYS: (keyof StudyProfile)[] = [
  "goal",
  "targetDegree",
  "field",
  "city",
  "language",
  "gpa",
  "testScore",
  "budget",
  "admissionYear",
  "experience",
  "notes",
];

const DAY_IN_MS = 1000 * 60 * 60 * 24;

function daysUntil(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(date);
  deadline.setHours(0, 0, 0, 0);

  return Math.ceil((deadline.getTime() - today.getTime()) / DAY_IN_MS);
}

function formatDeadlineStatus(date: string) {
  const days = daysUntil(date);
  if (days < 0) return "срок прошёл";
  if (days === 0) return "сегодня";
  return `${days} дн. осталось`;
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const editSectionRef = useRef<HTMLElement | null>(null);
  const { user, updateProfile, updateUser, logout } = useAuthStore();
  const { favorites, items } = useCompareStore();
  const { checked, bolashakMode } = useChecklistStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !user) router.replace("/auth");
  }, [mounted, router, user]);

  useEffect(() => {
    if (!editOpen) return;

    const timeout = window.setTimeout(() => {
      editSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [editOpen]);

  const checklistStats = getChecklistStats(checked, bolashakMode);

  const profileCompletion = useMemo(() => {
    if (!user) return 0;

    const filledProfileFields = PROFILE_KEYS.filter((key) => {
      const value = user.profile[key];
      return typeof value === "boolean" ? true : Boolean(String(value).trim());
    }).length;
    const accountFields = [user.name, user.email].filter(Boolean).length;

    return Math.round(((filledProfileFields + accountFields) / (PROFILE_KEYS.length + 2)) * 100);
  }, [user]);

  const nextDeadline = useMemo(() => {
    if (favorites.length === 0) return null;
    const upcoming = favorites
      .filter((program) => daysUntil(program.deadline) >= 0)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    return upcoming[0] || null;
  }, [favorites]);

  const missingRequiredDocs = useMemo(
    () => checklistStats.allDocs.filter((doc) => doc.required && !checked.includes(doc.id)).slice(0, 5),
    [checklistStats.allDocs, checked],
  );

  const recommendedPrograms = useMemo(() => {
    if (!user) return [];

    const scored = PROGRAMS.map((program) => {
      let score = 0;
      if (program.field === user.profile.field) score += 4;
      if (program.city === user.profile.city) score += 2;
      if (user.profile.interestedBolashak && program.bolashak) score += 2;
      if (program.language.includes(user.profile.language)) score += 1;
      return { program, score };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.program.rating - a.program.rating)
      .slice(0, 3)
      .map((item) => item.program);
  }, [user]);

  const nextAction = useMemo(() => {
    if (checklistStats.progress < 40) {
      return {
        title: "Продолжить чек-лист документов",
        description: `Готово ${checklistStats.totalChecked} из ${checklistStats.allDocs.length}. Начните с обязательных документов, чтобы не потерять дедлайны.`,
        href: "/checklist",
        label: "Открыть чек-лист",
        icon: FileCheck,
        tone: "blue" as const,
      };
    }

    if (favorites.length === 0) {
      return {
        title: "Добавить первую программу в календарь",
        description: "Так профиль сможет показывать ближайший дедлайн и напоминать, что готовить дальше.",
        href: "/programs",
        label: "Выбрать программу",
        icon: CalendarDays,
        tone: "amber" as const,
      };
    }

    if (items.length < 2) {
      return {
        title: "Сравнить 2-3 программы",
        description: "Сравнение поможет быстро увидеть различия по стоимости, дедлайнам, языку и Болашак.",
        href: "/programs",
        label: "Добавить к сравнению",
        icon: BarChart2,
        tone: "green" as const,
      };
    }

    return {
      title: "Проверить ближайший дедлайн",
      description: nextDeadline
        ? `${nextDeadline.title}: ${formatDeadlineStatus(nextDeadline.deadline)}. Проверьте документы до подачи.`
        : "Проверьте календарь и обновите план подготовки.",
      href: "/calendar",
      label: "Открыть календарь",
      icon: Bell,
      tone: "blue" as const,
    };
  }, [checklistStats, favorites.length, items.length, nextDeadline]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 pt-28 dark:bg-[#070a12]">
        <div className="mx-auto max-w-6xl animate-pulse rounded-3xl border border-ink-200 bg-white p-8 dark:border-ink-800 dark:bg-ink-900">
          <div className="h-8 w-56 rounded bg-ink-100 dark:bg-ink-800" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="h-32 rounded-2xl bg-ink-100 dark:bg-ink-800" />
            <div className="h-32 rounded-2xl bg-ink-100 dark:bg-ink-800" />
            <div className="h-32 rounded-2xl bg-ink-100 dark:bg-ink-800" />
          </div>
        </div>
      </div>
    );
  }

  const profile = user.profile;

  const handleProfileChange = <K extends keyof StudyProfile>(key: K, value: StudyProfile[K]) => {
    updateProfile({ [key]: value });
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-ink-950 dark:bg-[#070a12] dark:text-white">
      <div className="mx-auto max-w-7xl px-3 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-950 sm:rounded-[2rem] sm:p-6 lg:rounded-[2.25rem] lg:p-8">
            <div className="relative flex flex-col gap-6 sm:gap-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-ink-950 text-xl font-black text-white shadow-lg shadow-ink-950/15 dark:bg-white dark:text-ink-950 sm:h-20 sm:w-20 sm:rounded-[1.6rem] sm:text-2xl">
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Рабочий кабинет
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                      {getFirstName(user.name)}, держим фокус.
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-300">
                      {profile.goal}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <ProfileChip icon={Target}>{profile.field}</ProfileChip>
                <ProfileChip icon={MapPin}>{profile.city}</ProfileChip>
                <ProfileChip icon={Globe2}>{profile.language}</ProfileChip>
                <ProfileChip icon={CalendarDays}>{profile.admissionYear}</ProfileChip>
                {profile.interestedBolashak && <ProfileChip icon={Award}>Болашак</ProfileChip>}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href={nextAction.href}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-ink-950 px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-ink-800 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-200 sm:px-5"
                >
                  Продолжить подготовку
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setEditOpen((value) => !value)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-center text-sm font-bold text-ink-800 transition-colors hover:border-brand-200 hover:bg-brand-50 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800 sm:px-5"
                >
                  <Pencil className="h-4 w-4" />
                  {editOpen ? "Скрыть настройки" : "Редактировать профиль"}
                </button>
              </div>
            </div>
          </div>

          <NextActionCard action={nextAction} />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <StatCard icon={FileCheck} label="Документы" value={`${checklistStats.progress}%`} helper={`${checklistStats.remaining} осталось`} href="/checklist" />
          <StatCard
            icon={CalendarDays}
            label="Ближайший дедлайн"
            value={nextDeadline ? nextDeadline.deadlineLabel : "Нет активных"}
            helper={nextDeadline ? formatDeadlineStatus(nextDeadline.deadline) : favorites.length > 0 ? "Все сроки прошли" : "Добавьте программу"}
            href="/calendar"
          />
          <StatCard icon={Star} label="В календаре" value={favorites.length} helper="избранные программы" href="/calendar" />
          <StatCard icon={BarChart2} label="Сравнение" value={`${items.length}/3`} helper="можно добавить ещё" href="/compare" />
        </section>

        <section className="mt-6 grid min-w-0 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-8">
          <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
            <Panel title="Документы к подаче" description="Показываем только то, что важно сейчас. Полный список остаётся в чек-листе." actionHref="/checklist" actionLabel="Открыть чек-лист">
              <div className="min-w-0 rounded-[1.25rem] border border-ink-200 bg-white/70 p-4 dark:border-ink-800 dark:bg-ink-950/50 sm:rounded-[1.5rem] sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink-700 dark:text-ink-200">Общий прогресс</span>
                  <span className="text-sm font-black text-brand-600 dark:text-brand-400">{checklistStats.progress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-500"
                    style={{ width: `${checklistStats.progress}%` }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:gap-3">
                  <MiniMetric label="Готово" value={checklistStats.totalChecked} />
                  <MiniMetric label="Осталось" value={checklistStats.remaining} />
                  <MiniMetric label="Обяз." value={`${checklistStats.requiredProgress}%`} />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="mb-3 text-sm font-bold text-ink-900 dark:text-white">Следующие обязательные документы</h3>
                {missingRequiredDocs.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {missingRequiredDocs.map((doc) => (
                      <div key={doc.id} className="flex min-w-0 items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-3 py-3 dark:border-ink-800 dark:bg-ink-950/50 sm:px-4">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-ink-400 dark:bg-ink-900">
                          <FileCheck className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink-800 dark:text-ink-100">{doc.name}</p>
                          <p className="text-xs text-ink-500 dark:text-ink-400">{doc.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Все обязательные документы отмечены. Проверьте дополнительные документы и дедлайны." />
                )}
              </div>
            </Panel>

            <Panel title="Мои программы" description="Избранные и подходящие программы в одном месте." actionHref="/programs" actionLabel="Каталог">
              <div className="grid min-w-0 gap-4 md:grid-cols-2">
                <ProgramGroup title="В календаре" empty="Добавьте программу в календарь, чтобы видеть дедлайны здесь.">
                  {favorites.slice(0, 3).map((program) => (
                    <ProgramRow key={program.id} program={program} />
                  ))}
                </ProgramGroup>
                <ProgramGroup title="Подходят профилю" empty="Заполните направление, город и язык для более точной подборки.">
                  {recommendedPrograms.map((program) => (
                    <ProgramRow key={program.id} program={program} />
                  ))}
                </ProgramGroup>
              </div>
            </Panel>
          </div>

          <aside className="flex min-w-0 flex-col gap-6 lg:gap-8">
            <Panel title="Профиль поступающего" description="Короткая карточка, по которой строится подборка." actionHref="/profile" actionLabel="Профиль">
              <div className="grid gap-3">
                <SummaryRow label="Степень" value={profile.targetDegree} />
                <SummaryRow label="Направление" value={profile.field} />
                <SummaryRow label="Город" value={profile.city} />
                <SummaryRow label="Язык" value={profile.language} />
                <SummaryRow label="GPA" value={profile.gpa} />
                <SummaryRow label="Сертификат" value={profile.testScore} />
                <SummaryRow label="Бюджет" value={profile.budget} />
              </div>
            </Panel>

            <Panel title="Заметки" description="Личные ориентиры, которые не нужно держать в голове." actionHref="/templates" actionLabel="Шаблоны">
              <p className="rounded-2xl border border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600 dark:border-ink-800 dark:bg-ink-950/50 dark:text-ink-300">
                {profile.notes || "Добавьте заметки о требованиях, профессорах, документах или приоритетах."}
              </p>
            </Panel>
          </aside>
        </section>

        {editOpen && (
          <section
            ref={editSectionRef}
            className="mt-6 rounded-[1.5rem] border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:mt-8 sm:rounded-[2rem] sm:p-6 lg:p-8"
          >
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-bold text-ink-950 dark:text-white" style={{ fontFamily: "var(--font-display)" }}>
                  Настройки профиля
                </h2>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Изменения сохраняются автоматически в браузере.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-xl bg-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-ink-700"
              >
                Готово
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Имя" icon={User}>
                <input value={user.name} onChange={(e) => updateUser({ name: e.target.value })} className="profile-input" />
              </Field>
              <Field label="Email" icon={Mail}>
                <input type="email" value={user.email} onChange={(e) => updateUser({ email: e.target.value })} className="profile-input" />
              </Field>
              <Field label="Год поступления" icon={CalendarDays}>
                <input value={profile.admissionYear} onChange={(e) => handleProfileChange("admissionYear", e.target.value)} className="profile-input" />
              </Field>
              <Field label="Цель" icon={Target} className="sm:col-span-2 lg:col-span-3">
                <input value={profile.goal} onChange={(e) => handleProfileChange("goal", e.target.value)} className="profile-input" />
              </Field>
              <Field label="Степень" icon={BookOpen}>
                <input value={profile.targetDegree} onChange={(e) => handleProfileChange("targetDegree", e.target.value)} className="profile-input" />
              </Field>
              <Field label="Направление" icon={Target}>
                <select value={profile.field} onChange={(e) => handleProfileChange("field", e.target.value)} className="profile-input">
                  {FIELD_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="Город" icon={MapPin}>
                <select value={profile.city} onChange={(e) => handleProfileChange("city", e.target.value)} className="profile-input">
                  {CITY_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="Язык" icon={Globe2}>
                <select value={profile.language} onChange={(e) => handleProfileChange("language", e.target.value)} className="profile-input">
                  {LANGUAGE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="GPA" icon={BookOpen}>
                <input value={profile.gpa} onChange={(e) => handleProfileChange("gpa", e.target.value)} className="profile-input" />
              </Field>
              <Field label="Тест / сертификат" icon={Globe2}>
                <input value={profile.testScore} onChange={(e) => handleProfileChange("testScore", e.target.value)} className="profile-input" />
              </Field>
              <Field label="Бюджет" icon={Wallet}>
                <input value={profile.budget} onChange={(e) => handleProfileChange("budget", e.target.value)} className="profile-input" />
              </Field>
              <Field label="Опыт" icon={Award}>
                <input value={profile.experience} onChange={(e) => handleProfileChange("experience", e.target.value)} className="profile-input" />
              </Field>

              <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 lg:col-span-3">
                <ToggleRow
                  icon={Bell}
                  label="Уведомления о дедлайнах"
                  enabled={profile.emailNotifications}
                  onClick={() => handleProfileChange("emailNotifications", !profile.emailNotifications)}
                />
                <ToggleRow
                  icon={Award}
                  label="Рассматриваю Болашак"
                  enabled={profile.interestedBolashak}
                  onClick={() => handleProfileChange("interestedBolashak", !profile.interestedBolashak)}
                  tone="amber"
                />
              </div>

              <Field label="Заметки" icon={Pencil} className="sm:col-span-2 lg:col-span-3">
                <textarea
                  value={profile.notes}
                  onChange={(e) => handleProfileChange("notes", e.target.value)}
                  rows={4}
                  className="profile-input resize-none"
                />
              </Field>
            </div>
          </section>
        )}

        <section className="mt-6 rounded-[1.5rem] border border-red-200/70 bg-white p-4 shadow-sm dark:border-red-500/20 dark:bg-ink-950 sm:mt-8 sm:rounded-[2rem] sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-ink-950 dark:text-white">Сессия</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-ink-500 dark:text-ink-400">
                Профиль, чек-лист, избранное и сравнение сейчас сохраняются локально в браузере. Выход завершает активную сессию, но рабочие данные остаются на устройстве.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .profile-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: rgb(248 250 252);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: rgb(15 23 42);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .profile-input:focus {
          border-color: rgb(37 99 235);
          box-shadow: 0 0 0 3px rgb(37 99 235 / 0.14);
          background: white;
        }
        .dark .profile-input {
          border-color: rgb(30 41 59);
          background: rgb(2 6 23 / 0.65);
          color: white;
        }
        .dark .profile-input:focus {
          background: rgb(15 23 42);
        }
      `}</style>
    </div>
  );
}

function NextActionCard({
  action,
}: {
  action: {
    title: string;
    description: string;
    href: string;
    label: string;
    icon: ElementType;
    tone: "blue" | "amber" | "green";
  };
}) {
  const Icon = action.icon;
  const toneClass = {
    blue: "from-brand-600 to-sky-500 dark:from-ink-900 dark:via-slate-900 dark:to-emerald-950 dark:ring-1 dark:ring-emerald-500/20",
    amber: "from-amber-500 to-orange-500 dark:from-ink-900 dark:via-stone-900 dark:to-amber-950 dark:ring-1 dark:ring-amber-500/20",
    green: "from-emerald-600 to-teal-500 dark:from-ink-900 dark:via-slate-900 dark:to-teal-950 dark:ring-1 dark:ring-teal-500/20",
  }[action.tone];

  return (
    <div className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${toneClass} p-5 text-white shadow-sm sm:rounded-[2rem] sm:p-6 lg:rounded-[2.25rem] lg:p-8`}>
      <div className="relative flex h-full flex-col justify-between gap-8 sm:gap-10">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/90 sm:mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            Следующий шаг
          </div>
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/15 sm:mb-5 sm:h-14 sm:w-14">
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
            {action.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/85">{action.description}</p>
        </div>

        <Link href={action.href} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-ink-950 transition-colors hover:bg-ink-50 sm:w-fit">
          {action.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  helper,
  href,
}: {
  icon: ElementType;
  label: string;
  value: ReactNode;
  helper?: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="h-full rounded-2xl border border-ink-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-200 hover:bg-brand-50 dark:border-ink-800 dark:bg-ink-950 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/10 sm:rounded-3xl sm:p-5">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-950 text-white dark:bg-white dark:text-ink-950 sm:mb-4 sm:h-11 sm:w-11">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-2xl font-black text-ink-950 dark:text-white sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
          {value}
        </div>
        <div className="mt-1 text-sm font-semibold text-ink-600 dark:text-ink-300">{label}</div>
        {helper && <div className="mt-2 text-xs text-ink-400 dark:text-ink-500">{helper}</div>}
      </div>
    </Link>
  );
}

function Panel({
  title,
  description,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[1.25rem] border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-950 sm:rounded-[2rem] sm:p-6">
      <div className="mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-ink-950 dark:text-white sm:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-ink-500 dark:text-ink-400">{description}</p>
        </div>
        <Link
          href={actionHref}
          className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-brand-500/10 dark:hover:text-brand-300 sm:w-auto"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {children}
    </section>
  );
}

function ProfileChip({ icon: Icon, children }: { icon: ElementType; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-3 py-1.5 text-xs font-bold text-ink-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-200">
      <Icon className="h-3.5 w-3.5 text-brand-500" />
      {children}
    </span>
  );
}

function ProgramGroup({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">{title}</h3>
      <div className="flex min-w-0 flex-col gap-3">
        {hasChildren ? children : <EmptyState text={empty} />}
      </div>
    </div>
  );
}

function ProgramRow({ program }: { program: (typeof PROGRAMS)[number] }) {
  return (
    <Link href={`/programs/${program.id}`} className="block min-w-0">
      <div className="min-w-0 overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 p-3 transition-colors hover:border-brand-200 hover:bg-brand-50 dark:border-ink-800 dark:bg-ink-950/50 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/10 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {program.bolashak && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              <Award className="h-3 w-3" />
              Болашак
            </span>
          )}
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-ink-500 dark:bg-ink-900 dark:text-ink-300">
            {program.field}
          </span>
        </div>
        <h3 className="line-clamp-2 min-w-0 break-words text-sm font-bold text-ink-950 dark:text-white">{program.title}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-ink-500 dark:text-ink-400">{program.university}</p>
        <div className="mt-3 flex flex-col gap-1 text-xs min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between min-[380px]:gap-3">
          <span className="font-semibold text-brand-600 dark:text-brand-400">{program.deadlineLabel}</span>
          <span className="shrink-0 text-ink-400 dark:text-ink-500">{program.city}</span>
        </div>
      </div>
    </Link>
  );
}

function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-start justify-between gap-1 rounded-2xl border border-ink-200 bg-ink-50 px-3 py-3 dark:border-ink-800 dark:bg-ink-950/50 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4 sm:px-4">
      <span className="text-sm text-ink-500 dark:text-ink-400">{label}</span>
      <span className="min-w-0 break-words text-left text-sm font-bold text-ink-900 dark:text-white min-[420px]:text-right">{value}</span>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
  className = "",
}: {
  label: string;
  icon: ElementType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      {children}
    </label>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  enabled,
  onClick,
  tone = "brand",
}: {
  icon: ElementType;
  label: string;
  enabled: boolean;
  onClick: () => void;
  tone?: "brand" | "amber";
}) {
  const active = tone === "amber" ? "bg-amber-500" : "bg-brand-600";

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 dark:border-ink-800 dark:bg-ink-950/50">
      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-ink-700 dark:text-ink-200">
        <Icon className="h-4 w-4 shrink-0 text-brand-500" />
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={onClick}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? active : "bg-ink-300 dark:bg-ink-800"}`}
      >
        <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-2.5 dark:bg-ink-900 sm:p-3">
      <div className="text-base font-black text-ink-950 dark:text-white sm:text-lg">{value}</div>
      <div className="text-[11px] font-medium text-ink-500 dark:text-ink-400">{label}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-5 text-sm leading-6 text-ink-500 dark:border-ink-800 dark:bg-ink-950/50 dark:text-ink-400">
      {text}
    </div>
  );
}
