import React, { useState } from "react";
import { contactService } from "../../services/apiService";
import { createContactData } from "../../utils/browserInfo";

const ContactForm = ({
    source = "Contact Form",
    title = "Send us a Message",
    subtitle = "We're here to help with any questions",
    showPhone = true,
    className = "",
    onSuccess,
    onError
}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Create contact data with system information
            const contactData = await createContactData(formData, source);

            // Submit to API
            const response = await contactService.create(contactData);

            console.log("Contact form submitted successfully:", response);
            setSubmitStatus('success');

            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                message: ""
            });

            // Call success callback if provided
            if (onSuccess) {
                onSuccess(response);
            } else {
                alert('Thank you for your message! We will get back to you soon.');
            }

        } catch (error) {
            console.error("Error submitting contact form:", error);
            setSubmitStatus('error');

            // Call error callback if provided
            if (onError) {
                onError(error);
            } else {
                alert(error.message || 'Failed to send message. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`contact-form-container ${className}`}>
            <div className="contact-form-card">
                <div className="form-header">
                    <h2 className="form-title">{title}</h2>
                    <p className="form-subtitle">{subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    <i className="fas fa-user me-2"></i>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control modern-input"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    <i className="fas fa-envelope me-2"></i>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="form-control modern-input"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {showPhone && (
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                <i className="fas fa-phone me-2"></i>
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                className="form-control modern-input"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="message" className="form-label">
                            <i className="fas fa-comment me-2"></i>
                            Message
                        </label>
                        <textarea
                            className="form-control modern-input"
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us more about your inquiry..."
                            required
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-main contact-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin me-2"></i>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane me-2"></i>
                                    Send Message
                                </>
                            )}
                        </button>
                    </div>

                    {submitStatus === 'success' && (
                        <div className="alert alert-success mt-3">
                            <i className="fas fa-check-circle me-2"></i>
                            Message sent successfully!
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="alert alert-danger mt-3">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            Failed to send message. Please try again.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
