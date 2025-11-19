import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function AffiliateRedirect() {
  const { affiliateCode } = useParams();

  useEffect(() => {
    // Track affiliate link and redirect
    // TODO: Implement tracking and redirect logic
    console.log('Affiliate code:', affiliateCode);
  }, [affiliateCode]);

  return (
    <div className="container py-5">
      <p>Processing affiliate link...</p>
    </div>
  );
}

