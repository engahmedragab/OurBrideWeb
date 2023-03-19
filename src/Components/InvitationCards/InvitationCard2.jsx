import React, { useContext } from 'react';
import invita2 from "../../Assets/My Invitation 2.jpeg";
import { InvitationDataContext } from '../../Context/InvitationDataContext';
import { useCountdown } from '../../Hooks/useCountDown';
import ShareBtns from '../../SimpleComponent/ShareBtns/ShareBtns';


export default function InvitationCard2() {
    let {invitaionData } = useContext(InvitationDataContext);
    let WDate = new Date(invitaionData["wedding-date"]).toDateString();
    let CDate = new Date(invitaionData["crown-date"]).toDateString();
    let EDate = new Date(invitaionData["engagement-date"]).toDateString();
    let HDate = new Date(invitaionData["henna-date"]).toDateString();
    const [days, hours, minutes, seconds] = useCountdown(WDate);
    let totalTime = days + hours + minutes + seconds;


  return <>
     <div className="mt-3 w-100 text-center">
            <div className="img-border w-50 mx-auto position-relative text-secondary fw-semibold">
                <img src={invita2} className="w-100" />
                <div className="position-absolute top-0 mt-4 w-100">
                    <p className='mb-0'>{invitaionData["adress"] } , { invitaionData["area"]}</p>
                    <p className="mb-0 text-card2 fs-4 fw-bold">{invitaionData["wedding-hole"]}</p>
                    <h2 className='main-font fw-bolder fa-4x'>{invitaionData["groom-name"]} & {invitaionData["bride-name"]}</h2>
                </div>
                <div className="position-absolute top-75 w-100">

                <p className='fs-6 text-card2 mb-0'>{WDate}</p>
                    <div className="d-flex justify-content-center mb-2">
                        <div className="d-flex flex-column fs-6 mx-3 ">
                            <span className='time mb-0'>{totalTime >0 ? days:'00'}</span>
                            day
                        </div>
                        <div className="d-flex flex-column fs-6  mx-3">
                            <span className='time mb-0'>{totalTime >0 ? hours:'00'}</span>
                            hour
                        </div>
                        <div className="d-flex flex-column fs-6 mx-3 ">
                            <span className='time mb-0'>{totalTime >0 ? minutes:"00"}</span>
                            min
                        </div>
                        <div className="d-flex flex-column fs-6 mx-3 ">
                            <span className='time mb-0'>{totalTime >0 ? seconds:"00"}</span>
                            sec
                        </div>
                    </div>
                    <p className='fs-6 mb-0'>Crown Date تاريح كتب الكتاب  : {CDate}</p>
                    <p className='fs-6 mb-0'>Engagement Date تاريخ الخطوبة :   {EDate}</p>
                    <p className='fs-6 mb-0'>Henna Date تاريح الحنة  :   {HDate}</p>
                </div>
            </div>
          <ShareBtns/>
    </div>
  </>
}
