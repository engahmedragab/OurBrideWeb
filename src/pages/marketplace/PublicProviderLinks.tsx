import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicProviderService } from "@/services/publicProviderService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import MainButton from '@/SimpleComponent/MainButton/MainButton';

export default function PublicProviderLinks() {
  const { id, code, slug } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedLinks, setGroupedLinks] = useState({});

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        let data;

        if (id) {
          data = await publicProviderService.getProfileById(id);
        } else if (code) {
          data = await publicProviderService.getProfileByCode(code);
        } else if (slug) {
          data = await publicProviderService.getProfileBySlug(slug);
        } else {
          throw new Error("No identifier provided");
        }

        setProvider(data);

        // Group links by category
        if (data.links && data.links.length > 0) {
          const grouped = {};
          data.links.forEach((link) => {
            const category = link.category || "Other";
            if (!grouped[category]) {
              grouped[category] = [];
            }
            grouped[category].push(link);
          });
          setGroupedLinks(grouped);
        }
      } catch (err) {
        setError(err.message || "Failed to load provider links");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id, code, slug]);

  const getLinkIcon = (link) => {
    const type = (link.type || "").toLowerCase();
    const url = (link.url || "").toLowerCase();

    // Social media platforms
    if (type.includes("facebook") || url.includes("facebook")) {
      return "fab fa-facebook";
    }
    if (type.includes("instagram") || url.includes("instagram")) {
      return "fab fa-instagram";
    }
    if (type.includes("twitter") || url.includes("twitter") || url.includes("x.com")) {
      return "fab fa-twitter";
    }
    if (type.includes("linkedin") || url.includes("linkedin")) {
      return "fab fa-linkedin";
    }
    if (type.includes("youtube") || url.includes("youtube")) {
      return "fab fa-youtube";
    }
    if (type.includes("tiktok") || url.includes("tiktok")) {
      return "fab fa-tiktok";
    }
    if (type.includes("snapchat") || url.includes("snapchat")) {
      return "fab fa-snapchat";
    }
    if (type.includes("whatsapp") || url.includes("whatsapp")) {
      return "fab fa-whatsapp";
    }
    if (type.includes("telegram") || url.includes("telegram")) {
      return "fab fa-telegram";
    }
    if (type.includes("pinterest") || url.includes("pinterest")) {
      return "fab fa-pinterest";
    }
    if (type.includes("github") || url.includes("github")) {
      return "fab fa-github";
    }
    if (type.includes("website") || type.includes("web") || url.includes("http")) {
      return "fas fa-globe";
    }
    if (type.includes("email") || url.includes("mailto")) {
      return "fas fa-envelope";
    }
    if (type.includes("phone") || url.includes("tel:")) {
      return "fas fa-phone";
    }
    if (type.includes("location") || url.includes("maps") || url.includes("google.com/maps")) {
      return "fas fa-map-marker-alt";
    }

    // Default icon
    return "fas fa-link";
  };

  const getLinkColor = (link) => {
    const type = (link.type || "").toLowerCase();
    const url = (link.url || "").toLowerCase();

    if (type.includes("facebook") || url.includes("facebook")) {
      return "#1877F2";
    }
    if (type.includes("instagram") || url.includes("instagram")) {
      return "#E4405F";
    }
    if (type.includes("twitter") || url.includes("twitter") || url.includes("x.com")) {
      return "#1DA1F2";
    }
    if (type.includes("linkedin") || url.includes("linkedin")) {
      return "#0077B5";
    }
    if (type.includes("youtube") || url.includes("youtube")) {
      return "#FF0000";
    }
    if (type.includes("tiktok") || url.includes("tiktok")) {
      return "#000000";
    }
    if (type.includes("whatsapp") || url.includes("whatsapp")) {
      return "#25D366";
    }
    if (type.includes("telegram") || url.includes("telegram")) {
      return "#0088cc";
    }
    if (type.includes("pinterest") || url.includes("pinterest")) {
      return "#BD081C";
    }
    if (type.includes("email") || url.includes("mailto")) {
      return "#EA4335";
    }
    if (type.includes("phone") || url.includes("tel:")) {
      return "#34A853";
    }

    return "var(--main)";
  };

  const handleLinkClick = (link) => {
    // Track click if needed
    if (link.trackClicks) {
      // You can add analytics tracking here
      console.log("Link clicked:", link.url);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !provider) {
    return (
      <div className="provider-links-section">
        <section className="hero-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="error-content">
                  <i className="fas fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#f14836", marginBottom: "20px" }}></i>
                  <h2 className="section-title">Provider Not Found</h2>
                  <p className="section-description">
                    {error || "The provider links page you're looking for doesn't exist or is not publicly available."}
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

  if (!provider.links || provider.links.length === 0) {
    return (
      <div className="provider-links-section">
        <section className="hero-section">
          <div className="hero-background">
            {provider.publicBannerImageUrl ? (
              <div
                className="provider-banner"
                style={{
                  backgroundImage: `url(${provider.publicBannerImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "400px",
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
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="provider-header-minimal">
                  <div className="provider-logo-container">
                    {provider.publicLogoImageUrl ? (
                      <img
                        src={provider.publicLogoImageUrl}
                        alt={provider.nameEn || provider.nameAr}
                        className="provider-logo"
                      />
                    ) : (
                      <div className="provider-logo-placeholder">
                        <i className="fas fa-store"></i>
                      </div>
                    )}
                  </div>
                  <h1 className="provider-name">
                    {provider.nameEn || provider.nameAr}
                    {provider.isVerified && (
                      <i className="fas fa-check-circle verified-badge" title="Verified Provider"></i>
                    )}
                  </h1>
                  {provider.descriptionEn || provider.descriptionAr ? (
                    <p className="provider-description">
                      {provider.descriptionEn || provider.descriptionAr}
                    </p>
                  ) : null}
                </div>
                <div className="no-links-message" style={{
                  background: "white",
                  padding: "60px 40px",
                  borderRadius: "20px",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                  marginTop: "40px",
                }}>
                  <i className="fas fa-link" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "12px" }}>
                    No Links Available
                  </h3>
                  <p style={{ color: "#666" }}>
                    This provider hasn't added any links yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="provider-links-section">
      {/* Hero Section with Banner */}
      <section className="hero-section">
        <div className="hero-background">
          {provider.publicBannerImageUrl ? (
            <div
              className="provider-banner"
              style={{
                backgroundImage: `url(${provider.publicBannerImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "400px",
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
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="provider-header-minimal">
                <div className="provider-logo-container">
                  {provider.publicLogoImageUrl ? (
                    <img
                      src={provider.publicLogoImageUrl}
                      alt={provider.nameEn || provider.nameAr}
                      className="provider-logo"
                    />
                  ) : (
                    <div className="provider-logo-placeholder">
                      <i className="fas fa-store"></i>
                    </div>
                  )}
                </div>
                <h1 className="provider-name">
                  {provider.nameEn || provider.nameAr}
                  {provider.isVerified && (
                    <i className="fas fa-check-circle verified-badge" title="Verified Provider"></i>
                  )}
                </h1>
                {provider.descriptionEn || provider.descriptionAr ? (
                  <p className="provider-description">
                    {provider.descriptionEn || provider.descriptionAr}
                  </p>
                ) : null}
                {provider.shortAddress && (
                  <p className="provider-location">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {provider.shortAddress}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="links-section" style={{ padding: "60px 0", background: "#f8f9fa", minHeight: "60vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Links by Category */}
              {Object.keys(groupedLinks).length > 0 ? (
                Object.entries(groupedLinks).map(([category, links]) => (
                  <div key={category} className="link-category-group" style={{ marginBottom: "40px" }}>
                    {category !== "Other" && category && (
                      <h2 className="category-title" style={{
                        fontSize: "1.3rem",
                        fontWeight: "700",
                        color: "#2d2d2d",
                        marginBottom: "24px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}>
                        <i className="fas fa-folder text-main"></i>
                        {category}
                      </h2>
                    )}
                    <div className="links-grid">
                      {links.map((link) => {
                        const icon = getLinkIcon(link);
                        const color = getLinkColor(link);
                        const displayName = link.displayName || link.nameEn || link.nameAr || link.type || "Link";
                        const displayDescription = link.displayDescription || link.descriptionEn || link.descriptionAr || "";
                        const thumbnailUrl = link.thumbnailUrl || link.urlSubnailEn || link.urlSubnailAr;

                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target={link.openInNewTab !== false ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="link-card"
                            onClick={() => handleLinkClick(link)}
                            style={{
                              display: "block",
                              background: "white",
                              borderRadius: "16px",
                              padding: "20px",
                              textDecoration: "none",
                              color: "#333",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                              transition: "all 0.3s ease",
                              marginBottom: "16px",
                              border: "2px solid transparent",
                              position: "relative",
                              overflow: "hidden",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-4px)";
                              e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                              e.currentTarget.style.borderColor = color;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                              e.currentTarget.style.borderColor = "transparent";
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              {/* Link Icon/Thumbnail */}
                              <div
                                className="link-icon-container"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "12px",
                                  background: thumbnailUrl
                                    ? `url(${thumbnailUrl}) center/cover`
                                    : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {!thumbnailUrl && (
                                  <i className={icon} style={{ fontSize: "1.5rem", color: "white" }}></i>
                                )}
                              </div>

                              {/* Link Content */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                  <h3 style={{
                                    fontSize: "1.1rem",
                                    fontWeight: "700",
                                    color: "#2d2d2d",
                                    margin: 0,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}>
                                    {displayName}
                                  </h3>
                                  {link.isVerified && (
                                    <i className="fas fa-check-circle" style={{ color: "#4CAF50", fontSize: "0.9rem" }} title="Verified"></i>
                                  )}
                                  {link.isBroken && (
                                    <i className="fas fa-exclamation-triangle" style={{ color: "#f14836", fontSize: "0.9rem" }} title="Broken Link"></i>
                                  )}
                                </div>
                                {displayDescription && (
                                  <p style={{
                                    fontSize: "0.9rem",
                                    color: "#666",
                                    margin: 0,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    lineHeight: "1.4",
                                  }}>
                                    {displayDescription}
                                  </p>
                                )}
                                {link.tags && (
                                  <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                    {link.tags.split(",").slice(0, 3).map((tag, idx) => (
                                      <span
                                        key={idx}
                                        style={{
                                          fontSize: "0.75rem",
                                          padding: "2px 8px",
                                          background: "#f0f0f0",
                                          borderRadius: "12px",
                                          color: "#666",
                                        }}
                                      >
                                        {tag.trim()}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Arrow Icon */}
                              <div style={{ flexShrink: 0 }}>
                                <i className="fas fa-chevron-right" style={{ color: "#999", fontSize: "1rem" }}></i>
                              </div>
                            </div>

                            {/* Link Stats (if available) */}
                            {(link.clickCount > 0 || link.viewCount > 0) && (
                              <div style={{
                                marginTop: "12px",
                                paddingTop: "12px",
                                borderTop: "1px solid #eee",
                                display: "flex",
                                gap: "16px",
                                fontSize: "0.8rem",
                                color: "#999",
                              }}>
                                {link.viewCount > 0 && (
                                  <span>
                                    <i className="fas fa-eye me-1"></i>
                                    {link.viewCount} views
                                  </span>
                                )}
                                {link.clickCount > 0 && (
                                  <span>
                                    <i className="fas fa-mouse-pointer me-1"></i>
                                    {link.clickCount} clicks
                                  </span>
                                )}
                              </div>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="links-grid">
                  {provider.links.map((link) => {
                    const icon = getLinkIcon(link);
                    const color = getLinkColor(link);
                    const displayName = link.displayName || link.nameEn || link.nameAr || link.type || "Link";
                    const displayDescription = link.displayDescription || link.descriptionEn || link.descriptionAr || "";
                    const thumbnailUrl = link.thumbnailUrl || link.urlSubnailEn || link.urlSubnailAr;

                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target={link.openInNewTab !== false ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="link-card"
                        onClick={() => handleLinkClick(link)}
                        style={{
                          display: "block",
                          background: "white",
                          borderRadius: "16px",
                          padding: "20px",
                          textDecoration: "none",
                          color: "#333",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.3s ease",
                          marginBottom: "16px",
                          border: "2px solid transparent",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                          e.currentTarget.style.borderColor = color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                          e.currentTarget.style.borderColor = "transparent";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <div
                            className="link-icon-container"
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "12px",
                              background: thumbnailUrl
                                ? `url(${thumbnailUrl}) center/cover`
                                : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            {!thumbnailUrl && (
                              <i className={icon} style={{ fontSize: "1.5rem", color: "white" }}></i>
                            )}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <h3 style={{
                                fontSize: "1.1rem",
                                fontWeight: "700",
                                color: "#2d2d2d",
                                margin: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}>
                                {displayName}
                              </h3>
                              {link.isVerified && (
                                <i className="fas fa-check-circle" style={{ color: "#4CAF50", fontSize: "0.9rem" }} title="Verified"></i>
                              )}
                              {link.isBroken && (
                                <i className="fas fa-exclamation-triangle" style={{ color: "#f14836", fontSize: "0.9rem" }} title="Broken Link"></i>
                              )}
                            </div>
                            {displayDescription && (
                              <p style={{
                                fontSize: "0.9rem",
                                color: "#666",
                                margin: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                lineHeight: "1.4",
                              }}>
                                {displayDescription}
                              </p>
                            )}
                            {link.tags && (
                              <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                {link.tags.split(",").slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      fontSize: "0.75rem",
                                      padding: "2px 8px",
                                      background: "#f0f0f0",
                                      borderRadius: "12px",
                                      color: "#666",
                                    }}
                                  >
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div style={{ flexShrink: 0 }}>
                            <i className="fas fa-chevron-right" style={{ color: "#999", fontSize: "1rem" }}></i>
                          </div>
                        </div>

                        {(link.clickCount > 0 || link.viewCount > 0) && (
                          <div style={{
                            marginTop: "12px",
                            paddingTop: "12px",
                            borderTop: "1px solid #eee",
                            display: "flex",
                            gap: "16px",
                            fontSize: "0.8rem",
                            color: "#999",
                          }}>
                            {link.viewCount > 0 && (
                              <span>
                                <i className="fas fa-eye me-1"></i>
                                {link.viewCount} views
                              </span>
                            )}
                            {link.clickCount > 0 && (
                              <span>
                                <i className="fas fa-mouse-pointer me-1"></i>
                                {link.clickCount} clicks
                              </span>
                            )}
                          </div>
                        )}
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Back to Profile Button */}
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <button
                  onClick={() => {
                    if (id) {
                      navigate(`/marketplace/providers/${id}`);
                    } else if (code) {
                      navigate(`/marketplace/providers/code/${code}`);
                    } else if (slug) {
                      navigate(`/marketplace/providers/slug/${slug}`);
                    } else {
                      navigate("/");
                    }
                  }}
                  className="btn btn-outline-main"
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


