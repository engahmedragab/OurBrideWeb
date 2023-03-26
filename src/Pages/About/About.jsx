import React from 'react';
import img0 from "../../Assets/Weddingplanner0.png";
import img1 from "../../Assets/Weddingplanner1.png";
import img2 from "../../Assets/Weddingplanner2.png";
import img3 from "../../Assets/Weddingplanner3.png";
import img4 from "../../Assets/Weddingplanner4.png";

export default function About() {
  return<>
  <div className="about m-5">
    <div className="contain w-100 d-flex flex-column justify-content-center align-items-center">
      <h2 className='text-main main-font fw-bolder fs-1'>WELCOME</h2>
      <h2 className='fw-light'><span className='fw-semibold'>Our working experience</span> to take care of your marrage and your wedding.</h2>
    </div>
   
    <div id="carouselExampleControls" className="carousel slide w-50 mx-auto" data-bs-ride="carousel">
    <div className="carousel-inner">
      <div className="carousel-item active">
        <img src={img0} className="d-block w-100"/>   
      </div>
      <div className="carousel-item">
        <img src={img1} className="d-block w-100"/>
      </div>
      <div className="carousel-item">
        <img src={img2} className="d-block w-100"/>
      </div>
      <div className="carousel-item">
        <img src={img3} className="d-block w-100"/>
      </div>
      <div className="carousel-item">
        <img src={img4} className="d-block w-100"/>
      </div>
    </div>
    <button className="carousel-control-prev text-second" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next text-second" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
    </div>
    <div className="comment text-center my-4">

        <p className='text-muted my-2 fa-1x'>From booking the right florist to unpacking after your honeymoon We cant wait to help you start the next chapter of your life.</p>
        <p className='text-muted my-2 fa-xs'> .من أصغر اختيارات وتفاصيل الفرح، من اختيارك للورد لحد ما تكون بتفضي الشنط بعد شهر العسل هنكون معاك، بنساعدك ونقولك كل اللي لازم تعرفه عن المرحلة اللي جاية في حياتكك</p>
    </div>
  </div>
  </>
}
