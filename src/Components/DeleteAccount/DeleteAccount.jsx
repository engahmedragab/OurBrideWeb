import React, { useState } from "react";
import MainButton from "../../SimpleComponent/MainButton/MainButton";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function DeleteAccount() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle modal open/close
  const handleShow = () => setShowConfirmModal(true);
  const handleClose = () => setShowConfirmModal(false);

  // Function to delete the account
  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete("/api/user/delete", {
        data: {
          emailOrPhone,
          password,
        },
      }); // Change to your API endpoint
      console.log("Account deleted:", response.data);
      // Handle successful deletion (e.g., redirect to login)
    } catch (err) {
      console.error("Failed to delete account", err);
      setError("Failed to delete account, please try again.");
    } finally {
      setLoading(false);
      handleClose(); // Close modal after operation
    }
  };

  // Form validation
  const isFormValid = emailOrPhone.trim() !== "" && password.trim() !== "";

  return (
    <div className="container">
      <div className="delete-account m-5 w-70">
        <div className="contain w-70 d-flex flex-column justify-content-center align-items-center">
          <h2 className="text-main main-font fw-bolder fs-1">Delete Account</h2>
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
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Modal.Body>
          <Modal.Footer>
            <MainButton
              classes="btn-secondary"
              title={"Cancel"}
              onClick={handleClose}
            ></MainButton>
            <MainButton
              classes="btn-danger"
              onClick={handleDeleteAccount}
              disabled={loading}
              title={loading ? "Deleting..." : "Delete"}
            ></MainButton>
          </Modal.Footer>
        </Modal>

        {/* Error Alert */}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}
