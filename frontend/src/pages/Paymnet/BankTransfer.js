import { useRef, useState, useEffect } from "react";
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
  const returnTo = location.state?.returnTo || "/homepage";
  const sessionDraft = location.state?.sessionDraft;
  const registrationDraft = location.state?.registrationDraft;
  const cartItems = Array.isArray(location.state?.cartItems) ? location.state.cartItems : [];
  const effectiveCartItems = (() => {
    if (cartItems.length > 0) return cartItems;
    try {
      const raw = sessionStorage.getItem("cartItems");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  })();
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentSummary, setPaymentSummary] = useState({
    amount: 0,
    items: [],
    type: ''
  });

  const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"];
  const maxFileSize = 5 * 1024 * 1024;

  useEffect(() => {
    const calculatePaymentSummary = async () => {
      let summary = {
        amount: 0,
        items: [],
        type: ''
      };

      // Check for direct payment amount first
      const paymentAmount = location.state?.paymentAmount;
      if (paymentAmount !== undefined && paymentAmount !== null && paymentAmount !== "") {
        summary.amount = parseFloat(paymentAmount);
        summary.type = 'direct';
        setPaymentSummary(summary);
        return;
      }

      // Check for session draft
      const sessionAmount = sessionDraft?.formData?.price || sessionDraft?.formData?.amount;
      if (sessionAmount) {
        summary.amount = parseFloat(sessionAmount);
        summary.type = 'session';
        summary.items = [{
          name: sessionDraft?.formData?.subject || 'Session',
          price: parseFloat(sessionAmount)
        }];
        setPaymentSummary(summary);
        return;
      }

      // Check for cart items
      if (effectiveCartItems.length > 0) {
        summary.type = 'cart';
        let totalAmount = 0;
        const items = [];

        for (const item of effectiveCartItems) {
          let itemPrice = 0;
          
          // Try to get price from item directly
          if (item.price) {
            itemPrice = parseFloat(item.price);
          } else if (item.sessionId) {
            // Fetch session details to get price
            try {
              const response = await axios.get("http://localhost:5000/api/kuppi-sessions");
              const session = Array.isArray(response.data)
                ? response.data.find((s) => s._id === item.sessionId)
                : null;
              
              if (session?.price !== undefined && session?.price !== null) {
                itemPrice = parseFloat(session.price);
              }
            } catch (_error) {
              // Leave price as 0 if fetch fails
            }
          }

          totalAmount += itemPrice;
          items.push({
            name: item.subject || item.moduleName || `Session ${item.sessionId?.slice(-6)}`,
            price: itemPrice
          });
        }

        summary.amount = totalAmount;
        summary.items = items;
        setPaymentSummary(summary);
        return;
      }

      // Check for registration draft
      const loadRegistrationAmount = async () => {
        const sessionId = registrationDraft?.sessionId;
        if (!sessionId) return;

        try {
          const response = await axios.get("http://localhost:5000/api/kuppi-sessions");
          const session = Array.isArray(response.data)
            ? response.data.find((item) => item._id === sessionId)
            : null;

          if (session?.price !== undefined && session?.price !== null) {
            summary.amount = parseFloat(session.price);
            summary.type = 'registration';
            summary.items = [{
              name: session.subject || session.moduleName || 'Registration',
              price: parseFloat(session.price)
            }];
            setPaymentSummary(summary);
          }
        } catch (_error) {
          // Leave summary empty if session lookup fails
        }
      };

      loadRegistrationAmount();
    };

    calculatePaymentSummary();
  }, [location.state, sessionDraft, registrationDraft, effectiveCartItems]);

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
    const targetPath = effectiveCartItems.length > 0 ? "/my-enrollments" : returnTo;
    navigate(targetPath, {
      state: {
        user: currentUser,
        paymentResult,
        sessionDraft,
        registrationDraft
      }
    });
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

      const response = await axios.post("http://localhost:5000/api/payments/bank-transfer", {
        userEmail: currentUser.email,
        userName: currentUser.name || "",
        studentRegistrationNumber: currentUser.studentRegistrationNumber,
        proofFileName: file.name,
        proofFileType: file.type,
        proofFileData
      });

      const transactionId = response.data?.data?.transactionId || "";
      const enrolledSessionIds = [];

      if (effectiveCartItems.length > 0) {
        for (const item of effectiveCartItems) {
          if (!item?.sessionId) continue;

          const entry = {
            studentName: item.studentName || currentUser.name || "Student",
            studentEmail: item.studentEmail || currentUser.email || "",
            studentId: item.studentId || currentUser.studentRegistrationNumber || "",
            contactNumber: item.contactNumber || "0700000000",
            sessionId: item.sessionId,
            paymentStatus: "pending",
            paymentTransactionId: transactionId,
            paymentMethod: "bank"
          };

          try {
            await axios.post("http://localhost:5000/api/student-registrations", entry);
            enrolledSessionIds.push(item.sessionId);
          } catch (_error) {
            // Keep failed cart items so student can retry.
          }
        }

        const remainingCartItems = effectiveCartItems.filter((item) => !enrolledSessionIds.includes(item.sessionId));
        sessionStorage.setItem("cartItems", JSON.stringify(remainingCartItems));
      }

      setPaymentResult({
        status: "pending",
        transactionId,
        method: "bank"
      });

      if (effectiveCartItems.length > 0) {
        const failedCount = effectiveCartItems.length - enrolledSessionIds.length;
        if (enrolledSessionIds.length > 0 && failedCount === 0) {
          openPopup(
            "success",
            `Receipt \"${fileName}\" uploaded. Cart sessions moved to My Kuppi Enrollments with pending payment status.`
          );
        } else if (enrolledSessionIds.length > 0 && failedCount > 0) {
          openPopup(
            "success",
            `Receipt \"${fileName}\" uploaded. ${enrolledSessionIds.length} session(s) moved as pending. ${failedCount} item(s) remain in cart.`
          );
        } else {
          openPopup(
            "success",
            `Receipt \"${fileName}\" uploaded, but cart sessions were not moved. Cart items are kept for retry.`
          );
        }
      } else {
        openPopup(
          "success",
          `Receipt \"${fileName}\" uploaded successfully. Your payment will be verified within 24 hours.`
        );
      }
    } catch (error) {
      setPaymentResult(null);
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

          {paymentSummary.amount > 0 && (
            <div className="payment-summary-section">
              <h3 className="section-title">Payment Summary</h3>
              <div className="summary-content">
                {paymentSummary.items.length > 0 ? (
                  <div className="summary-items">
                    {paymentSummary.items.map((item, index) => (
                      <div key={index} className="summary-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">Rs {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="summary-divider"></div>
                    <div className="summary-total">
                      <span className="total-label">Total Amount</span>
                      <span className="total-amount">Rs {paymentSummary.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="summary-single">
                    <span className="single-label">Amount to Pay</span>
                    <span className="single-amount">Rs {paymentSummary.amount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

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
