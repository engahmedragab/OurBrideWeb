import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { purchaseService } from "@/services/purchaseService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import MainButton from '@/SimpleComponent/MainButton/MainButton';

interface OrderItem {
    id: string;
    name: string;
    nameAr?: string;
    nameEn?: string;
    price: number;
    quantity: number;
    image?: string;
    type: string;
}

interface Order {
    id: string | number;
    orderNumber?: string;
    status: string;
    total: number;
    subtotal: number;
    tax?: number;
    shipping?: number;
    createdAt: string;
    items: OrderItem[];
    shippingAddress?: string;
    billingAddress?: string;
    paymentMethod?: string;
    providerName?: string;
}

export default function OrderDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) {
                setError("Order ID is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const orderId = parseInt(id);
                const data = await purchaseService.purchase.getById(orderId);
                setOrder(data);
            } catch (err: any) {
                setError(err.message || "Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

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
            <span className={`badge ${badgeClass} fs-6`}>
                {status}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error || !order) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error || "Order not found"}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/my-orders')}>
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to My Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="order-details-page">
            {/* Hero Section */}
            <HeroSection
                badge={{
                    icon: "fas fa-receipt",
                    text: "Order Details"
                }}
                title={
                    <>
                        Order <span className="text-gradient">#{order.orderNumber || order.id}</span>
                    </>
                }
                description={`Order placed on ${formatDate(order.createdAt)}. ${getStatusBadge(order.status)}`}
                stats={[
                    { number: order.items?.length || 0, label: "Items" },
                    { number: `${order.total.toFixed(0)} EGP`, label: "Total" },
                    { number: order.status, label: "Status" },
                ]}
            />

            {/* Order Details Section */}
            <section className="order-details-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-12 text-end">
                            <Link to="/my-orders" className="btn btn-outline-main">
                                <i className="fas fa-arrow-left me-2"></i>
                                Back to Orders
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            {/* Order Items */}
                            <div className="card shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                <div className="card-header bg-white" style={{ padding: "20px", borderBottom: "2px solid #e9ecef" }}>
                                    <SectionHeader
                                        title="Order Items"
                                        description={`${order.items?.length || 0} item${order.items?.length !== 1 ? 's' : ''} in this order`}
                                    />
                                </div>
                                <div className="card-body" style={{ padding: "24px" }}>
                                    {order.items && order.items.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Item</th>
                                                        <th>Quantity</th>
                                                        <th className="text-end">Price</th>
                                                        <th className="text-end">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    {item.image && (
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.nameEn || item.nameAr || item.name}
                                                                            className="me-3"
                                                                            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                                                                        />
                                                                    )}
                                                                    <div>
                                                                        <strong>{item.nameEn || item.nameAr || item.name}</strong>
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            <span className="badge bg-secondary">{item.type}</span>
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><strong>{item.quantity}</strong></td>
                                                            <td className="text-end">{item.price.toFixed(2)} EGP</td>
                                                            <td className="text-end">
                                                                <strong className="text-primary">{(item.price * item.quantity).toFixed(2)} EGP</strong>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-muted text-center py-4">No items found</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            {/* Order Summary */}
                            <div className="card shadow-lg mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                <div className="card-header bg-white" style={{ padding: "20px", borderBottom: "2px solid #e9ecef" }}>
                                    <h5 className="mb-0" style={{ fontWeight: "600" }}>
                                        <i className="fas fa-receipt me-2"></i>
                                        Order Summary
                                    </h5>
                                </div>
                                <div className="card-body" style={{ padding: "24px" }}>
                                    <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                        <span className="text-muted">Subtotal:</span>
                                        <strong>{order.subtotal?.toFixed(2) || order.total.toFixed(2)} EGP</strong>
                                    </div>
                                    {order.tax && (
                                        <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                            <span className="text-muted">Tax:</span>
                                            <span>{order.tax.toFixed(2)} EGP</span>
                                        </div>
                                    )}
                                    {order.shipping && (
                                        <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                            <span className="text-muted">Shipping:</span>
                                            <span>{order.shipping.toFixed(2)} EGP</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between pt-3" style={{ borderTop: "2px solid #e9ecef" }}>
                                        <strong style={{ fontSize: "1.2rem" }}>Total:</strong>
                                        <strong className="text-primary" style={{ fontSize: "1.5rem" }}>
                                            {order.total.toFixed(2)} EGP
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            {order.shippingAddress && (
                                <div className="card shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                    <div className="card-header bg-white" style={{ padding: "20px", borderBottom: "2px solid #e9ecef" }}>
                                        <h5 className="mb-0" style={{ fontWeight: "600" }}>
                                            <i className="fas fa-truck me-2"></i>
                                            Shipping Address
                                        </h5>
                                    </div>
                                    <div className="card-body" style={{ padding: "24px" }}>
                                        <p className="mb-0">{order.shippingAddress}</p>
                                    </div>
                                </div>
                            )}

                            {/* Payment Info */}
                            {order.paymentMethod && (
                                <div className="card shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                    <div className="card-header bg-white" style={{ padding: "20px", borderBottom: "2px solid #e9ecef" }}>
                                        <h5 className="mb-0" style={{ fontWeight: "600" }}>
                                            <i className="fas fa-credit-card me-2"></i>
                                            Payment Method
                                        </h5>
                                    </div>
                                    <div className="card-body" style={{ padding: "24px" }}>
                                        <p className="mb-0 text-capitalize">
                                            {order.paymentMethod.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
