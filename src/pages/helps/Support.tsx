import ContactForm from "@/Components/Contact/ContactForm";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Support() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a link to reset your password. Check your spam folder if you don't see the email within a few minutes."
    },
    {
      id: 2,
      question: "How do I contact support?",
      answer: "You can contact our support team by emailing support@our-bride.com or using the contact form below. We typically respond within 24 hours during business days."
    },
    {
      id: 3,
      question: "How do I create a wedding invitation?",
      answer: "After logging in, go to 'Create Invitation' from the main menu. Choose your preferred template, add your wedding details, and customize the design. You can preview and share your invitation once you're satisfied with the result."
    },
    {
      id: 4,
      question: "Can I edit my invitation after creating it?",
      answer: "Yes, you can edit your invitation at any time by logging into your account and accessing your created invitations. Look for the 'Edit' option next to your invitation."
    },
    {
      id: 5,
      question: "How do I share my invitation with guests?",
      answer: "Once your invitation is ready, you can share it via the share button which will generate a unique link. You can send this link via text, email, or social media to your guests."
    },
    {
      id: 6,
      question: "Is my personal information secure?",
      answer: "Yes, we take your privacy seriously. All personal information is encrypted and stored securely. Please review our Privacy Policy for detailed information about how we handle your data."
    },
    {
      id: 7,
      question: "How do I delete my account?",
      answer: "You can delete your account by visiting the 'Delete Account' page in your account settings. Please note that this action is irreversible and will permanently remove all your data."
    },
    {
      id: 8,
      question: "What if I'm having technical issues?",
      answer: "If you're experiencing technical issues, please try refreshing the page or clearing your browser cache. If the problem persists, contact our support team with details about the issue you're experiencing."
    }
  ];

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <div className="support-page">
      <div className="container">
        {/* Hero Section */}
        <div className="support-hero">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="support-title">Support Center</h1>
              <p className="support-subtitle">
                We're here to help you with any questions or issues you may have.
                Find answers to common questions or contact our support team directly.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="support-contact-section">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="support-card">
                <div className="support-card-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h4>Email Support</h4>
                <p>Get help via email</p>
                <a href="mailto:support@our-bride.com" className="support-link">
                  support@our-bride.com
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="support-card">
                <div className="support-card-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <h4>Phone Support</h4>
                <p>Call us for immediate assistance</p>
                <a href="tel:+1234567890" className="support-link">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="support-card">
                <div className="support-card-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h4>Response Time</h4>
                <p>We typically respond within</p>
                <span className="support-time">24 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="support-faq-section">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="faq-title">Frequently Asked Questions</h2>
              <div className="faq-container">
                {faqData.map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <div
                      className="faq-question"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <h4>{faq.question}</h4>
                      <i className={`fas fa-chevron-${activeFaq === faq.id ? 'up' : 'down'}`}></i>
                    </div>
                    {activeFaq === faq.id && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="support-form-section">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="form-title">Still Need Help?</h2>
              <p className="form-subtitle">
                Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
              </p>
              <ContactForm onSuccess={() => { }} onError={() => { }} />
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="support-resources-section">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="resource-card">
                <div className="resource-icon">
                  <i className="fas fa-file-contract"></i>
                </div>
                <h4>Terms & Conditions</h4>
                <p>Read our terms of service and user agreement</p>
                <Link to="/terms-conditions" className="resource-link">
                  View Terms <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="resource-card">
                <div className="resource-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h4>Privacy Policy</h4>
                <p>Learn how we protect and handle your data</p>
                <Link to="/privacy-policy" className="resource-link">
                  View Policy <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="resource-card">
                <div className="resource-icon">
                  <i className="fas fa-user-times"></i>
                </div>
                <h4>Delete Account</h4>
                <p>Need to remove your account? We can help</p>
                <Link to="/delete-account" className="resource-link">
                  Delete Account <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        .support-page {
          padding: 80px 0;
          background: var(--bg-light);
          min-height: 100vh;
        }

        .support-hero {
          margin-bottom: 60px;
        }

        .support-title {
          font-size: 3rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 20px;
        }

        .support-subtitle {
          font-size: 1.2rem;
          color: var(--text-light);
          line-height: 1.6;
        }

        .support-contact-section {
          margin-bottom: 80px;
        }

        .support-card {
          background: var(--bg-white);
          padding: 40px 30px;
          border-radius: var(--border-radius);
          text-align: center;
          box-shadow: var(--shadow);
          transition: transform 0.3s ease;
          height: 100%;
        }

        .support-card:hover {
          transform: translateY(-5px);
        }

        .support-card-icon {
          width: 80px;
          height: 80px;
          background: var(--main);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .support-card-icon i {
          font-size: 2rem;
          color: white;
        }

        .support-card h4 {
          color: var(--text-dark);
          margin-bottom: 10px;
          font-weight: 600;
        }

        .support-card p {
          color: var(--text-light);
          margin-bottom: 15px;
        }

        .support-link {
          color: var(--main);
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .support-link:hover {
          color: var(--third);
        }

        .support-time {
          color: var(--main);
          font-weight: 600;
          font-size: 1.2rem;
        }

        .support-faq-section {
          margin-bottom: 80px;
        }

        .faq-title {
          text-align: center;
          color: var(--text-dark);
          margin-bottom: 40px;
          font-weight: 600;
        }

        .faq-container {
          background: var(--bg-white);
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        .faq-item {
          border-bottom: 1px solid var(--bg-light);
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          padding: 25px 30px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.3s ease;
        }

        .faq-question:hover {
          background-color: var(--bg-light);
        }

        .faq-question h4 {
          color: var(--text-dark);
          margin: 0;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .faq-question i {
          color: var(--main);
          transition: transform 0.3s ease;
        }

        .faq-answer {
          padding: 0 30px 25px;
          background-color: var(--bg-light);
        }

        .faq-answer p {
          color: var(--text-light);
          line-height: 1.6;
          margin: 0;
        }

        .support-form-section {
          margin-bottom: 80px;
        }

        .form-title {
          text-align: center;
          color: var(--text-dark);
          margin-bottom: 15px;
          font-weight: 600;
        }

        .form-subtitle {
          text-align: center;
          color: var(--text-light);
          margin-bottom: 40px;
        }

        .support-resources-section {
          margin-bottom: 40px;
        }

        .resource-card {
          background: var(--bg-white);
          padding: 30px;
          border-radius: var(--border-radius);
          text-align: center;
          box-shadow: var(--shadow);
          transition: transform 0.3s ease;
          height: 100%;
        }

        .resource-card:hover {
          transform: translateY(-5px);
        }

        .resource-icon {
          width: 60px;
          height: 60px;
          background: var(--main);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .resource-icon i {
          font-size: 1.5rem;
          color: white;
        }

        .resource-card h4 {
          color: var(--text-dark);
          margin-bottom: 10px;
          font-weight: 600;
        }

        .resource-card p {
          color: var(--text-light);
          margin-bottom: 20px;
        }

        .resource-link {
          color: var(--main);
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .resource-link:hover {
          color: var(--third);
        }

        @media (max-width: 768px) {
          .support-title {
            font-size: 2rem;
          }
          
          .support-subtitle {
            font-size: 1rem;
          }
          
          .support-card {
            padding: 30px 20px;
          }
          
          .faq-question {
            padding: 20px;
          }
          
          .faq-answer {
            padding: 0 20px 20px;
          }
        }
      `}</style>
    </div>
  );
}
