import { useRef, useState } from "react";
import "./BankTransfer.css";

function BankTransfer() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

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

  const handleUpload = () => {
    if (!file) {
      openPopup("error", "Please select a valid proof of receipt file before submitting.");
      return;
    }

    console.log("Uploading file:", fileName);
    // Handle file upload logic here
    openPopup(
      "success",
      `Receipt \"${fileName}\" uploaded successfully. Your payment will be verified within 24 hours.`
    );
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

            <button className="upload-button" onClick={handleUpload}>
              Submit Payment Proof
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
              <button className="popup-button" onClick={closePopup}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BankTransfer;
