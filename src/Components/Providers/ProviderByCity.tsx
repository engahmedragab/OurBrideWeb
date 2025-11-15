import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProviderByCity() {
  const { city } = useParams();
  return (
    <div className="container py-5">
      <h1>Providers in {city}</h1>
      <p>Browse providers in this city</p>
    </div>
  );
}

