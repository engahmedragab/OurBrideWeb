import React, { useContext } from 'react';
import invita from "../../Assets/My Invitation.jpeg";
import { InvitationDataContext } from '../../Context/InvitationDataContext';
import { useCountdown } from '../../Hooks/useCountDown';
import ShareBtns from '../../SimpleComponent/ShareBtns/ShareBtns';


export default function InvitationCard() {
    let {invitaionData } = useContext(InvitationDataContext);
    let WDate = new Date(invitaionData["wedding-date"]).toDateString();
    let CDate = new Date(invitaionData["crown-date"]).toDateString();
    let EDate = new Date(invitaionData["engagement-date"]).toDateString();
    let HDate = new Date(invitaionData["henna-date"]).toDateString();
    const [days, hours, minutes, seconds] = useCountdown(WDate);
    let totalTime = days + hours + minutes + seconds;


    

  return <>
     <div className="mt-3 w-100 text-center">
            <div className="img-border w-50 mx-auto position-relative text-dark">
                <img src={invita} className="w-100" />
                <div className="contain-border position-absolute w-100">
                    <h2 className='main-font fw-bolder fa-4x my-0'>{invitaionData["groom-name"]} & {invitaionData["bride-name"]}</h2>
                    <p className="mb-0 text-card1 fs-5 fw-bolder">{ invitaionData["wedding-hole"]}</p>
                    <p className='m-0'>{invitaionData["adress"]} , { invitaionData["area"]}</p>
                    <div className="d-flex justify-content-center">
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
                    <p className='fs-6 my-2 text-card1 fw-bold'>{WDate}</p>
                    <p className='fs-6 mb-0'>Crown Date تاريح كتب الكتاب : <span className='fw-semibold'>{CDate}</span></p>
                    <p className='fs-6 mb-0'>Engagement Date تاريخ الخطوبة : <span className='fw-semibold'>{EDate}</span></p>
                    <p className='fs-6 mb-0'>Henna Date تاريح الحنة  : <span className='fw-semibold'>{HDate}</span></p>
                </div>
            </div>
          <ShareBtns/>
    </div>
  </>
}
