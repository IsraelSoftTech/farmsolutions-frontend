import { useEffect, useState } from 'react';
import api from '../config/api';
import { getImageUrl } from '../utils/imageUtils';

const Favicon = () => {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await api.get('/images?category=logo');
        if (response.ok && response.data.success && response.data.data.length > 0) {
          const logo = response.data.data[0];
          setLogoUrl(getImageUrl(logo.url));
        }
      } catch (error) {
        console.error('Error fetching logo for favicon:', error);
      }
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    if (!logoUrl) return;

    // Remove existing favicon links
    const existingIcons = document.querySelectorAll("link[rel*='icon'], link[rel*='apple-touch-icon']");
    existingIcons.forEach(icon => icon.remove());

    // Create main favicon
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/png';
    faviconLink.href = logoUrl;
    document.head.appendChild(faviconLink);

    // Create icon for different sizes
    const sizes = [192, 512];
    sizes.forEach(size => {
      const iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      iconLink.type = 'image/png';
      iconLink.sizes = `${size}x${size}`;
      iconLink.href = logoUrl;
      document.head.appendChild(iconLink);
    });

    // Create apple-touch-icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = logoUrl;
    document.head.appendChild(appleTouchIcon);
  }, [logoUrl]);

  return null;
};

export default Favicon;
