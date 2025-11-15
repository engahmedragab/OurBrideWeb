import React, { useEffect, useState } from 'react';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await guiderService.reports.getPolicies();
      setPolicies(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading policies:', error);
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
    <div className="container">
      <SEOHead
        title="Policies"
        description="View platform policies"
        url={`${window.location.origin}/reports/policies`}
      />

      <h1 className="mb-4">Policies</h1>

      {policies.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No policies available.
        </div>
      ) : (
        <div className="row">
          {policies.map((policy) => (
            <div key={policy.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{policy.title || policy.name}</h5>
                  <p className="card-text">{policy.description}</p>
                  <a
                    href={policy.url || policy.downloadUrl}
                    className="btn btn-sm btn-outline-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Policy
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
