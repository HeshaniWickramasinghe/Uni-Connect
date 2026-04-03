import { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AdminDashHeader from '../Admin/AdminDashHeader';
import '../Admin/AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function AdminPayments() {
  const location = useLocation();
  const user = location.state?.user;
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentsError, setPaymentsError] = useState('');
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterAmountValue, setFilterAmountValue] = useState('');
  const [filterAmountOperator, setFilterAmountOperator] = useState('=');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState('');

  const getStatusClass = (status) => {
    const normalizedStatus = String(status || '').trim().toLowerCase();
    if (normalizedStatus === 'success' || normalizedStatus === 'approved') return 'success';
    if (normalizedStatus === 'fail' || normalizedStatus === 'failed' || normalizedStatus === 'rejected') return 'failed';
    if (normalizedStatus === 'pending') return 'pending';
    return '';
  };

  const fetchPayments = async () => {
    setLoadingPayments(true);
    setPaymentsError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/api/payments`);
      setPayments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Cannot load payment data. Check backend URL/port and ensure backend is running.';
      setPaymentsError(message);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (paymentId) => {
    setUpdatingId(paymentId);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/payments/${paymentId}`, {
        status: 'approved'
      });
      
      setPayments(payments.map(p => 
        p._id === paymentId ? response.data.data : p
      ));
      alert('Payment approved successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to approve payment';
      alert(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (paymentId) => {
    setUpdatingId(paymentId);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/payments/${paymentId}`, {
        status: 'rejected'
      });
      
      setPayments(payments.map(p => 
        p._id === paymentId ? response.data.data : p
      ));
      alert('Payment rejected successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reject payment';
      alert(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewCardPaymentPDF = (payment) => {
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

    const paymentDate = payment.date ? new Date(payment.date).toLocaleDateString('en-GB') : '-';
    const paymentTime = payment.date
      ? new Date(payment.date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : '-';

    const rows = [
      ["Transaction ID", payment.transactionId || '-'],
      ["User Email", payment.userEmail || '-'],
      ["Student ID", payment.studentRegistrationNumber || '-'],
      ["Card Number", payment.cardNumber || '-'],
      ["Card Name", payment.cardName || '-'],
      ["Date", paymentDate],
      ["Time", paymentTime],
      ["Amount", String(payment.amount ?? '-')],
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

  const pendingPayments = payments.filter(p => 
    String(p.status || '').trim().toLowerCase() === 'pending'
  );

  const applyFilters = (paymentsToFilter) => {
    return paymentsToFilter.filter(p => {
      // Combined search filter - searches across Transaction ID, Email, and Student ID
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const transId = String(p.transactionId || '').toLowerCase();
        const email = String(p.userEmail || '').toLowerCase();
        const studentId = String(p.studentRegistrationNumber || '').toLowerCase();
        
        const matches = transId.includes(searchLower) || email.includes(searchLower) || studentId.includes(searchLower);
        if (!matches) return false;
      }

      // Method filter
      if (filterMethod && filterMethod !== '') {
        const method = String(p.method || '').toLowerCase();
        if (method !== filterMethod.toLowerCase()) return false;
      }

      // Date filter
      if (filterDateFrom) {
        const paymentDate = new Date(p.date);
        const fromDate = new Date(filterDateFrom);
        if (paymentDate < fromDate) return false;
      }
      if (filterDateTo) {
        const paymentDate = new Date(p.date);
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (paymentDate > toDate) return false;
      }

      // Amount filter
      if (filterAmountValue) {
        const amount = parseFloat(p.amount) || 0;
        const filterValue = parseFloat(filterAmountValue);
        
        if (filterAmountOperator === '=') {
          if (amount !== filterValue) return false;
        } else if (filterAmountOperator === '>') {
          if (amount <= filterValue) return false;
        } else if (filterAmountOperator === '<') {
          if (amount >= filterValue) return false;
        } else if (filterAmountOperator === '>=') {
          if (amount < filterValue) return false;
        } else if (filterAmountOperator === '<=') {
          if (amount > filterValue) return false;
        }
      }

      return true;
    });
  };

  const filteredPayments = applyFilters(showPendingOnly ? pendingPayments : payments);

  return (
    <div className="admin-layout">
      <Header user={user} />
      <main className="admin-page">
        <section className="admin-hero">
          <p className="admin-badge">Uni-Connect Admin</p>
          <h1>Check Payments</h1>
          <p className="admin-subtitle">Manage payment records here.</p>
        </section>

        <AdminDashHeader user={user} />

        <section className="admin-panel">
          <header className="admin-panel-head">
            <h3>Payment Management</h3>
            <div className="payment-view-buttons">
              <button 
                className={`view-btn ${!showPendingOnly ? 'active' : ''}`}
                onClick={() => setShowPendingOnly(false)}
              >
                All Payments
              </button>
              <button 
                className={`view-btn pending-badge ${showPendingOnly ? 'active' : ''}`}
                onClick={() => setShowPendingOnly(true)}
              >
                Pending Payments {pendingPayments.length > 0 && `(${pendingPayments.length})`}
              </button>
            </div>
          </header>

          {loadingPayments && <p className="admin-subtitle">Loading payments...</p>}

          {!loadingPayments && !paymentsError && (
            <div className="filter-section">
            <div className="filter-group">
              <label className="filter-label">Search:</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Transaction ID, Email, or Student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Method:</label>
              <select
                className="filter-input"
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
              >
                <option value="">All Methods</option>
                <option value="card">Card</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Date From:</label>
              <input
                type="date"
                className="filter-input"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Date To:</label>
              <input
                type="date"
                className="filter-input"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Amount:</label>
              <div className="filter-amount-group">
                <select
                  className="filter-operator"
                  value={filterAmountOperator}
                  onChange={(e) => setFilterAmountOperator(e.target.value)}
                >
                  <option value="=">=</option>
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value=">=">&gt;=</option>
                  <option value="<=">&lt;=</option>
                </select>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="Enter amount"
                  value={filterAmountValue}
                  onChange={(e) => setFilterAmountValue(e.target.value)}
                />
              </div>
            </div>

            <button
              className="filter-reset-btn"
              onClick={() => {
                setSearchQuery('');
                setFilterMethod('');
                setFilterDateFrom('');
                setFilterDateTo('');
                setFilterAmountValue('');
                setFilterAmountOperator('=');
              }}
            >
              Clear All Filters
            </button>
            </div>
          )}

          {paymentsError && <p className="admin-subtitle">{paymentsError}</p>}

          {!loadingPayments && !paymentsError && showPendingOnly && (
            <div className="admin-table-wrap">
              {filteredPayments.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Student ID</th>
                      <th>Method</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Receipt</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((item) => {
                      const date = item.date ? new Date(item.date).toLocaleDateString('en-GB') : '-';
                      const time = item.date
                        ? new Date(item.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                        : '-';

                      return (
                        <tr key={item._id}>
                          <td>{item.transactionId || '-'}</td>
                          <td>{item.studentRegistrationNumber || '-'}</td>
                          <td>{item.method || '-'}</td>
                          <td>{item.amount ?? '-'}</td>
                          <td>{date}</td>
                          <td>{time}</td>
                          <td>
                            {item.proofFileData ? (
                              <a
                                href={item.proofFileData}
                                target="_blank"
                                rel="noreferrer"
                                className="admin-receipt-link"
                              >
                                Open
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-approve"
                                onClick={() => handleApprove(item._id)}
                                disabled={updatingId === item._id}
                              >
                                {updatingId === item._id ? 'Approving...' : 'Approve'}
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() => handleReject(item._id)}
                                disabled={updatingId === item._id}
                              >
                                {updatingId === item._id ? 'Rejecting...' : 'Reject'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="admin-subtitle">No pending payments to review.</p>
              )}
            </div>
          )}

          {!loadingPayments && !paymentsError && !showPendingOnly && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Student ID</th>
                    <th>Method</th>
                    <th>Card Name</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((item) => {
                      const date = item.date ? new Date(item.date).toLocaleDateString('en-GB') : '-';
                      const time = item.date
                        ? new Date(item.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                        : '-';

                      return (
                        <tr key={item._id}>
                          <td>{item.transactionId || '-'}</td>
                          <td>{item.studentRegistrationNumber || '-'}</td>
                          <td>{item.method || '-'}</td>
                          <td>{item.cardName || '-'}</td>
                          <td>{item.amount ?? '-'}</td>
                          <td>
                            <span className={`pill ${getStatusClass(item.status)}`}>{item.status || '-'}</span>
                          </td>
                          <td>{date}</td>
                          <td>{time}</td>
                          <td>
                            {item.method === 'card' ? (
                              <button
                                className="admin-view-pdf-btn"
                                onClick={() => handleViewCardPaymentPDF(item)}
                              >
                                View
                              </button>
                            ) : item.proofFileData ? (
                              <a
                                href={item.proofFileData}
                                target="_blank"
                                rel="noreferrer"
                                className="admin-receipt-link"
                              >
                                Open
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9">No payment data found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default AdminPayments;
