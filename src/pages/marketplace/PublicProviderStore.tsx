import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicProviderService } from "@/services/publicProviderService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import MainButton from '@/SimpleComponent/MainButton/MainButton';

export default function PublicProviderStore() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const data = await publicProviderService.getStore(providerId, currentPage, pageSize);
        setStoreData(data);
      } catch (err) {
        setError(err.message || "Failed to load store");
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchStore();
    }
  }, [providerId, currentPage, pageSize]);

  const handleViewProfile = () => {
    navigate(`/marketplace/providers/${providerId}`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !storeData) {
    return (
      <div className="provider-store-section">
        <section className="hero-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="error-content">
                  <i className="fas fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#f14836", marginBottom: "20px" }}></i>
                  <h2 className="section-title">Store Not Found</h2>
                  <p className="section-description">
                    {error || "The store you're looking for doesn't exist or is not publicly available."}
                  </p>
                  <MainButton
                    title="Go to Home"
                    link="/"
                    classes="btn-main"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const totalPages = Math.ceil((storeData.totalProducts || 0) / pageSize);

  return (
    <div className="provider-store-section">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          {storeData.providerPublicBannerImageUrl ? (
            <div
              className="provider-banner"
              style={{
                backgroundImage: `url(${storeData.providerPublicBannerImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "300px",
                width: "100%",
                position: "relative",
              }}
            >
              <div className="banner-overlay" style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)",
              }}></div>
            </div>
          ) : (
            <div className="hero-gradient"></div>
          )}
        </div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="store-header">
                <div className="store-logo-container">
                  {storeData.providerPublicLogoImageUrl ? (
                    <img
                      src={storeData.providerPublicLogoImageUrl}
                      alt={storeData.providerNameEn || storeData.providerNameAr}
                      className="store-logo"
                    />
                  ) : (
                    <div className="store-logo-placeholder">
                      <i className="fas fa-store"></i>
                    </div>
                  )}
                </div>
                <div className="store-header-content">
                  <div className="store-title-section">
                    <h1 className="store-name">
                      {storeData.providerNameEn || storeData.providerNameAr}
                      {storeData.providerIsVerified && (
                        <i className="fas fa-check-circle verified-badge" title="Verified Provider"></i>
                      )}
                    </h1>
                    {(storeData.providerDescriptionEn || storeData.providerDescriptionAr) && (
                      <p className="store-description">
                        {storeData.providerDescriptionEn || storeData.providerDescriptionAr}
                      </p>
                    )}
                    {storeData.providerShortAddress && (
                      <p className="store-location">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {storeData.providerShortAddress}
                      </p>
                    )}
                  </div>
                  <div className="store-stats">
                    <div className="stat-item">
                      <div className="stat-number">{storeData.totalProducts || 0}</div>
                      <div className="stat-label">Products</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">{storeData.totalProductsInStock || 0}</div>
                      <div className="stat-label">In Stock</div>
                    </div>
                    {storeData.totalProductsOnSale > 0 && (
                      <div className="stat-item">
                        <div className="stat-number text-main">{storeData.totalProductsOnSale}</div>
                        <div className="stat-label">On Sale</div>
                      </div>
                    )}
                    {storeData.providerRate && (
                      <div className="stat-item">
                        <div className="stat-number">
                          <i className="fas fa-star text-main"></i> {storeData.providerRate.toFixed(1)}
                        </div>
                        <div className="stat-label">Rating</div>
                      </div>
                    )}
                  </div>
                  <div className="store-actions" style={{ marginTop: "24px" }}>
                    <button
                      onClick={handleViewProfile}
                      className="btn btn-outline-main me-2"
                    >
                      <i className="fas fa-user me-2"></i>
                      View Profile
                    </button>
                    {storeData.providerPhoneNumber && (
                      <a
                        href={`tel:${storeData.providerPhoneNumber}`}
                        className="btn btn-main"
                      >
                        <i className="fas fa-phone me-2"></i>
                        Contact
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E-commerce Data Section */}
      <section className="ecommerce-section" style={{ padding: "60px 0", background: "white" }}>
        <div className="container">
          <div className="row">
            {/* Provider Categories */}
            {storeData.providerCategories && storeData.providerCategories.length > 0 && (
              <div className="col-lg-12" style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px", color: "#2d2d2d" }}>
                  <i className="fas fa-th-large me-2 text-main"></i>
                  Product Categories
                </h3>
                <div className="provider-categories-grid" style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "20px",
                }}>
                  {storeData.providerCategories
                    .filter(cat => cat.isActive)
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((category) => (
                      <div
                        key={category.id}
                        className="provider-category-card"
                        style={{
                          background: "white",
                          padding: "24px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          border: "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.borderColor = "var(--main)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.borderColor = "transparent";
                        }}
                      >
                        {category.customImageUrl && (
                          <img
                            src={category.customImageUrl}
                            alt={category.customName || "Category"}
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              marginBottom: "16px",
                            }}
                          />
                        )}
                        <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "8px", color: "#2d2d2d" }}>
                          {category.customName || `Category ${category.categoryId}`}
                        </h4>
                        {category.customDescription && (
                          <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: "1.5" }}>
                            {category.customDescription}
                          </p>
                        )}
                        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                          {category.status === 1 && (
                            <span style={{
                              padding: "4px 12px",
                              background: "#d4edda",
                              color: "#155724",
                              borderRadius: "20px",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                            }}>
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Provider Product Tags */}
            {storeData.providerProductTags && storeData.providerProductTags.length > 0 && (
              <div className="col-lg-12" style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px", color: "#2d2d2d" }}>
                  <i className="fas fa-tags me-2 text-main"></i>
                  Product Tags
                </h3>
                <div className="provider-tags-grid" style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                }}>
                  {storeData.providerProductTags
                    .filter(tag => tag.isActive)
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((tag) => (
                      <div
                        key={tag.id}
                        className="provider-tag-item"
                        style={{
                          padding: "12px 20px",
                          borderRadius: "25px",
                          background: tag.customColor || "var(--main)",
                          color: "white",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        {tag.customIcon && (
                          <i className={tag.customIcon}></i>
                        )}
                        <span>{tag.customName || `Tag ${tag.productTagId}`}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Provider Product Brands */}
            {storeData.providerProductBrands && storeData.providerProductBrands.length > 0 && (
              <div className="col-lg-12" style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px", color: "#2d2d2d" }}>
                  <i className="fas fa-certificate me-2 text-main"></i>
                  Product Brands
                </h3>
                <div className="provider-brands-grid" style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "20px",
                }}>
                  {storeData.providerProductBrands
                    .filter(brand => brand.isActive)
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((brand) => (
                      <div
                        key={brand.id}
                        className="provider-brand-card"
                        style={{
                          background: "white",
                          padding: "20px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                          textAlign: "center",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        {brand.customIcon && (
                          <div style={{ fontSize: "3rem", marginBottom: "12px", color: brand.customColor || "var(--main)" }}>
                            <i className={brand.customIcon}></i>
                          </div>
                        )}
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px", color: "#2d2d2d" }}>
                          {brand.customName || `Brand ${brand.productBrandId}`}
                        </h4>
                        {brand.customDescription && (
                          <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: "1.4" }}>
                            {brand.customDescription}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Provider Product Attributes */}
            {storeData.providerProductAttributes && storeData.providerProductAttributes.length > 0 && (
              <div className="col-lg-12" style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px", color: "#2d2d2d" }}>
                  <i className="fas fa-list-ul me-2 text-main"></i>
                  Product Attributes
                </h3>
                <div className="provider-attributes-grid" style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}>
                  {storeData.providerProductAttributes
                    .filter(attr => attr.isActive)
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((attribute) => (
                      <div
                        key={attribute.id}
                        className="provider-attribute-card"
                        style={{
                          background: "white",
                          padding: "20px",
                          borderRadius: "12px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                          borderLeft: `4px solid ${attribute.isRequired ? "var(--main)" : "#ccc"}`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                          <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#2d2d2d" }}>
                            {attribute.customName || `Attribute ${attribute.productAttributeId}`}
                          </h4>
                          {attribute.isRequired && (
                            <span style={{
                              padding: "4px 8px",
                              background: "#fff3cd",
                              color: "#856404",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                            }}>
                              Required
                            </span>
                          )}
                        </div>
                        {attribute.customDescription && (
                          <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: "1.5" }}>
                            {attribute.customDescription}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" style={{ padding: "80px 0", background: "#f8f9fa" }}>
        <div className="container">
          {/* Categories Filter */}
          {storeData.productsByCategory && Object.keys(storeData.productsByCategory).length > 0 && (
            <div className="categories-filter" style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "20px" }}>
                Browse by Category
              </h3>
              <div className="categories-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}>
                {Object.entries(storeData.productsByCategory).map(([category, count]) => (
                  <div
                    key={category}
                    className="category-card"
                    style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  >
                    <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>
                      {category}
                    </h4>
                    <span style={{ color: "#666", fontSize: "0.9rem" }}>{count} products</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="products-header" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#2d2d2d" }}>
              All Products ({storeData.totalProducts || 0})
            </h2>
          </div>

          {storeData.products && storeData.products.length > 0 ? (
            <>
              <div className="products-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
                marginBottom: "40px",
              }}>
                {storeData.products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    {product.image && (
                      <div className="product-image-container" style={{
                        position: "relative",
                        width: "100%",
                        height: "250px",
                        overflow: "hidden",
                      }}>
                        <img
                          src={product.image}
                          alt={product.nameEn || product.nameAr}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                        />
                        {product.salePrice && (
                          <div className="sale-badge" style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "var(--main)",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                          }}>
                            Sale
                          </div>
                        )}
                        {!product.inStock && (
                          <div className="out-of-stock-overlay" style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "700",
                            fontSize: "1.2rem",
                          }}>
                            Out of Stock
                          </div>
                        )}
                      </div>
                    )}
                    <div className="product-content" style={{ padding: "20px" }}>
                      <h3 style={{
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: "#2d2d2d",
                      }}>
                        {product.nameEn || product.nameAr}
                      </h3>
                      {product.descriptionEn || product.descriptionAr ? (
                        <p style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          marginBottom: "12px",
                          lineHeight: "1.5",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {product.descriptionEn || product.descriptionAr}
                        </p>
                      ) : null}
                      {product.category && (
                        <div style={{
                          fontSize: "0.85rem",
                          color: "#999",
                          marginBottom: "12px",
                        }}>
                          <i className="fas fa-tag me-1"></i>
                          {product.category.nameEn || product.category.name}
                        </div>
                      )}
                      <div className="product-price-section" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "16px",
                      }}>
                        {product.salePrice ? (
                          <>
                            <span style={{
                              fontSize: "1.5rem",
                              fontWeight: "700",
                              color: "var(--main)",
                            }}>
                              {product.salePrice} EGP
                            </span>
                            <span style={{
                              fontSize: "1rem",
                              color: "#999",
                              textDecoration: "line-through",
                            }}>
                              {product.price} EGP
                            </span>
                          </>
                        ) : (
                          <span style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: "var(--main)",
                          }}>
                            {product.price} EGP
                          </span>
                        )}
                      </div>
                      {product.sku && (
                        <div style={{
                          fontSize: "0.8rem",
                          color: "#999",
                          marginBottom: "12px",
                        }}>
                          SKU: {product.sku}
                        </div>
                      )}
                      <button
                        className="btn btn-main"
                        style={{ width: "100%" }}
                        disabled={!product.inStock}
                      >
                        <i className="fas fa-shopping-cart me-2"></i>
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination" style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "40px",
                }}>
                  <button
                    className="btn btn-outline-main"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <i className="fas fa-chevron-left"></i>
                    Previous
                  </button>
                  <span style={{ padding: "0 16px" }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-main"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-products" style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "white",
              borderRadius: "16px",
            }}>
              <i className="fas fa-box-open" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "12px" }}>
                No Products Available
              </h3>
              <p style={{ color: "#666" }}>
                This store doesn't have any products available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Shipping Methods Section */}
      {storeData.providerShippingMethods && storeData.providerShippingMethods.length > 0 && (
        <section className="shipping-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
          <div className="container">
            <h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "32px", color: "#2d2d2d", textAlign: "center" }}>
              <i className="fas fa-truck me-2 text-main"></i>
              Shipping Methods
            </h3>
            <div className="shipping-methods-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}>
              {storeData.providerShippingMethods
                .filter(method => method.isActive)
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map((method) => (
                  <div
                    key={method.id}
                    className="shipping-method-card"
                    style={{
                      background: "white",
                      padding: "24px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                      <div>
                        <h4 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "8px", color: "#2d2d2d" }}>
                          {method.customName || method.shippingMethodName}
                        </h4>
                        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "4px" }}>
                          {method.customDescription || method.shippingMethodDescription || "Shipping method"}
                        </p>
                      </div>
                      {method.status === 1 && (
                        <span style={{
                          padding: "6px 12px",
                          background: "#d4edda",
                          color: "#155724",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}>
                          Active
                        </span>
                      )}
                    </div>
                    {method.shippingZones && method.shippingZones.length > 0 && (
                      <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #eee" }}>
                        <h5 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "12px", color: "#2d2d2d" }}>
                          <i className="fas fa-map-marked-alt me-2 text-main"></i>
                          Shipping Zones ({method.shippingZones.length})
                        </h5>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {method.shippingZones.map((zone, index) => (
                            <span
                              key={index}
                              style={{
                                padding: "4px 10px",
                                background: "#f8f9fa",
                                borderRadius: "4px",
                                fontSize: "0.85rem",
                                color: "#666",
                              }}
                            >
                              {zone.zoneName || `Zone ${index + 1}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Provider Info Footer */}
      <section className="provider-info-footer" style={{ padding: "60px 0", background: "white" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "20px" }}>
                About {storeData.providerNameEn || storeData.providerNameAr}
              </h3>
              {(storeData.providerDescriptionEn || storeData.providerDescriptionAr) && (
                <p style={{ color: "#666", lineHeight: "1.7", marginBottom: "24px" }}>
                  {storeData.providerDescriptionEn || storeData.providerDescriptionAr}
                </p>
              )}
              {storeData.providerAddress && (
                <div style={{ marginBottom: "16px" }}>
                  <i className="fas fa-map-marker-alt text-main me-2"></i>
                  <span>
                    {storeData.providerAddress.street}, {storeData.providerAddress.city}, {storeData.providerAddress.country}
                  </span>
                </div>
              )}
              {storeData.providerPhoneNumber && (
                <div style={{ marginBottom: "16px" }}>
                  <i className="fas fa-phone text-main me-2"></i>
                  <a href={`tel:${storeData.providerPhoneNumber}`} style={{ color: "#333", textDecoration: "none" }}>
                    {storeData.providerPhoneNumber}
                  </a>
                </div>
              )}
              {(storeData.totalViews !== undefined || storeData.totalFollowers !== undefined) && (
                <div style={{ marginTop: "24px", display: "flex", gap: "24px" }}>
                  {storeData.totalViews !== undefined && (
                    <div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--main)" }}>
                        {storeData.totalViews}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>Total Views</div>
                    </div>
                  )}
                  {storeData.totalFollowers !== undefined && (
                    <div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--main)" }}>
                        {storeData.totalFollowers}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>Followers</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="col-lg-6">
              {storeData.providerLinks && storeData.providerLinks.length > 0 && (
                <>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "20px" }}>
                    Follow Us
                  </h3>
                  <div className="links-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "12px",
                  }}>
                    {storeData.providerLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-main"
                        style={{ textAlign: "center" }}
                      >
                        <i className={`fab fa-${link.type.toLowerCase()} me-2`}></i>
                        {link.type}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


