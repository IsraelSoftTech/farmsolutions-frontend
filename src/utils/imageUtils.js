// Utility function to get the full image URL
// If the image is already a full URL, return it as-is
// Otherwise, construct it from the FTP base URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return it as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Construct URL from FTP base URL
  // Production FTP base URL: https://st69310.ispot.cc/farmsolutionss/
  // Upload dir is './' (root), so files are directly in farmsolutionss/
  // Remove any leading slashes from imagePath to avoid double slashes
  const cleanPath = imagePath.replace(/^\/+/, '');
  
  // Use production URL in production, or check for environment variable
  // In development, images should still use production FTP server URLs
  // since all images are uploaded to the production FTP server
  const baseUrl = process.env.REACT_APP_FTP_BASE_URL || 'https://st69310.ispot.cc/farmsolutionss';
  const fullUrl = `${baseUrl}/${cleanPath}`;
  
  // Debug logging (remove in production if needed)
  if (process.env.NODE_ENV === 'development') {
    console.log('[getImageUrl]', { imagePath, cleanPath, fullUrl, baseUrl });
  }
  
  return fullUrl;
};
