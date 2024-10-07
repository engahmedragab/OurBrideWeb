import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Show success message
    //toast.success("Operation was successful!");
    toast.success("Success! Your action was completed.", {
      position: "top-center",
      autoClose: 3000, // Auto-close after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    // Redirect to home after 2 seconds
    const timer = setTimeout(() => {
      navigate("/"); // '/' is the home route, change it if your home route is different
    }, 2000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h2>Success</h2>
      <p>You will be redirected to the homepage shortly...</p>
    </div>
  );
}
