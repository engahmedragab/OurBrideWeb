
import React from 'react';
import NavBar from '../NavBar/NavBar.jsx';
import {Outlet} from "react-router-dom"
import Footer from '../Footer/Footer.jsx';

export default function RouteLayout() {
  return <>
    <NavBar/>
    <div className="">
        <Outlet></Outlet>
    </div>
    <Footer/>
  </>
};
