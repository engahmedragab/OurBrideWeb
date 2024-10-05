import React from "react";
import MainButton from "../../SimpleComponent/MainButton/MainButton.jsx";
import LoadingScreen from "../LoadingScreen/LoadingScreen.jsx";
import { SvgIcons } from "../SVG/SvgIcons.jsx";
import homeimage from "../../Assets/appHome.jpg";
import screen1 from "../../Assets/screen1.jpg"; // Replace with your actual image paths
import screen2 from "../../Assets/screen2.jpg";
import screen3 from "../../Assets/screen4.jpg";
import screensplach from "../../Assets/splachscreen.jpg";
import servces from "../../Assets/servces-pana.png";
import cart from "../../Assets/cart-pana.png";

export default function Home() {
  return (
    <>
      {/* <LoadingScreen/> */}
      <div className="home">
        {/* <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-inner">
      <div className="carousel-item active">
        <img src={c0} className="d-block w-100"/>
      </div>
      <div className="carousel-item">
        <img src={c1} className="d-block w-100"/>
      </div>
      <div className="carousel-item">
        <img src={c2} className="d-block w-100"/>
      </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
    <div className="contain d-flex justify-content-center align-items-center position-absolute">
      <h2>OurBride</h2>
    </div>
    </div> */}
        <div className="container">
          <div className="row p-5 my-5">
            <div className="col-lg-6">
              <div className="contain">
                <h1 className="main-font main-head">
                  <b>Your</b> <span className="text-main">Bride</span> always is
                  our <b>Responsibility.</b>
                </h1>
                <p className="lead fs-6 pe-5 py-3">
                  We are a whole community about marriage, not just a page that
                  helps you with information through a wide range of services
                  and activities, we will help you with it until we reach you on
                  your wedding day.
                </p>
                <form>
                  <input
                    type="email"
                    className="form-control-lg shadow rounded-pill p-3 px-5 w-75 my-3"
                    placeholder="Enter your Email"
                  />
                  <input
                    type=""
                    className="form-control-lg shadow rounded-pill p-3 px-5 w-75 my-3"
                    placeholder="Enter your Phone"
                  />
                  <div>
                    <MainButton
                      title="Join Us"
                      link="register"
                      classes="btn-main p-2 my-2 m-3 h-50"
                    />
                  </div>
                </form>
                <p className="lead fs-6 pe-5 py-3">
                  Let us reach you, enter your Phone Number or Email, and we
                  will provide you with details and developments.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <SvgIcons />
            </div>
          </div>
        </div>

        <section
          id="home"
          className="app-section text-center justify-content-center "
        >
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-6 text-center text-md-start">
                <h1 className="app-title">
                  Your wedding, our commitment at OurBride.
                </h1>
                <p className="app-description">
                  Plan your perfect wedding with OurBride. Digital planner,
                  services, and products!
                </p>

                <div className="download-btn">
                  <a href="#" className="btn btn-lg btn-main me-2 ">
                    <i className="fab fa-google-play"></i> Get it on Google Play
                  </a>
                  <a href="#" className="btn btn-lg btn-main disabled">
                    <i className="fab fa-apple"></i> Coming Soon on the App
                    Store
                  </a>
                </div>
              </div>

              <div className="col-md-6 text-center mt-4 mt-md-0 position-relative">
                <div className="circle-bg"></div>
                <img
                  src={homeimage}
                  alt="Mobile App Screenshot"
                  className="app-screenshot"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="app-features" className="app-features-section">
          <div className="container-feature">
            <div className="row row-feature align-items-center justify-content-between">
              {/* Mobile Screens Section */}
              <div className="red-rectangle col-lg-6">
                <div className="d-flex justify-content-center">
                  <div className="mobile-screens d-flex">
                    <img src={screen1} alt="App screen 1" className="screen" />
                    <img src={screen2} alt="App screen 2" className="screen" />
                    <img src={screen3} alt="App screen 3" className="screen" />
                  </div>
                </div>
              </div>
              {/* Feature List Section */}
              <div className="col-lg-6">
                <h2 className="section-title">Application Features</h2>
                <ul className="feature-list">
                  <li className="feature-item">
                    <span className="feature-number">01</span>
                    <p>
                      <strong>Organize Your Wedding Items:</strong> Easily
                      manage your wedding checklist by adding and tracking
                      essential items such as venue reservations, catering,
                      decorations, and more.
                    </p>
                  </li>
                  <li className="feature-item">
                    <span className="feature-number">02</span>
                    <p>
                      <strong>Track Preparations:</strong> Monitor your wedding
                      preparations progress. The app helps you keep tabs on
                      completed tasks and what’s still pending, ensuring you're
                      on schedule.
                    </p>
                  </li>
                  <li className="feature-item">
                    <span className="feature-number">03</span>
                    <p>
                      <strong>Manage Todos and Checklists:</strong> Track
                      progress with visual indicators of completed and remaining
                      tasks, ensuring your wedding is fully organized.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="app-service" className="app-service-section">
          <div className="container">
            {/* Section Title */}
            <h2 className="section-title-service">Application Service</h2>
            <div className="row align-items-center justify-content-between ">
              {/* Service Cards */}
              <div className="col-md-6 d-flex justify-content-center service-card-container">
                <div className="service-card">
                  <div className="icon-circle">
                    <i className="fa fa-shopping-cart"></i>
                  </div>
                  <h3>Shop Products</h3>
                  <p>
                    Browse a wide selection of products available in our shop.
                    Purchase everything you need for your wedding, from bridal
                    accessories to decorations, all in one place.
                  </p>
                </div>
                <div className="service-card highlighted-card">
                  <div className="icon-circle">
                    <i className="fa fa-calendar-check"></i>
                  </div>
                  <h3>Vendor Service Reservations</h3>
                  <p>
                    Reserve services offered by our trusted vendors, including
                    catering, venues, photography, and more. Easily schedule and
                    manage your wedding services.
                  </p>
                </div>
              </div>

              <div className="col-md-6 text-center mt-4 mt-md-0 position-relative">
                <img
                  src={servces}
                  alt="Mobile App Screenshot"
                  className="app-service-screenshot"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="app-service" className="app-store-section">
        <div className="container">
          {/* Section Title */}
          <h2 className="section-title-service">Explore Our Store</h2>

          <div className="row align-items-center justify-content-between">
            {/* Left Side Service Cards */}
            <div className="col-md-6">
              <div className="row">
                {/* Shop Products */}
                <div className="service-card col-md-5 m-2 highlighted-card ">
                  <div className="icon-circle icon-shop">
                    <i className="fa fa-shopping-cart"></i>
                  </div>
                  <h3>Wide Range of Wedding Products</h3>
                  <p>
                    Explore a vast collection of wedding products from trusted
                    vendors. From bridal gowns, accessories, to decorations and
                    gifts, everything you need is right at your fingertips.
                  </p>
                </div>

                {/* Easy Navigation */}
                <div className="service-card col-md-5 m-2 shop-card">
                  <div className="icon-circle icon-compass">
                    <i className="fa fa-compass"></i>
                  </div>
                  <h3>Easy Navigation & Filtering</h3>
                  <p>
                    Quickly find what you’re looking for using our smart
                    filters. Sort products by category, price, popularity, or
                    reviews to make your shopping experience seamless.
                  </p>
                </div>
              </div>

              <div className="row mt-3">
                {/* Secure Payments */}
                <div className="service-card col-md-5 m-2 shop-card">
                  <div className="icon-circle icon-lock">
                    <i className="fa fa-lock"></i>
                  </div>
                  <h3>Secure Payments</h3>
                  <p>
                    Shop with confidence using our secure and trusted payment
                    options. Your transactions are protected, ensuring a safe
                    and smooth shopping experience.
                  </p>
                </div>

                {/* Fast Delivery */}
                <div className="service-card col-md-5 m-2 highlighted-card">
                  <div className="icon-circle icon-delivery">
                    <i className="fa fa-truck"></i>
                  </div>
                  <h3>Fast Delivery</h3>
                  <p>
                    Enjoy fast and reliable delivery right to your doorstep.
                    Track your orders easily and receive them on time, so you
                    can focus on planning your big day.
                  </p>
                </div>
              </div>
            </div>

            {/* Store Image/Visual Representation */}
            <div className="col-md-6 text-center mt-4 mt-md-0 position-relative">
              <img
                src={cart}
                alt="Store Representation"
                className="app-service-screenshot"
              />
              <a
                href="https://www.our-bride.store"
                className="btn btn-lg btn-main me-2 mt-5 "
              >
                Expolre <i className="fas fa-store icon m-1"></i> OurBride Store
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
