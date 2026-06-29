import { es, I18N_VERSION } from './i18n.js';

const STORAGE_KEY = 'portfolio_i18n_en';
const VERSION_KEY = 'portfolio_i18n_version';

// Traduce un texto con MyMemory API
async function translateText(text) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200) return data.responseData.translatedText;
    return text; // fallback al original si falla
  } catch {
    return text;
  }
}

// Traduce un objeto plano de textos en paralelo
async function translateObject(obj) {
  const result = {};
  const entries = Object.entries(obj);
  const translated = await Promise.all(
    entries.map(([key, val]) =>
      typeof val === 'string' ? translateText(val) : translateObject(val)
    )
  );
  entries.forEach(([key], i) => { result[key] = translated[i]; });
  return result;
}

// Obtiene las traducciones — desde cache o desde la API
export async function getTranslations() {
  const cachedVersion = localStorage.getItem(VERSION_KEY);
  const cachedData    = localStorage.getItem(STORAGE_KEY);

  // Si ya hay cache y es la versión actual, usarla
  if (cachedVersion === I18N_VERSION && cachedData) {
    return JSON.parse(cachedData);
  }

  // Si no hay cache o hay textos nuevos, traducir todo
  console.log('[i18n] Traduciendo textos con MyMemory...');
  const en = await translateObject(es);

  // Sobrescribir campos que no se deben traducir
  en.langBtn = 'Cambiar a Español';
  en.spine.subtitle = es.spine.subtitle;
  en.contact.emailLabel    = 'Email';
  en.contact.locationLabel = 'Location';
  en.contact.availLabel    = 'Availability';
  en.contact.replyLabel    = 'Response';
  en.contact.availValue    = 'Projects from Jan 2025';
  en.contact.replyValue    = 'Within 24 hours';

  // Guardar en localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(en));
  localStorage.setItem(VERSION_KEY, I18N_VERSION);

  return en;
}