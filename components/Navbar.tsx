"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, LogOut, Menu, User, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/lib/auth-store";

const NAV_LINKS = [
  { href: "/programs", label: "Программы" },
  { href: "/bolashak", label: "Болашак" },
  { href: "/compare", label: "Сравнение" },
  { href: "/checklist", label: "Чек-лист" },
  { href: "/calendar", label: "Календарь" },
  { href: "/templates", label: "Шаблоны" },
  { href: "/calculator", label: "Калькулятор" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => {
      const nextScrolled = window.scrollY > 20;
      if (scrolledRef.current === nextScrolled) return;

      scrolledRef.current = nextScrolled;
      setScrolled(nextScrolled);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    setProfileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-sm dark:bg-ink-950 dark:shadow-none"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo.svg"
                alt="Academik"
                width={167}
                height={40}
                priority
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-brand-600 bg-brand-50 dark:bg-brand-500/10 dark:text-brand-400"
                        : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-brand-50 dark:bg-brand-500/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick action + Theme */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <div className="mx-1 h-5 w-px bg-ink-200 dark:bg-ink-800" />
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((value) => !value)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 transition-colors hover:bg-ink-100 dark:hover:bg-ink-800"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                      {user.avatar}
                    </div>
                    <span className="max-w-[120px] truncate text-sm font-medium text-ink-700 dark:text-ink-200">{user.name}</span>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-ink-200 bg-white p-2 shadow-xl dark:border-ink-800 dark:bg-ink-900"
                      >
                        <div className="mb-1 px-3 py-2">
                          <p className="text-sm font-semibold text-ink-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-ink-500 dark:text-ink-400">{user.email}</p>
                        </div>
                        <div className="my-1 h-px bg-ink-100 dark:bg-ink-800" />
                        <Link
                          href="/profile"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
                        >
                          <User className="h-4 w-4" />
                          Профиль
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Выйти
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                >
                  <User className="h-4 w-4" />
                  Войти
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="rounded-lg p-2 text-ink-600 transition-colors hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 top-16 z-40 border-b border-ink-200 bg-white shadow-xl dark:border-ink-800 dark:bg-ink-950 md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      pathname.startsWith(link.href)
                        ? "text-brand-600 bg-brand-50 dark:bg-brand-500/10 dark:text-brand-400"
                        : "text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800/50"
                    }`}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 border-t border-ink-100 pt-3 dark:border-ink-800">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 rounded-xl bg-ink-50 px-3 py-3 dark:bg-ink-900">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                        {user.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">{user.name}</p>
                        <p className="truncate text-xs text-ink-500 dark:text-ink-400">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white"
                    >
                      <User className="h-4 w-4" />
                      Профиль
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-sm font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Выйти
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white"
                  >
                    <User className="h-4 w-4" />
                    Войти
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
