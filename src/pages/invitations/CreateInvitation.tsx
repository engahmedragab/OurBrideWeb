import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from "@/Assets/logo.png";
import invita from "@/Assets/My Invitation.jpeg";
import invita2 from "@/Assets/My Invitation 2.jpeg";
import invita3 from "@/Assets/My Invitation 3.jpeg";
import invita4 from "@/Assets/My Invitation 4.jpeg";

import MainButton from "@/SimpleComponent/MainButton/MainButton";
import { InvitationDataContext } from "@/Context/InvitationDataContext";

export default function CreateInvitation() {
  let navigate = useNavigate();
  let { invitaionData, setInvitaionData } = useContext(InvitationDataContext);

  const getImg = (e) => {
    let InvitaionData = { ...invitaionData };
    InvitaionData["img-src"] = e.target["src"];
    setInvitaionData(InvitaionData);
  };

  const getData = (e) => {
    let InvitaionData = { ...invitaionData };
    InvitaionData[e.target.name] = e.target.value;
    setInvitaionData(InvitaionData);
  };

  const sendData = () => {
    JSON.stringify(invitaionData);
    sessionStorage.setItem("InvitationData", JSON.stringify(invitaionData));
    if (
      invitaionData["img-src"] ===
      "http://localhost:3000/static/media/My%20Invitation.016d3ce66c84a1b7139f.jpeg"
    ) {
      navigate("/invitationCard");
    } else if (
      invitaionData["img-src"] ===
      "http://localhost:3000/static/media/My%20Invitation%202.b008917dc8c14901966d.jpeg"
    ) {
      navigate("/invitationCard2");
    } else if (
      invitaionData["img-src"] ===
      "http://localhost:3000/static/media/My%20Invitation%203.7abe65bf0fb7e83ef32a.jpeg"
    ) {
      navigate("/invitationCard3");
    } else if (
      invitaionData["img-src"] ===
      "http://localhost:3000/static/media/My%20Invitation%204.469b610a6163c90bea91.jpeg"
    ) {
      navigate("/invitationCard4");
    }
  };

  function SubmitData(e) {
    e.preventDefault();
    sendData();
  }

  return (
    <>
      <div className="create-invitation-section">
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
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="hero-content">
                  <div className="hero-badge">
                    <div className="badge-icon">
                      <i className="fas fa-envelope-open"></i>
                    </div>
                    <span>Digital Invitations</span>
                  </div>
                  <h1 className="hero-title">
                    Create Your <span className="text-gradient">Wedding Invitation</span>
                  </h1>
                  <p className="hero-description">
                    Design beautiful digital wedding invitations that your guests will love.
                    Share your special day with style and elegance.
                  </p>
                  <div className="hero-actions">
                    <MainButton
                      title="Open Your Invitation"
                      classes="btn-outline-main hero-btn-secondary"
                    />
                    <p className="hero-subtitle">or</p>
                    <h3 className="hero-subtitle">Create new invitation</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="invitation-form-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="invitation-form-container">
                  <div className="invitation-form-card">
                    <div className="form-header">
                      <h2 className="form-title">Create Your Online Invitation</h2>
                      <p className="form-subtitle">اعمل دعوة فرحك الاونلاين - Design your perfect wedding invitation</p>
                    </div>

                    <form onSubmit={SubmitData} className="invitation-form">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="bride-name" className="form-label">
                              <i className="fas fa-female me-2"></i>
                              Bride Name - اسم العروسة
                            </label>
                            <input
                              onChange={getData}
                              required
                              type="text"
                              name="bride-name"
                              id="bride-name"
                              className="form-control modern-input"
                              placeholder="Enter bride's name"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="groom-name" className="form-label">
                              <i className="fas fa-male me-2"></i>
                              Groom Name - اسم العريس
                            </label>
                            <input
                              onChange={getData}
                              required
                              type="text"
                              name="groom-name"
                              id="groom-name"
                              className="form-control modern-input"
                              placeholder="Enter groom's name"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="wedding-date" className="form-label">
                              <i className="fas fa-calendar-alt me-2"></i>
                              Wedding Date - تاريخ الفرح
                            </label>
                            <input
                              onChange={getData}
                              required
                              type="date"
                              name="wedding-date"
                              id="wedding-date"
                              className="form-control modern-input"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="engagement-date" className="form-label">
                              <i className="fas fa-heart me-2"></i>
                              Engagement Date - تاريخ الخطوبة
                            </label>
                            <input
                              onChange={getData}
                              required
                              type="date"
                              name="engagement-date"
                              id="engagement-date"
                              className="form-control modern-input"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="henna-date" className="form-label">
                              <i className="fas fa-paint-brush me-2"></i>
                              Henna Date - تاريخ الحنة
                            </label>
                            <input
                              onChange={getData}
                              required
                              type="date"
                              name="henna-date"
                              id="henna-date"
                              className="form-control modern-input"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="crown-date" className="form-label">
                              <i className="fas fa-crown me-2"></i>
                              Crown Date - تاريخ كتب الكتاب
                            </label>
                            <input
                              onChange={getData}
                              required
                              type="date"
                              name="crown-date"
                              id="crown-date"
                              className="form-control modern-input"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="area" className="form-label">
                              <i className="fas fa-map-marker-alt me-2"></i>
                              Area - المنطقة
                            </label>
                            <input
                              onChange={getData}
                              required
                              type="text"
                              name="area"
                              id="area"
                              className="form-control modern-input"
                              placeholder="Enter area"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="wedding-hole" className="form-label">
                              <i className="fas fa-building me-2"></i>
                              Wedding Hall - اسم قاعة الفرح
                            </label>
                            <input
                              onChange={getData}
                              required
                              type="text"
                              name="wedding-hole"
                              id="wedding-hole"
                              className="form-control modern-input"
                              placeholder="Enter hall name"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="adress" className="form-label">
                          <i className="fas fa-map me-2"></i>
                          Wedding Address - عنوان القاعة
                        </label>
                        <input
                          onChange={getData}
                          required
                          type="text"
                          name="adress"
                          id="adress"
                          className="form-control modern-input"
                          placeholder="Enter full address"
                        />
                      </div>

                      {/* Template Selection */}
                      <div className="template-selection">
                        <h3 className="template-title">Choose Your Invitation Template</h3>
                        <p className="template-subtitle">Select from our beautiful collection of invitation designs</p>

                        <div className="template-grid">
                          <div className="template-item">
                            <div className="template-card">
                              <img
                                onClick={getImg}
                                src={invita}
                                className="template-image"
                                alt="Template 1"
                              />
                              <div className="template-overlay">
                                <div className="template-actions">
                                  <button type="button" className="btn btn-main btn-sm">
                                    <i className="fas fa-eye me-1"></i>
                                    Preview
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="template-item">
                            <div className="template-card">
                              <img
                                onClick={getImg}
                                src={invita2}
                                className="template-image"
                                alt="Template 2"
                              />
                              <div className="template-overlay">
                                <div className="template-actions">
                                  <button type="button" className="btn btn-main btn-sm">
                                    <i className="fas fa-eye me-1"></i>
                                    Preview
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="template-item">
                            <div className="template-card">
                              <img
                                onClick={getImg}
                                src={invita3}
                                className="template-image"
                                alt="Template 3"
                              />
                              <div className="template-overlay">
                                <div className="template-actions">
                                  <button type="button" className="btn btn-main btn-sm">
                                    <i className="fas fa-eye me-1"></i>
                                    Preview
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="template-item">
                            <div className="template-card">
                              <img
                                onClick={getImg}
                                src={invita4}
                                className="template-image"
                                alt="Template 4"
                              />
                              <div className="template-overlay">
                                <div className="template-actions">
                                  <button type="button" className="btn btn-main btn-sm">
                                    <i className="fas fa-eye me-1"></i>
                                    Preview
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-actions">
                        <button
                          type="submit"
                          className="btn btn-main create-btn"
                        >
                          <i className="fas fa-magic me-2"></i>
                          Create Invitation
                        </button>
                      </div>
                    </form>
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
