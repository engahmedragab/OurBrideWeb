import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { purchaseService } from "@/services/purchaseService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import MainButton from '@/SimpleComponent/MainButton/MainButton';

interface CartItem {
    id: string;
    productId?: number;
    serviceId?: number;
    name: string;
    nameAr?: string;
    nameEn?: string;
    price: number;
    quantity: number;
    image?: string;
    type: string;
    providerId?: number;
    providerName?: string;
}

interface Cart {
    items: CartItem[];
    total: number;
    subtotal: number;
    tax?: number;
    shipping?: number;
}

export default function Cart() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const providerId = searchParams.get('providerId');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                let data;
                if (providerId) {
                    data = await purchaseService.cart.getByProvider(parseInt(providerId));
                } else {
                    data = await purchaseService.cart.get();
                }
                setCart(data);
            } catch (err: any) {
                setError(err.message || "Failed to load cart");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [providerId]);

    const handleClearCart = async () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            try {
                if (providerId) {
                    await purchaseService.cart.clearByProvider(parseInt(providerId));
                } else {
                    await purchaseService.cart.clear();
                }
                setCart(null);
            } catch (err: any) {
                alert(err.message || "Failed to clear cart");
            }
        }
    };

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            // Remove item
            return;
        }
        // TODO: Implement update quantity API call
        // For now, just refresh the cart
        const data = providerId 
            ? await purchaseService.cart.getByProvider(parseInt(providerId))
            : await purchaseService.cart.get();
        setCart(data);
    };

    const handleCheckout = () => {
        navigate('/checkout');
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

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <>
                <HeroSection
                    badge={{
                        icon: "fas fa-shopping-cart",
                        text: "Shopping Cart"
                    }}
                    title={
                        <>
                            Your <span className="text-gradient">Cart is Empty</span>
                        </>
                    }
                    description="Add some amazing wedding products and services to your cart to get started."
                />
                <section className="empty-cart-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-6">
                                <div className="empty-state">
                                    <i className="fas fa-shopping-cart" style={{ fontSize: "5rem", color: "#ccc", marginBottom: "24px" }}></i>
                                    <h3>Your Cart is Empty</h3>
                                    <p style={{ color: "#666", marginBottom: "32px" }}>
                                        Add some items to your cart to get started on your wedding planning journey.
                                    </p>
                                    <Link to="/" className="btn btn-main btn-lg">
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <div className="cart-page">
            {/* Hero Section */}
            <HeroSection
                badge={{
                    icon: "fas fa-shopping-cart",
                    text: "Shopping Cart"
                }}
                title={
                    <>
                        Your <span className="text-gradient">Shopping Cart</span>
                    </>
                }
                description={`You have ${cart.items.length} item${cart.items.length !== 1 ? 's' : ''} in your cart. Review your items and proceed to checkout.`}
                stats={[
                    { number: cart.items.length, label: "Items" },
                    { number: `${cart.total.toFixed(0)} EGP`, label: "Total" },
                    { number: cart.items.filter(item => item.type === 'service').length, label: "Services" },
                ]}
            />

            {/* Cart Content Section */}
            <section className="cart-content-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                <div className="container">
                    <div className="row justify-content-end mb-4">
                        <div className="col-auto">
                            <button
                                className="btn btn-outline-danger"
                                onClick={handleClearCart}
                            >
                                <i className="fas fa-trash me-2"></i>
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                <div className="card-body" style={{ padding: "32px" }}>
                                    <SectionHeader
                                        title="Cart Items"
                                        description={`${cart.items.length} item${cart.items.length !== 1 ? 's' : ''} in your cart`}
                                    />
                                    <div className="mt-4">
                                        {cart.items.map((item) => (
                                            <div key={item.id} className="cart-item-modern d-flex align-items-center mb-4 pb-4 border-bottom">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.nameEn || item.nameAr || item.name}
                                                        className="me-4"
                                                        style={{ 
                                                            width: "120px", 
                                                            height: "120px", 
                                                            objectFit: "cover", 
                                                            borderRadius: "12px",
                                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                                        }}
                                                    />
                                                )}
                                                <div className="flex-grow-1">
                                                    <h5 className="mb-2" style={{ fontWeight: "600" }}>
                                                        {item.nameEn || item.nameAr || item.name}
                                                    </h5>
                                                    {item.providerName && (
                                                        <p className="text-muted mb-2">
                                                            <i className="fas fa-store me-2"></i>
                                                            {item.providerName}
                                                        </p>
                                                    )}
                                                    <span className="badge bg-secondary">{item.type}</span>
                                                </div>
                                                <div className="text-end ms-4">
                                                    <div className="mb-3">
                                                        <strong className="text-primary" style={{ fontSize: "1.25rem" }}>
                                                            {item.price.toFixed(2)} EGP
                                                        </strong>
                                                        <small className="text-muted d-block">per item</small>
                                                    </div>
                                                    <div className="input-group mb-3" style={{ width: "140px" }}>
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            <i className="fas fa-minus"></i>
                                                        </button>
                                                        <input
                                                            type="number"
                                                            className="form-control text-center"
                                                            value={item.quantity}
                                                            readOnly
                                                            min="1"
                                                            style={{ fontWeight: "600" }}
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <strong style={{ fontSize: "1.1rem" }}>
                                                            {(item.price * item.quantity).toFixed(2)} EGP
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card shadow-lg" style={{ borderRadius: "16px", overflow: "hidden", position: "sticky", top: "100px" }}>
                                <div className="card-body" style={{ padding: "32px" }}>
                                    <h5 className="card-title mb-4" style={{ fontWeight: "600" }}>
                                        <i className="fas fa-receipt me-2"></i>
                                        Order Summary
                                    </h5>
                                    <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                        <span className="text-muted">Subtotal:</span>
                                        <strong>{cart.subtotal?.toFixed(2) || cart.total.toFixed(2)} EGP</strong>
                                    </div>
                                    {cart.tax && (
                                        <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                            <span className="text-muted">Tax:</span>
                                            <span>{cart.tax.toFixed(2)} EGP</span>
                                        </div>
                                    )}
                                    {cart.shipping && (
                                        <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                            <span className="text-muted">Shipping:</span>
                                            <span>{cart.shipping.toFixed(2)} EGP</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between mb-4 pt-3" style={{ borderTop: "2px solid #e9ecef" }}>
                                        <strong style={{ fontSize: "1.2rem" }}>Total:</strong>
                                        <strong className="text-primary" style={{ fontSize: "1.5rem" }}>
                                            {cart.total.toFixed(2)} EGP
                                        </strong>
                                    </div>
                                    <MainButton
                                        title="Proceed to Checkout"
                                        classes="btn-main w-100 mb-3"
                                        onClick={handleCheckout}
                                    />
                                    <Link to="/" className="btn btn-outline-main w-100">
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
