// Map product image URLs to imported assets
import pro1 from '../assets/pro1.jpeg';
import pro2 from '../assets/pro2.jpeg';
import pro3 from '../assets/pro3.jpeg';

const productImageMap = {
  // Direct image references
  'pro1.jpeg': pro1,
  'pro2.jpeg': pro2,
  'pro3.jpeg': pro3,
  'pro1': pro1,
  'pro2': pro2,
  'pro3': pro3,
  // Spethacs Room products
  'spethacs-room-a': pro1,
  'spethacs-room-b': pro2,
  'spethacs-room-c': pro3,
  '/images/spethacs-room-a.jpg': pro1,
  '/images/spethacs-room-b.jpg': pro2,
  '/images/spethacs-room-c.jpg': pro3,
};

/**
 * Get the actual image source for a product
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - The actual image source (imported asset or URL)
 */
export const getProductImage = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Check if it's one of our asset images
  const assetImage = productImageMap[imageUrl] || productImageMap[imageUrl.split('/').pop()];
  if (assetImage) {
    return assetImage;
  }
  
  // Otherwise return the URL as-is (for uploaded images)
  return imageUrl;
};

export default productImageMap;
