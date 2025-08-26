import React from 'react';
import Icon1 from "../../Assets/service-1.png";
import Icon2 from "../../Assets/service-2.png";
import Icon3 from "../../Assets/service-3.png";
import MainButton from '../../SimpleComponent/MainButton/MainButton';

export default function Invitation() {
  return (
    <>
      <div className="invitation-section">
        <div className="container">
          {/* Hero Section */}
          <div className="invitation-hero">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="invitation-title">
                  Wedding <span className="text-main">Invitation</span>
                </h1>
                <p className="invitation-subtitle">
                  Create your online invitation to share your happiness with others
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="invitation-features-section">
            <div className="row">
              <div className="col-lg-4">
                <div className="invitation-feature-card">
                  <div className="feature-image">
                    <img src={Icon1} alt="Select Date" className="feature-icon" />
                  </div>
                  <div className="feature-content">
                    <h3>Select Your Wedding Date</h3>
                    <p className="feature-description">
                      Choose your wedding date and venue location
                    </p>
                    <p className="feature-description-arabic">
                      حدد معاد فرحك و مكان الفرح و القاعة
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="invitation-feature-card">
                  <div className="feature-image">
                    <img src={Icon2} alt="Create Invitation" className="feature-icon" />
                  </div>
                  <div className="feature-content">
                    <h3>Create Wedding Invitation</h3>
                    <p className="feature-description">
                      Make your wedding invitation with our invitation creator
                    </p>
                    <p className="feature-description-arabic">
                      اعمل دعوة فرحك عن طريق دعوة الفرح الاونلاين بتاعتنا
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="invitation-feature-card">
                  <div className="feature-image">
                    <img src={Icon3} alt="Share Invitation" className="feature-icon" />
                  </div>
                  <div className="feature-content">
                    <h3>Share Your Invitation</h3>
                    <p className="feature-description">
                      Share your beautiful invitation with friends and family
                    </p>
                    <p className="feature-description-arabic">
                      شارك دعوة فرحك الجميلة مع الأهل والأصدقاء
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="invitation-cta-section">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h2 className="cta-title">Ready to Create Your Invitation?</h2>
                <p className="cta-description">
                  Start creating your beautiful wedding invitation today and share your special day with everyone you love.
                </p>
                <div className="cta-buttons">
                  <MainButton
                    title="Create Invitation"
                    classes="btn-main cta-btn"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
