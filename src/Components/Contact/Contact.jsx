import React from "react";
import MainButton from "../../SimpleComponent/MainButton/MainButton";

export default function Contact() {
  return (
    <>
      <div className="container">
        <div className="contact m-5 w-70">
          <div className="contain w-70 d-flex flex-column justify-content-center align-items-center">
            <h2 className="text-main main-font fw-bolder fs-1">OUR CONTACT</h2>
            <h2 className="fw-light">
              <span className="fw-semibold">Get in</span> Touch.
            </h2>
          </div>
          <form className="row mt-5">
            <div className="col-lg-6">
              <label htmlFor="name" className="mt-4 text-second fs-4">
                Enter your Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control-lg shadow-sm rounded-pill p-3 w-100 px-5"
                placeholder="full Name"
              />
            </div>
            <div className="col-lg-6">
              <label htmlFor="email" className="mt-4 text-second fs-4">
                Enter your Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control-lg shadow-sm rounded-pill p-3 w-100 px-5"
                placeholder="Email"
              />
            </div>
            <div className="col-12">
              <textarea
                type="text"
                id="message"
                className="form-control-lg shadow-sm rounded p-3 w-100 px-5 my-5"
                placeholder="Enter your Message..."
              />
            </div>
            <MainButton title="Send Now.." classes="btn-main" />
          </form>
        </div>
      </div>
    </>
  );
}
