import React from 'react';
import MainButton from '../../SimpleComponent/MainButton/MainButton.jsx';
import LoadingScreen from '../LoadingScreen/LoadingScreen.jsx';
import {SvgIcons} from "../SVG/SvgIcons.jsx";


export default function Home() {
  return<>
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
    <div className="row p-5 my-5">
      <div className="col-lg-6">
        <div className="contain">

          <h1 className="main-font main-head"><b>Your</b> <span className='text-main'>Bride</span> always is our <b>Responsibility.</b></h1>
          <p className='lead fs-6 pe-5 py-3'>We are a whole community about marriage, not just a page that helps you with information through a wide range of services and activities, we will help you with it until we reach you on your wedding day.</p>
          <form >
            <input type="email" className='form-control-lg shadow rounded-pill p-3 px-5 w-75 my-3' placeholder='Enter your Email'/>
            <input type="number" className='form-control-lg shadow rounded-pill p-3 px-5 w-75 my-3' placeholder='Enter your Phone'/>
            <MainButton title="Join Us" link="register" classes="btn-main p-2 my-2"/>
          </form>
          <p className='lead fs-6 pe-5 py-3'>Let us reach you, enter your Phone Number or Email, and we will provide you with details and developments.</p>
        </div>
      
      </div>
      <div className="col-lg-6">
        <SvgIcons/>
      </div>
    </div>
  </div>
  </> 
}
