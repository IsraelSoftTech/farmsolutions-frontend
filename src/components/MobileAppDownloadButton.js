import React from 'react';
import { HiDownload } from 'react-icons/hi';
import './MobileAppDownloadButton.css';

const MOBILE_APP_APK_URL =
  'https://expo.dev/artifacts/eas/wCgdZgpFAWWWVzVLkc5gJd.apk';

const MobileAppDownloadButton = () => {
  return (
    <a
      href={MOBILE_APP_APK_URL}
      className="mobile-app-download-fab"
      target="_blank"
      rel="noopener noreferrer"
      title="Download mobile app"
      aria-label="Download mobile app"
    >
      <HiDownload className="mobile-app-download-fab__icon" size={24} aria-hidden="true" />
    </a>
  );
};

export default MobileAppDownloadButton;
