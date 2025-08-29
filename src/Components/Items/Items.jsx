import React from "react";
import { imgsArray } from "../ItemsCard/ItemsCard";

export default function Items() {
  return (
    <>
      <div className="items-section">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-gradient"></div>
            <div className="hero-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>
          </div>
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="hero-content">
                  <div className="hero-badge">
                    <div className="badge-icon">
                      <i className="fas fa-shopping-bag"></i>
                    </div>
                    <span>Wedding Collection</span>
                  </div>
                  <h1 className="hero-title">
                    Explore Our <span className="text-gradient">Wedding Items</span>
                  </h1>
                  <p className="hero-description">
                    Discover a curated collection of premium wedding products and accessories.
                    From kitchen essentials to home decor, find everything you need for your new life together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="categories-nav">
                  <ul className="nav nav-pills categories-tabs" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link category-tab active"
                        id="pills-all-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-all"
                        type="button"
                        role="tab"
                        aria-controls="pills-all"
                        aria-selected="true"
                      >
                        <i className="fas fa-th-large me-2"></i>
                        All Items
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link category-tab"
                        id="pills-electronic-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-electronic"
                        type="button"
                        role="tab"
                        aria-controls="pills-electronic"
                        aria-selected="false"
                      >
                        <i className="fas fa-plug me-2"></i>
                        الأجهزة الكهربائية
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link category-tab"
                        id="pills-store-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-store"
                        type="button"
                        role="tab"
                        aria-controls="pills-store"
                        aria-selected="false"
                      >
                        <i className="fas fa-box me-2"></i>
                        الخزين
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link category-tab"
                        id="pills-complited-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-complited"
                        type="button"
                        role="tab"
                        aria-controls="pills-complited"
                        aria-selected="false"
                      >
                        <i className="fas fa-star me-2"></i>
                        الكماليات
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link category-tab"
                        id="pills-clothing-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-clothing"
                        type="button"
                        role="tab"
                        aria-controls="pills-clothing"
                        aria-selected="false"
                      >
                        <i className="fas fa-couch me-2"></i>
                        المفروشات
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link category-tab"
                        id="pills-bathThings-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-bathThings"
                        type="button"
                        role="tab"
                        aria-controls="pills-bathThings"
                        aria-selected="false"
                      >
                        <i className="fas fa-bath me-2"></i>
                        مستلزمات الحمام
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="gallery-section">
          <div className="container">
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-all"
                role="tabpanel"
                aria-labelledby="pills-all-tab"
                tabIndex="0"
              >
                <div className="gallery-grid">
                  {imgsArray
                    .filter((x) => x.title === "أدوات المطبخ")
                    .map((img, index) => (
                      <div key={index} className="gallery-item">
                        <div className="gallery-card">
                          <img className="gallery-image" src={img.imgSrc} alt={img.title} />
                          <div className="gallery-overlay">
                            <div className="gallery-actions">
                              <button className="btn btn-main btn-sm">
                                <i className="fas fa-eye me-1"></i>
                                View Details
                              </button>
                              <button className="btn btn-outline-main btn-sm">
                                <i className="fas fa-heart me-1"></i>
                                Add to Wishlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="pills-electronic"
                role="tabpanel"
                aria-labelledby="pills-electronic-tab"
                tabIndex="0"
              >
                <div className="gallery-grid">
                  {imgsArray
                    .filter((x) => x.title === "الأجهزة الكهربائية")
                    .map((img, index) => (
                      <div key={index} className="gallery-item">
                        <div className="gallery-card">
                          <img className="gallery-image" src={img.imgSrc} alt={img.title} />
                          <div className="gallery-overlay">
                            <div className="gallery-actions">
                              <button className="btn btn-main btn-sm">
                                <i className="fas fa-eye me-1"></i>
                                View Details
                              </button>
                              <button className="btn btn-outline-main btn-sm">
                                <i className="fas fa-heart me-1"></i>
                                Add to Wishlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="pills-store"
                role="tabpanel"
                aria-labelledby="pills-store-tab"
                tabIndex="0"
              >
                <div className="gallery-grid">
                  {imgsArray
                    .filter((x) => x.title === "الخزين")
                    .map((img, index) => (
                      <div key={index} className="gallery-item">
                        <div className="gallery-card">
                          <img className="gallery-image" src={img.imgSrc} alt={img.title} />
                          <div className="gallery-overlay">
                            <div className="gallery-actions">
                              <button className="btn btn-main btn-sm">
                                <i className="fas fa-eye me-1"></i>
                                View Details
                              </button>
                              <button className="btn btn-outline-main btn-sm">
                                <i className="fas fa-heart me-1"></i>
                                Add to Wishlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="pills-complited"
                role="tabpanel"
                aria-labelledby="pills-complited-tab"
                tabIndex="0"
              >
                <div className="gallery-grid">
                  {imgsArray
                    .filter((x) => x.title === "الكماليات")
                    .map((img, index) => (
                      <div key={index} className="gallery-item">
                        <div className="gallery-card">
                          <img className="gallery-image" src={img.imgSrc} alt={img.title} />
                          <div className="gallery-overlay">
                            <div className="gallery-actions">
                              <button className="btn btn-main btn-sm">
                                <i className="fas fa-eye me-1"></i>
                                View Details
                              </button>
                              <button className="btn btn-outline-main btn-sm">
                                <i className="fas fa-heart me-1"></i>
                                Add to Wishlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="pills-clothing"
                role="tabpanel"
                aria-labelledby="pills-clothing-tab"
                tabIndex="0"
              >
                <div className="gallery-grid">
                  {imgsArray
                    .filter((x) => x.title === "المفروشات")
                    .map((img, index) => (
                      <div key={index} className="gallery-item">
                        <div className="gallery-card">
                          <img className="gallery-image" src={img.imgSrc} alt={img.title} />
                          <div className="gallery-overlay">
                            <div className="gallery-actions">
                              <button className="btn btn-main btn-sm">
                                <i className="fas fa-eye me-1"></i>
                                View Details
                              </button>
                              <button className="btn btn-outline-main btn-sm">
                                <i className="fas fa-heart me-1"></i>
                                Add to Wishlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="pills-bathThings"
                role="tabpanel"
                aria-labelledby="pills-bathThings-tab"
                tabIndex="0"
              >
                <div className="gallery-grid">
                  {imgsArray
                    .filter((x) => x.title === "مستلزمات الحمام")
                    .map((img, index) => (
                      <div key={index} className="gallery-item">
                        <div className="gallery-card">
                          <img className="gallery-image" src={img.imgSrc} alt={img.title} />
                          <div className="gallery-overlay">
                            <div className="gallery-actions">
                              <button className="btn btn-main btn-sm">
                                <i className="fas fa-eye me-1"></i>
                                View Details
                              </button>
                              <button className="btn btn-outline-main btn-sm">
                                <i className="fas fa-heart me-1"></i>
                                Add to Wishlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="cta-content">
                  <h2 className="cta-title">Ready to Shop for Your Wedding?</h2>
                  <p className="cta-description">
                    Visit our comprehensive store to find everything you need for your perfect wedding and new life together.
                  </p>
                  <div className="cta-buttons">
                    <a href="https://www.our-bride.store" className="btn btn-main cta-btn">
                      <i className="fas fa-store me-2"></i>
                      Visit Our Store
                    </a>
                    <a href="#" className="btn btn-outline-main cta-btn">
                      <i className="fas fa-download me-2"></i>
                      Download App
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
