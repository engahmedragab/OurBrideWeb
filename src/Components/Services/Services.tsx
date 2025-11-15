import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serviceService } from "../../services/apiService";
import LoadingScreen from '../LoadingScreen/LoadingScreen';

export default function Services() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Search filters
    const [searchParams, setSearchParams] = useState({
        query: "",
        serviceClass: "",
        serviceStatus: "",
        serviceType: "",
        isOurBrideService: false,
        hasInstallment: false,
        hasPackages: false,
        sortBy: "name",
        sortOrder: "asc",
    });

    useEffect(() => {
        fetchServices();
    }, [currentPage, searchParams]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const params = {
                ...searchParams,
                pageNumber: currentPage,
                pageSize: pageSize,
            };

            // Remove empty values
            Object.keys(params).forEach(key => {
                if (params[key] === "" || params[key] === false) {
                    delete params[key];
                }
            });

            const response = await serviceService.search(params);
            const data = response.data || response;

            if (data.services) {
                setServices(data.services);
                setTotalPages(data.totalPages || 1);
                setTotalCount(data.totalCount || 0);
            } else {
                setServices(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            setError(err.message || "Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleServiceClick = (serviceId) => {
        navigate(`/services/${serviceId}`);
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="rating-stars">
                {[...Array(fullStars)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                ))}
                {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
                {[...Array(emptyStars)].map((_, i) => (
                    <i key={`empty-${i}`} className="far fa-star"></i>
                ))}
            </div>
        );
    };

    if (loading && services.length === 0) {
        return <LoadingScreen />;
    }

    return (
        <div className="services-section">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                </div>
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <div className="hero-content">
                                <h1 className="hero-title">
                                    Wedding <span className="text-gradient">Services</span>
                                </h1>
                                <p className="hero-description">
                                    Search and discover the perfect wedding services for your special day.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filters Section */}
            <section className="filters-section" style={{ padding: "40px 0", background: "white" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="search-filters-card" style={{
                                background: "#f8f9fa",
                                padding: "24px",
                                borderRadius: "12px",
                            }}>
                                <div className="row">
                                    <div className="col-lg-4 mb-3">
                                        <input
                                            type="text"
                                            name="query"
                                            className="form-control"
                                            placeholder="Search services..."
                                            value={searchParams.query}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-2 mb-3">
                                        <select
                                            name="sortBy"
                                            className="form-control"
                                            value={searchParams.sortBy}
                                            onChange={handleInputChange}
                                        >
                                            <option value="name">Name</option>
                                            <option value="rate">Rating</option>
                                            <option value="createdAt">Date</option>
                                            <option value="price">Price</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-2 mb-3">
                                        <select
                                            name="sortOrder"
                                            className="form-control"
                                            value={searchParams.sortOrder}
                                            onChange={handleInputChange}
                                        >
                                            <option value="asc">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-2 mb-3">
                                        <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                name="hasPackages"
                                                checked={searchParams.hasPackages}
                                                onChange={handleInputChange}
                                                style={{ marginRight: "8px" }}
                                            />
                                            Has Packages
                                        </label>
                                    </div>
                                    <div className="col-lg-2 mb-3">
                                        <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                name="hasInstallment"
                                                checked={searchParams.hasInstallment}
                                                onChange={handleInputChange}
                                                style={{ marginRight: "8px" }}
                                            />
                                            Has Installment
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="services-grid-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                <div className="container">
                    {totalCount > 0 && (
                        <div className="row mb-4">
                            <div className="col-lg-12">
                                <p style={{ color: "#666" }}>
                                    Found {totalCount} service{totalCount !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    )}

                    {error ? (
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <div className="error-content">
                                    <i className="fas fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#f14836", marginBottom: "20px" }}></i>
                                    <h3>Error Loading Services</h3>
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    ) : services.length > 0 ? (
                        <>
                            <div className="row">
                                {services.map((service) => (
                                    <div key={service.id} className="col-lg-4 col-md-6 mb-4">
                                        <div
                                            className="service-card"
                                            style={{
                                                background: "white",
                                                borderRadius: "16px",
                                                overflow: "hidden",
                                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                height: "100%",
                                            }}
                                            onClick={() => handleServiceClick(service.id)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                            }}
                                        >
                                            {service.imageUrl && (
                                                <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
                                                    <img
                                                        src={service.imageUrl}
                                                        alt={service.nameEn || service.nameAr}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div style={{ padding: "24px" }}>
                                                <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "12px" }}>
                                                    {service.nameEn || service.nameAr}
                                                </h4>
                                                {(service.descriptionEn || service.descriptionAr) && (
                                                    <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "16px", lineHeight: "1.5" }}>
                                                        {(service.descriptionEn || service.descriptionAr).substring(0, 100)}...
                                                    </p>
                                                )}
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                                    {service.buyPrice && (
                                                        <div>
                                                            <span style={{ fontSize: "0.85rem", color: "#999" }}>Buy: </span>
                                                            <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--main)" }}>
                                                                {service.buyPrice} EGP
                                                            </span>
                                                        </div>
                                                    )}
                                                    {service.rentPrice && (
                                                        <div>
                                                            <span style={{ fontSize: "0.85rem", color: "#999" }}>Rent: </span>
                                                            <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--main)" }}>
                                                                {service.rentPrice} EGP
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {service.rate && (
                                                    <div style={{ marginBottom: "12px" }}>
                                                        {renderStars(service.rate)}
                                                        <span style={{ marginLeft: "8px" }}>({service.rate.toFixed(1)})</span>
                                                    </div>
                                                )}
                                                {service.provider && (
                                                    <div style={{ fontSize: "0.85rem", color: "#999", marginTop: "12px" }}>
                                                        <i className="fas fa-store me-1"></i>
                                                        {service.provider.nameEn || service.provider.nameAr}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="row justify-content-center" style={{ marginTop: "40px" }}>
                                    <div className="col-lg-12">
                                        <div className="pagination" style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "8px",
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
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                                <h3>No Services Found</h3>
                                <p style={{ color: "#666" }}>
                                    Try adjusting your search filters.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

