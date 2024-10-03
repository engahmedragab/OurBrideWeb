import React from "react";
import NavBar from "../NavBar/NavBar.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";

export default function RoutLayout() {
  return (
    <>
      <NavBar />
      <div className="container-floud">
        <Outlet></Outlet>
      </div>
      <Footer />
    </>
  );
}
