"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionary, Language, Dictionary } from './dictionary';

interface I18nContextType {
  lang: Language;
  t: Dictionary;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('es'); // Default to Spanish

  useEffect(() => {
    // 1. Try to get from localStorage
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang) {
      setLang(savedLang);
      return;
    }

    // 2. IP-based detection (if no saved preference)
    const detectLanguage = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        
        // Spanish-speaking countries (ISO codes)
        const spanishSpeakingCountries = [
          'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GQ', 
          'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'ES', 'UY', 'VE'
        ];

        if (spanishSpeakingCountries.includes(data.country_code)) {
          setLang('es');
        } else {
          setLang('en');
        }
      } catch (err) {
        // Fallback to browser language
        const browserLang = navigator.language.split('-')[0];
        setLang(browserLang === 'es' ? 'es' : 'en');
      }
    };

    detectLanguage();
  }, []);

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('app-language', newLang);
  };

  const t = dictionary[lang];

  return (
    <I18nContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
