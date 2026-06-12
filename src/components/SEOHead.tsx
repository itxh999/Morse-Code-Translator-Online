import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SupportedLanguage, LANGUAGES } from '../constants/translations';
import { MorseWord } from '../constants/words';

interface SEOHeadProps {
  lang: SupportedLanguage;
  pageType: 'home' | 'alphabet' | 'detail';
  wordData?: MorseWord;
}

export default function SEOHead({ lang, pageType, wordData }: SEOHeadProps) {
  const location = useLocation();

  useEffect(() => {
    // 1. Get correct translation configurations
    const langConfig = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
    
    // Dynamic Meta Setup according to Page Types and Selected Language
    let title = '';
    let description = '';
    let keywords = '';

    // Translation maps for multilingual titles to satisfy local search volumes
    const localTitles: Record<SupportedLanguage, Record<string, string>> = {
      en: {
        alphabet: 'Morse Code Alphabet - Interational Standard Reference Chart',
        about: 'Detailed guide for Morse Code letters'
      },
      es: {
        alphabet: 'Alfabeto Código Morse - Tabla de Referencia Estándar Internacional',
        about: 'Guía detallada de letras del código morse'
      },
      pt: {
        alphabet: 'Alfabeto de Código Morse - Tabela de Referência Internacional',
        about: 'Guia detalhado de letras em código morse'
      },
      fr: {
        alphabet: 'Alphabet Code Morse - Tableau de Référence International',
        about: 'Guide détaillé des lettres du code morse'
      },
      tr: {
        alphabet: 'Mors Alfabesi - Uluslararası Standart Referans Tablosu',
        about: 'Mors alfabesi harfleri detaylı rehberi'
      },
      de: {
        alphabet: 'Morsecode Alphabet - Internationale Referenztabelle',
        about: 'Ausführliche Anleitung für die einzelnen Morsezeichen'
      }
    };

    if (pageType === 'home') {
      title = langConfig.seoTitle;
      description = langConfig.seoDesc;
      keywords = langConfig.seoKeywords;
    } else if (pageType === 'alphabet') {
      title = localTitles[lang]?.alphabet || localTitles.en.alphabet;
      description = `${localTitles[lang]?.alphabet} (A-Z), ${langConfig.seoKeywords.split(',')[1] || 'numbers'} & punctuation. Learn dots & dashes timing ratio.`;
      keywords = `${langConfig.seoKeywords}, morse alphabet, learn morse alphabet, morse code chart`;
    } else if (pageType === 'detail' && wordData) {
      // For phrase detail page (like 'sos in morse code' or 'i love you in morse code')
      const pWord = wordData.word;
      const pRepresentation = wordData.morse;
      
      const detailTitles: Record<SupportedLanguage, string> = {
        en: `"${pWord}" in Morse Code (${pRepresentation}) - Learn & Translate`,
        es: `"${pWord}" en Código Morse (${pRepresentation}) - Aprender y Traducir`,
        pt: `"${pWord}" em Código Morse (${pRepresentation}) - Aprender e Traduzir`,
        fr: `"${pWord}" en Code Morse (${pRepresentation}) - Traduire et Écouter`,
        tr: `Mors Alfabesinde "${pWord}" Nasıl Yazılır (${pRepresentation})`,
        de: `"${pWord}" in Morsecode (${pRepresentation}) - Übersetzung & Sound`
      };

      const detailDescriptions: Record<SupportedLanguage, string> = {
        en: `How to write and say "${pWord}" in Morse code (${pRepresentation}). Complete detailed analysis, pronunciation guide, millisecond timing, and history of "${pWord}".`,
        es: `Cómo escribir, escuchar y decir "${pWord}" en código morse (${pRepresentation}). Análisis detallado de tiempos, guía de pronunciación e historia de la frase.`,
        pt: `Como escrever, pronunciar e ouvir "${pWord}" em código morse (${pRepresentation}). Análise técnica detalhada, pronúncia e contexto histórico online.`,
        fr: `Comment écrire et prononcer "${pWord}" en code morse (${pRepresentation}). Analyse de rythme, prononciation en dit-dah et origine historique de la phrase.`,
        tr: `Mors alfabesinde "${pWord}" yazımı ve sesi (${pRepresentation}). Harf harf analiz, okunuş telaffuzu kılavuzu ve tarihçesi hakkında tüm detaylar.`,
        de: `Erfahren Sie, wie man "${pWord}" auf Morse schreibt und spricht (${pRepresentation}). Ausführliche Analyse der Morsezeichen, Aussprachehilfe und Hintergrundgeschichte.`
      };

      title = detailTitles[lang] || detailTitles.en;
      description = detailDescriptions[lang] || detailDescriptions.en;
      keywords = `${pWord} morse code, ${pWord} in morse, convert ${pWord} to morse, translate ${pWord}, morse alphabet`;
    }

    // 2. Set Document Title & Language Tag
    document.title = title;
    document.documentElement.lang = lang;

    // 3. Update Meta Description Element
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 4. Update Meta Keywords Element
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // 5. Update Canonical link
    const currentUrl = `https://morse-code-translator.wwkejishe.top${location.pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 5b. Update hreflang alternate links for multilingual SEO crawling using absolute paths
    const pathParts = location.pathname.split('/');
    const firstPart = pathParts[1];
    const hasLangPrefix = LANGUAGES.some(l => l.code === firstPart && firstPart !== 'en');
    const basePath = hasLangPrefix ? '/' + pathParts.slice(2).join('/') : location.pathname;

    LANGUAGES.forEach(l => {
      let hrTag = document.querySelector(`link[rel="alternate"][hreflang="${l.code}"]`);
      if (!hrTag) {
        hrTag = document.createElement('link');
        hrTag.setAttribute('rel', 'alternate');
        hrTag.setAttribute('hreflang', l.code);
        document.head.appendChild(hrTag);
      }
      
      const targetPath = l.code === 'en' 
        ? basePath 
        : `/${l.code}${basePath === '/' ? '' : basePath}`;
      const targetUrl = `https://morse-code-translator.wwkejishe.top${targetPath}`;
      
      hrTag.setAttribute('href', targetUrl);
    });

    // Add x-default hreflang pointing to english standard route
    let defaultHrTag = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (!defaultHrTag) {
      defaultHrTag = document.createElement('link');
      defaultHrTag.setAttribute('rel', 'alternate');
      defaultHrTag.setAttribute('hreflang', 'x-default');
      document.head.appendChild(defaultHrTag);
    }
    defaultHrTag.setAttribute('href', `https://morse-code-translator.wwkejishe.top${basePath}`);

    // 6. Update OpenGraph Social Tags
    const updateOGTag = (property: string, content: string, attributeType: 'property' | 'name' = 'property') => {
      let tag = document.querySelector(`meta[${attributeType}="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attributeType, property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOGTag('og:title', title);
    updateOGTag('og:description', description);
    updateOGTag('og:url', currentUrl);
    updateOGTag('twitter:title', title);
    updateOGTag('twitter:description', description);

    // 7. Dynamic JSON-LD Schema.org Injection
    let schemaScript = document.getElementById('dynamic-seo-schema') as HTMLScriptElement | null;
    if (schemaScript) {
      schemaScript.remove();
    }

    schemaScript = document.createElement('script');
    schemaScript.id = 'dynamic-seo-schema';
    schemaScript.type = 'application/ld+json';

    let schemaObj: any = null;

    if (pageType === 'home') {
      // Inject WebPage & Structured FAQPage Schema which gives absolute magic to SEO Results in Google Search Console!
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": lang === 'es' ? "¿Cómo traduzco código morse a español?" : "How do I translate morse code to english?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": lang === 'es' 
                ? "Simplemente cambia a la pestaña de 'Código Morse a Texto' en nuestro traductor e ingresa puntos (.) y rayas (-). Usa un espacio entre letras o una barra (/) entre palabras." 
                : "Simply switch to the 'Morse Code to English' tab on our translator and enter dots (.) and dashes (-). Use spaces between letters and slash (/) between words."
            }
          },
          {
            "@type": "Question",
            "name": lang === 'es' ? "¿Este traductor de código morse en línea es gratuito?" : "Is this morse code translator online free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our Morse code translator is 100% free with premium high-fidelity audio feedback, Farnsworth timing metrics, and full international ITU standards compliance."
            }
          },
          {
            "@type": "Question",
            "name": "What is the best way to learn Morse code?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most learning experts recommend the Koch Method combined with Farnsworth timing. Memorize sound rhythms (dits and dahs) rather than counting dots and dashes visually."
            }
          },
          {
            "@type": "Question",
            "name": "Does SOS stand for Save Our Souls?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, SOS was selected strictly because its Morse representation (... --- ...) is highly unique and recognizable in maritime radio interference."
            }
          }
        ]
      };
    } else if (pageType === 'alphabet') {
      // Inject standard HowTo or WebPage schema
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": title,
        "description": description,
        "step": [
          {
            "@type": "HowToStep",
            "name": "Learn DOT Timing",
            "text": "The dot (di) is the basic unit. A dash is exactly three dots in length."
          },
          {
            "@type": "HowToStep",
            "name": "Understand Letter & Word Spacing",
            "text": "Maintain three units of silence between letters and seven units of silence between words."
          },
          {
            "@type": "HowToStep",
            "name": "Visualize the Standard Reference Chart",
            "text": "Reference the alphabetical table to learn the character associations like A (.-) and S (...)."
          }
        ]
      };
    } else if (pageType === 'detail' && wordData) {
      // Inject DefinedTerm structured schema for precise definition indexing
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": wordData.word,
        "description": `${wordData.word} in Morse Code is defined as ${wordData.morse}. ${wordData.description}`,
        "inDefinedTermSet": {
          "@type": "DefinedTermSet",
          "name": "International Morse Code standard",
          "url": "https://morse-code-translator.wwkejishe.top/alphabet"
        },
        "termCode": wordData.morse
      };
    }

    if (schemaObj) {
      schemaScript.innerHTML = JSON.stringify(schemaObj);
      document.head.appendChild(schemaScript);
    }

  }, [lang, pageType, wordData, location]);

  return null;
}
