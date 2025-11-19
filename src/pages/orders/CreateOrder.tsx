import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { purchaseService } from "@/services/purchaseService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';

export default function CreateOrder() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const checkoutResult = location.state?.checkoutResult;

    useEffect(() => {
        const createOrder = async () => {
            try {
                setLoading(true);
                
                // Get cart data
                const cart = await purchaseService.cart.get();
                
                if (!cart || !cart.items || cart.items.length === 0) {
                    setError("Cart is empty");
                    return;
                }

                // Create order from checkout result or cart
                const orderRequest = {
                    ...checkoutResult,
                    items: cart.items,
                };

                const order = await purchaseService.order.create(orderRequest);
                
                // Navigate to success page with order ID
                navigate('/order/success', { 
                    state: { 
                        orderId: order?.id || order?.orderId,
                        order: order 
                    } 
                });
            } catch (err: any) {
                setError(err.message || "Failed to create order");
            } finally {
                setLoading(false);
            }
        };

        createOrder();
    }, [navigate, checkoutResult]);

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <LoadingScreen />
                    <p className="mt-3">Creating your order...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Order Creation Failed</h4>
                    <p>{error}</p>
                    <div className="mt-3">
                        <button 
                            className="btn btn-primary me-2"
                            onClick={() => navigate('/checkout')}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Checkout
                        </button>
                        <button 
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/cart')}
                        >
                            <i className="fas fa-shopping-cart me-2"></i>
                            View Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null; // Will redirect on success
}
