import React, { useState } from "react";
import srcImg from "@/Assets/Weddingplanner2.png";
import { Link, useNavigate } from "react-router-dom";
import Joi from "joi";
import authService from "@/services/authService";

export default function Login() {
  let navigate = useNavigate();
  let [isLoading, setIsLoading] = useState(false);
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

  async function sendLoginUserData() {
    try {
      const data = await authService.register(user);
      if (data.message === "success") {
        setIsLoading(false);
        localStorage.setItem("userToken", data.token);
        navigate("/home");
      } else {
        setIsLoading(false);
        setError(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  }

  function submitLoginData(e) {
    setIsLoading(true);
    e.preventDefault();
    let validation = validateLoginFormData();
    if (validation.error) {
      setIsLoading(false);
      setErrorList(validation.error.details);
    } else {
      sendLoginUserData();
    }
  }

  function validateLoginFormData() {
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
      <div className="login-section">
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
                      <i className="fas fa-sign-in-alt"></i>
                    </div>
                    <span>Welcome Back</span>
                  </div>
                  <h1 className="hero-title">
                    Sign In to <span className="text-gradient">OurBride</span>
                  </h1>
                  <p className="hero-description">
                    Access your wedding planning dashboard and continue creating your perfect wedding experience.
                  </p>
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
                        <span>Trusted Platform</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="login-form-container">
                  <div className="login-form-card">
                    <div className="form-header">
                      <h2 className="form-title">Sign In to Your Account</h2>
                      <p className="form-subtitle">Enter your credentials to access your wedding planning dashboard</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger alert-modern">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    )}

                    <form onSubmit={submitLoginData} className="login-form">
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          <i className="fas fa-envelope me-2"></i>
                          Email Address
                        </label>
                        <input
                          onChange={getUserData}
                          type="email"
                          id="email"
                          name="email"
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
                          id="password"
                          name="password"
                          className="form-control modern-input"
                          placeholder="Enter your password"
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
                          <input type="checkbox" className="form-check-input" id="remember" />
                          <label className="form-check-label" htmlFor="remember">
                            Remember me
                          </label>
                        </div>
                        <Link to="/forgot-password" className="forgot-password">
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-main login-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Signing In...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-sign-in-alt me-2"></i>
                            Sign In
                          </>
                        )}
                      </button>
                    </form>

                    <div className="form-footer">
                      <p className="signup-prompt">
                        Don't have an account?{" "}
                        <Link to="/register" className="signup-link">
                          Create one now
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
