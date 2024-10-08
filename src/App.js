import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoutLayout from "./Components/RoutLayout/RoutLayout.jsx";
import Home from "./Components/Home/Home.jsx";
import About from "./Components/About/About.jsx";
import Invitation from "./Components/Invitation/invitation.jsx";
import Items from "./Components/Items/Items.jsx";
import Contact from "./Components/Contact/Contact.jsx";
import Register from "./Components/Register/Register.jsx";
import Login from "./Components/Login/Login.jsx";
import CreateInvitation from "./Components/CreateInvitation/CreateInvitation.jsx";
import InvitationCard from "./Components/InvitationCards/InvitationCard.jsx";
import InvitationCard2 from "./Components/InvitationCards/InvitationCard2.jsx";
import InvitationCard3 from "./Components/InvitationCards/InvitationCard3.jsx";
import InvitationCard4 from "./Components/InvitationCards/InvitationCard4.jsx";
import InvitationDataContextProvider from "./Context/InvitationDataContext.jsx";
import DeleteAccount from "./Components/DeleteAccount/DeleteAccount.jsx";
import TermsAndConditions from "./Components/Helps/TermsAndConditions.jsx";
import PrivacyPolicy from "./Components/Helps/PrivacyPolicy.jsx";
import { ToastContainer } from "react-toastify";

export default function App() {
  let myRouter = createBrowserRouter([
    {
      path: "/",
      element: <RoutLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "invitation", element: <Invitation /> },
        { path: "items", element: <Items /> },
        { path: "contact", element: <Contact /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "createInvitation", element: <CreateInvitation /> },
        { path: "invitationCard", element: <InvitationCard /> },
        { path: "invitationCard2", element: <InvitationCard2 /> },
        { path: "invitationCard3", element: <InvitationCard3 /> },
        { path: "invitationCard4", element: <InvitationCard4 /> },
      ],
    },
    {
      path: "/delete-account",
      element: <DeleteAccount />,
    },
    {
      path: "/terms-conditions",
      element: <TermsAndConditions />,
    },
    {
      path: "/privacy-policy",
      element: <PrivacyPolicy />,
    },
  ]);

  return (
    <InvitationDataContextProvider>
      <RouterProvider router={myRouter} />
      <ToastContainer />
    </InvitationDataContextProvider>
  );
}
