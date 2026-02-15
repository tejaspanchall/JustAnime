export default function getSafeTitle(title, language = 'EN', jpTitle = '') {
  if (!title) return '';
  
  // If title is already a string, return it
  if (typeof title === 'string') return title;
  
  // If title is an object, extract based on language preference
  if (typeof title === 'object') {
    if (language === 'EN') {
      return title.english || title.romaji || title.userPreferred || title.native || jpTitle || 'Unknown Title';
    } else {
      // For JP/other languages, prefer native or romaji
      return title.native || title.romaji || title.userPreferred || title.english || jpTitle || 'Unknown Title';
    }
  }
  
  return 'Unknown Title';
}
