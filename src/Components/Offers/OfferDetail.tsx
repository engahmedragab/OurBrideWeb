import React from 'react';
import { useParams } from 'react-router-dom';

export default function OfferDetail() {
  const { offerId } = useParams();
  return (
    <div className="container py-5">
      <h1>Offer Details</h1>
      <p>Offer ID: {offerId}</p>
    </div>
  );
}

