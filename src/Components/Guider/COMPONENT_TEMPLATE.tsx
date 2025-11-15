import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';

/**
 * Component Template
 * Copy this file and customize for each component
 */
export default function ComponentTemplate() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Call appropriate service method
      // const result = await guiderService.section.method();
      // setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEOHead
        title="Page Title"
        description="Page description"
        url={`${window.location.origin}${window.location.pathname}`}
      />
      
      <h1>Page Title</h1>
      {/* Your content here */}
    </div>
  );
}

