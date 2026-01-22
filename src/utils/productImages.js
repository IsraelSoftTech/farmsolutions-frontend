// Product images are now managed through AdminImages
// All images should be uploaded via AdminImages and referenced by URL
// This utility is kept for backward compatibility but no longer uses asset imports

import { getImageUrl } from './imageUtils';

/**
 * Get the actual image source for a product
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - The image URL (from database/FTP)
 */
export const getProductImage = (imageUrl) => {
  if (!imageUrl) return null;
  
  // All images are now from database/FTP - use getImageUrl utility
  return getImageUrl(imageUrl);
};

export default {};
