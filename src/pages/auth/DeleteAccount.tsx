import React, { useState } from "react";
import MainButton from "@/SimpleComponent/MainButton/MainButton";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Navbar from "@/Components/NavBar/NavBar";
import Footer from "@/Components/Footer/Footer";

export default function DeleteAccount(): JSX.Element {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [emailOrPhone, setEmailOrPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle modal open/close
  const handleShow = (): void => setShowConfirmModal(true);
  const handleClose = (): void => setShowConfirmModal(false);

  // Function to delete the account
  const handleDeleteAccount = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://161.35.32.218/api/v1/identity/delete",
        {
          emailOrPhone,
          password,
        }
      );

      if (response.data.success) {
        toast.success("Account deleted successfully!");
        navigate("/");
      } else {
        setError(response.data.errors?.join(", ") || "Failed to delete account");
        return;
      }
    } catch (err) {
      setError("Failed to delete account, please try again.");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  // Form validation
  const isFormValid = emailOrPhone.trim() !== "" && password.trim() !== "";

  return (
    <>
      <Navbar />
      <div className="container-floud">
        <div className="container">
          <div className="delete-account m-5 w-70">
            <div className="contain w-70 d-flex flex-column justify-content-center align-items-center">
              <h2 className="text-main main-font fw-bolder fs-1">
                Delete Account
              </h2>
              <p className="fw-light">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>

            {/* Email/Phone Input */}
            <div className="col-lg-6">
              <label htmlFor="emailOrPhone" className="mt-4 text-second fs-4">
                Enter your Email or Phone Number
              </label>
              <input
                type="text"
                id="emailOrPhone"
                className="form-control-lg shadow-sm rounded-pill p-3 w-100 px-5"
                placeholder="Email or Phone Number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="col-lg-6">
              <label htmlFor="password" className="mt-4 text-second fs-4">
                Enter your Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control-lg shadow-sm rounded-pill p-3 w-100 px-5"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Delete Account Button */}
            <div className="mt-4">
              <MainButton
                title="Delete Account"
                classes="btn-main"
                onClick={handleShow}
                disabled={!isFormValid}
              />
            </div>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </Modal.Body>
              <Modal.Footer>
                <MainButton
                  classes="btn-secondary"
                  title={"Cancel"}
                  onClick={handleClose}
                />
                <MainButton
                  classes="btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  title={loading ? "Deleting..." : "Delete"}
                />
              </Modal.Footer>
            </Modal>

            {/* Error Alert */}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}




