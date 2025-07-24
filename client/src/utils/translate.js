// Utility to translate text using LibreTranslate API
// Usage: translateText(text, targetLang, apiKey)

export async function translateText(text, targetLang = 'hi', apiKey) {
  const endpoint = 'https://libretranslate.com/translate';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      q: text,
      source: 'en',
      target: targetLang,
      format: 'text'
    })
  });
  if (!res.ok) throw new Error('Translation failed');
  const data = await res.json();
  return data.translatedText;
}
