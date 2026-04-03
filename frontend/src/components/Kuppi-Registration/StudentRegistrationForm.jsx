import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentRegistrationForm.css';

const StudentRegistrationForm = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useState(null);
    const [formData, setFormData] = useState({
        studentName: '',
        studentEmail: '',
        studentId: '',
        contactNumber: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchSessionInfo = async () => {
            try {
                // We'll fetch all sessions and find our ID since we don't have a specific getById yet
                const response = await axios.get('http://localhost:5000/api/kuppi-sessions');
                const session = response.data.find(s => s._id === sessionId);
                if (!session) {
                    setMessage({ type: 'error', text: 'Kuppi Session not found' });
                } else {
                    setSessionData(session);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching session info:", error);
                setMessage({ type: 'error', text: 'Failed to access session information' });
                setLoading(false);
            }
        };

        fetchSessionInfo();
    }, [sessionId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        // Instead of immediate submission, show the payment modal
        setShowPaymentModal(true);
    };

    const confirmRegistration = async () => {
        setShowPaymentModal(false);
        setSubmitting(true);

        try {
            const response = await axios.post('http://localhost:5000/api/student-registrations', {
                ...formData,
                sessionId
            });
            setMessage({ type: 'success', text: response.data.message || 'Successfully registered for the session!' });
            setFormData({ studentName: '', studentEmail: '', studentId: '', contactNumber: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Enrollment failed. Please try again.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="sr-loading"><div className="loader"></div></div>;

    return (
        <div className="sr-form-container">
            <div className="sr-form-wrapper">
                <div className="sr-form-header">
                    <h2>Register for Kuppi</h2>
                    {sessionData && (
                        <div className="session-summary">
                            <p>You are registering for:</p>
                            <h3>{sessionData.moduleName} ({sessionData.moduleCode})</h3>
                            <div className="summary-grid">
                                <div className="summary-item"><strong>Date:</strong> {new Date(sessionData.date).toLocaleDateString()}</div>
                                <div className="summary-item"><strong>Time:</strong> {sessionData.time}</div>
                                <div className="summary-item"><strong>Duration:</strong> {sessionData.duration} mins</div>
                                <div className="summary-item"><strong>Price:</strong> LKR {sessionData.price}</div>
                            </div>
                            <p className="summary-host">Tutor: {sessionData.name}</p>
                        </div>
                    )}
                </div>

                {message.text && (
                    <div className={`sr-message sr-${message.type}`}>
                        {message.text}
                    </div>
                )}

                {!sessionData && !loading ? (
                    <button onClick={() => navigate('/')} className="back-btn">Go Back To Home</button>
                ) : (
                    <form className="sr-form" onSubmit={handleSubmit}>
                        <div className="sr-input-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                name="studentName" 
                                value={formData.studentName} 
                                onChange={handleChange} 
                                placeholder="Enter your full name" 
                                required 
                            />
                        </div>

                        <div className="sr-input-group">
                            <label>University Email Address</label>
                            <input 
                                type="email" 
                                name="studentEmail" 
                                value={formData.studentEmail} 
                                onChange={handleChange} 
                                placeholder="e.g. it21xxxx@my.sliit.lk" 
                                required 
                            />
                        </div>

                        <div className="sr-input-group">
                            <label>Student / Index Number</label>
                            <input 
                                type="text" 
                                name="studentId" 
                                value={formData.studentId} 
                                onChange={handleChange} 
                                placeholder="Enter your Student ID" 
                                required 
                            />
                        </div>

                        <div className="sr-input-group">
                            <label>Contact Number</label>
                            <input 
                                type="tel" 
                                name="contactNumber" 
                                value={formData.contactNumber} 
                                onChange={handleChange} 
                                placeholder="e.g. 07xxxxxxxx" 
                                pattern="\d{10}"
                                title="Please enter a 10-digit number"
                                required 
                            />
                        </div>

                        <div className="sr-submit-row">
                            <button type="submit" className="sr-submit-btn" disabled={submitting}>
                                {submitting ? <span className="loader"></span> : 'Complete Registration'}
                            </button>
                        </div>
                        
                        <div className="sr-back-home" onClick={() => navigate('/')}>
                            ← Return to Home Page
                        </div>
                    </form>
                )}
            </div>

            {/* Payment Confirmation Modal */}
            {showPaymentModal && sessionData && (
                <div className="sr-modal-overlay">
                    <div className="sr-modal-content">
                        <div className="sr-modal-header">
                            <h3>Payment Required</h3>
                        </div>
                        <div className="sr-modal-body">
                            <p className="payment-msg">
                                Please pay the session fee of <strong>LKR {sessionData.price}</strong> to the tutor's bank account to complete your registration.
                            </p>
                            
                            <div className="tutor-bank-card">
                                <h4 className="card-subtitle">Tutor's Bank Details:</h4>
                                <div className="bank-info-row"><span>Bank Name:</span> {sessionData.bankName}</div>
                                <div className="bank-info-row"><span>Account Holder:</span> {sessionData.accountHolderName}</div>
                                <div className="bank-info-row"><span>Account Number:</span> {sessionData.accountNumber}</div>
                                <div className="bank-info-row"><span>Branch:</span> {sessionData.branchName}</div>
                            </div>
                            
                            <p className="payment-notice">Once paid, click "Proceed" to finalize your enrollment.</p>
                        </div>
                        <div className="sr-modal-footer">
                            <button className="sr-modal-btn sr-confirm-btn" onClick={confirmRegistration}>
                                Proceed
                            </button>
                            <button className="sr-modal-btn sr-cancel-btn" onClick={() => setShowPaymentModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentRegistrationForm;
