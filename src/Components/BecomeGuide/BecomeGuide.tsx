import React from 'react';

export default function BecomeGuide() {
  const handleStart = () => {
    // Redirect to onboarding
    window.location.href = 'https://our-bride.online/onboarding/guide';
  };

  return (
    <div className="container py-5">
      <h1>Become a Local Guide</h1>
      <p>Share your wedding expertise and earn rewards</p>
      <button className="btn btn-primary" onClick={handleStart}>
        Start Now
      </button>
    </div>
  );
}

