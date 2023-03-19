import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import logo from "../../Assets/logo.png";
import invita from "../../Assets/My Invitation.jpeg";
import invita2 from "../../Assets/My Invitation 2.jpeg";
import invita3 from "../../Assets/My Invitation 3.jpeg";
import invita4 from "../../Assets/My Invitation 4.jpeg";

import MainButton from '../../SimpleComponent/MainButton/MainButton';
import { InvitationDataContext } from '../../Context/InvitationDataContext';



export default function CreateInvitation() {
    let navigate = useNavigate();
    let {invitaionData , setInvitaionData} = useContext(InvitationDataContext);
    // const [invitaionData , setInvitaionData] = useState({
    //     "bride-name":"",
    //     "groom-name":"",
    //     "wedding-date": "",
    //     "engagement-date": "",
    //     "henna-date": "",
    //     "crown-date": "",
    //     "area": "",
    //     "wedding-hole": "",
    //     "adress": "",
    //     "img-src": "",
    // });

    const getImg=(e)=>{
        let InvitaionData ={...invitaionData}
        InvitaionData["img-src"] = e.target["src"];
        setInvitaionData(InvitaionData);
        console.log(InvitaionData);


    }
    const getData=(e)=>{
        let InvitaionData ={...invitaionData}
        InvitaionData[e.target.name]=e.target.value;
        setInvitaionData(InvitaionData);
        console.log(InvitaionData);
    }

    const sendData = ()=>{
        JSON.stringify(invitaionData)
        sessionStorage.setItem("InvitationData",JSON.stringify(invitaionData));
        if (invitaionData["img-src"] == "http://localhost:3000/static/media/My%20Invitation.016d3ce66c84a1b7139f.jpeg"){
            navigate("/invitationCard");
        } else if(invitaionData["img-src"] == "http://localhost:3000/static/media/My%20Invitation%202.b008917dc8c14901966d.jpeg") {
            navigate("/invitationCard2");
        } else if(invitaionData["img-src"] == "http://localhost:3000/static/media/My%20Invitation%203.7abe65bf0fb7e83ef32a.jpeg") {
            navigate("/invitationCard3");
        } else if(invitaionData["img-src"] == "http://localhost:3000/static/media/My%20Invitation%204.469b610a6163c90bea91.jpeg"){
            navigate("/invitationCard4");
            console.log("44");
        }
    }

    function SubmitData (e){
        e.preventDefault();
        console.log(invitaionData);
        sendData();
    }

  return <>
    <div className="contain mt-3 cover-img">
        <div className="opicity-gray bg-light bg-opacity-50">
                <div className="text-center m-4 my-5">
                    <Link to="/"><img src={logo} className="w-25 mt-3"/></Link>
                    <h2 className='main-font fw-bolder my-4 '>CREATE OURBRIDE INVITATION</h2>
                    <MainButton title="Open your invitaion" classes="btn-outline-main bg-transparent"/>
                    <p>or</p>
                    <h3 className='fw-normal'>Create new invitation</h3>
                    <h4>Create your online Invitation - اعمل دعوة فرحك الاونلاين</h4>
                    <form onSubmit={SubmitData} >
                        <div className="col-12">
                            <label htmlFor="bride-name" className='mt-4 text-second fs-6'>Bride - اسم العروسة</label>
                            <input onChange={getData} required type="text" name='bride-name' id='bride-name' className='form-control shadow-sm rounded-pill w-50 text-center mx-auto px-4' placeholder='Name'/>
                        </div>
                        <div className="col-12">
                            <label htmlFor="groom-name" className='mt-4 text-second fs-6'>Groom - اسم العريس</label>
                            <input onChange={getData} required type="text" name='groom-name' id='groom-name' className='form-control shadow-sm rounded-pill w-50 text-center mx-auto px-4' placeholder='Name'/>
                        </div>
                        <div className="col-12">
                            <label htmlFor="wedding-date" className='mt-4 text-second fs-6'>wedding Date - تاريخ الفرح</label>
                            <input onChange={getData} required type="date" name='wedding-date' id='wedding-date' className='form-control shadow-sm rounded-pill w-50 text-center mx-auto px-4' />
                        </div>
                        <div className="col-12">
                            <label htmlFor="engagement-date" className='mt-4 text-second fs-6'>Engagement Date - تاريخ الخطوبة</label>
                            <input onChange={getData} required type="date" name='engagement-date' id='engagement-date' className='form-control shadow-sm rounded-pill w-50 text-center mx-auto px-4' />
                        </div>
                        <div className="col-12">
                            <label htmlFor="henna-date" className='mt-4 text-second fs-6'>Henna Date - تاريح الحنة</label>
                            <input onChange={getData} required type="date" name='henna-date' id='henna-date' className='form-control shadow-sm rounded-pill w-50 text-center mx-auto px-4' />
                        </div>
                        <div className="col-12">
                            <label htmlFor="crown-date" className='mt-4 text-second fs-6'>Crown Date - تاريح كتب الكتاب \ الاكليل</label>
                            <input onChange={getData} required type="date" name='crown-date' id='crown-date' className='form-control shadow-sm rounded-pill w-50 text-center mx-auto px-4' />
                        </div>
                        <div className="col-12">
                            <label htmlFor="area" className='mt-4 text-second fs-6'>Area - المنطقة</label>
                            <input onChange={getData} required type="text" name='area' id='area' className='form-control shadow-sm rounded-pill w-50 text-center mx-auto px-4' />
                        </div>
                        <div className="col-12">
                            <label htmlFor="wedding-hole" className='mt-4 text-second fs-6'>Wedding hole - اسم قاعة الفرح</label>
                            <input onChange={getData} required type="text" name='wedding-hole' id='wedding-hole' className='form-control shadow-sm rounded-pill w-50 text-center mx-auto px-4' />
                        </div>
                        <div className="col-12">
                            <label htmlFor="adress" className='mt-4 text-second fs-6'>Wedding Address - عنوان القاعة</label>
                            <input onChange={getData} required type="name" name='adress' id='adress' className='form-control shadow-sm rounded-pill w-50 text-center mx-auto px-4' />
                        </div>
                        <div  className="imgIcon d-flex justify-content-center row gx-5">
                            <div className="col-lg-3 p-5"><Link><img onClick={getImg}  src={invita} className='w-100'/></Link></div>
                            <div className="col-lg-3 p-5"><Link><img onClick={getImg}  src={invita2} className='w-100'/></Link></div>
                            <div className="col-lg-3 p-5"><Link><img onClick={getImg}  src={invita3} className='w-100'/></Link></div>
                            <div className="col-lg-3 p-5"><Link><img onClick={getImg}  src={invita4} className='w-100'/></Link></div>
                        </div>
                        
                       <input type="submit" className='btn btn-main my-4 px-5 rounded-pill fw-semibold p-2' value="Create"/>
                    </form>
                    
                </div>

        </div>

    </div>
  </>
}
