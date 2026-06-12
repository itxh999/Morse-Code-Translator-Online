import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SupportedLanguage, LANGUAGES } from '../constants/translations';
import { getLocalizedPath } from '../utils/path';

export function useLanguage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // Detect language from path prefix (e.g. /es/alphabet -> 'es')
    const pathParts = location.pathname.split('/');
    const firstPart = pathParts[1] as SupportedLanguage;

    if (LANGUAGES.some(l => l.code === firstPart && firstPart !== 'en')) {
      setLang(firstPart);
      localStorage.setItem('preferred_lang', firstPart);
    } else {
      setLang('en');
    }
  }, [location.pathname]);

  const changeLanguage = (newLang: SupportedLanguage) => {
    const pathParts = location.pathname.split('/');
    const currentLangPrefix = pathParts[1];
    const hasLangPrefix = LANGUAGES.some(l => l.code === currentLangPrefix && currentLangPrefix !== 'en');

    // Get the base path without any existing language prefix
    let basePath = '';
    if (hasLangPrefix) {
      basePath = '/' + pathParts.slice(2).join('/');
    } else {
      basePath = location.pathname;
    }

    // Generate the new path using our localized path utility
    const newPath = getLocalizedPath(basePath, newLang);

    // Keep search query and hash if present
    const search = location.search;
    const hash = location.hash;

    setLang(newLang);
    localStorage.setItem('preferred_lang', newLang);
    navigate(`${newPath}${search}${hash}`);
  };

  return {
    lang,
    changeLanguage
  };
}

