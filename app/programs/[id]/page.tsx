"use client";
import { useState, use, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MapPin, Clock, Star, Award, Globe, Calendar, BarChart2, CheckCircle2, Bell, X, Loader2, ExternalLink } from "lucide-react";
import { useCompareStore } from "@/lib/compare-store";
import type { ApiProgram } from "@/lib/api-types";
import { formatCost, formatDeadline } from "@/lib/api-types";

const TABS = ["Обзор", "Требования", "Документы", "Дедлайны", "Отзывы"] as const;

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [program, setProgram] = useState<ApiProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<typeof TABS[number]>("Обзор");
  const [checked, setChecked] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { items, add, remove } = useCompareStore();

  useEffect(() => {
    fetch(`/api/programs/${id}`)
      .then(r => r.json())
      .then(d => setProgram(d.data ?? null))
      .catch(() => setProgram(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500"/></div>;
  if (!program) return notFound();

  const inCompare = items.some(p => p.id === String(program.id));
  const cost = formatCost(program);
  const deadline = formatDeadline(program.deadline);
  const docs = program.documents?.length ? program.documents : ["Диплом бакалавра", "Транскрипт", "Удостоверение личности", "Мотивационное письмо", "CV", "Рекомендательное письмо"];
  const reqs = program.requirements?.length ? program.requirements : ["Диплом бакалавра", "Знание языка", "Мотивационное письмо"];
  const progress = docs.length ? Math.round((checked.length / docs.length) * 100) : 0;
  const toggleDoc = (doc: string) => setChecked(prev => prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]);
  const handleReminder = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); setTimeout(() => { setShowModal(false); setSubmitted(false); setEmail(""); }, 2000); };
  const toggleCompare = () => {
    if (inCompare) { remove(String(program.id)); return; }
    if (items.length >= 3) return;
    add({ id: String(program.id), title: program.titleRu || program.title, university: program.universityName, city: program.city, language: program.language, cost: program.cost, costLabel: cost, deadline: program.deadline || "", deadlineLabel: deadline, duration: program.duration || "2 года", bolashak: program.bolashak, tags: program.tags, description: program.description || "", requirements: reqs, documents: docs, rating: program.rating || 4.0, students: program.students || 0, field: program.field });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}>
        <Link href="/programs" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4"/> Назад к программам
        </Link>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-6 mb-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {program.bolashak && <span className="tag-pill-gold flex items-center gap-1"><Award className="w-3 h-3"/> Болашак</span>}
              <span className="tag-pill">{program.field}</span>
              {!program.isKazakh && <span className="tag-pill flex items-center gap-1"><Globe className="w-3 h-3"/>{program.country}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white mb-2" style={{fontFamily:"var(--font-display)"}}>{program.titleRu || program.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-ink-500 dark:text-ink-400">{program.universityName}</p>
              {program.ranking && <span className="text-xs bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full">QS #{program.ranking}</span>}
              {program.website && <a href={program.website} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-400 hover:text-brand-600 flex items-center gap-1"><ExternalLink className="w-3 h-3"/> Сайт</a>}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-ink-500 dark:text-ink-400">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/>{program.city}, {program.country}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/>{program.duration ?? "2 года"}</span>
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4"/>{program.language?.join(", ")}</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-gold-500 fill-gold-500"/>{program.rating?.toFixed(1)} · {program.students?.toLocaleString("ru") ?? 0} студентов</span>
            </div>
          </motion.div>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 overflow-hidden">
            <div className="flex border-b border-ink-100 dark:border-ink-800 overflow-x-auto">
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)} className={"relative px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors " + (tab===t ? "text-brand-600" : "text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white")}>
                  {tab===t && <motion.span layoutId="tab-ul" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full"/>}
                  {t}
                </button>
              ))}
            </div>
            <div className="p-6">
              <AnimatePresence mode="wait">
                {tab==="Обзор" && (
                  <motion.div key="o" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
                    <p className="text-ink-600 dark:text-ink-300 leading-relaxed">{program.description || "Магистерская программа в " + program.universityName + " в " + program.city + ". Язык обучения: " + program.language?.join(", ") + "."}</p>
                    {program.bolashak && <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20"><div className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400 mb-1"><Award className="w-4 h-4"/> Поддерживается грантом Болашак</div><p className="text-sm text-amber-600 dark:text-amber-400/80">Эта программа соответствует требованиям гранта Болашак.</p></div>}
                  </motion.div>
                )}
                {tab==="Требования" && (
                  <motion.div key="r" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
                    <ul className="flex flex-col gap-3">{reqs.map((r,i) => <motion.li key={r} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}} className="flex items-start gap-3 text-sm text-ink-700 dark:text-ink-300"><CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 shrink-0"/>{r}</motion.li>)}</ul>
                  </motion.div>
                )}
                {tab==="Документы" && (
                  <motion.div key="d" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2 text-sm"><span className="font-medium text-ink-700 dark:text-ink-300">Прогресс</span><span className="font-bold text-brand-600">{checked.length}/{docs.length}</span></div>
                      <div className="progress-bar"><motion.div className="progress-bar-fill" animate={{width:progress+"%"}} transition={{duration:0.5}}/></div>
                    </div>
                    <ul className="flex flex-col gap-2.5">{docs.map((doc,i) => { const done=checked.includes(doc); return <motion.li key={doc} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}><label className="flex items-center gap-3 cursor-pointer group"><input type="checkbox" className="sr-only" checked={done} onChange={() => toggleDoc(doc)}/><motion.div whileTap={{scale:0.9}} className={"w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors " + (done ? "border-brand-500 bg-brand-500" : "border-ink-300 group-hover:border-brand-400")}>{done && <motion.div initial={{scale:0}} animate={{scale:1}}><CheckCircle2 className="w-3.5 h-3.5 text-white"/></motion.div>}</motion.div><span className={"text-sm " + (done ? "line-through text-ink-400" : "text-ink-700 dark:text-ink-300")}>{doc}</span></label></motion.li>; })}</ul>
                  </motion.div>
                )}
                {tab==="Дедлайны" && (
                  <motion.div key="dl" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
                    <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20 mb-4">
                      <Calendar className="w-8 h-8 text-amber-500 shrink-0"/>
                      <div><div className="font-semibold text-ink-900 dark:text-white">Дедлайн подачи</div><div className="text-2xl font-bold text-amber-600 dark:text-amber-400" style={{fontFamily:"var(--font-display)"}}>{deadline}</div></div>
                    </div>
                    <p className="text-sm text-ink-500 dark:text-ink-400">Рекомендуем начать подготовку за 4–6 недель до дедлайна.</p>
                  </motion.div>
                )}
                {tab==="Отзывы" && (
                  <motion.div key="rv" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
                    <div className="flex flex-col gap-4">{[{name:"Айгерим С.",stars:5,text:"Отличная программа! Преподаватели — практики с огромным опытом."},{name:"Ильяс Н.",stars:4,text:"Интенсивное обучение. Качество знаний на высоте."}].map(({name,stars,text}) => <div key={name} className="bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl p-4"><div className="flex items-center justify-between mb-2"><span className="font-semibold text-ink-900 dark:text-white text-sm">{name}</span><div className="flex text-gold-500">{Array.from({length:5}).map((_,i) => <Star key={i} className={"w-3.5 h-3.5 " + (i<stars ? "fill-gold-500" : "")}/>)}</div></div><p className="text-sm text-ink-600 dark:text-ink-400">{text}</p></div>)}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        <motion.aside initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:0.2}} className="flex flex-col gap-4">
          <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-5">
            <div className="text-2xl font-bold text-ink-900 dark:text-white mb-0.5" style={{fontFamily:"var(--font-display)"}}>{cost}</div>
            <div className="text-sm text-ink-400 dark:text-ink-500 mb-5">в год</div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setShowModal(true)} className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"><Bell className="w-4 h-4"/> Напомнить о дедлайне</button>
              <button onClick={toggleCompare} className={"w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl border transition-colors " + (inCompare ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 border-brand-200" : "bg-ink-50 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-ink-200 dark:border-ink-800 hover:bg-brand-50 hover:text-brand-700")}><BarChart2 className="w-4 h-4"/>{inCompare ? "В сравнении ✓" : "Сравнить"}</button>
              {program.website && <a href={program.website} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-ink-900 dark:bg-white text-white dark:text-ink-900 text-sm font-semibold py-2.5 rounded-xl hover:bg-ink-800 transition-colors"><ExternalLink className="w-4 h-4"/> Перейти на сайт</a>}
            </div>
          </div>
          <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-5">
            <h4 className="font-semibold text-ink-900 dark:text-white text-sm mb-3">Информация</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              {([["Страна",program.country],["Город",program.city],["Длительность",program.duration??"2 года"],["Язык",program.language?.join(", ")],["Студентов",program.students?.toLocaleString("ru")??"—"],["QS рейтинг",program.ranking?"#"+program.ranking:"—"],["Болашак",program.bolashak?"✓ Подходит":"✗ Не входит"]] as [string,string|undefined][]).map(([k,v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-ink-500 dark:text-ink-400">{k}</span>
                  <span className={"font-medium " + (k==="Болашак" && program.bolashak ? "text-amber-600" : "text-ink-800 dark:text-ink-200")}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} className="bg-white dark:bg-ink-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink-900 dark:text-white">Напоминание о дедлайне</h3>
              <button onClick={() => setShowModal(false)} className="text-ink-400 hover:text-ink-700"><X className="w-5 h-5"/></button>
            </div>
            {!submitted ? (
              <form onSubmit={handleReminder}>
                <p className="text-sm text-ink-500 dark:text-ink-400 mb-4">Напоминание за неделю до <strong className="text-amber-600">{deadline}</strong>.</p>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-900 dark:text-white rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
                <button type="submit" className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-brand-700">Подписаться</button>
              </form>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2"/>
                <p className="font-semibold text-ink-900 dark:text-white">Готово!</p>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Напоминание отправлено на {email}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
