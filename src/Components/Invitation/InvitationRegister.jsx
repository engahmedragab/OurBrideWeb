import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/apiService";

export default function InvitationRegister() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: "",
        phone: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get return URL from query params
    const queryParams = new URLSearchParams(location.search);
    const returnUrl = queryParams.get('returnUrl') || '/invitations/create';

    useEffect(() => {
        // Check if user is already authenticated
        const token = localStorage.getItem('userToken');
        if (token) {
            navigate('/invitations/create');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^(?:\+20|0)?1[0125][0-9]{8}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid Egyptian phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Call the landing sign-in service (equivalent to _identityService.LandingSignInAsync)
            const response = await authService.landingSignIn(formData.email, formData.phone);


            // Redirect to create invitation page
            navigate('/invitations/create');

        } catch (error) {
            // Registration error handled silently
            setErrors({ submit: error.message || 'Registration failed. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="invitation-register-section">
            {/* Background Image */}
            <div
                className="register-background"
                style={{
                    backgroundImage: "url('/images/invitations/1.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    position: 'relative'
                }}
            >
                {/* Overlay */}
                <div
                    className="register-overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)'
                    }}
                ></div>

                {/* Content */}
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <div className="register-form-container">
                                <div className="register-form-card">
                                    <div className="form-header text-center">
                                        <h1 className="form-title">Register</h1>
                                        <h2>Create a new account.</h2>
                                        <hr />
                                    </div>

                                    <form id="registerForm" onSubmit={handleSubmit} className="invitation-register-form">
                                        {errors.submit && (
                                            <div className="alert alert-danger">
                                                {errors.submit}
                                            </div>
                                        )}

                                        <div className="form-floating mb-3">
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Email"
                                                autoComplete="username"
                                                aria-required="true"
                                            />
                                            <label htmlFor="email">Email</label>
                                            {errors.email && (
                                                <div className="invalid-feedback">{errors.email}</div>
                                            )}
                                        </div>

                                        <div className="form-floating mb-3">
                                            <input
                                                type="tel"
                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Phone"
                                                autoComplete="phone"
                                                aria-required="true"
                                            />
                                            <label htmlFor="phone">Phone</label>
                                            {errors.phone && (
                                                <div className="invalid-feedback">{errors.phone}</div>
                                            )}
                                        </div>

                                        <button
                                            id="registerSubmit"
                                            type="submit"
                                            className="w-100 btn btn-lg btn-primary confirm-button"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin me-2"></i>
                                                    Registering...
                                                </>
                                            ) : (
                                                'Register'
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
