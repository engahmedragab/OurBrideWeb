import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function Support() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to submit support request');
      navigate('/');
      return;
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to submit support request');
      return;
    }
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const guideProfileId = getGuideProfileId();
      if (!guideProfileId) {
        throw new Error('No guide profile found.');
      }
      await guiderService.help.submitSupportRequest(guideProfileId, formData);
      toast.success('Support request submitted successfully!');
      setFormData({ subject: '', message: '', category: 'general' });
    } catch (error) {
      console.error('Error submitting support request:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit support request.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <SEOHead
        title="Support"
        description="Contact support"
        url={`${window.location.origin}/help/support`}
      />

      <h1 className="mb-4">Contact Support</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="subject" className="form-label">
            Subject <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            placeholder="Enter subject"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleInputChange}
            required
            placeholder="Enter your message..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
