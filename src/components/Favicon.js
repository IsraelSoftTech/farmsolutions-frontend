import { useEffect } from 'react';
import logo from '../assets/logo.png';

const Favicon = () => {
  useEffect(() => {
    // Remove existing favicon links
    const existingIcons = document.querySelectorAll("link[rel*='icon'], link[rel*='apple-touch-icon']");
    existingIcons.forEach(icon => icon.remove());

    // Create main favicon
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/png';
    faviconLink.href = logo;
    document.head.appendChild(faviconLink);

    // Create icon for different sizes
    const sizes = [192, 512];
    sizes.forEach(size => {
      const iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      iconLink.type = 'image/png';
      iconLink.sizes = `${size}x${size}`;
      iconLink.href = logo;
      document.head.appendChild(iconLink);
    });

    // Create apple-touch-icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = logo;
    document.head.appendChild(appleTouchIcon);
  }, []);

  return null;
};

export default Favicon;
