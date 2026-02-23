import i18n from 'i18next';

/**
 * Extract localized text from a JSON multilingual field.
 * 
 * Product fields (name, description, etc.) are stored as JSON objects:
 * {"zh": "中文名", "en": "English Name", "ja": "日本語名", ...}
 * 
 * This function returns the text for the current language,
 * falling back to 'en' then 'zh' if the current language is not available.
 * 
 * If the value is a plain string (not JSON), it returns it as-is for backward compatibility.
 */
export function getLocalized(value: string | null | undefined): string {
  if (!value) return '';
  
  // Try to parse as JSON
  try {
    const obj = JSON.parse(value);
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      const lang = i18n.language || 'en';
      // Try exact match first
      if (obj[lang]) return obj[lang];
      // Try base language (e.g., 'zh' for 'zh-CN')
      const baseLang = lang.split('-')[0];
      if (obj[baseLang]) return obj[baseLang];
      // Fallback chain: en -> zh -> first available
      if (obj.en) return obj.en;
      if (obj.zh) return obj.zh;
      // Return first available value
      const keys = Object.keys(obj);
      if (keys.length > 0) return obj[keys[0]];
      return '';
    }
  } catch {
    // Not JSON - return as plain string
  }
  
  return value;
}
