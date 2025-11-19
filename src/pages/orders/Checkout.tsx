import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { purchaseService } from "@/services/purchaseService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import MainButton from '@/SimpleComponent/MainButton/MainButton';

interface Cart {
    items: any[];
    total: number;
    subtotal: number;
    tax?: number;
    shipping?: number;
}

export default function Checkout() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        shippingAddress: "",
        billingAddress: "",
        paymentMethod: "credit_card",
        couponCode: "",
    });

    const [couponValid, setCouponValid] = useState<boolean | null>(null);
    const [couponMessage, setCouponMessage] = useState("");
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                const data = await purchaseService.cart.get();
                setCart(data);
            } catch (err: any) {
                setError(err.message || "Failed to load cart");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleValidateCoupon = async () => {
        if (!formData.couponCode.trim()) {
            setCouponMessage("Please enter a coupon code");
            setCouponValid(false);
            return;
        }

        try {
            setValidatingCoupon(true);
            const result = await purchaseService.coupon.validate(formData.couponCode);
            setCouponValid(true);
            setCouponMessage("Coupon applied successfully!");
            // Refresh cart to show discount
            const cartData = await purchaseService.cart.get();
            setCart(cartData);
        } catch (err: any) {
            setCouponValid(false);
            setCouponMessage(err.message || "Invalid coupon code");
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.shippingAddress.trim()) {
            alert("Please enter a shipping address");
            return;
        }

        try {
            setProcessing(true);
            const checkoutRequest = {
                shippingAddress: formData.shippingAddress,
                billingAddress: formData.billingAddress || formData.shippingAddress,
                paymentMethod: formData.paymentMethod,
                couponCode: formData.couponCode || undefined,
            };

            const result = await purchaseService.checkout.process(checkoutRequest);
            
            // Navigate to order creation or success page
            navigate('/order/create', { state: { checkoutResult: result } });
        } catch (err: any) {
            alert(err.message || "Checkout failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error || !cart) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error || "Cart is empty"}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/cart')}>
                        Back to Cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            {/* Hero Section */}
            <HeroSection
                badge={{
                    icon: "fas fa-credit-card",
                    text: "Secure Checkout"
                }}
                title={
                    <>
                        Complete Your <span className="text-gradient">Order</span>
                    </>
                }
                description={`Review your ${cart.items.length} item${cart.items.length !== 1 ? 's' : ''} and complete your purchase securely.`}
                stats={[
                    { number: cart.items.length, label: "Items" },
                    { number: `${cart.total.toFixed(0)} EGP`, label: "Total" },
                    { number: "100%", label: "Secure" },
                ]}
            />

            {/* Checkout Form Section */}
            <section className="checkout-form-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <form onSubmit={handleSubmit}>
                                {/* Shipping Address */}
                                <div className="card shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                    <div className="card-header bg-white" style={{ padding: "20px", borderBottom: "2px solid #e9ecef" }}>
                                        <SectionHeader
                                            title="Shipping Address"
                                            description="Where should we deliver your order?"
                                        />
                                    </div>
                                    <div className="card-body" style={{ padding: "24px" }}>
                                        <div className="mb-3">
                                            <label htmlFor="shippingAddress" className="form-label" style={{ fontWeight: "600" }}>
                                                Address <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                id="shippingAddress"
                                                name="shippingAddress"
                                                className="form-control"
                                                rows={4}
                                                value={formData.shippingAddress}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter your complete shipping address"
                                                style={{ borderRadius: "8px", border: "1px solid #e9ecef" }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div className="card shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                    <div className="card-header bg-white" style={{ padding: "20px", borderBottom: "2px solid #e9ecef" }}>
                                        <SectionHeader
                                            title="Billing Address"
                                            description="Billing information (optional)"
                                        />
                                    </div>
                                    <div className="card-body" style={{ padding: "24px" }}>
                                        <div className="mb-3">
                                            <label htmlFor="billingAddress" className="form-label" style={{ fontWeight: "600" }}>
                                                Address
                                            </label>
                                            <textarea
                                                id="billingAddress"
                                                name="billingAddress"
                                                className="form-control"
                                                rows={4}
                                                value={formData.billingAddress}
                                                onChange={handleInputChange}
                                                placeholder="Enter your billing address (optional)"
                                                style={{ borderRadius: "8px", border: "1px solid #e9ecef" }}
                                            />
                                            <small className="form-text text-muted mt-2">
                                                <i className="fas fa-info-circle me-1"></i>
                                                Leave empty to use shipping address
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="card shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                    <div className="card-header bg-white" style={{ padding: "20px", borderBottom: "2px solid #e9ecef" }}>
                                        <SectionHeader
                                            title="Payment Method"
                                            description="Choose your preferred payment method"
                                        />
                                    </div>
                                    <div className="card-body" style={{ padding: "24px" }}>
                                        <div className="mb-3">
                                            <label htmlFor="paymentMethod" className="form-label" style={{ fontWeight: "600" }}>
                                                Select Payment Method
                                            </label>
                                            <select
                                                id="paymentMethod"
                                                name="paymentMethod"
                                                className="form-select"
                                                value={formData.paymentMethod}
                                                onChange={handleInputChange}
                                                style={{ borderRadius: "8px", border: "1px solid #e9ecef", padding: "12px" }}
                                            >
                                                <option value="credit_card">💳 Credit Card</option>
                                                <option value="debit_card">💳 Debit Card</option>
                                                <option value="paypal">💼 PayPal</option>
                                                <option value="cash_on_delivery">💰 Cash on Delivery</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Coupon Code */}
                                <div className="card shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                    <div className="card-header bg-white" style={{ padding: "20px", borderBottom: "2px solid #e9ecef" }}>
                                        <SectionHeader
                                            title="Coupon Code"
                                            description="Have a discount code? Enter it here"
                                        />
                                    </div>
                                    <div className="card-body" style={{ padding: "24px" }}>
                                        <div className="input-group" style={{ borderRadius: "8px", overflow: "hidden" }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="couponCode"
                                                value={formData.couponCode}
                                                onChange={handleInputChange}
                                                placeholder="Enter coupon code"
                                                style={{ border: "1px solid #e9ecef" }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-main"
                                                onClick={handleValidateCoupon}
                                                disabled={validatingCoupon}
                                            >
                                                {validatingCoupon ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Validating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-check me-2"></i>
                                                        Validate
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        {couponMessage && (
                                            <div className={`mt-3 alert ${couponValid ? 'alert-success' : 'alert-danger'}`} style={{ borderRadius: "8px" }}>
                                                <i className={`fas ${couponValid ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                                                {couponMessage}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex gap-3">
                                    <MainButton
                                        title={processing ? "Processing..." : "Place Order"}
                                        classes="btn-main btn-lg"
                                        onClick={handleSubmit}
                                        disabled={processing}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-main btn-lg"
                                        onClick={() => navigate('/cart')}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to Cart
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="col-lg-4">
                            <div className="card shadow-lg" style={{ borderRadius: "16px", overflow: "hidden", position: "sticky", top: "100px" }}>
                                <div className="card-header bg-white" style={{ padding: "20px", borderBottom: "2px solid #e9ecef" }}>
                                    <h5 className="mb-0" style={{ fontWeight: "600" }}>
                                        <i className="fas fa-receipt me-2"></i>
                                        Order Summary
                                    </h5>
                                </div>
                                <div className="card-body" style={{ padding: "24px" }}>
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
                                    {couponValid && (
                                        <div className="d-flex justify-content-between mb-3 pb-3 border-bottom text-success">
                                            <span><i className="fas fa-tag me-1"></i>Discount:</span>
                                            <span>-</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between pt-3" style={{ borderTop: "2px solid #e9ecef" }}>
                                        <strong style={{ fontSize: "1.2rem" }}>Total:</strong>
                                        <strong className="text-primary" style={{ fontSize: "1.5rem" }}>
                                            {cart.total.toFixed(2)} EGP
                                        </strong>
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
