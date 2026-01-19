// Map team member image URLs to imported assets
import T1 from '../assets/T1.jpg';
import T2 from '../assets/T2.jpeg';
import T3 from '../assets/T3.jpeg';
import T4 from '../assets/T4.jpeg';

const teamImageMap = {
  'T1.jpg': T1,
  'T2.jpeg': T2,
  'T3.jpg': T3,
  'T3.jpeg': T3,
  'T4.jpeg': T4,
  'T1': T1,
  'T2': T2,
  'T3': T3,
  'T4': T4,
};

/**
 * Get the actual image source for a team member
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - The actual image source (imported asset or URL)
 */
export const getTeamImage = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Check if it's one of our asset images
  const assetImage = teamImageMap[imageUrl] || teamImageMap[imageUrl.split('/').pop()];
  if (assetImage) {
    return assetImage;
  }
  
  // Otherwise return the URL as-is (for uploaded images)
  return imageUrl;
};

export default teamImageMap;
