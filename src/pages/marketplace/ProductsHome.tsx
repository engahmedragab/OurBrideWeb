import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { homeService } from "@/services/homeService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import CTASection from '@/Components/Shared/CTASection';

interface TopBarText {
    id: number;
    textAr: string;
    textEn: string;
    text: string;
    screenType: string;
    displayType: string;
    isActive: boolean;
    order: number;
    startDate: string;
    endDate: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    fontWeight: string;
    isBold: boolean;
    isItalic: boolean;
    icon: string;
    link: string;
    openInNewTab: boolean;
    priority: number;
}

interface Banner {
    id: number;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    imageUrl: string;
    linkUrl: string;
    bannerType: string;
    isActive: boolean;
    order: number;
    startDate: string;
    endDate: string;
}

interface Testimonial {
    id: number;
    customerNameAr: string;
    customerNameEn: string;
    customerName: string;
    rating: number;
    commentAr: string;
    commentEn: string;
    comment: string;
    productAr: string;
    productEn: string;
    product: string;
    imageUrl: string;
    isVerified: boolean;
    isActive: boolean;
    order: number;
    verifiedDate: string;
    orderId: number;
}

interface FAQ {
    id: number;
    questionAr: string;
    questionEn: string;
    question: string;
    answerAr: string;
    answerEn: string;
    answer: string;
    order: number;
    isActive: boolean;
    type: string;
}

interface StoreHomeData {
    topBarTexts: TopBarText[];
    banners: Banner[];
    testimonials: Testimonial[];
    faqs: FAQ[];
}

export default function ProductsHome() {
    const [data, setData] = useState<StoreHomeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await homeService.getStoreHome();
                setData(response);
            } catch (err: any) {
                setError(err.message || "Failed to load store home data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const toggleFaq = (faqId: number) => {
        setExpandedFaq(expandedFaq === faqId ? null : faqId);
    };

    return (
        <div className="store-home-page">
            {/* Hero Section */}
            <HeroSection
                badge={{
                    icon: "fas fa-store",
                    text: "Products Store"
                }}
                title={
                    <>
                        Wedding <span className="text-gradient">Products</span>
                    </>
                }
                description="Discover amazing wedding products and gifts. From decorations to accessories, find everything you need for your special day."
                stats={[
                    { number: "1000+", label: "Products" },
                    { number: "4.8★", label: "Average Rating" },
                    { number: "500+", label: "Happy Customers" },
                ]}
            />

            {/* Top Bar Texts */}
            {data.topBarTexts && data.topBarTexts.length > 0 && (
                <section className="top-bar-section" style={{ background: "white", padding: "10px 0" }}>
                    {data.topBarTexts
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((topBar) => (
                            <div
                                key={topBar.id}
                                className="top-bar-text"
                                style={{
                                    backgroundColor: topBar.backgroundColor || "#f8f9fa",
                                    color: topBar.textColor || "#000",
                                    fontSize: topBar.fontSize || "14px",
                                    fontWeight: topBar.fontWeight || "normal",
                                    padding: "10px 0",
                                    textAlign: "center",
                                }}
                            >
                                {topBar.link ? (
                                    <Link
                                        to={topBar.link}
                                        target={topBar.openInNewTab ? "_blank" : "_self"}
                                        style={{
                                            color: topBar.textColor || "#000",
                                            textDecoration: "none",
                                        }}
                                    >
                                        {topBar.icon && (
                                            <i className={`${topBar.icon} me-2`}></i>
                                        )}
                                        <span
                                            style={{
                                                fontWeight: topBar.isBold ? "bold" : "normal",
                                                fontStyle: topBar.isItalic ? "italic" : "normal",
                                            }}
                                        >
                                            {topBar.textEn || topBar.textAr || topBar.text}
                                        </span>
                                    </Link>
                                ) : (
                                    <span>
                                        {topBar.icon && (
                                            <i className={`${topBar.icon} me-2`}></i>
                                        )}
                                        <span
                                            style={{
                                                fontWeight: topBar.isBold ? "bold" : "normal",
                                                fontStyle: topBar.isItalic ? "italic" : "normal",
                                            }}
                                        >
                                            {topBar.textEn || topBar.textAr || topBar.text}
                                        </span>
                                    </span>
                                )}
                            </div>
                        ))}
                </section>
            )}

            {/* Banners Section */}
            {data.banners && data.banners.length > 0 && (
                <section className="banners-section" style={{ padding: "40px 0", background: "white" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center mb-4">
                            <div className="col-lg-8">
                                <SectionHeader
                                    badge={{ icon: "fas fa-images", text: "Featured" }}
                                    title="Special Offers"
                                    description="Check out our latest promotions and featured products"
                                />
                            </div>
                        </div>
                        <div className="row">
                            {data.banners
                                .sort((a, b) => (a.order || 0) - (b.order || 0))
                                .map((banner) => (
                                    <div key={banner.id} className="col-12 mb-4">
                                        <Link to={banner.linkUrl || "#"} className="banner-link text-decoration-none">
                                            <div className="banner-card position-relative overflow-hidden rounded shadow-sm" style={{ borderRadius: "16px", transition: "all 0.3s ease" }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "translateY(-4px)";
                                                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "translateY(0)";
                                                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                                }}>
                                                <img
                                                    src={banner.imageUrl}
                                                    alt={banner.titleEn || banner.titleAr}
                                                    className="w-100"
                                                    style={{ maxHeight: "400px", objectFit: "cover" }}
                                                />
                                                <div className="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)" }}>
                                                    <div className="container">
                                                        <h2 className="text-white mb-3" style={{ fontWeight: "600" }}>
                                                            {banner.titleEn || banner.titleAr}
                                                        </h2>
                                                        {banner.descriptionEn || banner.descriptionAr ? (
                                                            <p className="text-white lead">
                                                                {banner.descriptionEn || banner.descriptionAr}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {data.testimonials && data.testimonials.length > 0 && (
                <section className="testimonials-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center mb-5">
                            <div className="col-lg-8">
                                <SectionHeader
                                    badge={{ icon: "fas fa-star", text: "Reviews" }}
                                    title="Customer Testimonials"
                                    description="See what our customers are saying about our products"
                                />
                            </div>
                        </div>
                        <div className="row">
                            {data.testimonials
                                .sort((a, b) => (a.order || 0) - (b.order || 0))
                                .map((testimonial) => (
                                    <div key={testimonial.id} className="col-md-6 col-lg-4 mb-4">
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
                                                    {testimonial.imageUrl && (
                                                        <img
                                                            src={testimonial.imageUrl}
                                                            alt={testimonial.customerName}
                                                            className="rounded-circle me-3"
                                                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                        />
                                                    )}
                                                    <div>
                                                        <h6 className="card-title mb-0" style={{ fontWeight: "600" }}>
                                                            {testimonial.customerNameEn || testimonial.customerNameAr || testimonial.customerName}
                                                        </h6>
                                                        {testimonial.isVerified && (
                                                            <small className="text-success">
                                                                <i className="fas fa-check-circle me-1"></i> Verified Purchase
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i
                                                            key={i}
                                                            className={`fas fa-star ${i < testimonial.rating ? 'text-warning' : 'text-muted'}`}
                                                        ></i>
                                                    ))}
                                                </div>
                                                <p className="card-text" style={{ color: "#666" }}>
                                                    {testimonial.commentEn || testimonial.commentAr || testimonial.comment}
                                                </p>
                                                {testimonial.product && (
                                                    <p className="text-muted small mb-0">
                                                        <i className="fas fa-shopping-bag me-1"></i>
                                                        {testimonial.productEn || testimonial.productAr || testimonial.product}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQs Section */}
            {data.faqs && data.faqs.length > 0 && (
                <section className="faqs-section" style={{ padding: "60px 0", background: "white" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center mb-5">
                            <div className="col-lg-8">
                                <SectionHeader
                                    badge={{ icon: "fas fa-question-circle", text: "Help" }}
                                    title="Frequently Asked Questions"
                                    description="Find answers to common questions about our products"
                                />
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="accordion" id="faqAccordion">
                                    {data.faqs
                                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                                        .map((faq) => (
                                            <div key={faq.id} className="accordion-item mb-3 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                                                <h2 className="accordion-header" id={`faq-heading-${faq.id}`}>
                                                    <button
                                                        className={`accordion-button ${expandedFaq !== faq.id ? 'collapsed' : ''}`}
                                                        type="button"
                                                        onClick={() => toggleFaq(faq.id)}
                                                        aria-expanded={expandedFaq === faq.id}
                                                        aria-controls={`faq-collapse-${faq.id}`}
                                                        style={{ fontWeight: "600" }}
                                                    >
                                                        {faq.questionEn || faq.questionAr || faq.question}
                                                    </button>
                                                </h2>
                                                <div
                                                    id={`faq-collapse-${faq.id}`}
                                                    className={`accordion-collapse collapse ${expandedFaq === faq.id ? 'show' : ''}`}
                                                    aria-labelledby={`faq-heading-${faq.id}`}
                                                >
                                                    <div className="accordion-body" style={{ padding: "20px" }}>
                                                        {faq.answerEn || faq.answerAr || faq.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <CTASection
                title="Ready to Shop for Wedding Products?"
                description="Browse our amazing collection of wedding products and find everything you need for your special day."
                buttons={[
                    {
                        label: "Browse Products",
                        icon: "fas fa-shopping-bag",
                        to: "/shop",
                        variant: "primary"
                    },
                    {
                        label: "View Providers",
                        icon: "fas fa-users",
                        to: "/providers",
                        variant: "outline"
                    }
                ]}
            />
        </div>
    );
}
