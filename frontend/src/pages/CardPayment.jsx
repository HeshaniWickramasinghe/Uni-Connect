import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./CardPayment.css";

function CardPayment() {

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

  const handlePrintSummary = () => {
    if (!paymentSummary) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 42;
    const cardWidth = pageWidth - marginX * 2;

    doc.setFillColor(245, 249, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setFillColor(25, 87, 178);
    doc.roundedRect(marginX, 38, cardWidth, 88, 12, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(23);
    doc.text("Payment Receipt", marginX + 18, 78);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Uni-Connect Secure Payments", marginX + 18, 99);

    doc.setFillColor(225, 249, 235);
    doc.roundedRect(marginX + cardWidth - 124, 62, 106, 34, 8, 8, "F");
    doc.setTextColor(30, 130, 76);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PAID", marginX + cardWidth - 87, 84);

    doc.setTextColor(45, 62, 92);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Your payment has been processed successfully.", marginX, 150);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(209, 222, 241);
    doc.roundedRect(marginX, 174, cardWidth, 232, 10, 10, "FD");

    doc.setTextColor(26, 43, 74);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Payment Summary", marginX + 16, 202);

    const rows = [
      ["Amount", String(paymentSummary.amount)],
      ["Card Number", paymentSummary.cardNumber],
      ["Card Name", paymentSummary.cardName],
      ["Date", paymentSummary.date],
      ["Time", paymentSummary.time]
    ];

    let y = 234;
    rows.forEach(([label, value], index) => {
      if (index % 2 === 0) {
        doc.setFillColor(248, 251, 255);
        doc.rect(marginX + 10, y - 16, cardWidth - 20, 30, "F");
      }

      doc.setTextColor(69, 84, 112);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(label, marginX + 18, y);

      doc.setTextColor(27, 43, 70);
      doc.setFont("helvetica", "bold");
      doc.text(String(value), marginX + cardWidth - 18, y, { align: "right" });

      doc.setDrawColor(227, 235, 247);
      doc.line(marginX + 12, y + 10, marginX + cardWidth - 12, y + 10);
      y += 36;
    });

    doc.setTextColor(93, 108, 136);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("This is a system-generated receipt.", marginX, pageHeight - 34);

    const safeDate = paymentSummary.date.replace(/\//g, "-");
    const safeTime = paymentSummary.time.replace(/[:\s]/g, "-");
    doc.save(`payment-summary-${safeDate}-${safeTime}.pdf`);
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

    try {
      const payload = {
        ...form,
        cardNumber: form.cardNumber.replace(/\s/g, "")
      };

      const res = await axios.post(
        "http://localhost:5000/api/payments",
        payload
      );

      const summaryCardNumber = `**** **** **** ${payload.cardNumber.slice(-4)}`;
      const paidAt = new Date();
      setPaymentSummary({
        amount: form.amount,
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
              <div className="summary-row"><span>Amount</span><strong>{paymentSummary.amount}</strong></div>
              <div className="summary-row"><span>Card Number</span><strong>{paymentSummary.cardNumber}</strong></div>
              <div className="summary-row"><span>Card Name</span><strong>{paymentSummary.cardName}</strong></div>
              <div className="summary-row"><span>Date</span><strong>{paymentSummary.date}</strong></div>
              <div className="summary-row"><span>Time</span><strong>{paymentSummary.time}</strong></div>
            </div>
          )}

          {popup.type === "success" ? (
            <div className="popup-actions">
              <button type="button" className="popup-button popup-print" onClick={handlePrintSummary}>
                Print
              </button>
              <button type="button" className="popup-button" onClick={closePopup}>
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