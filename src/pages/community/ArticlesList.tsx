import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from '@/services/communityService';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import SEOHead from '@/Components/SEO/SEOHead';
import ContentCard from '@/Components/Community/Shared/ContentCard';

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    loadArticles();
  }, [page]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await communityService.articles.getPublished(page, pageSize);
      // Handle both ApiResult format and direct data format
      let articlesData = [];
      let paginationInfo = {};
      
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          articlesData = response.data;
          paginationInfo = response;
        } else if (Array.isArray(response)) {
          articlesData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          articlesData = response.data.data;
          paginationInfo = response.data;
        }
      }
      
      setArticles(articlesData);
      setHasNextPage(paginationInfo.hasNextPage || false);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && articles.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SEOHead
        title="Community Articles"
        description="Read insightful articles from our wedding community"
        keywords="wedding articles, community articles, wedding tips, wedding advice"
        image=""
        url={`${window.location.origin}/community/articles`}
      />
      <div className="articles-list-section">
        {/* Hero Section */}
        <HeroSection
          badge={{
            icon: "fas fa-newspaper",
            text: "Community Articles"
          }}
          title={
            <>
              Community <span className="text-gradient">Articles</span>
            </>
          }
          description="Read insightful articles, tips, and stories from our wedding community. Learn from experts and share your experiences."
          stats={[
            { number: articles.length > 0 ? `${articles.length}+` : "200+", label: "Articles" },
            { number: hasNextPage ? "10+" : "1", label: "Pages" },
            { number: "4.9★", label: "Average Rating" },
          ]}
        />

        {/* Articles Grid Section */}
        <section className="articles-grid-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <SectionHeader
                  badge={{ icon: "fas fa-newspaper", text: "Latest" }}
                  title="Community Articles"
                  description="Explore articles written by our community members and experts"
                />
              </div>
            </div>

            {articles.length === 0 ? (
              <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                  <div className="empty-state" style={{ padding: "60px 20px" }}>
                    <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                    <h3>No Articles Found</h3>
                    <p style={{ color: "#666" }}>Check back soon for new articles!</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  {articles.map((article) => (
                    <div key={article.id} className="col-md-6 col-lg-4 mb-4">
                      <ContentCard
                        content={article}
                        contentType="article"
                        showActions={false}
                      />
                    </div>
                  ))}
                </div>

                {hasNextPage && (
                  <div className="row justify-content-center mt-5">
                    <div className="col-auto">
                      <button
                        className="btn btn-main btn-lg"
                        onClick={() => setPage(page + 1)}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More <i className="fas fa-arrow-down ms-2"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

