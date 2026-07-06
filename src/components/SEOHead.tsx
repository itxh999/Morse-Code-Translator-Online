import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SupportedLanguage } from '../constants/translations';
import { MorseWord } from '../constants/words';
import { findSeoRoute, SeoPageType } from '../seo/metadata';

interface SEOHeadProps {
  lang: SupportedLanguage;
  pageType: SeoPageType;
  wordData?: MorseWord;
}

function upsertMeta(
  attributeType: 'name' | 'property',
  key: string,
  content: string
): void {
  let tag = document.querySelector(`meta[${attributeType}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attributeType, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function SEOHead({ lang, pageType, wordData }: SEOHeadProps) {
  const location = useLocation();

  useEffect(() => {
    const route = findSeoRoute(lang, pageType, wordData?.slug);

    document.title = route.title;
    document.documentElement.lang = lang;

    upsertMeta('name', 'description', route.description);
    upsertMeta('name', 'keywords', route.keywords);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', route.title);
    upsertMeta('property', 'og:description', route.description);
    upsertMeta('property', 'og:url', route.canonical);
    upsertMeta('property', 'twitter:card', 'summary_large_image');
    upsertMeta('property', 'twitter:title', route.title);
    upsertMeta('property', 'twitter:description', route.description);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', route.canonical);

    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((tag) => tag.remove());
    route.alternates.forEach((alternate) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alternate.hreflang);
      link.setAttribute('href', alternate.href);
      document.head.appendChild(link);
    });

    const existingSchema = document.getElementById('dynamic-seo-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    const schemaScript = document.createElement('script');
    schemaScript.id = 'dynamic-seo-schema';
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify(route.schema);
    document.head.appendChild(schemaScript);
  }, [lang, pageType, wordData, location.pathname]);

  return null;
}
