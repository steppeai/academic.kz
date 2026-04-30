"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { User, Mail, LogOut, BookOpen, Heart, CheckSquare, Award } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoggedIn } = useAuthStore();
  useEffect(() => { if (!isLoggedIn()) router.push("/login"); }, [isLoggedIn, router]);
  if (!user) return null;

  const handleLogout = () => { logout(); router.push("/"); };
  const initials = user.name ? user.name.split(" ").map((w:string)=>w[0]).slice(0,2).join("").toUpperCase() : user.email[0].toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 dark:text-white" style={{fontFamily:"var(--font-display)"}}>Личный кабинет</h1>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="md:col-span-1 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-2xl font-bold mb-4">{initials}</div>
          <h2 className="text-lg font-semibold text-ink-900 dark:text-white mb-1">{user.name || "Пользователь"}</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400 flex items-center gap-1.5 mb-6"><Mail className="w-3.5 h-3.5"/>{user.email}</p>
          <div className="w-full space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-ink-50 dark:bg-ink-800 text-sm text-ink-600 dark:text-ink-300">
              <User className="w-4 h-4 text-brand-500"/>
              <span>Роль: {user.role==="admin"?"Администратор":"Пользователь"}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/30 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4"/> Выйти
          </button>
        </motion.div>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-ink-900 dark:text-white">Быстрый доступ</h3>
          {[
            {href:"/programs",icon:BookOpen,label:"Каталог программ",desc:"Найди свою магистратуру",c:"brand"},
            {href:"/checklist",icon:CheckSquare,label:"Чек-лист документов",desc:"Отслеживай готовность документов",c:"green"},
            {href:"/compare",icon:Award,label:"Сравнение программ",desc:"Сравни до 3 программ",c:"amber"},
            {href:"/bolashak",icon:Heart,label:"Гид по Болашак",desc:"Всё о гранте Болашак",c:"purple"},
          ].map(({href,icon:Icon,label,desc,c},i)=>(
            <motion.div key={href} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.2+i*0.08}}>
              <Link href={href} className="flex items-center gap-4 p-4 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 hover:border-brand-300 dark:hover:border-brand-500/40 transition-all group">
                <div className={"w-10 h-10 rounded-xl flex items-center justify-center shrink-0 "+(c==="brand"?"bg-brand-50 dark:bg-brand-500/10":c==="green"?"bg-green-50 dark:bg-green-500/10":c==="amber"?"bg-amber-50 dark:bg-amber-500/10":"bg-purple-50 dark:bg-purple-500/10")}>
                  <Icon className={"w-5 h-5 "+(c==="brand"?"text-brand-600":c==="green"?"text-green-600":c==="amber"?"text-amber-600":"text-purple-600")}/>
                </div>
                <div>
                  <div className="font-medium text-ink-900 dark:text-white group-hover:text-brand-600 transition-colors">{label}</div>
                  <div className="text-sm text-ink-500 dark:text-ink-400">{desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
