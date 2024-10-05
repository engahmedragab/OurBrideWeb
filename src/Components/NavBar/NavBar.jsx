import React from "react";
import logo from "../../Assets/logo.png";
import { Link } from "react-router-dom";
import MainButton from "../../SimpleComponent/MainButton/MainButton";

export default function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white  navbar-white fixed-nav">
        <div className="container">
          <a className="navbar-brand text-white" href="/">
            <img className="w-50" src={logo} />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className=" navs navbar-nav d-flex align-items-center me-auto list-unstyled mb-2 mb-lg-0">
              <li className="nav-item m-1">
                <Link className="nav-link px-4" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item m-1">
                <Link className="nav-link px-4" to="about">
                  About
                </Link>
              </li>

              {/* <li className="nav-item">
                <Link className="nav-link px-4" to="invitation">
                  Invitation
                </Link>
              </li> */}
              <li className="nav-item m-1">
                <Link className="nav-link px-4" to="items">
                  Items
                </Link>
              </li>
              <li className="nav-item m-1">
                <Link className="nav-link px-4" to="contact">
                  Contact
                </Link>
              </li>
            </ul>
            <MainButton
              title="Store"
              classes="btn-main "
              icon="store"
              onClick={() =>
                window.open("https://www.our-bride.store", "_blank")
              }
            />
          </div>
        </div>
      </nav>
    </>
  );
}
