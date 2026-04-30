"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Calculator, ChevronDown, ChevronUp, TrendingUp, BookOpen, CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react";

const UNIS = [
  {id:1,name:"MIT",nameRu:"Массачусетский технологический институт",country:"USA",minGPA:3.7,minIELTS:7.0,minTOEFL:100,requiresGRE:true,minGRE:165,requiresGMAT:false,avgGPA:3.85,avgIELTS:7.5,avgGRE:167,acceptance:4,programId:13,tips:["Нужны публикации или исследовательский опыт","GRE Quant 167+ у большинства принятых","SOP должен показывать конкретные исследовательские цели"]},
  {id:2,name:"Stanford",nameRu:"Стэнфордский университет",country:"USA",minGPA:3.8,minIELTS:7.0,minTOEFL:100,requiresGRE:false,minGRE:165,requiresGMAT:false,avgGPA:3.9,avgIELTS:7.5,avgGRE:168,acceptance:2,programId:14,tips:["GRE не обязателен, но 90% подают с 165+","Нужен сильный research background","Рекомендации от известных профессоров — ключевой фактор"]},
  {id:3,name:"ETH Zurich",nameRu:"ЕТН Цюрих",country:"Switzerland",minGPA:3.5,minIELTS:7.0,minTOEFL:95,requiresGRE:false,minGRE:0,requiresGMAT:false,avgGPA:3.75,avgIELTS:7.2,avgGRE:0,acceptance:10,programId:35,tips:["GRE не требуется","Оценивают математическую базу","Мотивационное письмо очень важно"]},
  {id:4,name:"Oxford",nameRu:"Оксфордский университет",country:"UK",minGPA:3.8,minIELTS:7.5,minTOEFL:110,requiresGRE:false,minGRE:0,requiresGMAT:false,avgGPA:3.85,avgIELTS:7.8,avgGRE:0,acceptance:8,programId:20,tips:["IELTS 7.5 с минимум 7.0 в каждом разделе","Research proposal обязателен — 1000 слов","Рекомендации от известных профессоров"]},
  {id:5,name:"Cambridge",nameRu:"Кембриджский университет",country:"UK",minGPA:3.8,minIELTS:7.5,minTOEFL:110,requiresGRE:false,minGRE:0,requiresGMAT:false,avgGPA:3.88,avgIELTS:7.8,avgGRE:0,acceptance:7,programId:21,tips:["Обязателен предварительный контакт с научным руководителем","Research proposal — 2000 слов","1st class degree (3.8+)"]},
  {id:6,name:"TU Munich",nameRu:"Технический университет Мюнхена",country:"Germany",minGPA:3.0,minIELTS:6.5,minTOEFL:88,requiresGRE:false,minGRE:0,requiresGMAT:false,avgGPA:3.4,avgIELTS:7.0,avgGRE:0,acceptance:25,programId:25,tips:["Один из самых доступных топ-университетов","GRE не нужен","Важны оценки по математике и CS"]},
  {id:7,name:"Toronto",nameRu:"Университет Торонто",country:"Canada",minGPA:3.3,minIELTS:7.0,minTOEFL:100,requiresGRE:false,minGRE:0,requiresGMAT:false,avgGPA:3.6,avgIELTS:7.2,avgGRE:0,acceptance:18,programId:28,tips:["GRE опционален","2 трека: thesis и coursework","Возможность остаться в Канаде по PGWP"]},
  {id:8,name:"NUS",nameRu:"Национальный университет Сингапура",country:"Singapore",minGPA:3.0,minIELTS:6.0,minTOEFL:85,requiresGRE:false,minGRE:0,requiresGMAT:false,avgGPA:3.5,avgIELTS:6.8,avgGRE:0,acceptance:20,programId:31,tips:["Хорошее соотношение цена/качество","Сильная tech-экосистема Сингапура","IELTS требования ниже чем в UK/US"]},
  {id:9,name:"LSE",nameRu:"Лондонская школа экономики",country:"UK",minGPA:3.7,minIELTS:7.5,minTOEFL:107,requiresGRE:true,minGRE:162,requiresGMAT:false,avgGPA:3.82,avgIELTS:7.8,avgGRE:165,acceptance:12,programId:23,tips:["GRE Quant 165+ настоятельно рекомендуется","Нужна сильная математическая база","Эконометрика и матанализ на высоком уровне"]},
  {id:10,name:"Nazarbayev University",nameRu:"Назарбаев Университет",country:"Kazakhstan",minGPA:3.0,minIELTS:6.5,minTOEFL:80,requiresGRE:false,minGRE:0,requiresGMAT:false,avgGPA:3.4,avgIELTS:6.8,avgGRE:0,acceptance:35,programId:1,tips:["Лучший выбор для Болашак внутри Казахстана","Преподаватели из MIT, Stanford, Cambridge","Стипендии покрывают до 100% обучения"]},
  {id:11,name:"EPFL",nameRu:"Федеральная политехническая школа Лозанны",country:"Switzerland",minGPA:3.5,minIELTS:7.0,minTOEFL:100,requiresGRE:false,minGRE:0,requiresGMAT:false,avgGPA:3.72,avgIELTS:7.2,avgGRE:0,acceptance:12,programId:36,tips:["GRE не требуется","Мотивационное письмо и рекомендации важны","Сильная в ML и distributed systems"]},
  {id:12,name:"Columbia",nameRu:"Колумбийский университет",country:"USA",minGPA:3.5,minIELTS:7.5,minTOEFL:105,requiresGRE:false,minGRE:0,requiresGMAT:true,minGMAT:720,avgGPA:3.7,avgIELTS:7.7,avgGRE:0,avgGMAT:730,acceptance:8,programId:16,tips:["GMAT 720+ у большинства принятых","Нужен опыт в финансах 2+ лет","Эссе о карьерных целях очень важно"]},
];

const calcChance = (uni, form) => {
  let score=0,max=0;
  const gpa=parseFloat(form.gpa)||0; max+=30; if(gpa>=uni.avgGPA) score+=30; else if(gpa>=uni.minGPA) score+=30*((gpa-uni.minGPA)/(uni.avgGPA-uni.minGPA));
  const lang=Math.max(parseFloat(form.ielts)||0,(parseInt(form.toefl)||0)/14.7); max+=25; if(lang>=uni.avgIELTS) score+=25; else if(lang>=uni.minIELTS) score+=25*((lang-uni.minIELTS)/(uni.avgIELTS-uni.minIELTS));
  if(uni.requiresGRE){const gre=parseInt(form.gre)||0;max+=20;if(gre>=(uni.avgGRE||uni.minGRE))score+=20;else if(gre>=uni.minGRE)score+=20*((gre-uni.minGRE)/((uni.avgGRE||uni.minGRE)-uni.minGRE));}
  if(uni.requiresGMAT){const gmat=parseInt(form.gmat)||0;max+=20;const avg=uni.avgGMAT||700,min=uni.minGMAT||600;if(gmat>=avg)score+=20;else if(gmat>=min)score+=20*((gmat-min)/(avg-min));}
  max+=15;const exp=parseInt(form.experience)||0;if(exp>=2)score+=10;else if(exp>=1)score+=5;if(form.pubs==="yes")score+=5;else if(form.pubs==="conf")score+=3;
  const raw=max>0?(score/max)*100:0,af=Math.min(1,uni.acceptance/25);
  return Math.min(95,Math.max(2,Math.round(raw*0.7+raw*af*0.3)));
};

const getLabel = (c) => {
  if(c>=70) return {text:"Высокие шансы",color:"text-emerald-600 dark:text-emerald-400",bar:"bg-emerald-500"};
  if(c>=45) return {text:"Средние шансы",color:"text-amber-600 dark:text-amber-400",bar:"bg-amber-500"};
  if(c>=20) return {text:"Низкие шансы",color:"text-orange-600 dark:text-orange-400",bar:"bg-orange-500"};
  return {text:"Очень сложно",color:"text-red-600 dark:text-red-400",bar:"bg-red-500"};
};

export default function AdmissionCalculatorPage() {
  const [form,setForm] = useState({gpa:"",ielts:"",toefl:"",gre:"",gmat:"",experience:"0",pubs:"no",region:"all"});
  const [done,setDone] = useState(false);
  const [open,setOpen] = useState(null);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const INP = "w-full bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2.5 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500";
  const unis = UNIS
    .filter(u=>form.region==="all"||(form.region==="kz"&&u.country==="Kazakhstan")||(form.region==="int"&&u.country!=="Kazakhstan"))
    .map(u=>({...u,chance:calcChance(u,form)}))
    .sort((a,b)=>b.chance-a.chance);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white"/></div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white" style={{fontFamily:"var(--font-display)"}}>Калькулятор шансов поступления</h1>
        </div>
        <p className="text-ink-500 dark:text-ink-400">Введи свои данные — получи реальную оценку шансов по 12 университетам</p>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:0.1}} className="lg:col-span-1">
          <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-6 sticky top-24">
            <h2 className="font-bold text-ink-900 dark:text-white mb-5 flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-600"/>Твои данные</h2>
            <div className="space-y-4">
              {[["GPA (из 4.0)","gpa","3.5","0","4","0.1"],["IELTS","ielts","7.0","0","9","0.5"],["TOEFL iBT","toefl","100","0","120","1"],["GRE Quant","gre","160","130","170","1"],["GMAT","gmat","650","200","800","1"]].map(([l,k,ph,mn,mx,st])=>(
                <div key={k}>
                  <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-1.5">{l}</label>
                  <input type="number" min={mn} max={mx} step={st} value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} className={INP}/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-1.5">Опыт работы</label>
                <select value={form.experience} onChange={e=>set("experience",e.target.value)} className={INP}>
                  <option value="0">Нет опыта</option><option value="1">До 1 года</option><option value="2">1-2 года</option><option value="3">2+ лет</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-1.5">Публикации</label>
                <select value={form.pubs} onChange={e=>set("pubs",e.target.value)} className={INP}>
                  <option value="no">Нет</option><option value="conf">Конференция / GitHub</option><option value="yes">Журнал Scopus/WoS</option>
                </select>
              </div>
              <div className="border-t border-ink-100 dark:border-ink-800 pt-4">
                <label className="block text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">Регион</label>
                <div className="flex gap-1">
                  {[["all","Все"],["kz","🇰🇿 KZ"],["int","🌍"]].map(([v,l])=>(
                    <button key={v} onClick={()=>set("region",v)} className={"flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors "+(form.region===v?"bg-brand-600 text-white":"bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300")}>{l}</button>
                  ))}
                </div>
              </div>
              <button onClick={()=>setDone(true)} className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors">
                <Calculator className="w-4 h-4"/>Рассчитать шансы
              </button>
            </div>
          </div>
        </motion.div>
        <div className="lg:col-span-2">
          {!done?(
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center py-24 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-4"><TrendingUp className="w-8 h-8 text-brand-600"/></div>
              <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">Заполни форму слева</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 text-center max-w-xs">Введи академические данные и нажми Рассчитать — получишь оценку шансов по 12 университетам</p>
            </motion.div>
          ):(
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-3">
              <h2 className="font-bold text-ink-900 dark:text-white mb-4">Результаты по {unis.length} университетам</h2>
              {unis.map((uni,i)=>{
                const ch=getLabel(uni.chance),isOpen=open===uni.id;
                return (
                  <motion.div key={uni.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 overflow-hidden">
                    <div className="p-4 cursor-pointer" onClick={()=>setOpen(isOpen?null:uni.id)}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-xs font-bold text-ink-600 dark:text-ink-300 shrink-0">#{i+1}</div>
                          <div className="min-w-0">
                            <div className="font-semibold text-ink-900 dark:text-white text-sm truncate">{uni.nameRu}</div>
                            <div className="text-xs text-ink-400">{uni.country} · {uni.acceptance}% acceptance rate</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className={"text-2xl font-bold "+ch.color} style={{fontFamily:"var(--font-display)"}}>{uni.chance}%</div>
                            <div className={"text-xs font-medium "+ch.color}>{ch.text}</div>
                          </div>
                          {isOpen?<ChevronUp className="w-4 h-4 text-ink-400"/>:<ChevronDown className="w-4 h-4 text-ink-400"/>}
                        </div>
                      </div>
                      <div className="mt-3 h-2 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
                        <motion.div className={"h-full rounded-full "+ch.bar} initial={{width:0}} animate={{width:uni.chance+"%"}} transition={{duration:0.8,delay:i*0.05}}/>
                      </div>
                    </div>
                    <AnimatePresence>
                      {isOpen&&(
                        <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden">
                          <div className="px-4 pb-4 border-t border-ink-100 dark:border-ink-800 pt-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                              {[
                                {l:"GPA",v:parseFloat(form.gpa)||0,m:uni.minGPA,show:true},
                                {l:"IELTS",v:parseFloat(form.ielts)||0,m:uni.minIELTS,show:true},
                                {l:"GRE",v:parseInt(form.gre)||0,m:uni.minGRE,show:uni.requiresGRE},
                                {l:"GMAT",v:parseInt(form.gmat)||0,m:uni.minGMAT||0,show:uni.requiresGMAT},
                              ].filter(x=>x.show).map(({l,v,m})=>(
                                <div key={l} className={"flex items-center gap-2 p-2.5 rounded-xl text-xs "+(v>=m?"bg-emerald-50 dark:bg-emerald-500/10":"bg-red-50 dark:bg-red-500/10")}>
                                  {v>=m?<CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/>:<XCircle className="w-4 h-4 text-red-500 shrink-0"/>}
                                  <div>
                                    <div className="font-medium text-ink-700 dark:text-ink-300">{l}</div>
                                    <div className={v>=m?"text-emerald-600":"text-red-600"}>{v>0?v+" / min "+m:"нет / min "+m}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="bg-brand-50 dark:bg-brand-500/10 rounded-xl p-3 mb-3">
                              <div className="text-xs font-semibold text-brand-700 dark:text-brand-400 mb-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/>Советы</div>
                              <ul className="space-y-1">{uni.tips.map((t,ti)=><li key={ti} className="text-xs text-brand-700 dark:text-brand-400 flex items-start gap-1.5"><span className="shrink-0">•</span>{t}</li>)}</ul>
                            </div>
                            <Link href={"/programs/"+uni.programId} className="flex items-center justify-center gap-2 text-sm font-medium text-brand-600 hover:underline">
                              Подробнее о программе<ArrowRight className="w-3.5 h-3.5"/>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              <div className="p-4 bg-ink-50 dark:bg-ink-800/50 rounded-xl text-xs text-ink-500 dark:text-ink-400">
                ⚠️ Калькулятор даёт приблизительную оценку. Реальное решение принимает приёмная комиссия.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
