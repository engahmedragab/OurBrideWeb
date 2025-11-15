import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';

export default function GuiderHub() {
  return (
    <div className="container my-5">
      <SEOHead
        title="OurBride Guider - Wedding Planning Guides & Resources"
        description="Comprehensive wedding planning guides, tips, and resources to help you plan your perfect wedding"
        keywords="wedding guides, wedding planning tips, wedding resources, wedding checklist, wedding planning guide"
        url={`${window.location.origin}`}
      />
      
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 mb-3">Wedding Planning Guides</h1>
          <p className="lead">Your comprehensive resource for planning the perfect wedding</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-3">
            <div className="card" style={{ width: '18rem' }}>
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-book me-2"></i>Guides
                </h5>
                <p className="card-text">Comprehensive wedding planning guides</p>
                <Link to="/guides" className="btn btn-primary">
                  View Guides
                </Link>
              </div>
            </div>

            <div className="card" style={{ width: '18rem' }}>
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-calendar-check me-2"></i>Timeline
                </h5>
                <p className="card-text">Wedding planning timeline and checklist</p>
                <Link to="/timeline" className="btn btn-primary">
                  View Timeline
                </Link>
              </div>
            </div>

            <div className="card" style={{ width: '18rem' }}>
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-dollar-sign me-2"></i>Budget
                </h5>
                <p className="card-text">Budget planning and cost guides</p>
                <Link to="/budget" className="btn btn-primary">
                  View Budget Guide
                </Link>
              </div>
            </div>

            <div className="card" style={{ width: '18rem' }}>
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-venus-mars me-2"></i>Vendors
                </h5>
                <p className="card-text">How to choose and work with vendors</p>
                <Link to="/vendors" className="btn btn-primary">
                  View Vendor Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Sections */}
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">More Resources Coming Soon</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Venue Selection</h5>
                  <p className="card-text text-muted">Coming soon...</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Catering Guide</h5>
                  <p className="card-text text-muted">Coming soon...</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Photography Tips</h5>
                  <p className="card-text text-muted">Coming soon...</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Invitation Guide</h5>
                  <p className="card-text text-muted">Coming soon...</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Decor & Styling</h5>
                  <p className="card-text text-muted">Coming soon...</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Music & Entertainment</h5>
                  <p className="card-text text-muted">Coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

