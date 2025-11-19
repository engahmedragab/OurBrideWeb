import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from "@/services/communityService";
import Pagination from "@/Components/Community/Shared/Pagination";
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import SEOHead from '@/Components/SEO/SEOHead';

export default function ContestsList() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [filter, setFilter] = useState('active'); // 'active', 'published', 'all'
  const pageSize = 20;

  useEffect(() => {
    loadContests();
  }, [page, filter]);

  const loadContests = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'active') {
        response = await communityService.contests.getActive(page, pageSize);
      } else if (filter === 'published') {
        response = await communityService.contests.getPublished(page, pageSize);
      } else {
        response = await communityService.contests.getAll(page, pageSize);
      }

      // Handle both ApiResult format and direct data format
      let contestsData = [];
      let paginationInfo: any = {};

      if (response) {
        if (response.data && Array.isArray(response.data)) {
          contestsData = response.data;
          paginationInfo = response;
        } else if (Array.isArray(response)) {
          contestsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          contestsData = response.data.data;
          paginationInfo = response.data;
        }
      }

      setContests(contestsData);
      setTotalPages(paginationInfo.totalPages || 1);
      setHasNextPage(paginationInfo.hasNextPage || false);
      setHasPreviousPage(paginationInfo.hasPreviousPage || false);
    } catch (error) {
      console.error('Error loading contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isContestActive = (contest) => {
    if (!contest.isActive) return false;
    const now = new Date();
    const startDate = contest.startDate ? new Date(contest.startDate) : null;
    const endDate = contest.endDate ? new Date(contest.endDate) : null;

    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    return true;
  };

  if (loading && contests.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SEOHead
        title="Community Contests"
        description="Join exciting contests and win amazing prizes"
        keywords="wedding contests, community contests, competitions, prizes"
        image=""
        url={`${window.location.origin}/community/contests`}
      />
      <div className="contests-list-section">
        {/* Hero Section */}
        <HeroSection
          badge={{
            icon: "fas fa-trophy",
            text: "Competitions"
          }}
          title={
            <>
              Community <span className="text-gradient">Contests</span>
            </>
          }
          description="Join exciting contests and win amazing prizes. Showcase your creativity and compete with other community members."
          stats={[
            { number: contests.length > 0 ? `${contests.length}+` : "50+", label: "Contests" },
            { number: totalPages > 1 ? `${totalPages}` : "1", label: "Pages" },
            { number: contests.filter(c => isContestActive(c)).length, label: "Active" },
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
                      <i className="fas fa-fire me-2"></i>Active Contests
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
                      <i className="fas fa-list me-2"></i>All Contests
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contests Grid Section */}
        <section className="contests-grid-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <SectionHeader
                  badge={{ icon: "fas fa-trophy", text: filter === 'active' ? "Active" : filter === 'published' ? "Published" : "All" }}
                  title="Community Contests"
                  description={filter === 'active' ? "Currently active contests you can join" : filter === 'published' ? "Published contests from the community" : "All contests in the community"}
                />
              </div>
            </div>

            {contests.length === 0 ? (
              <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                  <div className="empty-state" style={{ padding: "60px 20px" }}>
                    <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                    <h3>No Contests Found</h3>
                    <p style={{ color: "#666" }}>Check back soon for new contests!</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  {contests.map((contest) => (
                    <div key={contest.id} className="col-md-6 col-lg-4 mb-4">
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
                            <Link to={`/community/contests/${contest.id}`} className="text-decoration-none">
                              {contest.title}
                            </Link>
                          </h5>
                          <p className="card-text" style={{ color: "#666", marginBottom: "16px" }}>
                            {contest.description}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <small className="text-muted">
                                <i className="fas fa-eye me-1"></i>{contest.viewCount || 0}
                                <i className="fas fa-heart ms-3 me-1"></i>{contest.likeCount || 0}
                              </small>
                            </div>
                            {isContestActive(contest) && (
                              <span className="badge bg-success">Active</span>
                            )}
                          </div>
                          {contest.startDate && (
                            <small className="text-muted d-block mb-1">
                              <i className="fas fa-calendar-alt me-1"></i>
                              Starts: {new Date(contest.startDate).toLocaleDateString()}
                            </small>
                          )}
                          {contest.endDate && (
                            <small className="text-muted d-block mb-2">
                              <i className="fas fa-clock me-1"></i>
                              Ends: {new Date(contest.endDate).toLocaleDateString()}
                            </small>
                          )}
                          {contest.prizes && (
                            <div className="mt-2">
                              <span className="badge bg-warning text-dark">
                                <i className="fas fa-trophy me-1"></i>Prizes Available
                              </span>
                            </div>
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

