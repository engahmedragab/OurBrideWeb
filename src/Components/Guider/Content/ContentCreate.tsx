import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';
import { ContentType, ContentVisibility } from '../../../common/api/gen/ourbride-api';

export default function ContentCreate() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    type: 'video', // video, photo, article
    title: '',
    description: '',
    content: '',
    tags: [],
    media: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to create content');
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...files]
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
      requireAuth('login', 'Please login to create content');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      setSaving(true);
      const guideProfileId = getGuideProfileId();
      if (!guideProfileId) {
        throw new Error('No guide profile found. Please complete onboarding.');
      }

      // Prepare content data
      const contentData = {
        guideProfileId: guideProfileId,
        title: formData.title,
        caption: formData.description,
        type: (formData.type === 'video' ? ContentType.Video : formData.type === 'photo' ? ContentType.Photo : ContentType.Article) as ContentType,
        // Add media handling if needed
      };

      const result = await guiderService.ugcContent.create(contentData);
      toast.success('Content created successfully!');
      navigate('/content');
    } catch (error) {
      console.error('Error creating content:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create content.';
      toast.error(errorMessage);

      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to save drafts');
      return;
    }

    try {
      setSaving(true);
      const guideProfileId = getGuideProfileId();
      if (!guideProfileId) {
        throw new Error('No guide profile found.');
      }

      // Prepare content data for draft
      const contentData = {
        guideProfileId: guideProfileId,
        title: formData.title,
        caption: formData.description,
        type: (formData.type === 'video' ? ContentType.Video : formData.type === 'photo' ? ContentType.Photo : ContentType.Article) as ContentType,
      };

      await guiderService.ugcContent.create(contentData);
      toast.success('Draft saved!');
      navigate('/content/drafts');
    } catch (error) {
      console.error('Error saving draft:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save draft.';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <SEOHead
        title="Create Content"
        description="Create new content"
        keywords=""
        image=""
        url={`${window.location.origin}/content/new`}
      />

      <h1 className="mb-4">Create Content</h1>

      <form onSubmit={handleSubmit}>
        {/* Content Type */}
        <div className="mb-3">
          <label className="form-label">Content Type</label>
          <div className="btn-group" role="group">
            <input
              type="radio"
              className="btn-check"
              name="type"
              id="type-video"
              value="video"
              checked={formData.type === 'video'}
              onChange={handleInputChange}
            />
            <label className="btn btn-outline-primary" htmlFor="type-video">
              <i className="fas fa-video me-1"></i>Video
            </label>

            <input
              type="radio"
              className="btn-check"
              name="type"
              id="type-photo"
              value="photo"
              checked={formData.type === 'photo'}
              onChange={handleInputChange}
            />
            <label className="btn btn-outline-primary" htmlFor="type-photo">
              <i className="fas fa-image me-1"></i>Photo
            </label>

            <input
              type="radio"
              className="btn-check"
              name="type"
              id="type-article"
              value="article"
              checked={formData.type === 'article'}
              onChange={handleInputChange}
            />
            <label className="btn btn-outline-primary" htmlFor="type-article">
              <i className="fas fa-file-alt me-1"></i>Article
            </label>
          </div>
        </div>

        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter content title"
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description..."
          />
        </div>

        {/* Content/Body */}
        {formData.type === 'article' && (
          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              className="form-control"
              id="content"
              name="content"
              rows="10"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your article content..."
            />
          </div>
        )}

        {/* Media Upload */}
        <div className="mb-3">
          <label className="form-label">
            {formData.type === 'video' ? 'Video' : formData.type === 'photo' ? 'Photos' : 'Media'}
          </label>
          <input
            type="file"
            className="form-control"
            multiple={formData.type !== 'video'}
            accept={formData.type === 'video' ? 'video/*' : formData.type === 'photo' ? 'image/*' : 'image/*,video/*'}
            onChange={handleFileUpload}
          />
          {formData.media.length > 0 && (
            <div className="mt-2">
              <small className="text-muted">
                {formData.media.length} file(s) selected
              </small>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/content')}
          >
            Cancel
          </button>
          <div>
            <button
              type="button"
              className="btn btn-outline-primary me-2"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Submit for Review'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
