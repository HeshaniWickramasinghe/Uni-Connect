import { useNavigate } from "react-router-dom";
import "./testpay.css";

function TestPay() {
  const navigate = useNavigate();

  const handleBankTransfer = () => {
    // Navigate to bank transfer page
    navigate("/bank-transfer");
  };

  const handleOnlinePay = () => {
    // Navigate to card payment page
    navigate("/card-payment");
  };

  return (
    <div className="testpay-page">
      <div className="testpay-card">
        <h2 className="testpay-title">💳 Select Payment Method</h2>
        <p className="testpay-subtitle">Choose how you want to pay</p>

        <div className="payment-methods">
          <button className="payment-button bank-transfer" onClick={handleBankTransfer}>
            <div className="button-icon">🏦</div>
            <div className="button-label">Bank Transfer</div>
            <div className="button-desc">Direct bank payment</div>
          </button>

          <button className="payment-button online-pay" onClick={handleOnlinePay}>
            <div className="button-icon">💳</div>
            <div className="button-label">Online Pay</div>
            <div className="button-desc">Card payment</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestPay;
