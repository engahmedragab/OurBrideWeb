import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeroSection from '@/Components/Shared/HeroSection';
import CTASection from '@/Components/Shared/CTASection';
import MainButton from '@/SimpleComponent/MainButton/MainButton';

export default function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId;
    const order = location.state?.order;

    return (
        <div className="order-success-page">
            {/* Hero Section */}
            <HeroSection
                badge={{
                    icon: "fas fa-check-circle",
                    text: "Order Confirmed"
                }}
                title={
                    <>
                        Order <span className="text-gradient">Placed Successfully!</span>
                    </>
                }
                description="Thank you for your purchase. Your order has been received and is being processed. You will receive an email confirmation shortly."
                stats={[
                    { number: orderId ? `#${orderId}` : order?.orderNumber ? `#${order.orderNumber}` : "✓", label: "Order Number" },
                    { number: "100%", label: "Secure" },
                    { number: "✓", label: "Confirmed" },
                ]}
            />

            {/* Success Content Section */}
            <section className="success-content-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <div className="card border-0 shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
                                <div className="card-body p-5">
                                    <div className="mb-5">
                                        <div className="success-icon mb-4" style={{
                                            width: "120px",
                                            height: "120px",
                                            margin: "0 auto",
                                            background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 8px 30px rgba(40, 167, 69, 0.3)",
                                        }}>
                                            <i className="fas fa-check fa-4x text-white"></i>
                                        </div>
                                        <h2 className="text-success mb-3" style={{ fontWeight: "600" }}>
                                            Order Placed Successfully!
                                        </h2>
                                        <p className="lead text-muted">
                                            Thank you for your purchase. Your order has been received and is being processed.
                                        </p>
                                    </div>

                                    {(orderId || order?.orderNumber) && (
                                        <div className="alert alert-info mb-4" style={{ borderRadius: "12px", border: "none" }}>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <i className="fas fa-receipt me-3" style={{ fontSize: "1.5rem" }}></i>
                                                <div className="text-start">
                                                    <strong>Order Number:</strong>
                                                    <div style={{ fontSize: "1.25rem", marginTop: "4px" }}>
                                                        #{orderId || order?.orderNumber}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="d-flex flex-column gap-3 mb-4">
                                        {orderId && (
                                            <Link
                                                to={`/order/${orderId}`}
                                                className="btn btn-main btn-lg"
                                            >
                                                <i className="fas fa-eye me-2"></i>
                                                View Order Details
                                            </Link>
                                        )}
                                        <Link
                                            to="/my-orders"
                                            className="btn btn-outline-main btn-lg"
                                        >
                                            <i className="fas fa-list me-2"></i>
                                            View All Orders
                                        </Link>
                                        <Link
                                            to="/"
                                            className="btn btn-outline-secondary"
                                        >
                                            <i className="fas fa-home me-2"></i>
                                            Return to Home
                                        </Link>
                                    </div>

                                    <div className="mt-4 pt-4 border-top">
                                        <p className="text-muted mb-0">
                                            <i className="fas fa-envelope me-2"></i>
                                            You will receive an email confirmation shortly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
