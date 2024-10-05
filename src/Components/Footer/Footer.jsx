import React from "react";
import { Link } from "react-router-dom";
import appStore from "../../Assets/appstore.png";
import googleplay from "../../Assets/googleplay.png";

export default function Footer() {
  return (
    <>
      <div className="container">
        <div className="row p-5">
          {/* App Store and Google Play Links */}
          <div className="col-lg-3 d-flex align-items-center">
            <a href="#" className="m-1">
              <img className="w-100" src={appStore} alt="App Store" />
            </a>
            <a href="#" className="m-1">
              <img className="w-100" src={googleplay} alt="Google Play" />
            </a>
          </div>

          {/* Social Media Links */}
          <div className="col-lg-3 offset-lg-6 text-center">
            <h3 className="main-font fw-bolder">Reach US ON.</h3>
            <div className="icon d-flex justify-content-center">
              <a
                className="text-decoration-none"
                href="https://www.facebook.com/OurBrideCom"
              >
                <div className="icon-box rounded-circle d-flex justify-content-center align-items-center m-3">
                  <i className="fa-brands fa-facebook-f"></i>
                </div>
              </a>
              <a
                className="text-decoration-none"
                href="https://www.instagram.com/ourbridecom"
              >
                <div className="icon-box rounded-circle d-flex justify-content-center align-items-center m-3">
                  <i className="fa-brands fa-instagram"></i>
                </div>
              </a>
              <a
                className="text-decoration-none"
                href="https://mobile.twitter.com/ourbridecom"
              >
                <div className="icon-box rounded-circle d-flex justify-content-center align-items-center m-3">
                  <i className="fa-brands fa-twitter"></i>
                </div>
              </a>
              <a
                className="text-decoration-none"
                href="https://www.tiktok.com/@ourbridecom"
              >
                <div className="icon-box rounded-circle d-flex justify-content-center align-items-center m-3">
                  <i className="fa-brands fa-tiktok"></i>
                </div>
              </a>
            </div>
          </div>

          {/* Horizontal Line */}
          <hr className="text-black-50" />

          {/* Useful Links Section */}
          <div className="col-lg-3  offset-lg-9 text-center ">
            <h3 className="main-font fw-bolder">Useful Links</h3>
            <ul className="list-unstyled">
              <li>
                <a
                  className="hover-main text-decoration-none text-main"
                  href="https://www.our-bride.store"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`fas fa-store icon m-1`}> </i>OurBride Store
                </a>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover-main text-decoration-none text-main"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="hover-main text-decoration-none text-main"
                >
                  Terms and Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/delete-account"
                  className="hover-main text-decoration-none text-main"
                >
                  Delete Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="text-center">
            {/* Footer Copyright */}
            <p className="text-muted py-4">
              © 2024 Crafted by{" "}
              <Link
                to="/"
                className="hover-main text-decoration-none text-main"
              >
                OurBride
              </Link>{" "}
              All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
