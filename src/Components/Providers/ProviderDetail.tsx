import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProviderDetail() {
  const { providerId } = useParams();
  return (
    <div className="container py-5">
      <h1>Provider Details</h1>
      <p>Provider ID: {providerId}</p>
    </div>
  );
}

