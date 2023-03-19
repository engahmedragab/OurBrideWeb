import React from 'react';
import { Link } from 'react-router-dom';
import appStore from "../../Assets/appstore.png";
import googleplay from "../../Assets/googleplay.png";


export default function Footer() {
  return <>
   <div className="container">
        <div className="row p-5">
            <div className="col-lg-3 d-flex align-items-center">
                <a href="" ><img className='w-100' src={appStore}/></a>
                <a href="" ><img className='w-100' src={googleplay}/></a>
            </div>
            <div className="col-lg-3 offset-lg-6 text-center">
                <h3 className='main-font fw-bolder'>Reach US ON.</h3>
                <div className="icon d-flex justify-content-center">
                    <a className='text-decoration-none' href="https://www.facebook.com/OurBrideCom">
                        <div className="icon-box rounded-circle d-flex justify-content-center align-items-center m-3">
                            <i className='fa-brands fa-facebook-f'></i>
                        </div></a>
                    <a className='text-decoration-none' href="https://www.instagram.com/ourbridecom">
                        <div className="icon-box rounded-circle d-flex justify-content-center align-items-center m-3">
                            <i className='fa-brands fa-instagram'></i>
                        </div></a> 
                    <a className='text-decoration-none' href="https://mobile.twitter.com/ourbridecom">
                        <div className="icon-box rounded-circle d-flex justify-content-center align-items-center m-3">
                            <i className='fa-brands fa-twitter'></i>
                        </div></a> 
                </div>
            </div>
            <hr className='text-black-50'/>
            <div className="text-center">
                <p className='text-muted py-4'>© 2022 Crafted by <Link to="/" className='hover-main text-decoration-none text-main'>OurBride</Link> All Rights Reserved.</p>
            </div>
        </div>
   </div>
  </>
}
