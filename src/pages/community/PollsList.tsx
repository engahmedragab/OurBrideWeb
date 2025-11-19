import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from "@/services/communityService";
import Pagination from "@/Components/Community/Shared/Pagination";
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import SEOHead from '@/Components/SEO/SEOHead';

export default function PollsList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [filter, setFilter] = useState('active'); // 'active', 'published', 'all'
  const pageSize = 20;

  useEffect(() => {
    loadPolls();
  }, [page, filter]);

  const loadPolls = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'active') {
        response = await communityService.decisionGroups.getActive(page, pageSize);
      } else if (filter === 'published') {
        response = await communityService.decisionGroups.getPublished(page, pageSize);
      } else {
        response = await communityService.decisionGroups.getAll(page, pageSize);
      }

      // Handle both ApiResult format and direct data format
      let pollsData = [];
      let paginationInfo: any = {};

      if (response) {
        if (response.data && Array.isArray(response.data)) {
          pollsData = response.data;
          paginationInfo = response;
        } else if (Array.isArray(response)) {
          pollsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          pollsData = response.data.data;
          paginationInfo = response.data;
        }
      }

      setPolls(pollsData);
      setTotalPages(paginationInfo.totalPages || 1);
      setHasNextPage(paginationInfo.hasNextPage || false);
      setHasPreviousPage(paginationInfo.hasPreviousPage || false);
    } catch (error) {
      console.error('Error loading polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && polls.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SEOHead
        title="Community Polls"
        description="Participate in community polls and share your opinion"
        keywords="wedding polls, community polls, decision groups, voting"
        image=""
        url={`${window.location.origin}/community/decision-groups`}
      />
      <div className="polls-list-section">
        {/* Hero Section */}
        <HeroSection
          badge={{
            icon: "fas fa-poll",
            text: "Decision Groups"
          }}
          title={
            <>
              Community <span className="text-gradient">Polls</span>
            </>
          }
          description="Participate in community polls and share your opinion. Help others make decisions and see what the community thinks."
          stats={[
            { number: polls.length > 0 ? `${polls.length}+` : "100+", label: "Polls" },
            { number: totalPages > 1 ? `${totalPages}` : "1", label: "Pages" },
            { number: polls.filter(p => p.isActive).length, label: "Active" },
          ]}
        />

        {/* Filter Tabs */}
        <section className="filter-section" style={{ padding: "20px 0", background: "white" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-auto">
                <ul className="nav nav-pills shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${filter === 'active' ? 'active bg-main text-white' : ''}`}
                      onClick={() => { setFilter('active'); setPage(1); }}
                      style={{ borderRadius: 0 }}
                    >
                      <i className="fas fa-fire me-2"></i>Active Polls
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${filter === 'published' ? 'active bg-main text-white' : ''}`}
                      onClick={() => { setFilter('published'); setPage(1); }}
                      style={{ borderRadius: 0 }}
                    >
                      <i className="fas fa-check-circle me-2"></i>Published
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${filter === 'all' ? 'active bg-main text-white' : ''}`}
                      onClick={() => { setFilter('all'); setPage(1); }}
                      style={{ borderRadius: 0 }}
                    >
                      <i className="fas fa-list me-2"></i>All Polls
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Polls Grid Section */}
        <section className="polls-grid-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <SectionHeader
                  badge={{ icon: "fas fa-poll", text: filter === 'active' ? "Active" : filter === 'published' ? "Published" : "All" }}
                  title="Community Polls"
                  description={filter === 'active' ? "Currently active polls you can participate in" : filter === 'published' ? "Published polls from the community" : "All polls in the community"}
                />
              </div>
            </div>

            {polls.length === 0 ? (
              <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                  <div className="empty-state" style={{ padding: "60px 20px" }}>
                    <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                    <h3>No Polls Found</h3>
                    <p style={{ color: "#666" }}>Check back soon for new polls!</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  {polls.map((poll) => (
                    <div key={poll.id} className="col-md-6 col-lg-4 mb-4">
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
                          <h5 className="card-title mb-3" style={{ fontWeight: "600" }}>
                            <Link to={`/community/decision-groups/${poll.id}`} className="text-decoration-none">
                              {poll.title}
                            </Link>
                          </h5>
                          <p className="card-text" style={{ color: "#666", marginBottom: "16px" }}>
                            {poll.description || poll.question}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <small className="text-muted">
                                <i className="fas fa-eye me-1"></i>{poll.viewCount || 0}
                                <i className="fas fa-heart ms-3 me-1"></i>{poll.likeCount || 0}
                              </small>
                            </div>
                            {poll.isActive && (
                              <span className="badge bg-success">Active</span>
                            )}
                          </div>
                          {poll.endDate && (
                            <small className="text-muted d-block">
                              <i className="fas fa-clock me-1"></i>
                              Ends: {new Date(poll.endDate).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="row justify-content-center mt-5">
                    <div className="col-auto">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        onPageChange={handlePageChange}
                        loading={loading}
                      />
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

