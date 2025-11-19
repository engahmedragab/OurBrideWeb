import React, { useState } from "react";
import srcImg from "@/Assets/Weddingplanner2.png";
import { Link, useNavigate } from "react-router-dom";
import Joi from "joi";
import authService from "@/services/authService";

export default function Register() {
  let navigate = useNavigate();
  let [error, setError] = useState();
  let [errorList, setErrorList] = useState([]);

  let [user, setUser] = useState({
    email: "",
    password: "",
  });

  function getUserData(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  }

  async function sendUserData() {
    try {
      const response = await authService.register(user);
      if (response.status === 200) {
        navigate("/login");
      } else {
      }
    } catch (error) {
      setError(error.message);
    }
  }

  function submitRegisterData(e) {
    e.preventDefault();
    let validation = validateFormData();
    if (validation.error) {
      setErrorList(validation.error.details);
    } else {
      sendUserData();
    }
  }

  function validateFormData() {
    let scheme = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string()
        .pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,20}$/)
        .min(4)
        .required(),
    });
    return scheme.validate(user, { abortEarly: false });
  }

  return (
    <>
      <div className="register-section">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-gradient"></div>
            <div className="hero-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>
          </div>
          <div className="container">
            <div className="row align-items-center min-vh-100">
              <div className="col-lg-6">
                <div className="hero-content">
                  <div className="hero-badge">
                    <div className="badge-icon">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <span>Join OurBride</span>
                  </div>
                  <h1 className="hero-title">
                    Create Your <span className="text-gradient">Wedding Account</span>
                  </h1>
                  <p className="hero-description">
                    Start your wedding planning journey today. Join thousands of happy couples who trust OurBride to create their perfect wedding.
                  </p>
                  <div className="hero-stats">
                    <div className="stat-item">
                      <div className="stat-number">15K+</div>
                      <div className="stat-label">Happy Couples</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">1000+</div>
                      <div className="stat-label">Premium Vendors</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">4.9★</div>
                      <div className="stat-label">App Rating</div>
                    </div>
                  </div>
                  <div className="hero-trust">
                    <div className="trust-badges">
                      <div className="trust-badge">
                        <i className="fas fa-shield-alt"></i>
                        <span>100% Secure</span>
                      </div>
                      <div className="trust-badge">
                        <i className="fas fa-clock"></i>
                        <span>24/7 Support</span>
                      </div>
                      <div className="trust-badge">
                        <i className="fas fa-award"></i>
                        <span>Free Forever</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="register-form-container">
                  <div className="register-form-card">
                    <div className="form-header">
                      <h2 className="form-title">Create Your Account</h2>
                      <p className="form-subtitle">Join OurBride and start planning your perfect wedding</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger alert-modern">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    )}

                    <form onSubmit={submitRegisterData} className="register-form">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="firstName" className="form-label">
                              <i className="fas fa-user me-2"></i>
                              First Name
                            </label>
                            <input
                              required
                              type="text"
                              name="firstName"
                              id="firstName"
                              className="form-control modern-input"
                              placeholder="Enter your first name"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="lastName" className="form-label">
                              <i className="fas fa-user me-2"></i>
                              Last Name
                            </label>
                            <input
                              required
                              type="text"
                              name="lastName"
                              id="lastName"
                              className="form-control modern-input"
                              placeholder="Enter your last name"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          <i className="fas fa-envelope me-2"></i>
                          Email Address
                        </label>
                        <input
                          onChange={getUserData}
                          type="email"
                          name="email"
                          id="email"
                          className="form-control modern-input"
                          placeholder="Enter your email address"
                        />
                        {errorList.filter((err) => err.context.label === "email")[0] && (
                          <div className="error-message">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            {errorList.filter((err) => err.context.label === "email")[0].message}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="password" className="form-label">
                          <i className="fas fa-lock me-2"></i>
                          Password
                        </label>
                        <input
                          onChange={getUserData}
                          type="password"
                          name="password"
                          id="password"
                          className="form-control modern-input"
                          placeholder="Create a strong password"
                        />
                        {errorList.filter((err) => err.context.label === "password")[0] && (
                          <div className="error-message">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            Password must contain a capital letter and special character
                          </div>
                        )}
                      </div>

                      <div className="form-options">
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="terms" required />
                          <label className="form-check-label" htmlFor="terms">
                            I agree to the{" "}
                            <Link to="/terms" className="terms-link">Terms of Service</Link> and{" "}
                            <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                          </label>
                        </div>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="newsletter" />
                          <label className="form-check-label" htmlFor="newsletter">
                            Send me wedding planning tips and updates
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-main register-btn"
                      >
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </button>
                    </form>

                    <div className="form-footer">
                      <p className="login-prompt">
                        Already have an account?{" "}
                        <Link to="/login" className="login-link">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
