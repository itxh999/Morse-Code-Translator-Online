import { SupportedLanguage } from '../constants/translations';

/**
 * Creates an SEO-friendly path containing the language prefix.
 * @param path The base path (e.g. '/' or '/alphabet' or '/words/sos')
 * @param lang The target language code (e.g. 'en', 'es', 'pt', etc.)
 * @returns The fully localized path (e.g. '/es/alphabet' or '/alphabet')
 */
export function getLocalizedPath(path: string, lang: SupportedLanguage): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (lang === 'en') {
    return cleanPath;
  }

  // For non-English languages, prepends /lang code
  if (cleanPath === '/') {
    return `/${lang}`;
  }
  return `/${lang}${cleanPath}`;
}
