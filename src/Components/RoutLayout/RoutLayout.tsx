import React from "react";
import NavBar from '../NavBar/NavBar';
import { Outlet } from "react-router-dom";
import Footer from '../Footer/Footer';
import AppDownloadBar from '../AppDownloadBar/AppDownloadBar';

export default function RoutLayout() {
  // Check if download bar is visible to adjust padding
  const [hasDownloadBar, setHasDownloadBar] = React.useState(true);
  
  React.useEffect(() => {
    const checkBarVisibility = () => {
      const dismissed = localStorage.getItem('appDownloadBarDismissed');
      setHasDownloadBar(dismissed !== 'true');
    };
    
    checkBarVisibility();
    window.addEventListener('appDownloadBarDismissed', checkBarVisibility);
    window.addEventListener('storage', checkBarVisibility);
    
    return () => {
      window.removeEventListener('appDownloadBarDismissed', checkBarVisibility);
      window.removeEventListener('storage', checkBarVisibility);
    };
  }, []);

  return (
    <>
      <AppDownloadBar />
      <NavBar />
      <div 
        className="container-floud" 
        style={{ 
          paddingTop: hasDownloadBar ? '128px' : '80px',
          transition: 'padding-top 0.3s ease'
        }}
      >
        <Outlet></Outlet>
      </div>
      <Footer />
    </>
  );
}
