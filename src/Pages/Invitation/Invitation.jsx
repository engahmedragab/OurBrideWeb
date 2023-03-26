import React from 'react';
import Icon1 from "../../Assets/service-1.png";
import Icon2 from "../../Assets/service-2.png";
import Icon3 from "../../Assets/service-3.png";
import MainButton from '../../SimpleComponent/MainButton/MainButton';


export default function Invitation() {
  return<>
  <div className="about m-5">
    <div className="contain w-100 d-flex flex-column justify-content-center align-items-center">
      <h2 className='text-main main-font fw-bolder fs-1'>WEDDING INVITATION</h2>
      <h2 className='fw-light'><span className='fw-semibold'>Create your online Invitation</span> to share your happiness with others</h2>
    </div>
    <div className="row g-0 p-5 my-4 shadow p-4 py-5">
      <div className="col-lg-4 d-flex">
        <div className="icon">
            <img src={Icon1} className="w-100" />
        </div>
        <div className="contain ps-4">
            <h4  className='mb-4'>Select your wedding date</h4>
            <p  className='text-muted pe-4 my-3 fa-1x'>chose your wedding date and the hole.</p>
            <p  className='text-muted fw-semibold my-2 fa-xs'>حدد معاد فرحك و مكان الفرح و القاعة</p>
        </div>
      </div>
      <div className="col-lg-4 d-flex">
        <div className="icon">
            <img src={Icon2} className="w-100" />
        </div>
        <div className="contain ps-4">
            <h4  className='mb-4'>Create Wedding Invitation</h4>
            <p  className='text-muted pe-4 my-3 fa-1x'>Make your wedding invitation with our invitation creator.</p>
            <p  className='text-muted fw-semibold my-2 fa-xs'>اعمل دعوة فرحك عن طريق دعوة الفرح الاونلاين بتاعتنا</p>
        </div>
      </div>
      <div className="col-lg-4 d-flex">
        <div className="icon">
            <img src={Icon3} className="w-100" />
        </div>
        <div className="contain ps-4">
            <h4  className='mb-4'>Share it</h4>
            <p  className='text-muted pe-4 my-3 fa-1x'>Share it, your online invitation to all your loved ones.</p>
            <p  className='text-muted fw-semibold my-2 fa-xs'>شير دعوتك الاونلاين لكل حبايبك و معازيمك</p>
        </div>
      </div>
      <MainButton title="Create Your Invitation" link="/createInvitation" classes="btn-main mt-5"/>

    </div>


  </div>
  </>
}
