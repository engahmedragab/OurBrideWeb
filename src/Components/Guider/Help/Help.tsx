import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';

export default function Help() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await guiderService.help.getFaqs();
      setFaqs(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading FAQs:', error);
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
        title="Help Center"
        description="Get help and find answers"
        url={`${window.location.origin}/help`}
      />

      <h1 className="mb-4">Help Center</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Support</h5>
              <p className="card-text">Get in touch with our support team</p>
              <Link to="/help/support" className="btn btn-primary">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Announcements</h5>
              <p className="card-text">Stay updated with platform announcements</p>
              <Link to="/help/announcements" className="btn btn-primary">
                View Announcements
              </Link>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-3">Frequently Asked Questions</h2>
      {faqs.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No FAQs available.
        </div>
      ) : (
        <div className="accordion">
          {faqs.map((faq, index) => (
            <div key={faq.id || index} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq-${faq.id || index}`}
                >
                  {faq.question || faq.title}
                </button>
              </h2>
              <div
                id={`faq-${faq.id || index}`}
                className="accordion-collapse collapse"
              >
                <div className="accordion-body">
                  {faq.answer || faq.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
