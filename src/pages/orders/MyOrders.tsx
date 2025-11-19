import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { purchaseService } from "@/services/purchaseService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import CTASection from '@/Components/Shared/CTASection';
import MainButton from '@/SimpleComponent/MainButton/MainButton';

interface Order {
    id: string | number;
    orderNumber?: string;
    status: string;
    total: number;
    createdAt: string;
    items?: any[];
    providerName?: string;
}

export default function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const searchRequest = {
                    pageNumber: page,
                    pageSize: 10,
                };
                const data = await purchaseService.order.search(searchRequest);
                
                if (data?.items) {
                    setOrders(data.items);
                    setTotalPages(data.totalPages || 1);
                } else if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    setOrders([]);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page]);

    const getStatusBadge = (status: string) => {
        const statusLower = status.toLowerCase();
        let badgeClass = "bg-secondary";
        
        if (statusLower.includes("pending") || statusLower.includes("processing")) {
            badgeClass = "bg-warning text-dark";
        } else if (statusLower.includes("completed") || statusLower.includes("delivered")) {
            badgeClass = "bg-success";
        } else if (statusLower.includes("cancelled") || statusLower.includes("failed")) {
            badgeClass = "bg-danger";
        }
        
        return (
            <span className={`badge ${badgeClass}`}>
                {status}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

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

    return (
        <div className="my-orders-page">
            {/* Hero Section */}
            <HeroSection
                badge={{
                    icon: "fas fa-shopping-bag",
                    text: "Order History"
                }}
                title={
                    <>
                        My <span className="text-gradient">Orders</span>
                    </>
                }
                description="View and manage all your orders. Track your purchases and access order details anytime."
                stats={[
                    { number: orders.length, label: "Total Orders" },
                    { number: orders.filter(o => o.status?.toLowerCase().includes('completed')).length, label: "Completed" },
                    { number: orders.filter(o => o.status?.toLowerCase().includes('pending')).length, label: "Pending" },
                ]}
            />

            {/* Orders Content Section */}
            <section className="orders-content-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                <div className="container">
                    {orders.length === 0 ? (
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <div className="empty-state" style={{ padding: "60px 20px" }}>
                                    <i className="fas fa-shopping-bag" style={{ fontSize: "5rem", color: "#ccc", marginBottom: "24px" }}></i>
                                    <h3>No Orders Found</h3>
                                    <p style={{ color: "#666", marginBottom: "32px" }}>
                                        You haven't placed any orders yet. Start shopping to see your orders here.
                                    </p>
                                    <Link to="/" className="btn btn-main btn-lg">
                                        <i className="fas fa-shopping-cart me-2"></i>
                                        Start Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="row justify-content-center text-center mb-5">
                                <div className="col-lg-8">
                                    <SectionHeader
                                        badge={{ icon: "fas fa-list", text: "Order History" }}
                                        title="Your Orders"
                                        description={`You have ${orders.length} order${orders.length !== 1 ? 's' : ''} in your history`}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                {orders.map((order) => (
                                    <div key={order.id} className="col-12 mb-4">
                                        <div className="card shadow-sm" style={{ borderRadius: "16px", overflow: "hidden", transition: "all 0.3s ease" }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                            }}>
                                            <div className="card-body" style={{ padding: "24px" }}>
                                                <div className="row align-items-center">
                                                    <div className="col-md-3">
                                                        <h5 className="mb-2" style={{ fontWeight: "600" }}>
                                                            Order #{order.orderNumber || order.id}
                                                        </h5>
                                                        <p className="text-muted mb-0">
                                                            <i className="fas fa-calendar me-2"></i>
                                                            {formatDate(order.createdAt)}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-2">
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div>
                                                            <strong className="text-primary" style={{ fontSize: "1.25rem" }}>
                                                                {order.total?.toFixed(2) || "0.00"} EGP
                                                            </strong>
                                                        </div>
                                                        {order.items && order.items.length > 0 && (
                                                            <small className="text-muted">
                                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                            </small>
                                                        )}
                                                    </div>
                                                    {order.providerName && (
                                                        <div className="col-md-2">
                                                            <small className="text-muted">
                                                                <i className="fas fa-store me-1"></i>
                                                                {order.providerName}
                                                            </small>
                                                        </div>
                                                    )}
                                                    <div className="col-md-2 text-end">
                                                        <MainButton
                                                            title="View Details"
                                                            classes="btn-outline-main btn-sm"
                                                            onClick={() => navigate(`/order/${order.id}`)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="row justify-content-center mt-5">
                                    <div className="col-auto">
                                        <nav>
                                            <ul className="pagination">
                                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPage(page - 1)}
                                                        disabled={page === 1}
                                                    >
                                                        <i className="fas fa-chevron-left"></i> Previous
                                                    </button>
                                                </li>
                                                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                                    const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                                                    if (pageNum > totalPages) return null;
                                                    return (
                                                        <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                                                            <button
                                                                className="page-link"
                                                                onClick={() => setPage(pageNum)}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPage(page + 1)}
                                                        disabled={page === totalPages}
                                                    >
                                                        Next <i className="fas fa-chevron-right"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            {orders.length === 0 && (
                <CTASection
                    title="Ready to Start Shopping?"
                    description="Browse our amazing collection of wedding products and services."
                    buttons={[
                        {
                            label: "Browse Services",
                            icon: "fas fa-concierge-bell",
                            to: "/services",
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
            )}
        </div>
    );
}
