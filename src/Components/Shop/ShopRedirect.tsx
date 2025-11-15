import React, { useEffect } from 'react';

export default function ShopRedirect() {
  useEffect(() => {
    // Redirect to store subdomain
    window.location.href = 'https://our-bride.store';
  }, []);

  return (
    <div className="container py-5">
      <p>Redirecting to store...</p>
    </div>
  );
}

