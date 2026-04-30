"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, ArrowRight, Award, Globe, Loader2 } from "lucide-react";

const toGCal = (title: string, dateStr: string) => {
  const d = new Date(dateStr);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z";
  const end = new Date(d); end.setDate(end.getDate()+1);
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent("Дедлайн: "+title)+"&dates="+fmt(d)+"/"+fmt(end);
};
const daysLeft = (d: string) => Math.ceil((new Date(d).getTime()-Date.now())/(86400000));
const fmtDate = (d: string) => new Date(d).toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"});

export default function CalendarPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [bolashakOnly, setBolashakOnly] = useState(false);

  useEffect(() => {
    fetch("/api/programs?limit=100&sort=deadline")
      .then(r=>r.json()).then(d=>setPrograms((d.data||[]).filter((p: any)=>p.deadline)))
      .catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const filtered = programs
    .filter((p: any) => filter==="kz" ? p.isKazakh : filter==="foreign" ? !p.isKazakh : true)
    .filter((p: any) => bolashakOnly ? p.bolashak : true);

  const grouped = filtered.reduce((acc: Record<string,any[]>,p: any) => {
    const m = new Date(p.deadline).toLocaleDateString("ru-RU",{month:"long",year:"numeric"});
    (acc[m]=acc[m]||[]).push(p); return acc;
  }, {} as Record<string,any[]>);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white mb-2" style={{fontFamily:"var(--font-display)"}}>Календарь дедлайнов</h1>
        <p className="text-ink-500 dark:text-ink-400">Все дедлайны программ магистратуры в одном месте</p>
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}} className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex gap-1 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl p-1">
          {[["all","Все"],["kz","🇰🇿 KZ"],["foreign","🌍 Зарубеж"]].map(([v,label]) => (
            <button key={v} onClick={()=>setFilter(v)} className={"px-3 py-1.5 text-sm font-medium rounded-lg transition-colors "+(filter===v?"bg-brand-600 text-white":"text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800")}>{label}</button>
          ))}
        </div>
        <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2">
          <Award className="w-4 h-4 text-amber-500"/>
          <span className="text-sm text-ink-700 dark:text-ink-300">Только Болашак</span>
          <div onClick={()=>setBolashakOnly(!bolashakOnly)} className={"w-9 h-5 rounded-full relative transition-colors cursor-pointer "+(bolashakOnly?"bg-amber-500":"bg-ink-200 dark:bg-ink-700")}>
            <div className={"absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform "+(bolashakOnly?"translate-x-4":"translate-x-0.5")}/>
          </div>
        </label>
        <span className="text-sm text-ink-400 ml-auto">{filtered.length} программ</span>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-brand-500"/></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800">
          <CalendarIcon className="w-12 h-12 text-ink-300 mx-auto mb-4"/>
          <p className="text-ink-500 dark:text-ink-400 mb-4">Программы не найдены</p>
          <Link href="/programs" className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-medium">Все программы <ArrowRight className="w-4 h-4"/></Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {(Object.entries(grouped) as [string,any[]][]).map(([month,progs],gi) => (
            <motion.div key={month} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:gi*0.08}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center"><CalendarIcon className="w-4 h-4 text-white"/></div>
                <h2 className="text-lg font-bold text-ink-900 dark:text-white capitalize">{month}</h2>
                <div className="flex-1 h-px bg-ink-200 dark:bg-ink-800"/>
                <span className="text-sm text-ink-400">{progs.length} программ</span>
              </div>
              <div className="flex flex-col gap-3 relative before:absolute before:inset-y-0 before:left-5 before:w-px before:bg-ink-100 dark:before:bg-ink-800">
                {progs.map((p,i) => {
                  const dl = daysLeft(p.deadline);
                  const urgent = dl<=14 && dl>=0;
                  const past = dl<0;
                  return (
                    <motion.div key={p.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}} className="relative pl-12">
                      <div className={"absolute left-3.5 top-5 w-3 h-3 rounded-full border-2 border-white dark:border-ink-950 "+(past?"bg-ink-300":urgent?"bg-red-500":"bg-brand-600")}/>
                      <div className={"bg-white dark:bg-ink-900 border rounded-2xl p-4 hover:shadow-md transition-all "+(past?"border-ink-100 dark:border-ink-800 opacity-60":urgent?"border-red-200 dark:border-red-500/30":"border-ink-200 dark:border-ink-800")}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 mb-2">
                              {p.bolashak && <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Award className="w-3 h-3"/>Болашак</span>}
                              {!p.isKazakh && <span className="text-xs text-ink-500 dark:text-ink-400 bg-ink-100 dark:bg-ink-800 px-2 py-0.5 rounded-full flex items-center gap-1"><Globe className="w-3 h-3"/>{p.country}</span>}
                              {urgent && !past && <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full animate-pulse">🔥 {dl} дн. осталось</span>}
                              {past && <span className="text-xs text-ink-400 bg-ink-100 dark:bg-ink-800 px-2 py-0.5 rounded-full">Истёк</span>}
                              {!past && !urgent && <span className="text-xs text-ink-400 dark:text-ink-500">{dl} дн. осталось</span>}
                            </div>
                            <Link href={"/programs/"+p.id}><h3 className="font-semibold text-ink-900 dark:text-white hover:text-brand-600 transition-colors mb-1">{p.titleRu||p.title}</h3></Link>
                            <p className="text-sm text-ink-500 dark:text-ink-400">{p.universityName} · {p.city}</p>
                            <p className={"text-sm font-bold mt-1 "+(past?"text-ink-400":urgent?"text-red-600 dark:text-red-400":"text-brand-600 dark:text-brand-400")}>{fmtDate(p.deadline)}</p>
                          </div>
                          {!past && <a href={toGCal(p.titleRu||p.title,p.deadline)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-white bg-ink-900 dark:bg-white dark:text-ink-900 hover:bg-brand-600 px-3 py-2 rounded-lg transition-colors shrink-0"><CalendarIcon className="w-3.5 h-3.5"/> Google Календарь</a>}
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
