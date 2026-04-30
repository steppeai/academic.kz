"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, ChevronDown, ChevronUp, Award, LogIn, Save, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const GENERAL_DOCS = [
  { id: "g1", name: "Удостоверение личности / паспорт", category: "Личные документы", required: true },
  { id: "g2", name: "Фотография 3x4 (4 штуки)", category: "Личные документы", required: true },
  { id: "g3", name: "Копия диплома бакалавра (нотариально заверенная)", category: "Образование", required: true },
  { id: "g4", name: "Транскрипт оценок (нотариально заверенный)", category: "Образование", required: true },
  { id: "g5", name: "Диплом о среднем образовании", category: "Образование", required: false },
  { id: "g6", name: "Мотивационное письмо (SOP)", category: "Заявочные документы", required: true },
  { id: "g7", name: "CV / Резюме (на английском)", category: "Заявочные документы", required: true },
  { id: "g8", name: "2 рекомендательных письма", category: "Заявочные документы", required: true },
  { id: "g9", name: "Сертификат IELTS / TOEFL", category: "Языковые сертификаты", required: false },
  { id: "g10", name: "Медицинская справка (форма 086)", category: "Медицинские документы", required: false },
  { id: "g11", name: "Справка об отсутствии судимостей", category: "Юридические документы", required: false },
];
const BOLASHAK_EXTRA = [
  { id: "b1", name: "Заявление на грант Болашак", category: "Болашак", required: true },
  { id: "b2", name: "Решение работодателя / НПД (если есть)", category: "Болашак", required: false },
  { id: "b3", name: "Справка о составе семьи", category: "Болашак", required: true },
  { id: "b4", name: "Письмо о приеме из иностранного университета", category: "Болашак", required: true },
];

export default function ChecklistPage() {
  const { token, isLoggedIn } = useAuthStore();
  const [checked, setChecked] = useState([]);
  const [bolashakMode, setBolashakMode] = useState(false);
  const [collapsed, setCollapsed] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const allDocs = bolashakMode ? [...GENERAL_DOCS, ...BOLASHAK_EXTRA] : GENERAL_DOCS;
  const allCategories = [...new Set(allDocs.map(d => d.category))];

  useEffect(() => {
    if (!isLoggedIn() || !token) return;
    fetch("/api/user/checklist", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json())
      .then(d => { if (d.data?.length) setChecked(d.data.filter(i => i.isDone).map(i => i.docName)); })
      .catch(() => {});
  }, [token]);

  const toggleDoc = async (id) => {
    const newChecked = checked.includes(id) ? checked.filter(x => x !== id) : [...checked, id];
    setChecked(newChecked);
    if (isLoggedIn() && token) {
      const doc = allDocs.find(d => d.id === id);
      if (!doc) return;
      await fetch("/api/user/checklist", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify({ docName: id, isDone: newChecked.includes(id), category: doc.category }) });
    }
  };

  const toggleCategory = (cat) => {
    const catDocs = allDocs.filter(d => d.category === cat).map(d => d.id);
    const allCh = catDocs.every(id => checked.includes(id));
    if (allCh) setChecked(prev => prev.filter(id => !catDocs.includes(id)));
    else setChecked(prev => [...new Set([...prev, ...catDocs])]);
  };

  const handleSaveAll = async () => {
    if (!isLoggedIn() || !token) return;
    setSaving(true);
    for (const doc of allDocs) {
      await fetch("/api/user/checklist", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify({ docName: doc.id, isDone: checked.includes(doc.id), category: doc.category }) });
    }
    setSaving(false); setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2000);
  };

  const totalChecked = checked.filter(id => allDocs.find(d => d.id === id)).length;
  const totalRequired = allDocs.filter(d => d.required).length;
  const checkedRequired = allDocs.filter(d => d.required && checked.includes(d.id)).length;
  const progress = allDocs.length ? Math.round((totalChecked / allDocs.length) * 100) : 0;
  const requiredProgress = totalRequired ? Math.round((checkedRequired / totalRequired) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white mb-2" style={{fontFamily:"var(--font-display)"}}>Чек-лист документов</h1>
            <p className="text-ink-500 dark:text-ink-400">Отслеживай прогресс сбора документов для поступления</p>
          </div>
          {!isLoggedIn() ? (
            <Link href="/login" className="flex items-center gap-2 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand-100 transition-colors">
              <LogIn className="w-4 h-4"/> Войдите чтобы сохранить прогресс
            </Link>
          ) : (
            <button onClick={handleSaveAll} disabled={saving} className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-60">
              {savedMsg ? <><CheckCircle2 className="w-4 h-4"/> Сохранено!</> : saving ? "Сохраняем..." : <><Save className="w-4 h-4"/> Сохранить прогресс</>}
            </button>
          )}
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {value: progress+"%", label:"Общий прогресс", color:"text-ink-900 dark:text-white", bar: progress, barColor: null},
          {value: requiredProgress+"%", label:"Обязательных собрано", color:"text-emerald-600", bar: requiredProgress, barColor:"linear-gradient(90deg,#10b981,#059669)"},
          {value: totalChecked+"/"+allDocs.length, label:"Документов готово", color:"text-ink-900 dark:text-white", bar: null, sub: (allDocs.length-totalChecked)+" осталось"},
        ].map(({value,label,color,bar,barColor,sub}) => (
          <div key={label} className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-5">
            <div className={"text-3xl font-bold mb-1 "+color} style={{fontFamily:"var(--font-display)"}}>{value}</div>
            <div className="text-sm text-ink-500 dark:text-ink-400 mb-3">{label}</div>
            {bar !== null && <div className="progress-bar"><motion.div className="progress-bar-fill" animate={{width:bar+"%"}} transition={{duration:0.6}} style={barColor ? {background:barColor} : {}}/></div>}
            {sub && <div className="text-xs text-ink-400 dark:text-ink-500 mt-2">{sub}</div>}
          </div>
        ))}
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.15}} className="flex flex-wrap items-center gap-3 mb-6">
        <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2">
          <Award className="w-4 h-4 text-amber-500"/>
          <span className="text-sm text-ink-700 dark:text-ink-300">+Болашак</span>
          <div onClick={()=>setBolashakMode(!bolashakMode)} className={"w-9 h-5 rounded-full relative transition-colors cursor-pointer "+(bolashakMode?"bg-amber-500":"bg-ink-200 dark:bg-ink-700")}>
            <div className={"absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform "+(bolashakMode?"translate-x-4":"translate-x-0.5")}/>
          </div>
        </label>
        <button onClick={()=>setChecked([])} className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2 rounded-xl transition-colors">
          <RotateCcw className="w-3.5 h-3.5"/> Сбросить
        </button>
      </motion.div>

      <div className="flex flex-col gap-4">
        {allCategories.map((cat,ci) => {
          const catDocs = allDocs.filter(d=>d.category===cat);
          const catChecked = catDocs.filter(d=>checked.includes(d.id)).length;
          const isBolashakCat = cat==="Болашак";
          const isCollapsed = collapsed.includes(cat);
          return (
            <motion.div key={cat} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:ci*0.07}}
              className={"bg-white dark:bg-ink-900 rounded-2xl border overflow-hidden "+(isBolashakCat?"border-amber-200 dark:border-amber-500/30":"border-ink-200 dark:border-ink-800")}>
              <div className={"flex items-center justify-between px-5 py-4 cursor-pointer "+(isBolashakCat?"bg-amber-50 dark:bg-amber-500/10":"bg-ink-50 dark:bg-ink-800/50")}
                onClick={()=>setCollapsed(prev=>prev.includes(cat)?prev.filter(c=>c!==cat):[...prev,cat])}>
                <div className="flex items-center gap-3">
                  {isBolashakCat && <Award className="w-4 h-4 text-amber-500"/>}
                  <h3 className="font-semibold text-ink-900 dark:text-white text-sm">{cat}</h3>
                  <span className={"text-xs font-medium px-2 py-0.5 rounded-full "+(catChecked===catDocs.length?"bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400":"bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-ink-300")}>{catChecked}/{catDocs.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={e=>{e.stopPropagation();toggleCategory(cat);}} className="text-xs font-medium text-brand-600 hover:underline">{catDocs.every(d=>checked.includes(d.id))?"Снять всё":"Отметить всё"}</button>
                  {isCollapsed?<ChevronDown className="w-4 h-4 text-ink-400"/>:<ChevronUp className="w-4 h-4 text-ink-400"/>}
                </div>
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden">
                    <ul className="px-5 py-3 flex flex-col gap-1">
                      {catDocs.map((doc,di) => {
                        const done=checked.includes(doc.id);
                        return (
                          <motion.li key={doc.id} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:di*0.04}}>
                            <label className="flex items-center gap-3 py-2.5 cursor-pointer group border-b border-ink-50 dark:border-ink-800 last:border-0">
                              <input type="checkbox" className="sr-only" checked={done} onChange={()=>toggleDoc(doc.id)}/>
                              <motion.div whileTap={{scale:0.85}} className={"w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all "+(done?"border-emerald-500 bg-emerald-500":"border-ink-300 dark:border-ink-600 group-hover:border-brand-400")}>
                                {done && <motion.svg initial={{pathLength:0}} animate={{pathLength:1}} viewBox="0 0 12 12" className="w-3 h-3"><motion.path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></motion.svg>}
                              </motion.div>
                              <span className={"flex-1 text-sm transition-colors "+(done?"line-through text-ink-400":"text-ink-700 dark:text-ink-300")}>{doc.name}</span>
                              {doc.required && !done && <span className="text-xs text-red-500 font-medium shrink-0">обязательно</span>}
                              {done && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium shrink-0">готово ✓</span>}
                            </label>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {progress===100 && (
          <motion.div initial={{opacity:0,scale:0.95,y:10}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}} className="mt-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mb-1" style={{fontFamily:"var(--font-display)"}}>Все документы готовы!</h3>
            <p className="text-emerald-700 dark:text-emerald-400/80 text-sm mb-4">Отличная работа! Теперь можно переходить к подаче заявки.</p>
            <Link href="/programs" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors">Найти программу для подачи</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
