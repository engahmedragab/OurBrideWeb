import React, { useState, useEffect } from 'react';

export default function AppDownloadBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the bar
    const dismissed = localStorage.getItem('appDownloadBarDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('appDownloadBarDismissed', 'true');
    // Dispatch custom event to notify navbar
    window.dispatchEvent(new CustomEvent('appDownloadBarDismissed'));
  };

  const handleDownload = (platform: 'ios' | 'android') => {
    if (platform === 'ios') {
      window.open('https://apps.apple.com/sa/app/ourbride/id6747453812', '_blank');
    } else {
      window.open('https://play.google.com/store/apps/details?id=com.ourbride.app', '_blank');
    }
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="app-download-bar" style={{
      background: 'linear-gradient(135deg, var(--main) 0%, #d63d2e 100%)',
      color: 'white',
      padding: '12px 0',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1060,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-8 text-center text-md-start">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <i className="fas fa-mobile-alt" style={{ fontSize: '18px' }}></i>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>
                Download OurBride App for the best experience!
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4 text-center text-md-end mt-2 mt-md-0">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleDownload('ios')}
                className="btn btn-light btn-sm"
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fab fa-apple"></i>
                <span>iOS</span>
              </button>
              <button
                onClick={() => handleDownload('android')}
                className="btn btn-light btn-sm"
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fab fa-google-play"></i>
                <span>Android</span>
              </button>
              <button
                onClick={handleDismiss}
                className="btn btn-link btn-sm"
                style={{
                  color: 'white',
                  padding: '6px 8px',
                  fontSize: '16px',
                  textDecoration: 'none',
                  border: 'none',
                  background: 'transparent'
                }}
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

