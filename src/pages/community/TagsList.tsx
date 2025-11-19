import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from "@/services/communityService";
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import SEOHead from '@/Components/SEO/SEOHead';

export default function TagsList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await communityService.tags.getAll();

      // Handle both ApiResult format and direct data format
      let tagsData = [];
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          tagsData = response.data;
        } else if (Array.isArray(response)) {
          tagsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          tagsData = response.data.data;
        }
      }

      setTags(tagsData);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadTags();
      return;
    }

    try {
      setLoading(true);
      const response = await communityService.tags.search(searchTerm);

      // Handle both ApiResult format and direct data format
      let tagsData = [];
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          tagsData = response.data;
        } else if (Array.isArray(response)) {
          tagsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          tagsData = response.data.data;
        }
      }

      setTags(tagsData);
    } catch (error) {
      console.error('Error searching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && tags.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SEOHead
        title="Community Tags"
        description="Browse and discover tags in our wedding community"
        keywords="wedding tags, community tags, wedding categories"
        image=""
        url={`${window.location.origin}/community/tags`}
      />
      <div className="tags-list-section">
        {/* Hero Section */}
        <HeroSection
          badge={{
            icon: "fas fa-tags",
            text: "Community Tags"
          }}
          title={
            <>
              Community <span className="text-gradient">Tags</span>
            </>
          }
          description="Browse and discover tags to explore content by topics. Find articles, posts, and discussions about specific wedding topics."
          stats={[
            { number: tags.length > 0 ? `${tags.length}+` : "500+", label: "Tags" },
            { number: filteredTags.length, label: "Filtered" },
            { number: "4.9★", label: "Community Rating" },
          ]}
        />

        {/* Search Section */}
        <section className="search-section" style={{ padding: "40px 0", background: "white" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="input-group shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ border: "none", padding: "16px 20px" }}
                  />
                  <button
                    className="btn btn-main"
                    type="button"
                    onClick={handleSearch}
                    style={{ border: "none", padding: "16px 24px" }}
                  >
                    <i className="fas fa-search me-2"></i> Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tags Grid Section */}
        <section className="tags-grid-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <SectionHeader
                  badge={{ icon: "fas fa-tags", text: "Browse" }}
                  title="Community Tags"
                  description={searchTerm ? `Search results for "${searchTerm}"` : "Explore all tags in our community"}
                />
              </div>
            </div>

            {filteredTags.length === 0 ? (
              <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                  <div className="empty-state" style={{ padding: "60px 20px" }}>
                    <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                    <h3>No Tags Found</h3>
                    <p style={{ color: "#666" }}>
                      {searchTerm ? `No tags found matching "${searchTerm}"` : "Check back soon for new tags!"}
                    </p>
                    {searchTerm && (
                      <button
                        className="btn btn-outline-main mt-3"
                        onClick={() => {
                          setSearchTerm('');
                          loadTags();
                        }}
                      >
                        <i className="fas fa-redo me-2"></i>
                        Clear Search
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                {filteredTags.map((tag) => (
                  <div key={tag.id} className="col-md-6 col-lg-4 mb-4">
                    <Link
                      to={`/community/tags/${tag.slug || tag.id}`}
                      className="text-decoration-none"
                    >
                      <div className="card h-100 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden", transition: "all 0.3s ease" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                        }}>
                        <div className="card-body" style={{ padding: "24px" }}>
                          <div className="d-flex align-items-center mb-3">
                            {tag.icon && (
                              <i className={`${tag.icon} me-3`} style={{ fontSize: '2rem', color: tag.color || 'var(--main)' }}></i>
                            )}
                            <h5 className="card-title mb-0" style={{ fontWeight: "600" }}>
                              {tag.color ? (
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: tag.color,
                                    color: '#fff',
                                    fontSize: '1rem',
                                    padding: '0.75rem 1.25rem',
                                    borderRadius: "8px"
                                  }}
                                >
                                  {tag.name}
                                </span>
                              ) : (
                                tag.name
                              )}
                            </h5>
                          </div>
                          {tag.description && (
                            <p className="card-text text-muted" style={{ marginBottom: 0 }}>
                              {tag.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

