"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Award, CheckCircle2, XCircle, ChevronRight, ArrowRight, Globe, GraduationCap, FileText, Calendar, DollarSign, MapPin, Star, AlertCircle, ExternalLink, BookOpen, Shield, Briefcase, TrendingUp } from "lucide-react";

const STATS = [
  {num:"~500",label:"Грантов в год",sub:"на магистратуру"},
  {num:"47+",label:"Стран обучения",sub:"из утверждённого списка"},
  {num:"100%",label:"Покрытие",sub:"обучение + проживание"},
  {num:"5 лет",label:"Обязательная отработка",sub:"в Казахстане после"},
];
const COVERAGE = [
  {icon:DollarSign,title:"Оплата обучения",desc:"100% стоимости обучения без ограничений по сумме",color:"emerald"},
  {icon:MapPin,title:"Проживание",desc:"$1,500–$2,500/мес в зависимости от страны",color:"brand"},
  {icon:Globe,title:"Перелёты",desc:"Авиабилеты туда-обратно 1 раз в год",color:"amber"},
  {icon:BookOpen,title:"Учебные материалы",desc:"Компенсация до $2,000/год на книги",color:"purple"},
  {icon:Shield,title:"Медстраховка",desc:"Полное медицинское страхование за рубежом",color:"rose"},
  {icon:TrendingUp,title:"Языковые курсы",desc:"Подготовительные языковые курсы при необходимости",color:"sky"},
];
const REQUIREMENTS = [
  {icon:GraduationCap,title:"Образование",items:["Диплом бакалавра с отличием (красный диплом) ИЛИ","GPA 3.5+ из 4.0 (или 4.0+ из 5.0)","Для PhD — диплом магистра"]},
  {icon:Globe,title:"Гражданство",items:["Гражданин Республики Казахстан","Постоянное проживание в РК","Нет иного иностранного гражданства"]},
  {icon:Calendar,title:"Возраст",items:["Магистратура: до 35 лет","Докторантура (PhD): до 40 лет","Исчисляется на дату подачи заявки"]},
  {icon:Briefcase,title:"Опыт работы",items:["Не менее 2 лет стажа по специальности","Подтверждается трудовой книжкой","Для стратегических специальностей — исключения"]},
  {icon:Shield,title:"Обязательства",items:["Вернуться в Казахстан после обучения","Работать по специальности 5 лет","Работодатель должен подтвердить возврат"]},
  {icon:FileText,title:"Языковой минимум",items:["IELTS 6.0+ / TOEFL 79+ для английских программ","Или языковой сертификат страны обучения","Подтверждается на момент подачи"]},
];
const DOCS = [
  {cat:"Основные",items:["Удостоверение личности / паспорт (нотариально заверенная копия)","Диплом бакалавра с приложением (нотариально заверенный)","Транскрипт оценок (нотариально заверенный)","Трудовая книжка или справка о стаже","Автобиография (CV) на казахском и английском"]},
  {cat:"Языковые",items:["IELTS / TOEFL / DELF / TestDaF или иной языковой сертификат","Сертификат должен быть действующим (обычно 2 года)"]},
  {cat:"От работодателя",items:["Письмо-гарантия о трудоустройстве после возвращения","Согласование с государственным органом (для гос. служащих)","НПД (направление на подготовку) — если есть"]},
  {cat:"От университета",items:["Письмо о зачислении (Offer / Acceptance Letter)","Программа обучения с указанием стоимости","Аккредитация университета (QS или аналог)"]},
  {cat:"Дополнительные",items:["Медицинская справка (форма 086-У)","Справка об отсутствии судимости","3 рекомендательных письма","Мотивационное письмо (SOP) на казахском и английском"]},
];
const TIMELINE = [
  {month:"Январь–Февраль",step:"Сбор документов",desc:"Готовь диплом, транскрипт, языковой сертификат, письмо от работодателя"},
  {month:"Февраль–Март",step:"Подача в ЦМП",desc:"Подача заявки в Центр международных программ на bolashak.gov.kz"},
  {month:"Апрель–Май",step:"Конкурсный отбор",desc:"Документальный скрининг, тестирование, интервью на казахском языке"},
  {month:"Май–Июнь",step:"Результаты",desc:"Публикация списков победителей на сайте ЦМП"},
  {month:"Июнь–Август",step:"Поступление в университет",desc:"Подача заявок с письмом-поддержкой от ЦМП"},
  {month:"Сентябрь",step:"Начало обучения",desc:"Выезд на учёбу, активация стипендии"},
];
const PARTNER_UNIS = [
  {name:"MIT",country:"США",qs:1,city:"Кембридж"},{name:"Stanford",country:"США",qs:5,city:"Стэнфорд"},
  {name:"Oxford",country:"UK",qs:3,city:"Оксфорд"},{name:"Cambridge",country:"UK",qs:2,city:"Кембридж"},
  {name:"ETH Zurich",country:"Швейцария",qs:7,city:"Цюрих"},{name:"Imperial College",country:"UK",qs:8,city:"Лондон"},
  {name:"UCL",country:"UK",qs:9,city:"Лондон"},{name:"TU Munich",country:"Германия",qs:37,city:"Мюнхен"},
  {name:"NUS",country:"Сингапур",qs:8,city:"Сингапур"},{name:"Toronto",country:"Канада",qs:25,city:"Торонто"},
  {name:"EPFL",country:"Швейцария",qs:17,city:"Лозанна"},{name:"LSE",country:"UK",qs:45,city:"Лондон"},
];
const QUIZ = [
  {q:"Ты гражданин Республики Казахстан?",opts:["Да","Нет"],correct:"Да"},
  {q:"Есть диплом бакалавра с отличием или GPA 3.5+?",opts:["Да","Нет"],correct:"Да"},
  {q:"Сколько тебе лет?",opts:["До 35 лет","35 и старше"],correct:"До 35 лет"},
  {q:"Есть 2+ лет опыта работы по специальности?",opts:["Да","Нет / меньше 2 лет"],correct:"Да"},
  {q:"Готов вернуться и работать в Казахстане 5 лет?",opts:["Да, готов","Нет, не готов"],correct:"Да, готов"},
  {q:"Есть языковой сертификат (IELTS 6.0+, TOEFL 79+)?",opts:["Да, есть","Планирую сдать","Нет"],correct:"Да, есть"},
];
const COLORS: Record<string, string> = {emerald:"bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600",brand:"bg-brand-50 dark:bg-brand-500/10 text-brand-600",amber:"bg-amber-50 dark:bg-amber-500/10 text-amber-600",purple:"bg-purple-50 dark:bg-purple-500/10 text-purple-600",rose:"bg-rose-50 dark:bg-rose-500/10 text-rose-600",sky:"bg-sky-50 dark:bg-sky-500/10 text-sky-600"};

export default function BolashakPage() {
  const [programs,setPrograms] = useState<string[]>([]);
  const [step,setStep] = useState(0);
  const [answers,setAnswers] = useState<string[]>([]);
  const [done,setDone] = useState(false);
  const [openDoc,setOpenDoc] = useState("Основные");

  useEffect(()=>{
    fetch("/api/programs?bolashak=true&limit=6&sort=rating").then(r=>r.json()).then(d=>setPrograms(d.data||[])).catch(()=>{});
  },[]);

  const eligible = answers.length===QUIZ.length && answers.every((a,i)=>a===QUIZ[i].correct);
  const passed = answers.filter((a,i)=>a===QUIZ[i].correct).length;
  const answer = (a: string) => {
    const na=[...answers,a]; setAnswers(na);
    if(step<QUIZ.length-1) setTimeout(()=>setStep(s=>s+1),300);
    else setTimeout(()=>setDone(true),300);
  };
  const reset = () => {setStep(0);setAnswers([]);setDone(false);};

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 pt-32 pb-20 px-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{type:"spring",bounce:0.4}} className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-white"/>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{fontFamily:"var(--font-display)"}}>Стипендия Болашак</motion.h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="text-white/85 text-lg max-w-2xl mx-auto mb-8">Государственная программа Казахстана — полное финансирование обучения в лучших университетах мира. Основана в 1993 году.</motion.p>
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="flex flex-wrap justify-center gap-4 text-white mb-8">
            {STATS.map(({num,label,sub})=>(
              <div key={label} className="bg-white/15 backdrop-blur rounded-2xl px-6 py-4 text-center">
                <div className="text-2xl font-bold" style={{fontFamily:"var(--font-display)"}}>{num}</div>
                <div className="text-sm font-medium text-white/90">{label}</div>
                <div className="text-xs text-white/60">{sub}</div>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}} className="flex flex-wrap gap-3 justify-center">
            <Link href="/programs?bolashak=true" className="flex items-center gap-2 bg-white text-amber-700 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-amber-50 transition-colors">Программы Болашак <ArrowRight className="w-4 h-4"/></Link>
            <a href="https://bolashak.gov.kz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-white/30 transition-colors">Официальный сайт <ExternalLink className="w-4 h-4"/></a>
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white mb-2" style={{fontFamily:"var(--font-display)"}}>Что покрывает стипендия</h2>
          <p className="text-ink-500 dark:text-ink-400">Полное финансирование — от обучения до перелётов</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COVERAGE.map((c,i)=>(
            <motion.div key={c.title} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}} className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-5">
              <div className={"w-10 h-10 rounded-xl flex items-center justify-center mb-3 "+COLORS[c.color]}><c.icon className="w-5 h-5"/></div>
              <h3 className="font-semibold text-ink-900 dark:text-white mb-1">{c.title}</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-ink-50 dark:bg-ink-900/50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white mb-2" style={{fontFamily:"var(--font-display)"}}>Требования к кандидатам</h2>
            <p className="text-ink-500 dark:text-ink-400">Актуальные условия участия 2024–2025</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REQUIREMENTS.map((r,i)=>(
              <motion.div key={r.title} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}} className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0"><r.icon className="w-5 h-5 text-amber-600"/></div>
                  <h3 className="font-semibold text-ink-900 dark:text-white">{r.title}</h3>
                </div>
                <ul className="space-y-1.5">{r.items.map((item,ii)=><li key={ii} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>{item}</li>)}</ul>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} className="mt-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"/>
            <p className="text-sm text-amber-700 dark:text-amber-400"><strong>Важно:</strong> Требования обновляются каждый год. Проверяй актуальную информацию на <a href="https://bolashak.gov.kz" target="_blank" rel="noopener noreferrer" className="underline font-medium">bolashak.gov.kz</a></p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white mb-2" style={{fontFamily:"var(--font-display)"}}>Список документов</h2>
        </motion.div>
        <div className="flex flex-col gap-3">
          {DOCS.map((s,i)=>(
            <motion.div key={s.cat} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06}} className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 overflow-hidden">
              <button className="w-full flex items-center justify-between px-5 py-4 text-left" onClick={()=>setOpenDoc(openDoc===s.cat?null:s.cat)}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-50 dark:bg-amber-500/10 rounded-lg flex items-center justify-center"><FileText className="w-4 h-4 text-amber-600"/></div>
                  <span className="font-semibold text-ink-900 dark:text-white">{s.cat}</span>
                  <span className="text-xs text-ink-400 bg-ink-100 dark:bg-ink-800 px-2 py-0.5 rounded-full">{s.items.length} документа</span>
                </div>
                <ChevronRight className={"w-4 h-4 text-ink-400 transition-transform "+(openDoc===s.cat?"rotate-90":"")}/>
              </button>
              <AnimatePresence>
                {openDoc===s.cat&&<motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden">
                  <ul className="px-5 pb-4 space-y-2 border-t border-ink-100 dark:border-ink-800 pt-3">
                    {s.items.map((item,ii)=><li key={ii} className="flex items-start gap-2.5 text-sm text-ink-700 dark:text-ink-300"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/>{item}</li>)}
                  </ul>
                </motion.div>}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link href="/checklist" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">Открыть чек-лист <ArrowRight className="w-4 h-4"/></Link>
        </div>
      </section>

      <section className="bg-ink-50 dark:bg-ink-900/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white mb-2" style={{fontFamily:"var(--font-display)"}}>Процесс подачи — шаг за шагом</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-amber-200 dark:bg-amber-500/30"/>
            <div className="flex flex-col gap-6">
              {TIMELINE.map((t,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.08}} className="relative pl-14">
                  <div className="absolute left-3.5 top-3 w-5 h-5 rounded-full bg-amber-500 border-4 border-white dark:border-ink-900 flex items-center justify-center text-white text-xs font-bold">{i+1}</div>
                  <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-4">
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">{t.month}</div>
                    <div className="font-semibold text-ink-900 dark:text-white mb-1">{t.step}</div>
                    <p className="text-sm text-ink-500 dark:text-ink-400">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mb-6">
          <h2 className="text-2xl font-bold text-ink-900 dark:text-white mb-1" style={{fontFamily:"var(--font-display)"}}>Топ университеты для Болашак</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">Из утверждённого ЦМП списка партнёрских вузов</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PARTNER_UNIS.map((u,i)=>(
            <motion.div key={u.name} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl p-4 hover:border-amber-300 dark:hover:border-amber-500/40 transition-colors">
              <div className="font-bold text-ink-900 dark:text-white text-sm mb-0.5">{u.name}</div>
              <div className="text-xs text-ink-400 dark:text-ink-500 mb-2">{u.country} · {u.city}</div>
              <div className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 text-amber-500 fill-amber-500"/><span className="text-ink-500">QS #{u.qs}</span></div>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-ink-400 mt-3">* Полный список 200+ университетов на bolashak.gov.kz</p>
      </section>

      {programs.length>0&&(
        <section className="bg-amber-50 dark:bg-amber-500/5 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-ink-900 dark:text-white" style={{fontFamily:"var(--font-display)"}}>Программы в каталоге с Болашак</h2>
              <Link href="/programs?bolashak=true" className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1 hover:underline">Все <ChevronRight className="w-4 h-4"/></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.slice(0,6).map((p,i)=>(
                <motion.div key={p.id} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.07}}>
                  <Link href={"/programs/"+p.id} className="block bg-white dark:bg-ink-900 rounded-2xl border border-amber-200 dark:border-amber-500/30 p-4 hover:border-amber-400 transition-all hover:shadow-md">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Award className="w-3 h-3"/>Болашак</span>
                      <span className="text-xs text-ink-400 bg-ink-100 dark:bg-ink-800 px-2 py-0.5 rounded-full">{p.field}</span>
                    </div>
                    <h3 className="font-semibold text-ink-900 dark:text-white text-sm mb-1 line-clamp-2">{p.titleRu||p.title}</h3>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mb-3 flex items-center gap-1"><BookOpen className="w-3 h-3 shrink-0"/>{p.universityName}{p.ranking&&<span className="text-ink-300"> · QS #{p.ranking}</span>}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-ink-400"><MapPin className="w-3 h-3"/>{p.city}</span>
                      <span className="font-bold text-ink-900 dark:text-white">{p.isKazakh?p.cost.toLocaleString("ru")+" 000 ₸/год":(p.costUsd===0?"Бесплатно":"$"+(p.costUsd||p.cost).toLocaleString("en")+"/год")}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-3xl p-8 text-white">
          <h2 className="text-xl font-bold mb-2" style={{fontFamily:"var(--font-display)"}}>Проверь соответствие требованиям</h2>
          <p className="text-ink-400 text-sm mb-6">{QUIZ.length} вопросов — узнай подходишь ли ты под условия Болашак</p>
          <AnimatePresence mode="wait">
            {!done?(
              <motion.div key={step} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <div className="flex gap-1.5 mb-6">{QUIZ.map((_,i)=><div key={i} className={"h-1 flex-1 rounded-full transition-colors "+(i<=step?"bg-amber-500":"bg-white/20")}/>)}</div>
                <p className="text-xs text-amber-400 mb-2">Вопрос {step+1} из {QUIZ.length}</p>
                <h3 className="text-lg font-semibold mb-5">{QUIZ[step].q}</h3>
                <div className="flex flex-col gap-2.5">
                  {QUIZ[step].opts.map(opt=>(
                    <motion.button key={opt} whileHover={{scale:1.01}} whileTap={{scale:0.98}} onClick={()=>answer(opt)} className="text-left px-4 py-3 rounded-xl border border-white/20 hover:border-amber-400 hover:bg-amber-500/10 text-sm font-medium transition-all">{opt}</motion.button>
                  ))}
                </div>
              </motion.div>
            ):(
              <motion.div key="result" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="text-center">
                {eligible?(
                  <><CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4"/>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{fontFamily:"var(--font-display)"}}>Ты подходишь! 🎉</h3>
                  <p className="text-ink-400 text-sm mb-6">По всем критериям ты соответствуешь требованиям Болашак. Начинай готовить документы!</p></>
                ):(
                  <><div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4"><span className="text-2xl font-bold text-amber-400">{passed}/{QUIZ.length}</span></div>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{fontFamily:"var(--font-display)"}}>Есть над чем поработать</h3>
                  <p className="text-ink-400 text-sm mb-6">Ты соответствуешь {passed} из {QUIZ.length} критериев. Посмотри другие программы с финансированием.</p></>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/programs?bolashak=true" className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center gap-2 justify-center">Программы Болашак <ArrowRight className="w-4 h-4"/></Link>
                  <button onClick={reset} className="text-ink-400 hover:text-white text-sm underline">Пройти снова</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
