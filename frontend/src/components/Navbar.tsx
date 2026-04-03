"use client";

import Link from "next/link";
import { FileText, Menu, X, LogOut, User, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}

function NavbarContent() {
  const { data: session } = useSession();
  const { t, lang, setLanguage } = useI18n();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("status") === "success";
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-background/95 backdrop-blur-md py-3 shadow-lg border-b border-border" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href={session ? "/tools" : "/"} className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-lg shadow-blue-500/20 shadow-lg group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Xylo<span className="text-primary">PDF</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/tools" className="text-sm font-medium hover:text-primary transition-colors">
            {t.navbar.tools}
          </Link>
          <Link href="/tools?tab=Conversion" className="text-sm font-medium hover:text-primary transition-colors">
            {t.navbar.convert}
          </Link>
          <Link href="/tools?tab=Editing" className="text-sm font-medium hover:text-primary transition-colors">
            {t.navbar.edit}
          </Link>
          <Link href="/tools?tab=Optimization" className="text-sm font-medium hover:text-primary transition-colors">
            {t.navbar.compress}
          </Link>

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border/50">
            {/* Global Language Toggle (available to everyone) */}
            <button 
              onClick={() => setLanguage(lang === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all active:scale-95 group/lang"
              aria-label="Change language"
            >
              <Globe className="w-4 h-4 text-primary group-hover/lang:animate-spin-slow" />
              <span className="text-primary tracking-tighter">{lang.toUpperCase()}</span>
            </button>

            {session ? (
              <>
                {!session.user?.subscriptionActive && !isSuccess && (
                  <Link href="/unlimited-access" className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-xs font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                    {t.navbar.unlimitedAccess}
                  </Link>
                )}
                
                <Link href="/account" className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-all group/user">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover/user:bg-primary group-hover/user:text-white transition-all">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:block">{session.user?.email?.split('@')[0]}</span>
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-secondary hover:text-red-500 transition-colors"
                  title={t.navbar.logout}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-secondary hover:text-primary transition-colors">
                  {t.navbar.login}
                </Link>
                {!isSuccess && (
                  <Link href="/unlimited-access" className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-all active:scale-95">
                    {t.navbar.unlimited}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 hover:bg-accent rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <Link href="/tools" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-border/50 text-slate-800">{t.navbar.tools}</Link>
          <Link href="/tools?tab=Conversion" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-border/50 text-slate-800">{t.navbar.convert}</Link>
          <Link href="/tools?tab=Editing" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-border/50 text-slate-800">{t.navbar.edit}</Link>
          <Link href="/tools?tab=Optimization" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-border/50 text-slate-800">{t.navbar.compress}</Link>

          <button
            onClick={() => { setLanguage(lang === 'es' ? 'en' : 'es'); setMobileMenuOpen(false); }}
            className="flex items-center justify-between py-2 border-b border-border/50 text-sm font-bold text-slate-800"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {lang === 'es' ? 'Idioma' : 'Language'}
            </div>
            <span>{lang === 'es' ? 'English' : 'Español'}</span>
          </button>

          {session ? (
            <>
              {!session.user?.subscriptionActive && !isSuccess && (
                <Link href="/unlimited-access" onClick={() => setMobileMenuOpen(false)} className="bg-primary text-primary-foreground py-3 rounded-xl font-bold mt-2 text-center">
                  {t.navbar.unlimitedAccess}
                </Link>
              )}
              <button onClick={() => { setMobileMenuOpen(false); signOut(); }} className="bg-red-500/10 text-red-500 py-3 rounded-xl font-bold mt-2 flex items-center justify-center gap-2">
                <LogOut className="w-5 h-5" /> {t.navbar.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-border/50 font-bold text-slate-800">
                {t.navbar.login}
              </Link>
              {!isSuccess && (
                <Link href="/unlimited-access" onClick={() => setMobileMenuOpen(false)} className="bg-primary text-primary-foreground py-3 rounded-xl font-bold mt-2 text-center w-full block">
                  {t.navbar.unlimited}
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
