"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, X, Award, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ApiProgramCard } from "@/components/ApiProgramCard";

const FIELDS = ["Все направления","IT","Business","Finance","Law","Medicine","Engineering","Economics","Public Policy","Humanities"];
const COUNTRIES = ["Все страны","Kazakhstan","USA","UK","Germany","Canada","Netherlands","Australia","Singapore","South Korea","Japan","China","Switzerland"];
const LANGUAGES = ["English","Kazakh","Russian","German","Turkish"];

function ProgramsContent() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [debouncedQ, setDebouncedQ] = useState(params.get("q") || "");
  const [field, setField] = useState("Все направления");
  const [country, setCountry] = useState("Все страны");
  const [langs, setLangs] = useState<string[]>([]);
  const [bolashak, setBolashak] = useState(false);
  const [isKazakh, setIsKazakh] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const [programs, setPrograms] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => { setDebouncedQ(query); setPage(1); }, 400); return () => clearTimeout(t); }, [query]);
  useEffect(() => { setPage(1); }, [field, country, langs, bolashak, isKazakh, sortBy]);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (debouncedQ) sp.set("q", debouncedQ);
      if (field !== "Все направления") sp.set("field", field);
      if (country !== "Все страны") sp.set("country", country);
      if (langs.length === 1) sp.set("lang", langs[0]);
      if (bolashak) sp.set("bolashak", "true");
      if (isKazakh === "kz") sp.set("isKazakh", "true");
      if (isKazakh === "foreign") sp.set("isKazakh", "false");
      sp.set("sort", sortBy); sp.set("page", String(page)); sp.set("limit", "12");
      const res = await fetch(`/api/programs?${sp}`);
      const data = await res.json();
      setPrograms(data.data ?? []); setMeta(data.meta ?? null);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  }, [debouncedQ, field, country, langs, bolashak, isKazakh, sortBy, page]);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);
  const toggleLang = (l: string) => setLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  const resetFilters = () => { setQuery(""); setDebouncedQ(""); setField("Все направления"); setCountry("Все страны"); setLangs([]); setBolashak(false); setIsKazakh("all"); setSortBy("rating"); setPage(1); };
  const hasFilters = field !== "Все направления" || country !== "Все страны" || langs.length > 0 || bolashak || isKazakh !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div className="mb-8">
        <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white mb-2" style={{fontFamily:"var(--font-display)"}}>Каталог программ</motion.h1>
        <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="text-ink-500 dark:text-ink-400">{loading ? "Загружаем..." : `${meta?.total ?? 0} программ найдено`}</motion.p>
      </div>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по названию, университету или тегу..." className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-ink-400 hover:text-ink-600" /></button>}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="hidden sm:block bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2.5 text-sm text-ink-700 dark:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="rating">По рейтингу</option>
          <option value="cost-asc">Дешевле сначала</option>
          <option value="cost-desc">Дороже сначала</option>
          <option value="deadline">По дедлайну</option>
        </select>
      </motion.div>
      <div className="flex gap-6">
        <motion.aside initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.2}} className="hidden md:block w-64 shrink-0">
          <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-ink-900 dark:text-white flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Фильтры</h3>
              {hasFilters && <button onClick={resetFilters} className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:underline"><X className="w-3 h-3" /> Сбросить</button>}
            </div>
            <label className="flex items-center justify-between gap-2 mb-5 cursor-pointer">
              <span className="flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-ink-300"><Award className="w-3.5 h-3.5 text-gold-500" /> Только Болашак</span>
              <div onClick={() => setBolashak(!bolashak)} style={{height:"22px"}} className={`w-10 rounded-full relative transition-colors cursor-pointer ${bolashak ? "bg-amber-500" : "bg-ink-200 dark:bg-ink-700"}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${bolashak ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">Регион</label>
              <div className="flex gap-1">
                {[["all","Все"],["kz","🇰🇿 KZ"],["foreign","🌍 Заруб"]].map(([v,label]) => (
                  <button key={v} onClick={() => setIsKazakh(v)} className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${isKazakh === v ? "bg-brand-600 text-white" : "bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-200"}`}>{label}</button>
                ))}
              </div>
            </div>
            {([["Направление", field, setField, FIELDS],["Страна", country, setCountry, COUNTRIES]] as [string, string, (v: string)=>void, string[]][]).map(([label, val, setter, opts]) => (
              <div key={label} className="mb-4">
                <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">{label}</label>
                <select value={val} onChange={e => setter(e.target.value)} className="w-full bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-lg px-3 py-2 text-sm text-ink-800 dark:text-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-500">
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">Язык</label>
              <div className="flex flex-col gap-2">
                {LANGUAGES.map(l => (
                  <label key={l} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={langs.includes(l)} onChange={() => toggleLang(l)} className="w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
                    <span className="text-sm text-ink-700 dark:text-ink-300">{l}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /><p className="text-sm text-ink-400">Загружаем программы...</p></div>
          ) : programs.length === 0 ? (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium text-ink-500 dark:text-ink-400">Программы не найдены</p>
              <button onClick={resetFilters} className="mt-4 text-sm text-brand-600 font-medium hover:underline">Сбросить фильтры</button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  {programs.map((p, i) => <ApiProgramCard key={p.id} program={p} index={i} />)}
                </motion.div>
              </AnimatePresence>
              {meta && meta.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-ink-200 dark:border-ink-700 disabled:opacity-30 hover:bg-ink-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  {Array.from({length: meta.pages}, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${page === n ? "bg-brand-600 text-white" : "border border-ink-200 dark:border-ink-700 hover:bg-ink-50 text-ink-700 dark:text-ink-300"}`}>{n}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(meta.pages, p + 1))} disabled={page === meta.pages} className="p-2 rounded-xl border border-ink-200 dark:border-ink-700 disabled:opacity-30 hover:bg-ink-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default function ProgramsPage() {
  return <Suspense><ProgramsContent /></Suspense>;
}