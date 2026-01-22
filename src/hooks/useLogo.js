import { useState, useEffect } from 'react';
import api from '../config/api';
import { getImageUrl } from '../utils/imageUtils';

/**
 * Custom hook to fetch logo from database
 * Returns the logo URL or null if not found
 */
export const useLogo = () => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await api.get('/images?category=logo');
        if (response.ok && response.data.success && response.data.data.length > 0) {
          // Get the first logo (most recent)
          const logo = response.data.data[0];
          setLogoUrl(getImageUrl(logo.url));
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        // If no logo found, set to null (component should handle fallback)
        setLogoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  return { logoUrl, loading };
};

export default useLogo;
