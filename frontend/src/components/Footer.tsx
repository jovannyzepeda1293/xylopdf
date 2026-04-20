"use client";

import Link from "next/link";
import { FileText, Facebook, Linkedin, Mail, Instagram } from "lucide-react";
import { useSession } from "next-auth/react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function Footer() {
  const { data: session } = useSession();
  const { t } = useI18n();
  
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Link href={session ? "/tools" : "/"} className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Xylo<span className="text-primary">PDF</span>
              </span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed mb-6">
              {t.footer.desc}
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/people/Xylo-PDF/61575436934161/" target="_blank" rel="noopener noreferrer" className="p-2 bg-accent rounded-full hover:text-primary transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="https://www.instagram.com/xylo_pdf/" target="_blank" rel="noopener noreferrer" className="p-2 bg-accent rounded-full hover:text-primary transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="https://www.tiktok.com/@xylo_pdf" target="_blank" rel="noopener noreferrer" className="p-2 bg-accent rounded-full hover:text-primary transition-colors flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
              <a href="#" className="p-2 bg-accent rounded-full hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">{t.tools.filterGeneral}</h4>
            <ul className="space-y-4 text-sm text-secondary">
              <li><Link href="/tools/merge-pdf" className="hover:text-primary transition-colors">{t.tools.unir}</Link></li>
              <li><Link href="/tools/split-pdf" className="hover:text-primary transition-colors">{t.tools.dividir}</Link></li>
              <li><Link href="/tools/rotate-pdf" className="hover:text-primary transition-colors">{t.tools.girar}</Link></li>
              <li><Link href="/tools/compress-pdf" className="hover:text-primary transition-colors">{t.tools.compressDesc.split('.')[0]}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">{t.tools.filterConvert}</h4>
            <ul className="space-y-4 text-sm text-secondary">
              <li><Link href="/tools/lock-pdf" className="hover:text-primary transition-colors">{t.tools.lock}</Link></li>
              <li><Link href="/tools/unlock-pdf" className="hover:text-primary transition-colors">{t.tools.unlock}</Link></li>
              <li><Link href="/tools/pdf-to-word" className="hover:text-primary transition-colors">PDF to Word</Link></li>
              <li><Link href="/tools/pdf-to-excel" className="hover:text-primary transition-colors">PDF to Excel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">{t.footer.company}</h4>
            <ul className="space-y-4 text-sm text-secondary">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">{t.footer.terms}</Link></li>
              <li className="flex items-center gap-2 pt-2 text-xs opacity-80"><Mail className="w-4 h-4" /> support@xylopdf.com</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:row justify-between items-center gap-4">
          <p className="text-secondary text-xs text-center md:text-left">
            © 2024 XyloPDF. {t.footer.rights}
          </p>
          <div className="flex gap-6 text-xs text-secondary">
            <a href="/sitemap.xml" className="hover:text-primary">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
