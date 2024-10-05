import React from "react";
import img0 from "../../Assets/Weddingplanner0.png";
import img1 from "../../Assets/Weddingplanner1.png";
import img2 from "../../Assets/Weddingplanner2.png";
import img3 from "../../Assets/Weddingplanner3.png";
import img4 from "../../Assets/Weddingplanner4.png";

export default function About() {
  return (
    <>
      <div className="container about m-5">
        <div className="contain w-100 d-flex flex-column justify-content-center align-items-center">
          <h2 className="text-main main-font fw-bolder fs-1">WELCOME</h2>
          <h2 className="fw-light">
            <span className="fw-semibold">Our working experience</span> to take
            care of your marrage and your wedding.
          </h2>
        </div>

        <div
          id="carouselExampleIndicators"
          className="carousel slide  mx-auto"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators ">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="3"
              aria-label="Slide 4"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="4"
              aria-label="Slide 5"
            ></button>
          </div>
          <div className="carousel-inner w-50 mx-auto ">
            <div className="carousel-item active">
              <img src={img0} className="d-block w-100" alt="Slide 0" />
            </div>
            <div className="carousel-item ">
              <img src={img1} className="d-block w-100" alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src={img2} className="d-block w-100" alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src={img3} className="d-block w-100" alt="Slide 3" />
            </div>
            <div className="carousel-item">
              <img src={img4} className="d-block w-100" alt="Slide 4" />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="comment text-center my-4">
          <p className="text-muted my-2 fa-1x">
            From booking the right florist to unpacking after your honeymoon We
            cant wait to help you start the next chapter of your life.
          </p>
          <p className="text-muted my-2 fa-xs">
            {" "}
            .من أصغر اختيارات وتفاصيل الفرح، من اختيارك للورد لحد ما تكون بتفضي
            الشنط بعد شهر العسل هنكون معاك، بنساعدك ونقولك كل اللي لازم تعرفه عن
            المرحلة اللي جاية في حياتكك
          </p>
        </div>
      </div>
    </>
  );
}
