// Map partner logo URLs to imported assets
import patnuc from '../assets/patnuc.jpeg';
import worldBank from '../assets/world bank.jpeg';
import minpostel from '../assets/minpostel.jpeg';
import minader from '../assets/minader.jpeg';
import minepia from '../assets/minepia.jpeg';
import minmidt from '../assets/minmidt.jpeg';

const partnerImageMap = {
  // PATNUC Cameroon
  'patnuc.jpeg': patnuc,
  'patnuc': patnuc,
  'patnuc-cameroon': patnuc,
  'PATNUC Cameroon': patnuc,
  
  // World Bank (note: filename has a space)
  'world bank.jpeg': worldBank,
  'world-bank.jpeg': worldBank,
  'world bank': worldBank,
  'world-bank': worldBank,
  'World Bank': worldBank,
  
  // MINPOSTE/MINPOSTEL (note: actual file is minpostel.jpeg)
  'minpostel.jpeg': minpostel,
  'minposte.jpeg': minpostel,
  'minpostel': minpostel,
  'minposte': minpostel,
  'MINPOSTE': minpostel,
  'MINPOSTEL': minpostel,
  
  // MINADER
  'minader.jpeg': minader,
  'minader': minader,
  'MINADER': minader,
  
  // MINEPIA
  'minepia.jpeg': minepia,
  'minepia': minepia,
  'MINEPIA': minepia,
  
  // MINMIDT
  'minmidt.jpeg': minmidt,
  'minmidt': minmidt,
  'MINMIDT': minmidt,
};

/**
 * Get the actual image source for a partner logo
 * @param {string} imageUrl - The image URL from the database or filename
 * @returns {string} - The actual image source (imported asset or URL)
 */
export const getPartnerImage = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Check if it's one of our asset images
  // Try exact match first
  let assetImage = partnerImageMap[imageUrl];
  
  // If not found, try with filename extraction
  if (!assetImage && imageUrl.includes('/')) {
    const filename = imageUrl.split('/').pop();
    assetImage = partnerImageMap[filename];
  }
  
  // If still not found, try lowercase version
  if (!assetImage) {
    const lowerKey = imageUrl.toLowerCase();
    assetImage = partnerImageMap[lowerKey];
  }
  
  if (assetImage) {
    return assetImage;
  }
  
  // Otherwise return the URL as-is (for admin-uploaded images)
  return imageUrl;
};

export default partnerImageMap;
