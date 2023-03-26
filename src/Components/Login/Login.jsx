import React, { useState } from "react";
import srcImg from "../../Assets/Weddingplanner2.png";
import { Link, useNavigate } from "react-router-dom";
import Joi from "joi";
import axios from "axios";

export default function Register() {
  let navigate = useNavigate();
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState();
  let [errorList, setErrorList] = useState([]);
  let [user, setUser] = useState({
    email: "",
    password: "",
  });

  function getUserData(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
    console.log(myUser);
  }

  async function sendLoginUserData() {
    let { data } = await axios.post(
      `https://localhost:5001/api/v1/identity/register`,
      user
    );
    console.log(data);
    if (data.message === "success") {
      setIsLoading(false);
      localStorage.setItem("userToken", data.token);
      navigate("/home");
    } else {
      setIsLoading(false);
      setError(data.message);
      console.log(error);
    }
  }

  function submitLoginData(e) {
    setIsLoading(true);
    e.preventDefault();
    let validation = validateLoginFormData();
    if (validation.error) {
      setIsLoading(false);
      setErrorList(validation.error.details);
      console.log(errorList);
    } else {
      sendLoginUserData();
    }
  }

  function validateLoginFormData() {
    let scheme = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string()
        .pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,20}$/)
        .min(4)
        .required(),
    });
    return scheme.validate(user, { abortEarly: false });
  }
  return (
    <>
      <div className="Register m-5">
        <div className="contain">
          <div className="row">
            <div className="col-lg-6 ">
              <img src={srcImg} className="w-100" />
            </div>
            <div className="col-lg-6 p-5 text-center">
              <h2 className="text-second fw-bolder">Register New Account</h2>
              <form onSubmit={submitLoginData} className="mt-5">
                <div className="text-start">
                  <label htmlFor="email" className="mt-4">
                    Enter your Email
                  </label>
                  <input
                    onChange={getUserData}
                    type="email"
                    id="email"
                    name="email"
                    className="form-control border-0 shadow-sm rounded-pill p-2 w-100 px-5"
                    placeholder="Email"
                  />
                </div>
                <div className="text-start">
                  <label htmlFor="password" className="mt-4">
                    Enter your Email
                  </label>
                  <input
                    onChange={getUserData}
                    type="password"
                    id="password"
                    name="password"
                    className="form-control border-0 shadow-sm rounded-pill p-2 w-100 px-5"
                    placeholder="Email"
                  />
                </div>
                <input
                  type="submit"
                  className="btn btn-main my-4 px-5 rounded-pill fw-semibold p-2"
                  value="Login"
                />
                <p>
                  forget password?
                  <Link
                    className="hover-main text-decoration-none text-main"
                    to="/register"
                  >
                    Register new account&gt;
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
