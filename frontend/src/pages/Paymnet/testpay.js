import { useLocation, useNavigate } from "react-router-dom";
import "./testpay.css";

function TestPay() {
  const navigate = useNavigate();
  const location = useLocation();
  const isModal = Boolean(location.state?.backgroundLocation);
  const user = location.state?.user;
  const returnTo = location.state?.returnTo;
  const sessionDraft = location.state?.sessionDraft;
  const registrationDraft = location.state?.registrationDraft;
  const paymentAmount = location.state?.paymentAmount;
  const cartItems = location.state?.cartItems;

  const handleBankTransfer = () => {
    // Navigate to bank transfer page
    navigate("/bank-transfer", { state: { user, returnTo, sessionDraft, registrationDraft, paymentAmount, cartItems, backgroundLocation: location } });
  };

  const handleOnlinePay = () => {
    // Navigate to card payment page
    navigate("/card-payment", { state: { user, returnTo, sessionDraft, registrationDraft, paymentAmount, cartItems, backgroundLocation: location } });
  };

  const handleClose = () => {
    if (isModal) {
      navigate(-1);
      return;
    }

    navigate(returnTo || "/homepage", { state: { user } });
  };

  return (
    <div className={isModal ? "testpay-overlay" : "testpay-page"}>
      <div className={isModal ? "testpay-modal" : "testpay-card"}>
        <div className="testpay-close-icon" onClick={handleClose} aria-label="Close payment selector" role="button" tabIndex={0}>
          ×
        </div>
        <h2 className="testpay-title">💳 Select Payment Method</h2>
        <p className="testpay-subtitle">Choose how you want to pay</p>

        <div className="payment-methods">
          <div className="payment-option bank-transfer" onClick={handleBankTransfer} role="button" tabIndex={0}>
            <div className="payment-icon">🏦</div>
            <div>
              <div className="payment-label">Bank Transfer</div>
              <div className="payment-desc">Direct bank payment</div>
            </div>
          </div>

          <div className="payment-option online-pay" onClick={handleOnlinePay} role="button" tabIndex={0}>
            <div className="payment-icon">💳</div>
            <div>
              <div className="payment-label">Online Pay</div>
              <div className="payment-desc">Card payment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPay;
