import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import productService from "@/services/productService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import MainButton from '@/SimpleComponent/MainButton/MainButton';

export default function ProductDetails() {
    const { productId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const params = {};
            const providerId = searchParams.get('providerId');
            const branchId = searchParams.get('branchId');
            const staffId = searchParams.get('staffId');

            if (providerId) params.providerId = providerId;
            if (branchId) params.branchId = branchId;
            if (staffId) params.staffId = staffId;

            const response = await productService.getById(productId, params);
            setProduct(response.data || response);
        } catch (err) {
            setError(err.message || "Failed to load product details");
        } finally {
            setLoading(false);
        }
    };

    const handleProviderClick = (providerId) => {
        navigate(`/marketplace/providers/${providerId}`);
    };

    const renderStars = (rating) => {
        const ratingNum = parseFloat(rating) || 0;
        const fullStars = Math.floor(ratingNum);
        const hasHalfStar = ratingNum % 1 >= 0.5;
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

    if (loading) {
        return <LoadingScreen />;
    }

    if (error || !product) {
        return (
            <div className="product-details-section">
                <section className="hero-section">
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <div className="error-content">
                                    <i className="fas fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#f14836", marginBottom: "20px" }}></i>
                                    <h2 className="section-title">Product Not Found</h2>
                                    <p className="section-description">
                                        {error || "The product you're looking for doesn't exist."}
                                    </p>
                                    <MainButton title="Go to Home" link="/" classes="btn-main" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    const images = product.images || (product.image ? [{ src: product.image }] : []);
    const displayPrice = product.salePrice || product.price || product.amount;
    const regularPrice = product.regularPrice || product.amount;
    const hasDiscount = product.onSale || product.hasDiscount || (product.salePrice && product.salePrice < regularPrice);

    return (
        <div className="product-details-section">
            {/* Product Section */}
            <section className="product-section" style={{ padding: "60px 0", background: "white" }}>
                <div className="container">
                    <div className="row">
                        {/* Product Images */}
                        <div className="col-lg-6">
                            {images.length > 0 ? (
                                <div>
                                    <div style={{
                                        width: "100%",
                                        height: "500px",
                                        marginBottom: "16px",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        background: "#f8f9fa",
                                    }}>
                                        <img
                                            src={images[selectedImageIndex]?.src || images[selectedImageIndex]}
                                            alt={product.name || product.nameEn || product.nameAr}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </div>
                                    {images.length > 1 && (
                                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                            {images.map((img, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        borderRadius: "8px",
                                                        overflow: "hidden",
                                                        cursor: "pointer",
                                                        border: selectedImageIndex === index ? "3px solid var(--main)" : "2px solid #eee",
                                                        transition: "all 0.3s ease",
                                                    }}
                                                >
                                                    <img
                                                        src={img.src || img}
                                                        alt={`Product ${index + 1}`}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{
                                    width: "100%",
                                    height: "500px",
                                    background: "#f8f9fa",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <i className="fas fa-image" style={{ fontSize: "4rem", color: "#ccc" }}></i>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="col-lg-6">
                            <div style={{ paddingLeft: "32px" }}>
                                <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "16px" }}>
                                    {product.name || product.nameEn || product.nameAr}
                                </h1>

                                {product.bio || product.bioEn || product.bioAr ? (
                                    <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "24px" }}>
                                        {product.bio || product.bioEn || product.bioAr}
                                    </p>
                                ) : null}

                                {/* Rating */}
                                {product.rate || product.averageRating ? (
                                    <div style={{ marginBottom: "24px" }}>
                                        {renderStars(product.rate || product.averageRating)}
                                        <span style={{ marginLeft: "12px", fontSize: "1rem" }}>
                                            ({product.rate || product.averageRating})
                                            {product.ratingCount && ` ${product.ratingCount} reviews`}
                                        </span>
                                    </div>
                                ) : null}

                                {/* Price */}
                                <div style={{ marginBottom: "32px" }}>
                                    {hasDiscount ? (
                                        <div>
                                            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--main)", marginBottom: "8px" }}>
                                                {displayPrice} EGP
                                            </div>
                                            <div style={{ fontSize: "1.2rem", color: "#999", textDecoration: "line-through" }}>
                                                {regularPrice} EGP
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--main)" }}>
                                            {displayPrice} EGP
                                        </div>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div style={{ marginBottom: "24px" }}>
                                    {product.inStock || product.stockStatus === "instock" ? (
                                        <span style={{
                                            padding: "8px 16px",
                                            background: "#d4edda",
                                            color: "#155724",
                                            borderRadius: "20px",
                                            fontSize: "0.95rem",
                                            fontWeight: "600",
                                        }}>
                                            <i className="fas fa-check-circle me-2"></i>
                                            In Stock
                                            {product.stockQuantity && ` (${product.stockQuantity} available)`}
                                        </span>
                                    ) : (
                                        <span style={{
                                            padding: "8px 16px",
                                            background: "#f8d7da",
                                            color: "#721c24",
                                            borderRadius: "20px",
                                            fontSize: "0.95rem",
                                            fontWeight: "600",
                                        }}>
                                            <i className="fas fa-times-circle me-2"></i>
                                            Out of Stock
                                        </span>
                                    )}
                                </div>

                                {/* SKU */}
                                {product.sku && (
                                    <div style={{ marginBottom: "24px", fontSize: "0.9rem", color: "#666" }}>
                                        SKU: {product.sku}
                                    </div>
                                )}

                                {/* Provider */}
                                {product.provider && (
                                    <div style={{
                                        padding: "20px",
                                        background: "#f8f9fa",
                                        borderRadius: "12px",
                                        marginBottom: "24px",
                                    }}>
                                        <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "12px" }}>
                                            Sold by
                                        </h4>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <div>
                                                <h5 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "4px" }}>
                                                    {product.provider.nameEn || product.provider.nameAr}
                                                </h5>
                                                {product.provider.shortAddress && (
                                                    <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>
                                                        <i className="fas fa-map-marker-alt me-1"></i>
                                                        {product.provider.shortAddress}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleProviderClick(product.provider.id)}
                                                className="btn btn-outline-main"
                                            >
                                                View Store
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Add to Cart Button */}
                                <button
                                    className="btn btn-main"
                                    style={{ width: "100%", padding: "16px", fontSize: "1.1rem", fontWeight: "600" }}
                                    disabled={!product.inStock && product.stockStatus !== "instock"}
                                >
                                    <i className="fas fa-shopping-cart me-2"></i>
                                    {product.inStock || product.stockStatus === "instock" ? "Add to Cart" : "Out of Stock"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Section */}
            {(product.description || product.descriptionEn || product.descriptionAr) && (
                <section className="description-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <div style={{
                                    background: "white",
                                    padding: "32px",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                }}>
                                    <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>
                                        Product Description
                                    </h2>
                                    <div
                                        style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#666" }}
                                        dangerouslySetInnerHTML={{
                                            __html: product.enableHtmlDescription
                                                ? (product.description || product.descriptionEn || product.descriptionAr)
                                                : (product.description || product.descriptionEn || product.descriptionAr).replace(/\n/g, '<br />')
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Specifications */}
            {product.specifications && (
                <section className="specifications-section" style={{ padding: "60px 0", background: "white" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <div style={{
                                    background: "#f8f9fa",
                                    padding: "32px",
                                    borderRadius: "12px",
                                }}>
                                    <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>
                                        Specifications
                                    </h2>
                                    <div
                                        style={{ fontSize: "1rem", lineHeight: "1.8", color: "#666" }}
                                        dangerouslySetInnerHTML={{
                                            __html: product.specifications.replace(/\n/g, '<br />')
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
                <section className="attributes-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <div style={{
                                    background: "white",
                                    padding: "32px",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                }}>
                                    <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>
                                        Product Attributes
                                    </h2>
                                    {product.attributes.map((attr, index) => (
                                        <div key={index} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #eee" }}>
                                            <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>
                                                {attr.name}
                                            </h4>
                                            {attr.options && (
                                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                    {attr.options.map((option, optIndex) => (
                                                        <span
                                                            key={optIndex}
                                                            style={{
                                                                padding: "6px 12px",
                                                                background: "#f8f9fa",
                                                                borderRadius: "6px",
                                                                fontSize: "0.9rem",
                                                            }}
                                                        >
                                                            {option}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
                <section className="reviews-section" style={{ padding: "60px 0", background: "white" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "32px" }}>
                                    Customer Reviews ({product.reviews.length})
                                </h2>
                                {product.reviews.map((review) => (
                                    <div key={review.id} style={{
                                        background: "#f8f9fa",
                                        padding: "24px",
                                        borderRadius: "12px",
                                        marginBottom: "16px",
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                            <div>
                                                <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "4px" }}>
                                                    {review.reviewer || "Anonymous"}
                                                </h4>
                                                {review.rating && renderStars(review.rating)}
                                            </div>
                                            <div style={{ fontSize: "0.85rem", color: "#666" }}>
                                                {new Date(review.dateCreated || review.dateCreatedGmt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {review.review && (
                                            <p style={{ color: "#333", lineHeight: "1.6" }}>
                                                {review.review}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

