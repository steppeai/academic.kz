"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, Clock, Star, Award, BarChart2, BookOpen, Globe } from "lucide-react";
import { useCompareStore } from "@/lib/compare-store";

function formatCost(p) {
  if (p.isKazakh) return p.cost.toLocaleString("ru") + " 000 ₸/год";
  if (p.costUsd === 0) return "Бесплатно";
  if (p.costUsd) return "$" + p.costUsd.toLocaleString("en") + "/год";
  return p.cost.toLocaleString("ru") + " 000 ₸/год";
}
function formatDeadline(d) {
  if (!d) return "Уточняйте";
  return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export function ApiProgramCard({ program: p, index = 0 }) {
  const { items, add, remove } = useCompareStore();
  const isInCompare = items.some(x => x.id === String(p.id));
  const toggle = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (isInCompare) remove(String(p.id));
    else if (items.length < 3) add({ id: String(p.id), title: p.titleRu || p.title, university: p.universityName, city: p.city, language: p.language, cost: p.cost, costLabel: formatCost(p), deadline: p.deadline || "", deadlineLabel: formatDeadline(p.deadline), duration: p.duration || "2 года", bolashak: p.bolashak, tags: p.tags, description: p.description || "", requirements: p.requirements, documents: p.documents, rating: p.rating || 4.0, students: p.students || 0, field: p.field });
  };
  return (
    <motion.div layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{duration:0.35,delay:index*0.04,ease:[0.22,1,0.36,1]}}>
      <Link href={`/programs/${p.id}`} className="block">
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-5 card-hover cursor-pointer">
          <div className="flex items-start justify-between mb-3 gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {p.bolashak && <span className="tag-pill-gold flex items-center gap-1"><Award className="w-3 h-3" />Болашак</span>}
                <span className="tag-pill">{p.field}</span>
                {!p.isKazakh && <span className="tag-pill flex items-center gap-1"><Globe className="w-3 h-3" />{p.country}</span>}
              </div>
              <h3 className="font-semibold text-ink-900 dark:text-white text-base leading-snug">{p.titleRu || p.title}</h3>
            </div>
            <div className="flex items-center gap-1 shrink-0 bg-ink-50 dark:bg-ink-800/50 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
              <span className="text-sm font-semibold text-ink-900 dark:text-white">{p.rating?.toFixed(1) ?? "—"}</span>
            </div>
          </div>
          <p className="text-sm text-ink-600 dark:text-ink-300 mb-4 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-ink-400 shrink-0" />
            {p.universityName}
            {p.ranking && <span className="text-xs text-ink-400 ml-1">QS #{p.ranking}</span>}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500 dark:text-ink-400 mb-4">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.city}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.duration ?? "2 года"}</span>
            <span>{p.language?.join(", ")}</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-ink-100 dark:border-ink-800">
            <div>
              <div className="text-base font-bold text-ink-900 dark:text-white">{formatCost(p)}</div>
              <div className="text-xs text-ink-400 dark:text-ink-500">Дедлайн: {formatDeadline(p.deadline)}</div>
            </div>
            <motion.div role="button" tabIndex={0} whileTap={{scale:0.95}} onClick={toggle}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${isInCompare ? "bg-brand-600 text-white" : "bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-brand-50 hover:text-brand-600"}`}>
              <BarChart2 className="w-3.5 h-3.5" />
              {isInCompare ? "В сравнении" : "Сравнить"}
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}