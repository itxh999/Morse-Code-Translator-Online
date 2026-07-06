import { LANGUAGES, SupportedLanguage } from '../constants/translations';
import { MORSE_WORDS, MorseWord } from '../constants/words';
import { getLocalizedPath } from '../utils/path';

export const SITE_URL = 'https://morse-code-translator.wwkejishe.top';

export type SeoPageType = 'home' | 'alphabet' | 'detail';

export interface SeoRoute {
  path: string;
  lang: SupportedLanguage;
  pageType: SeoPageType;
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  alternates: Array<{ hreflang: string; href: string }>;
  schema: Record<string, unknown>;
  h1: string;
  summary: string;
  word?: MorseWord;
  priority: string;
  changefreq: string;
}

const alphabetTitles: Record<SupportedLanguage, string> = {
  en: 'Morse Code Alphabet - International Standard Reference Chart',
  es: 'Alfabeto Codigo Morse - Tabla de Referencia Internacional',
  pt: 'Alfabeto de Codigo Morse - Tabela de Referencia Internacional',
  fr: 'Alphabet Code Morse - Tableau de Reference International',
  tr: 'Mors Alfabesi - Uluslararasi Standart Referans Tablosu',
  de: 'Morsecode Alphabet - Internationale Referenztabelle',
};

const detailTitleTemplates: Record<SupportedLanguage, (word: MorseWord) => string> = {
  en: (word) => `${word.word} in Morse Code (${word.morse}) - Learn and Translate`,
  es: (word) => `${word.word} en Codigo Morse (${word.morse}) - Aprender y Traducir`,
  pt: (word) => `${word.word} em Codigo Morse (${word.morse}) - Aprender e Traduzir`,
  fr: (word) => `${word.word} en Code Morse (${word.morse}) - Traduire et Ecouter`,
  tr: (word) => `Mors Alfabesinde ${word.word} Nasil Yazilir (${word.morse})`,
  de: (word) => `${word.word} in Morsecode (${word.morse}) - Ubersetzung und Sound`,
};

const detailDescriptionTemplates: Record<SupportedLanguage, (word: MorseWord) => string> = {
  en: (word) => `How to write, hear, and understand "${word.word}" in Morse code (${word.morse}). Includes character breakdown, timing guidance, and practical usage notes.`,
  es: (word) => `Como escribir, escuchar y entender "${word.word}" en codigo morse (${word.morse}). Incluye desglose por caracteres, tiempos y uso practico.`,
  pt: (word) => `Como escrever, ouvir e entender "${word.word}" em codigo morse (${word.morse}). Inclui analise de caracteres, tempos e uso pratico.`,
  fr: (word) => `Comment ecrire, ecouter et comprendre "${word.word}" en code morse (${word.morse}). Avec decomposition, rythme et usages pratiques.`,
  tr: (word) => `"${word.word}" ifadesini Mors kodunda (${word.morse}) yazma, dinleme ve anlama rehberi. Harf analizi, zamanlama ve kullanim notlari icerir.`,
  de: (word) => `So schreiben, horen und verstehen Sie "${word.word}" im Morsecode (${word.morse}). Mit Zeichenanalyse, Timing und praktischen Hinweisen.`,
};

const alphabetSummaries: Record<SupportedLanguage, string> = {
  en: 'A complete International Morse Code alphabet reference for letters, numbers, punctuation, timing ratios, mnemonics, and common beginner questions.',
  es: 'Referencia completa del alfabeto internacional de codigo morse con letras, numeros, puntuacion, tiempos, mnemotecnias y preguntas frecuentes.',
  pt: 'Referencia completa do alfabeto internacional de codigo morse com letras, numeros, pontuacao, tempos, mnemonicos e perguntas comuns.',
  fr: 'Reference complete de l alphabet international du code morse avec lettres, chiffres, ponctuation, rythme, mnemonique et questions courantes.',
  tr: 'Harfler, sayilar, noktalama, zamanlama oranlari, hafiza ipuclari ve temel sorular icin tam Uluslararasi Mors alfabesi referansi.',
  de: 'Vollstandige Referenz fur das internationale Morsecode-Alphabet mit Buchstaben, Zahlen, Satzzeichen, Timing, Merkhilfen und Einsteigerfragen.',
};

const alphabetDescriptions: Record<SupportedLanguage, string> = {
  en: 'Morse Code Alphabet - International Standard Reference Chart for A-Z letters, numbers, punctuation, timing ratios, and Morse code practice.',
  es: 'Tabla del alfabeto internacional de codigo morse con letras A-Z, numeros, puntuacion, reglas de tiempo y practica.',
  pt: 'Tabela do alfabeto internacional de codigo morse com letras A-Z, numeros, pontuacao, regras de tempo e pratica.',
  fr: 'Tableau de l alphabet international du code morse avec lettres A-Z, chiffres, ponctuation, regles de rythme et pratique.',
  tr: 'A-Z harfler, sayilar, noktalama, zamanlama kurallari ve pratik icin Uluslararasi Mors alfabesi tablosu.',
  de: 'Internationale Morsecode-Alphabet-Tabelle mit A-Z Buchstaben, Zahlen, Satzzeichen, Timing-Regeln und Ubungen.',
};

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

function getBasePath(pageType: SeoPageType, slug?: string): string {
  if (pageType === 'alphabet') return '/alphabet';
  if (pageType === 'detail' && slug) return `/words/${slug}`;
  return '/';
}

function getLocalizedSeoPath(basePath: string, lang: SupportedLanguage): string {
  const path = getLocalizedPath(basePath, lang);
  return path === `/${lang}` ? `/${lang}/` : path;
}

function getAlternates(basePath: string): Array<{ hreflang: string; href: string }> {
  const alternates: Array<{ hreflang: string; href: string }> = LANGUAGES.map((language) => ({
    hreflang: language.code,
    href: absoluteUrl(getLocalizedSeoPath(basePath, language.code)),
  }));

  alternates.push({
    hreflang: 'x-default',
    href: absoluteUrl(basePath),
  });

  return alternates;
}

function getRouteSchema(route: Omit<SeoRoute, 'schema'>): Record<string, unknown> {
  if (route.pageType === 'home') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: route.title,
      description: route.description,
      url: route.canonical,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
      },
      featureList: [
        'English to Morse code translation',
        'Morse code to English translation',
        'Real-time audio playback',
        'Customizable WPM and frequency',
        'International Morse Code reference pages',
      ],
    };
  }

  if (route.pageType === 'alphabet') {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: route.title,
      description: route.description,
      url: route.canonical,
      step: [
        {
          '@type': 'HowToStep',
          name: 'Learn dot and dash timing',
          text: 'A dot is one time unit and a dash is three time units in International Morse Code.',
        },
        {
          '@type': 'HowToStep',
          name: 'Study letters, numbers, and punctuation',
          text: 'Use the reference chart to match each character with its Morse code sequence.',
        },
        {
          '@type': 'HowToStep',
          name: 'Practice common phrases',
          text: 'Start with common signals like SOS, 73, CQ, OK, and Hello before longer messages.',
        },
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: route.word?.word,
    description: route.word
      ? `${route.word.word} in Morse Code is ${route.word.morse}. ${route.word.description}`
      : route.description,
    url: route.canonical,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'International Morse Code standard',
      url: absoluteUrl('/alphabet'),
    },
    termCode: route.word?.morse,
  };
}

export function buildSeoRoute(
  lang: SupportedLanguage,
  pageType: SeoPageType,
  slug?: string
): SeoRoute {
  const langConfig = LANGUAGES.find((language) => language.code === lang) || LANGUAGES[0];
  const word = slug ? MORSE_WORDS.find((item) => item.slug === slug) : undefined;
  const basePath = getBasePath(pageType, slug);
  const path = getLocalizedSeoPath(basePath, lang);

  let title = langConfig.seoTitle;
  let description = langConfig.seoDesc;
  let keywords = langConfig.seoKeywords;
  let h1 = langConfig.seoTitle;
  let summary = langConfig.seoDesc;
  let priority = '1.0';
  let changefreq = 'weekly';

  if (pageType === 'alphabet') {
    title = alphabetTitles[lang] || alphabetTitles.en;
    description = alphabetDescriptions[lang] || alphabetDescriptions.en;
    keywords = `${langConfig.seoKeywords}, morse alphabet, morse code chart, learn morse code`;
    h1 = title;
    summary = alphabetSummaries[lang] || alphabetSummaries.en;
    priority = '0.9';
    changefreq = 'monthly';
  }

  if (pageType === 'detail' && word) {
    title = detailTitleTemplates[lang](word);
    description = detailDescriptionTemplates[lang](word);
    keywords = `${word.word} morse code, ${word.word} in morse, convert ${word.word} to morse, morse code translator`;
    h1 = `${word.word} in Morse Code`;
    summary = `${word.word} is written as ${word.morse} in International Morse Code. ${word.description} ${word.usage}`;
    priority = '0.8';
    changefreq = 'monthly';
  }

  const routeWithoutSchema = {
    path,
    lang,
    pageType,
    title,
    description,
    keywords,
    canonical: absoluteUrl(path),
    alternates: getAlternates(basePath),
    h1,
    summary,
    word,
    priority,
    changefreq,
  };

  return {
    ...routeWithoutSchema,
    schema: getRouteSchema(routeWithoutSchema),
  };
}

export function getSeoRoutes(): SeoRoute[] {
  const routes: SeoRoute[] = [];

  for (const language of LANGUAGES) {
    routes.push(buildSeoRoute(language.code, 'home'));
    routes.push(buildSeoRoute(language.code, 'alphabet'));

    for (const word of MORSE_WORDS) {
      routes.push(buildSeoRoute(language.code, 'detail', word.slug));
    }
  }

  return routes;
}

export function findSeoRoute(
  lang: SupportedLanguage,
  pageType: SeoPageType,
  slug?: string
): SeoRoute {
  return buildSeoRoute(lang, pageType, slug);
}
