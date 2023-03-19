import React, { useState } from 'react';
import srcImg from "../../Assets/Weddingplanner2.png";
import {Link, useNavigate} from "react-router-dom";
import Joi from 'joi';
import axios from 'axios';


export default function Register() {

    let navigate = useNavigate();
    let [error , setError] = useState();
    let [errorList , setErrorList] = useState([]);
    
    let [user ,setUser] = useState({
        "email": "",
        "password": ""
    });

    function getUserData (e) {
        let myUser = {...user};
        myUser[e.target.name]=e.target.value;
        setUser(myUser);
        console.log(myUser)
    }

    async function sendUserData () {
        
       let response = await axios.post(`https://localhost:5001/api/v1/identity/register`,user);

       console.log(response,"res");
       if (response.status === 200){
        console.log("sucssess")
        navigate("/login")
       }else{
        console.log(response.errors,"err")
       }
    }

    function submitRegisterData (e) {
        e.preventDefault();
        let validation = validateFormData();
        if(validation.error){
            setErrorList(validation.error.details);
            console.log(errorList)
        }else{
            sendUserData();
        }

    }

    function validateFormData () {
       let scheme = Joi.object({
            email :Joi.string().email({tlds:{allow: false}}).required(),
            password :Joi.string().pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,20}$/).min(4).required(),
        });
        return scheme.validate(user,{ abortEarly: false});
    }

console.log(user)
  return <>
   <div className="Register m-5">
    <div className="contain">
        <div className="row">
            <div className="col-lg-6">
                <h2 className='text-second fw-bolder'>Register New Account</h2>
                <form onSubmit={submitRegisterData} className='mt-5'>
                    {error?<p className='alert-danger'>{error}</p>:""}
                    <div className="">
                        <label htmlFor="firstName" className='mt-3 mb-0'>First Name</label>
                        <input required type="text" name='firstName'  id='firstName' className='form-control border-0 shadow-sm rounded-pill p-2 w-100 px-5' placeholder='first Name'/>
                        </div>
                    <div className="">
                        <label htmlFor="lastName" className='mt-3 mb-0'>Last Name</label>
                        <input required type="text" name='lastName'  id='lastName' className='form-control border-0 shadow-sm rounded-pill p-2 w-100 px-5' placeholder='last Name'/>
                    </div>
                    <div className="">
                        <label htmlFor="email" className='mt-3 mb-0'>Enter your Email</label>
                        <input onChange={getUserData} type="email" name='email' id='email'  className='form-control border-0 shadow-sm rounded-pill p-2 w-100 px-5' placeholder='Email'/>
                        <p className='alert-warning rounded'>{errorList.filter((err)=>err.context.label == "email")[0]?.message}</p>
                    </div>
                    <div className="">
                        <label htmlFor="password" className='mt-3 mb-0'>Enter your Password</label>
                        <input onChange={getUserData} type="password" name='password' id='password'  className='form-control border-0 shadow-sm rounded-pill p-2 w-100 px-5' placeholder='password'/>
                        <p className='alert alert-danger rounded'>{errorList.filter((err)=>err.context.label == "password")?"'password' must contain a capital letter and special character":""}</p>
                    </div>
                    <input type="submit" className='btn btn-main my-4 px-5 rounded-pill fw-semibold p-2' value="Register"/>
                    <p>Already a member?<Link className='hover-main text-decoration-none text-main' to="/login">Log in&gt;</Link></p>     
                </form>

            </div>

            <div className="col-lg-6 ">
                <img src={srcImg} alt="cover img" className="w-100"/>
            </div>
        </div>
    </div>
  </div>
  </>
}
