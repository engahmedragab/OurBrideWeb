import React, { useContext } from 'react';
import './InvitationCard.css';
import invita3 from "../../Assets/My Invitation 4.jpeg";
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
            <div className="img-border w-50 mx-auto position-relative text-secondary">
                <img src={invita3} className="w-100" />
                <div className="position-absolute top-50 start-50  translate-middle  w-50">
                    <h2 className='main-font fa-3x'>{invitaionData["groom-name"]} & {invitaionData["bride-name"]}</h2>
                    <p className="mb-4 fs-4 fw-bold text-card4">{invitaionData["wedding-hole"]} </p>
                    <p>{invitaionData["adress"]} , { invitaionData["area"]}</p>
                    <div className="d-flex justify-content-center">
                        <div className="d-flex flex-column fs-6 mx-3 mb-3 ">
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
                    <p className='fs-6 mb-3 fw-bold text-card4'>{WDate}</p>
                    <p className='fs-6 mb-3'>Crown Date تاريح كتب الكتاب<br/> {CDate}</p>
                    <p className='fs-6 mb-3'>Engagement Date تاريخ الخطوبة<br/>  {EDate}</p>
                    <p className='fs-6 mb-3'>Henna Date تاريح الحنة<br/> {HDate}</p>
                </div>
            </div>
          <ShareBtns/>
    </div>
  </>
}
