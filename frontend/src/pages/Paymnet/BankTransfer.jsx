import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./BankTransfer.css";

function BankTransfer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  const stateUser = location.state?.user;
  const storedUser = (() => {
    try {
      const rawUser = sessionStorage.getItem("loggedInUser");
      return rawUser ? JSON.parse(rawUser) : null;
    } catch (_error) {
      return null;
    }
  })();
  const currentUser = stateUser || storedUser;

  const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"];
  const maxFileSize = 5 * 1024 * 1024;

  const openPopup = (type, message) => {
    setPopup({ isOpen: true, type, message });
  };

  const closePopup = () => {
    setFile(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPopup({ isOpen: false, type: "success", message: "" });
  };

  const handleDone = () => {
    closePopup();
    navigate("/homepage");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!allowedFileTypes.includes(selectedFile.type)) {
      setFile(null);
      setFileName("");
      e.target.value = "";
      openPopup("error", "Invalid file type. Please upload a PDF, JPG, PNG, or GIF file.");
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setFile(null);
      setFileName("");
      e.target.value = "";
      openPopup("error", "File is too large. Please upload a file smaller than 5MB.");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = async () => {
    if (!file) {
      openPopup("error", "Please select a valid proof of receipt file before submitting.");
      return;
    }

    if (!currentUser?.email || !currentUser?.studentRegistrationNumber) {
      openPopup("error", "Please log in before submitting payment proof.");
      return;
    }

    try {
      setLoading(true);

      const proofFileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await axios.post("http://localhost:5000/api/payments/bank-transfer", {
        userEmail: currentUser.email,
        userName: currentUser.name || "",
        studentRegistrationNumber: currentUser.studentRegistrationNumber,
        proofFileName: file.name,
        proofFileType: file.type,
        proofFileData
      });

      openPopup(
        "success",
        `Receipt \"${fileName}\" uploaded successfully. Your payment will be verified within 24 hours.`
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to submit bank transfer proof. Please try again.";
      openPopup("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bank-transfer-page">
      <div className={`bank-transfer-card ${popup.isOpen ? "card-blur" : ""}`}>
        <h2 className="bank-title">🏦 Bank Transfer Details</h2>
        <p className="bank-subtitle">Complete your payment using bank transfer</p>

        <div className="bank-details-container">
          <div className="details-section">
            <h3 className="section-title">Bank Account Information</h3>

            <div className="detail-row">
              <label className="detail-label">Account Number</label>
              <div className="detail-value">1234567890</div>
            </div>

            <div className="detail-row">
              <label className="detail-label">Account Holder Name</label>
              <div className="detail-value">Uni-Connect</div>
            </div>

            <div className="detail-row">
              <label className="detail-label">Bank Name</label>
              <div className="detail-value">National Bank</div>
            </div>

            <div className="detail-row">
              <label className="detail-label">Branch</label>
              <div className="detail-value">Main Branch - City Center</div>
            </div>
          </div>

          <div className="file-upload-section">
            <h3 className="section-title">Upload Payment Proof</h3>
            <p className="upload-description">
              Please upload a screenshot or receipt of your bank transfer as proof of payment
            </p>

            <div className="file-input-wrapper">
              <input
                ref={fileInputRef}
                type="file"
                id="receipt-file"
                onChange={handleFileChange}
                className="file-input"
                accept=".pdf,.jpg,.jpeg,.png,.gif"
              />
              <label htmlFor="receipt-file" className="file-label">
                <span className="file-icon">📎</span>
                <span className="file-text">
                  {fileName || "Click to select proof of receipt"}
                </span>
              </label>
            </div>

            <div className="file-info">
              Accepted formats: PDF, JPG, PNG (Max size: 5MB)
            </div>

            <button className="upload-button" onClick={handleUpload} disabled={loading}>
              {loading ? "Submitting..." : "Submit Payment Proof"}
            </button>
          </div>
        </div>

        <div className="instructions-box">
          <h4>Instructions:</h4>
          <ul>
            <li>Transfer the payment amount to the account details above</li>
            <li>Include your order/transaction ID as reference</li>
            <li>Upload a screenshot of your successful bank transfer</li>
            <li>Your payment will be verified within 24 hours</li>
          </ul>
        </div>
      </div>

      {popup.isOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <div
              className={`popup-icon ${
                popup.type === "success" ? "popup-icon-success" : "popup-icon-error"
              }`}
            >
              <span className="popup-icon-inner">{popup.type === "success" ? "✓" : "✕"}</span>
            </div>

            <h3 className={`popup-title ${popup.type === "success" ? "popup-success" : "popup-error"}`}>
              {popup.type === "success" ? "Payment Successful!" : "Payment Unsuccessful"}
            </h3>

            <p className="popup-message">{popup.message}</p>

            <div className="popup-actions">
              <button className="popup-button" onClick={popup.type === "success" ? handleDone : closePopup}>
                {popup.type === "success" ? "Done" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BankTransfer;
