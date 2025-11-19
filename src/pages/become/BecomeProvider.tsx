import React from 'react';

export default function BecomeProvider() {
  const handleStart = () => {
    // Redirect to onboarding
    window.location.href = 'https://our-bride.online/onboarding/provider';
  };

  return (
    <div className="container py-5">
      <h1>Become a Provider</h1>
      <p>Join our network of wedding service providers</p>
      <button className="btn btn-primary" onClick={handleStart}>
        Start Now
      </button>
    </div>
  );
}

