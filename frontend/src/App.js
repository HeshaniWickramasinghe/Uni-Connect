import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPay from "./pages/testpay";
import CardPayment from "./pages/CardPayment";
import BankTransfer from "./pages/BankTransfer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestPay />} />
        <Route path="/card-payment" element={<CardPayment />} />
        <Route path="/bank-transfer" element={<BankTransfer />} />
      </Routes>
    </Router>
  );
}

export default App;