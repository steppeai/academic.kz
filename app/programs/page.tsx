"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, X, Award } from "lucide-react";
import { PROGRAMS, CITIES, LANGUAGES, FIELDS, DEGREES } from "@/lib/data";
import { ProgramCard } from "@/components/ProgramCard";

const ALL_CITIES = "Все города";
const ALL_FIELDS = "Все направления";
const ALL_DEGREES = "Все степени";
const MAX_COST = 3000;

type SortBy = "cost-asc" | "cost-desc" | "deadline";
type DeadlineFilter = "all" | "soon" | "later" | "past";

const DEADLINE_FILTER_LABELS: Record<DeadlineFilter, string> = {
  all: "Любой срок",
  soon: "Ближайшие 30 дней",
  later: "Позже 30 дней",
  past: "Срок прошел",
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;

function getDaysUntil(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(date);
  deadline.setHours(0, 0, 0, 0);

  return Math.ceil((deadline.getTime() - today.getTime()) / DAY_IN_MS);
}

function matchesDeadlineFilter(date: string, filter: DeadlineFilter) {
  if (filter === "all") return true;

  const daysUntil = getDaysUntil(date);
  if (filter === "soon") return daysUntil >= 0 && daysUntil <= 30;
  if (filter === "later") return daysUntil > 30;
  return daysUntil < 0;
}

function formatProgramCount(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) return `${count} программа найдена`;
  if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
    return `${count} программы найдено`;
  }

  return `${count} программ найдено`;
}

function ProgramsContent() {
  const params = useSearchParams();
  const initialQ = params.get("q") || "";
  const initialBolashak = params.get("bolashak") === "true";

  const [query, setQuery] = useState(initialQ);
  const [city, setCity] = useState(ALL_CITIES);
  const [field, setField] = useState(ALL_FIELDS);
  const [degree, setDegree] = useState(ALL_DEGREES);
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>("all");
  const [langs, setLangs] = useState<string[]>([]);
  const [bolashak, setBolashak] = useState(initialBolashak);
  const [maxCost, setMaxCost] = useState(MAX_COST);
  const [sortBy, setSortBy] = useState<SortBy>("deadline");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleLang = (l: string) =>
    setLangs((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));

  const resetFilters = () => {
    setQuery("");
    setCity(ALL_CITIES);
    setField(ALL_FIELDS);
    setDegree(ALL_DEGREES);
    setDeadlineFilter("all");
    setLangs([]);
    setBolashak(false);
    setMaxCost(MAX_COST);
    setSortBy("deadline");
  };

  const filtered = useMemo(() => {
    const result = PROGRAMS.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query.toLowerCase()) &&
          !p.university.toLowerCase().includes(query.toLowerCase()) &&
          !p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))) return false;
      if (city !== ALL_CITIES && p.city !== city) return false;
      if (field !== ALL_FIELDS && p.field !== field) return false;
      if (degree !== ALL_DEGREES && p.degree !== degree) return false;
      if (!matchesDeadlineFilter(p.deadline, deadlineFilter)) return false;
      if (langs.length > 0 && !langs.some((l) => p.language.includes(l))) return false;
      if (bolashak && !p.bolashak) return false;
      if (p.cost > maxCost) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "cost-asc") return a.cost - b.cost;
      if (sortBy === "cost-desc") return b.cost - a.cost;
      return a.deadline.localeCompare(b.deadline);
    });
  }, [query, city, field, degree, deadlineFilter, langs, bolashak, maxCost, sortBy]);

  const activeFilters = useMemo(() => {
    const filters: { key: string; label: string; onRemove: () => void }[] = [];

    if (query.trim()) {
      filters.push({ key: "query", label: `Поиск: ${query.trim()}`, onRemove: () => setQuery("") });
    }
    if (city !== ALL_CITIES) {
      filters.push({ key: "city", label: city, onRemove: () => setCity(ALL_CITIES) });
    }
    if (field !== ALL_FIELDS) {
      filters.push({ key: "field", label: field, onRemove: () => setField(ALL_FIELDS) });
    }
    if (degree !== ALL_DEGREES) {
      filters.push({ key: "degree", label: degree, onRemove: () => setDegree(ALL_DEGREES) });
    }
    if (deadlineFilter !== "all") {
      filters.push({
        key: "deadline",
        label: DEADLINE_FILTER_LABELS[deadlineFilter],
        onRemove: () => setDeadlineFilter("all"),
      });
    }
    langs.forEach((lang) => {
      filters.push({
        key: `lang-${lang}`,
        label: lang,
        onRemove: () => setLangs((prev) => prev.filter((item) => item !== lang)),
      });
    });
    if (bolashak) {
      filters.push({ key: "bolashak", label: "Только программы Болашак", onRemove: () => setBolashak(false) });
    }
    if (maxCost < MAX_COST) {
      filters.push({
        key: "maxCost",
        label: `До ${maxCost.toLocaleString("ru")} 000 ₸`,
        onRemove: () => setMaxCost(MAX_COST),
      });
    }

    return filters;
  }, [query, city, field, degree, deadlineFilter, langs, bolashak, maxCost]);

  const hasFilters = activeFilters.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Каталог программ
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-ink-500"
        >
          {formatProgramCount(filtered.length)}
        </motion.p>
      </div>

      {/* Search + Sort bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-3 mb-6"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию, университету или тегу..."
            className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors md:hidden ${
            filtersOpen || hasFilters ? "bg-brand-600 text-white border-brand-600" : "bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-ink-200 dark:border-ink-800"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Фильтры
          {hasFilters && <span className="w-2 h-2 rounded-full bg-white/80" />}
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="hidden sm:block bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2.5 text-sm text-ink-700 dark:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="cost-asc">Дешевле сначала</option>
          <option value="cost-desc">Дороже сначала</option>
          <option value="deadline">По сроку подачи</option>
        </select>
      </motion.div>

      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={filter.onRemove}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:border-brand-200 hover:bg-brand-100 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300"
              >
                {filter.label}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
            >
              Сбросить все
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar filters — desktop */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:block w-64 shrink-0"
        >
          <FilterPanel
            city={city} setCity={setCity}
            field={field} setField={setField}
            degree={degree} setDegree={setDegree}
            deadlineFilter={deadlineFilter} setDeadlineFilter={setDeadlineFilter}
            langs={langs} toggleLang={toggleLang}
            bolashak={bolashak} setBolashak={setBolashak}
            maxCost={maxCost} setMaxCost={setMaxCost}
            sortBy={sortBy} setSortBy={setSortBy}
            onReset={resetFilters} hasFilters={hasFilters}
          />
        </motion.aside>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden w-full overflow-hidden mb-4"
            >
              <FilterPanel
                city={city} setCity={setCity}
                field={field} setField={setField}
                degree={degree} setDegree={setDegree}
                deadlineFilter={deadlineFilter} setDeadlineFilter={setDeadlineFilter}
                langs={langs} toggleLang={toggleLang}
                bolashak={bolashak} setBolashak={setBolashak}
                maxCost={maxCost} setMaxCost={setMaxCost}
                sortBy={sortBy} setSortBy={setSortBy}
                onReset={resetFilters} hasFilters={hasFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards grid */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4"
              >
                {filtered.map((p, i) => (
                  <ProgramCard key={p.id} program={p} index={i} hasActiveFilters={hasFilters} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-ink-400"
              >
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium text-ink-500">Программы не найдены</p>
                <p className="text-sm mt-1">Попробуйте изменить или сбросить фильтры</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-sm text-brand-600 font-medium hover:underline"
                >
                  Сбросить фильтры
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Filter panel ──────────────────────────────────────────────── */
function FilterPanel({
  city, setCity, field, setField,
  degree, setDegree, deadlineFilter, setDeadlineFilter,
  langs, toggleLang, bolashak, setBolashak,
  maxCost, setMaxCost, sortBy, setSortBy,
  onReset, hasFilters,
}: {
  city: string; setCity: (v: string) => void;
  field: string; setField: (v: string) => void;
  degree: string; setDegree: (v: string) => void;
  deadlineFilter: DeadlineFilter; setDeadlineFilter: (v: DeadlineFilter) => void;
  langs: string[]; toggleLang: (l: string) => void;
  bolashak: boolean; setBolashak: (v: boolean) => void;
  maxCost: number; setMaxCost: (v: number) => void;
  sortBy: SortBy; setSortBy: (v: SortBy) => void;
  onReset: () => void; hasFilters: boolean;
}) {
  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-ink-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Фильтры
        </h3>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:underline"
          >
            <X className="w-3 h-3" /> Сбросить
          </button>
        )}
      </div>

      {/* Bolashak toggle */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <span className="flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-ink-200">
          <Award className="w-3.5 h-3.5 text-gold-500" />
          Только программы Болашак
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={bolashak}
          aria-label="Показывать только программы, подходящие для Болашак"
          onClick={() => setBolashak(!bolashak)}
          className={`w-10 h-5.5 rounded-full relative transition-colors ${bolashak ? "bg-amber-500" : "bg-ink-200 dark:bg-ink-700"}`}
          style={{ height: "22px" }}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white dark:bg-ink-950 rounded-full shadow transition-transform ${bolashak ? "translate-x-5" : "translate-x-0.5"}`} />
        </button>
      </div>

      {/* City */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">Город</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-lg px-3 py-2 text-sm text-ink-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Field */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">Направление</label>
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="w-full bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-lg px-3 py-2 text-sm text-ink-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {FIELDS.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>

      {/* Degree */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">Степень обучения</label>
        <select
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          className="w-full bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-lg px-3 py-2 text-sm text-ink-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {DEGREES.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Deadline */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">Дедлайн</label>
        <select
          value={deadlineFilter}
          onChange={(e) => setDeadlineFilter(e.target.value as DeadlineFilter)}
          className="w-full bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-lg px-3 py-2 text-sm text-ink-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {(Object.keys(DEADLINE_FILTER_LABELS) as DeadlineFilter[]).map((value) => (
            <option key={value} value={value}>{DEADLINE_FILTER_LABELS[value]}</option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">Язык обучения</label>
        <div className="flex flex-col gap-2">
          {LANGUAGES.map((l) => (
            <label key={l} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={langs.includes(l)}
                onChange={() => toggleLang(l)}
                className="w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-ink-700 dark:text-ink-200">{l}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cost range */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">
          Стоимость до: <span className="text-ink-900 dark:text-white font-bold">{maxCost.toLocaleString("ru")} 000 ₸</span>
        </label>
        <input
          type="range"
          min={500}
          max={3000}
          step={100}
          value={maxCost}
          onChange={(e) => setMaxCost(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
        <div className="flex justify-between text-xs text-ink-400 mt-1">
          <span>500K</span><span>3M</span>
        </div>
      </div>

      {/* Sort (mobile) */}
      <div className="md:hidden">
        <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">Сортировка</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="w-full bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-lg px-3 py-2 text-sm text-ink-800 dark:text-white focus:outline-none"
        >
          <option value="cost-asc">Дешевле сначала</option>
          <option value="cost-desc">Дороже сначала</option>
          <option value="deadline">По сроку подачи</option>
        </select>
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense>
      <ProgramsContent />
    </Suspense>
  );
}
