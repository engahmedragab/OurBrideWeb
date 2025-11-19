import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { purchaseService } from "@/services/purchaseService";
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';

interface CartProvider {
    providerId: number;
    providerName: string;
    carts: any[];
}

export default function UserCarts() {
    const [carts, setCarts] = useState<CartProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                setLoading(true);
                const data = await purchaseService.cart.getAllWithProviders();
                setCarts(data || []);
            } catch (err: any) {
                setError(err.message || "Failed to load carts");
            } finally {
                setLoading(false);
            }
        };

        fetchCarts();
    }, []);

    const handleClearProviderCart = async (providerId: number) => {
        if (window.confirm("Are you sure you want to clear this cart?")) {
            try {
                await purchaseService.cart.clearByProvider(providerId);
                // Refresh carts
                const data = await purchaseService.cart.getAllWithProviders();
                setCarts(data || []);
            } catch (err: any) {
                alert(err.message || "Failed to clear cart");
            }
        }
    };

    const handleViewCart = (providerId: number) => {
        navigate(`/cart?providerId=${providerId}`);
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
        <div className="user-carts-page">
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>My Carts</h1>
                    <Link to="/cart" className="btn btn-primary">
                        <i className="fas fa-shopping-cart me-2"></i>
                        View Unified Cart
                    </Link>
                </div>

                {carts.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                        <h3>No Carts Found</h3>
                        <p className="text-muted">You don't have any active shopping carts.</p>
                        <Link to="/" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="row">
                        {carts.map((cartProvider) => (
                            <div key={cartProvider.providerId} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="card-title mb-0">
                                            <i className="fas fa-store me-2"></i>
                                            {cartProvider.providerName || `Provider ${cartProvider.providerId}`}
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">
                                            <strong>{cartProvider.carts?.length || 0}</strong> cart(s) with this provider
                                        </p>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleViewCart(cartProvider.providerId)}
                                            >
                                                <i className="fas fa-eye me-1"></i>
                                                View Cart
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleClearProviderCart(cartProvider.providerId)}
                                            >
                                                <i className="fas fa-trash me-1"></i>
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
