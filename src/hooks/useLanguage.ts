import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SupportedLanguage, LANGUAGES } from '../constants/translations';

export function useLanguage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lang, setLang] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // 1. Check URL query string first (best for search crawlers)
    const urlLang = searchParams.get('lang') as SupportedLanguage | null;
    if (urlLang && LANGUAGES.some(l => l.code === urlLang)) {
      setLang(urlLang);
      localStorage.setItem('preferred_lang', urlLang);
      return;
    }

    // 2. Check LocalStorage
    const storedLang = localStorage.getItem('preferred_lang') as SupportedLanguage | null;
    if (storedLang && LANGUAGES.some(l => l.code === storedLang)) {
      setLang(storedLang);
      // Update URL to match preference so crawlers or direct links get synced
      setSearchParams({ lang: storedLang }, { replace: true });
      return;
    }

    // 3. Fallback to navigator language
    const navLang = navigator.language.split('-')[0] as SupportedLanguage;
    if (LANGUAGES.some(l => l.code === navLang)) {
      setLang(navLang);
      setSearchParams({ lang: navLang }, { replace: true });
    } else {
      setLang('en');
    }
  }, [searchParams, setSearchParams]);

  const changeLanguage = (newLang: SupportedLanguage) => {
    setLang(newLang);
    localStorage.setItem('preferred_lang', newLang);
    setSearchParams({ lang: newLang });
  };

  return {
    lang,
    changeLanguage
  };
}
