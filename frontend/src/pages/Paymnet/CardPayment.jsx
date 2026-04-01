import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import "./CardPayment.css";

function CardPayment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    amount: ""
  });

  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    message: ""
  });

  const [paymentSummary, setPaymentSummary] = useState(null);

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

  const showPopup = (message, type) => {
    setPopup({
      isOpen: true,
      type,
      message
    });
  };

  const closePopup = () => {
    if (popup.type === "success") {
      setForm({
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        amount: ""
      });
    }

    setPopup({
      isOpen: false,
      type: "success",
      message: ""
    });

    setPaymentSummary(null);
  };

  const handleDone = () => {
    closePopup();
    navigate("/homepage");
  };

  const handlePrintSummary = () => {
    if (!paymentSummary) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 34;
    const contentWidth = pageWidth - marginX * 2;

    doc.setFillColor(250, 252, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setFillColor(11, 61, 122);
    doc.roundedRect(marginX, 32, contentWidth, 112, 16, 16, "F");

    doc.setDrawColor(147, 197, 253);
    doc.setLineWidth(1.2);
    doc.line(marginX + 18, 104, marginX + contentWidth - 18, 104);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(25);
    doc.text("UNI-CONNECT RECEIPT", marginX + 18, 72);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Secure Student Payment Confirmation", marginX + 18, 94);

    doc.setFillColor(220, 252, 231);
    doc.roundedRect(marginX + contentWidth - 120, 50, 102, 30, 8, 8, "F");
    doc.setTextColor(22, 101, 52);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PAID", marginX + contentWidth - 82, 69);

    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Thank you. Your payment is completed and recorded.", marginX, 164);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, 184, contentWidth, 322, 12, 12, "FD");

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(marginX + 10, 194, contentWidth - 20, 30, 8, 8, "F");
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Payment Summary", marginX + 18, 214);

    const rows = [
      ["Transaction ID", paymentSummary.transactionId],
      ["User Email", paymentSummary.userEmail],
      ["Student ID", paymentSummary.studentRegistrationNumber],
      ["Card Number", paymentSummary.cardNumber],
      ["Card Name", paymentSummary.cardName],
      ["Date", paymentSummary.date],
      ["Time", paymentSummary.time],
      ["Amount", String(paymentSummary.amount)],
    ];

    let y = 246;
    rows.forEach(([label, value], index) => {
      const isAmountRow = label === "Amount";

      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(marginX + 10, y - 16, contentWidth - 20, 30, "F");
      }

      if (isAmountRow) {
        doc.setFillColor(219, 234, 254);
        doc.rect(marginX + 10, y - 16, contentWidth - 20, 30, "F");
      }

      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", isAmountRow ? "bold" : "normal");
      doc.setFontSize(isAmountRow ? 13 : 11);
      doc.text(label, marginX + 18, y);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(isAmountRow ? 14 : 12);
      doc.text(String(value), marginX + contentWidth - 18, y, { align: "right" });

      doc.setDrawColor(226, 232, 240);
      doc.line(marginX + 12, y + 10, marginX + contentWidth - 12, y + 10);
      y += 36;
    });

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("This is a system-generated receipt.", marginX, pageHeight - 38);
    doc.text("Need help? Contact Uni-Connect support.", marginX, pageHeight - 22);

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardName" && !/^[A-Za-z\s]*$/.test(value)) return;
    if (name === "cardNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");

      setForm({
        ...form,
        cardNumber: formatted
      });
      return;
    }
    if (name === "cvv" && !/^\d*$/.test(value)) return;
    if (name === "amount" && !/^\d*(\.\d*)?$/.test(value)) return;

    if (name === "expiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);

      if (digits.length >= 2) {
        const month = Number(digits.slice(0, 2));
        if (month < 1 || month > 12) return;
      }

      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;

      setForm({
        ...form,
        expiry: formatted
      });
      return;
    }

    setForm({
      ...form,
      [name]: value
    });
  };

  const validate = () => {
    const cardNumberDigits = form.cardNumber.replace(/\s/g, "");

    if (!form.cardName.trim()) return "Card holder name is required";
    if (!/^[A-Za-z\s]+$/.test(form.cardName.trim())) return "Invalid Name";
    if (!/^\d{16}$/.test(cardNumberDigits)) return "Card number must be 16 digits";
    if (!/^\d{3}$/.test(form.cvv)) return "CVV must be 3 digits";
    if (!form.expiry) return "Expiry date required";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) return "Expiry must be in MM/YY format";

    const [expMonthStr, expYearStr] = form.expiry.split("/");
    const expMonth = Number(expMonthStr);
    const expYear = Number(expYearStr);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return "Card is expired.";
    }

    if (!form.amount) return "Amount required";
    if (!/^\d+(\.\d+)?$/.test(form.amount)) return "Amount must be a valid number";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      setPaymentSummary(null);
      showPopup(error, "error");
      return;
    }

    if (!currentUser?.email || !currentUser?.studentRegistrationNumber) {
      setPaymentSummary(null);
      showPopup("Please log in before making a payment.", "error");
      return;
    }

    try {
      const payload = {
        ...form,
        cardNumber: form.cardNumber.replace(/\s/g, ""),
        userEmail: currentUser.email,
        studentRegistrationNumber: currentUser.studentRegistrationNumber
      };

      const res = await axios.post(
        "http://localhost:5000/api/payments",
        payload
      );

      const summaryCardNumber = `**** **** **** ${payload.cardNumber.slice(-4)}`;
      const paidAt = new Date();
      setPaymentSummary({
        transactionId: res.data?.data?.transactionId || "-",
        amount: form.amount,
        userEmail: currentUser.email,
        studentRegistrationNumber: currentUser.studentRegistrationNumber,
        cardNumber: summaryCardNumber,
        cardName: form.cardName,
        date: paidAt.toLocaleDateString("en-GB"),
        time: paidAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      });

      showPopup(
        "Your payment has been processed successfully. You will receive a confirmation email shortly.",
        "success"
      );

    } catch (err) {
      setPaymentSummary(null);
      showPopup(
        "Your payment could not be completed. Please check your card details and try again.",
        "error"
      );
    }
  };

return (
  <div className="page">
    <div className={`card ${popup.isOpen ? "card-blur" : ""}`}>
      <h2 className="title">💳 Card Payment</h2>

      <form onSubmit={handleSubmit} className="form">

        <input name="cardName" placeholder="Card Holder Name" value={form.cardName} onChange={handleChange} className="input" />

        <input name="cardNumber" placeholder="Card Number" value={form.cardNumber} maxLength={19} inputMode="numeric" onChange={handleChange} className="input" />

        <div className="row">
          <input name="expiry" placeholder="MM/YY" value={form.expiry} maxLength={5} inputMode="numeric" onChange={handleChange} className="input-small" />
          <input name="cvv" placeholder="CVV" value={form.cvv} maxLength={3} inputMode="numeric" onChange={handleChange} className="input-small" />
        </div>

        <input name="amount" placeholder="Amount" value={form.amount} inputMode="decimal" onChange={handleChange} className="input" />

        <button type="submit" className="button">
          Pay Now
        </button>
      </form>
    </div>

    {popup.isOpen && (
      <div className="popup-overlay" onClick={closePopup}>
        <div className="popup-box" onClick={(e) => e.stopPropagation()}>
          <div className={`popup-icon ${popup.type === "success" ? "popup-icon-success" : "popup-icon-error"}`}>
            <span className="popup-icon-inner">{popup.type === "success" ? "✓" : "✕"}</span>
          </div>
          <h3 className={`popup-title ${popup.type === "success" ? "popup-success" : "popup-error"}`}>
            {popup.type === "success" ? "Payment Successful!" : "Payment Unsuccessful"}
          </h3>
          <p className="popup-message">{popup.message}</p>

          {popup.type === "success" && paymentSummary && (
            <div className="payment-summary">
              <div className="summary-row"><span>Transaction ID</span><strong>{paymentSummary.transactionId}</strong></div>
              <div className="summary-row"><span>User Email</span><strong>{paymentSummary.userEmail}</strong></div>
              <div className="summary-row"><span>Student ID</span><strong>{paymentSummary.studentRegistrationNumber}</strong></div>
              <div className="summary-row"><span>Card Number</span><strong>{paymentSummary.cardNumber}</strong></div>
              <div className="summary-row"><span>Card Name</span><strong>{paymentSummary.cardName}</strong></div>
              <div className="summary-row"><span>Date</span><strong>{paymentSummary.date}</strong></div>
              <div className="summary-row"><span>Time</span><strong>{paymentSummary.time}</strong></div>
              <div className="summary-row amount-row"><span>Amount</span><strong>{paymentSummary.amount}</strong></div>
            </div>
          )}

          {popup.type === "success" ? (
            <div className="popup-actions">
              <button type="button" className="popup-button popup-print" onClick={handlePrintSummary}>
                Print
              </button>
              <button type="button" className="popup-button" onClick={handleDone}>
                Done
              </button>
            </div>
          ) : (
            <button type="button" className="popup-button" onClick={closePopup}>
              OK
            </button>
          )}
        </div>
      </div>
    )}
  </div>
);
}

export default CardPayment;