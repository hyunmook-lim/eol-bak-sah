import React, { useEffect } from 'react';

/**
 * AdBanner Component for Google AdSense
 * 
 * Usage:
 * <AdBanner adSlot="XXXXXXXXXX" />
 * 
 * @param {string} adSlot - The ad slot ID from your AdSense dashboard
 * @param {string} adFormat - Ad format (default: 'auto')
 * @param {boolean} fullWidthResponsive - Whether the ad should be full width responsive (default: true)
 */
const AdBanner = ({ adSlot, adFormat = 'auto', fullWidthResponsive = true }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  // Replace with your actual Publisher ID (e.g., 'ca-pub-1234567890123456')
  const publisherId = 'ca-pub-1065505358095471';

  return (
    <div className="ad-container" style={{ overflow: 'hidden', margin: '20px 0' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdBanner;
