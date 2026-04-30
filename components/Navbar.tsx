"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, GraduationCap, ChevronRight, User, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/lib/auth-store";

const NAV_LINKS = [
  {href:"/programs",label:"Программы"},
  {href:"/bolashak",label:"Болашак"},
  {href:"/compare",label:"Сравнение"},
  {href:"/checklist",label:"Чек-лист"},
  {href:"/calendar",label:"Календарь"},
  {href:"/templates",label:"Шаблоны"},
  {href:"/calculator",label:"Калькулятор"},{href:"/admission-calculator",label:"Шансы"},
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, isLoggedIn } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); setDropdownOpen(false); }, [pathname]);

  const handleLogout = () => { logout(); router.push("/"); };
  const initials = user?.name ? user.name.split(" ").map((w:string)=>w[0]).slice(0,2).join("").toUpperCase() : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <>
      <motion.header initial={{y:-80,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5,ease:[0.22,1,0.36,1]}}
        className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 "+(scrolled?"bg-white/95 dark:bg-ink-950/95 backdrop-blur-md shadow-[0_1px_0_0_#e2e8f0] dark:shadow-[0_1px_0_0_#1e293b]":"bg-transparent")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-4 h-4 text-white"/>
              </div>
              <span className="font-display text-xl text-ink-900 dark:text-white tracking-tight" style={{fontFamily:"var(--font-display)"}}>
                Academik<span className="text-brand-600">.kz</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link)=>{
                const active=pathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href} className={"relative px-4 py-2 text-sm font-medium rounded-lg transition-colors "+(active?"text-brand-600 bg-brand-50 dark:bg-brand-500/10 dark:text-brand-400":"text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800")}>
                    {active && <motion.span layoutId="nav-pill" className="absolute inset-0 bg-brand-50 dark:bg-brand-500/10 rounded-lg" transition={{type:"spring",bounce:0.2,duration:0.5}}/>}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle/>
              <div className="w-px h-5 bg-ink-200 dark:bg-ink-800 mx-1"/>
              {isLoggedIn() ? (
                <div className="relative">
                  <button onClick={()=>setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                    <span className="text-sm font-medium text-ink-700 dark:text-ink-300 max-w-24 truncate">{user?.name?.split(" ")[0] || "Профиль"}</span>
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div initial={{opacity:0,y:8,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:0.95}} transition={{duration:0.15}}
                        className="absolute right-0 top-12 w-48 bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 shadow-xl overflow-hidden">
                        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                          <User className="w-4 h-4 text-ink-400"/> Мой профиль
                        </Link>
                        <div className="border-t border-ink-100 dark:border-ink-800"/>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                          <LogOut className="w-4 h-4"/> Выйти
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white px-3 py-2 rounded-lg transition-colors">Войти</Link>
                  <Link href="/register" className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg transition-colors shadow-sm">Регистрация</Link>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle/>
              <button onClick={()=>setOpen(!open)} className="p-2 rounded-lg text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
                {open?<X className="w-5 h-5"/>:<Menu className="w-5 h-5"/>}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {dropdownOpen && <div className="fixed inset-0 z-40" onClick={()=>setDropdownOpen(false)}/>}

      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.2}}
            className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-ink-950 border-b border-ink-200 dark:border-ink-800 shadow-xl md:hidden">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link,i)=>(
                <motion.div key={link.href} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}>
                  <Link href={link.href} className={"flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors "+(pathname.startsWith(link.href)?"text-brand-600 bg-brand-50 dark:bg-brand-500/10 dark:text-brand-400":"text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800/50")}>
                    {link.label}<ChevronRight className="w-4 h-4 opacity-40"/>
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 pt-3 border-t border-ink-100 dark:border-ink-800 flex gap-2">
                {isLoggedIn() ? (
                  <>
                    <Link href="/profile" className="flex-1 py-2.5 text-sm font-medium text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700 rounded-lg text-center">Профиль</Link>
                    <button onClick={handleLogout} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg">Выйти</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="flex-1 py-2.5 text-sm font-medium text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700 rounded-lg text-center">Войти</Link>
                    <Link href="/register" className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg text-center">Регистрация</Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
