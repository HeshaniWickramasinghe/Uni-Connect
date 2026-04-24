import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import KuppiLayout from './KuppiLayout';
import './KuppiSessionForm.css';

const REGISTRATION_FEE = 1000;

function getStoredUser() {
    try {
        const rawUser = sessionStorage.getItem('loggedInUser');
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (_error) {
        return null;
    }
}

const KuppiSessionForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || getStoredUser();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        faculty: '',
        skills: '',
        moduleName: '',
        moduleCode: '',
        date: '',
        time: '',
        duration: '',
        price: '',
        meetingLink: '',
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
        branchName: ''
    });

    const [files, setFiles] = useState({
        coverImage: null,
        qualificationFile: null,
        shortNoteFile: null
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const paymentHandledRef = useRef(false);

    const resetFormState = () => {
        setFormData({
            name: user?.name || '', email: user?.email || '', faculty: '', skills: '', moduleName: '',
            moduleCode: '', date: '', time: '', duration: '', price: '', meetingLink: '',
            bankName: '', accountNumber: '', accountHolderName: '', branchName: ''
        });
        setFiles({ coverImage: null, qualificationFile: null, shortNoteFile: null });
        const formElement = document.getElementById('file-form');
        if (formElement) {
            formElement.reset();
        }
    };

    const submitSessionRequest = async (draftData, paymentResult) => {
        setLoading(true);

        const submitData = new FormData();
        Object.keys(draftData.formData).forEach(key => {
            if (key === 'skills') {
                submitData.append(key, JSON.stringify(draftData.formData[key].split(',').map(s => s.trim())));
            } else {
                submitData.append(key, draftData.formData[key]);
            }
        });

        submitData.append('coverImage', draftData.files.coverImage);
        submitData.append('qualificationFile', draftData.files.qualificationFile);
        submitData.append('shortNoteFile', draftData.files.shortNoteFile);
        submitData.append('registrationPaymentStatus', paymentResult?.status || 'unknown');
        submitData.append('registrationTransactionId', paymentResult?.transactionId || '');
        submitData.append('registrationPaymentMethod', paymentResult?.method || '');

        try {
            const response = await axios.post('http://localhost:5000/api/kuppi-sessions', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: response.data.message || 'Session request submitted successfully!' });
            resetFormState();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to submit session request after payment.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const paymentResult = location.state?.paymentResult;
        const sessionDraft = location.state?.sessionDraft;

        if (!paymentResult || !sessionDraft || paymentHandledRef.current) {
            return;
        }

        paymentHandledRef.current = true;
        submitSessionRequest(sessionDraft, paymentResult);
        navigate(location.pathname, { replace: true, state: { user } });
    }, [location.pathname, location.state, navigate, user]);

    // Handle standard inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file inputs
    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    // Form submission and validation
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Frontend Validations
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(formData.email)) {
            return setMessage({ type: 'error', text: 'Please provide a valid email.' });
        }

        if (formData.moduleName.length < 3) {
            return setMessage({ type: 'error', text: 'Module Name must be at least 3 characters.' });
        }

        const codeRegex = /^[A-Z]{2,4}\d{3,4}$/i;
        if (!codeRegex.test(formData.moduleCode)) {
            return setMessage({ type: 'error', text: 'Module Code must match format like IT3020.' });
        }

        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            return setMessage({ type: 'error', text: 'Date cannot be in the past.' });
        }

        if (formData.duration < 30 || formData.duration > 240) {
            return setMessage({ type: 'error', text: 'Duration must be between 30 and 240 minutes.' });
        }

        if (formData.price <= 0) {
            return setMessage({ type: 'error', text: 'Price must be a positive number.' });
        }

        const urlRegex = /^https?:\/\//;
        if (!urlRegex.test(formData.meetingLink)) {
            return setMessage({ type: 'error', text: 'Meeting Link must be a valid URL starting with http/https.' });
        }

        if (!files.coverImage || !files.qualificationFile || !files.shortNoteFile) {
            return setMessage({ type: 'error', text: 'Cover Image (JPG/PNG), Qualification Proof (PDF/JPG/PNG), and Short Notes (PDF/JPG/PNG) are required.' });
        }

        // Route directly to payment selection and pass the fixed registration fee.
        paymentHandledRef.current = false;
        navigate('/payments', {
            state: {
                user,
                returnTo: location.pathname,
                paymentAmount: REGISTRATION_FEE,
                sessionDraft: {
                    formData,
                    files
                },
                backgroundLocation: location
            }
        });
    };

    if (!user) {
        return (
            <KuppiLayout title="Host A LEC">
                <div className="ks-form-container">
                    <div className="ks-form-wrapper" style={{ textAlign: 'center' }}>
                        <div className="ks-form-header">
                            <h2>Login Required</h2>
                            <p>Please log in first to Uni-Connect.</p>
                        </div>
                        <div className="ks-submit-row" style={{ marginTop: '1rem' }}>
                            <button type="button" className="ks-submit-btn" onClick={() => navigate('/login', { state: { from: '/host-session' } })}>
                                Log in to Uni-Connect
                            </button>
                        </div>
                    </div>
                </div>
            </KuppiLayout>
        );
    }

    return (
        <KuppiLayout title="Host A LEC">
            <div className="ks-form-container">
                <div className="ks-form-wrapper">
                    <div className="ks-form-header">
                        <h2>Host A Kuppi Session</h2>
                        <p>Share your knowledge and help your peers succeed by registering a new module session.</p>
                    </div>

                    {message.text && (
                        <div className={`ks-message ks-${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form id="file-form" className="ks-form" onSubmit={handleSubmit}>

                    {/* Tutor Details Section */}
                    <h3 className="ks-section-title">1. Your Details</h3>
                    <div className="ks-grid">
                        <div className="ks-input-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} readOnly required />
                        </div>
                        <div className="ks-input-group">
                            <label>Email Address</label>
                            <input type="email" name="email" value={formData.email} readOnly required />
                        </div>
                    </div>

                    <div className="ks-grid">
                        <div className="ks-input-group">
                            <label>Faculty / Department</label>
                            <select name="faculty" value={formData.faculty} onChange={handleChange} required>
                                <option value="" disabled>Select your faculty...</option>
                                <option value="Computing">Computing</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Business">Business</option>
                                <option value="Humanities">Humanities & Sciences</option>
                            </select>
                        </div>
                        <div className="ks-input-group">
                            <label>Skills / Modules Expertise</label>
                            <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Comma separated: React, Java, Accounting" required />
                        </div>
                    </div>

                    {/* Session Details Section */}
                    <h3 className="ks-section-title">2. Session Information</h3>
                    <div className="ks-grid">
                        <div className="ks-input-group">
                            <label>Module Name</label>
                            <input type="text" name="moduleName" value={formData.moduleName} onChange={handleChange} placeholder="e.g. Web Development" required />
                        </div>
                        <div className="ks-input-group">
                            <label>Module Code</label>
                            <input type="text" name="moduleCode" value={formData.moduleCode} onChange={handleChange} placeholder="e.g. IT3020" required />
                        </div>
                    </div>

                    <div className="ks-grid">
                        <div className="ks-input-group">
                            <label>Session Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div className="ks-input-group">
                            <label>Session Time</label>
                            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="ks-grid">
                        <div className="ks-input-group">
                            <label>Duration (Minutes)</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Between 30 and 240..." min="30" max="240" required />
                        </div>
                        <div className="ks-input-group">
                            <label>Price (LKR)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 50" min="1" step="0.01" required />
                        </div>
                    </div>

                    <div className="ks-input-group fill-width">
                        <label>Virtual Meeting Link</label>
                        <input type="url" name="meetingLink" value={formData.meetingLink} onChange={handleChange} placeholder="https://zoom.us/j/123..." required />
                    </div>

                    {/* Documentation Section */}
                    <h3 className="ks-section-title">3. Upload Documentation</h3>
                    <div className="ks-grid">
                        <div className="ks-file-group">
                            <label>Cover Image (JPG/PNG)</label>
                            <div className="file-input-wrapper">
                                <input type="file" name="coverImage" accept=".jpg,.jpeg,.png" onChange={handleFileChange} required />
                                <span className="file-custom-btn">Choose Image</span>
                                <span className="file-name">{files.coverImage ? files.coverImage.name : 'No file chosen...'}</span>
                            </div>
                        </div>

                        <div className="ks-file-group">
                            <label>Qualification Proof (PDF/JPG/PNG)</label>
                            <div className="file-input-wrapper">
                                <input type="file" name="qualificationFile" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required />
                                <span className="file-custom-btn">Choose File</span>
                                <span className="file-name">{files.qualificationFile ? files.qualificationFile.name : 'No file chosen...'}</span>
                            </div>
                        </div>

                        <div className="ks-file-group">
                            <label>Short Notes (PDF/JPG/PNG)</label>
                            <div className="file-input-wrapper">
                                <input type="file" name="shortNoteFile" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required />
                                <span className="file-custom-btn">Choose File</span>
                                <span className="file-name">{files.shortNoteFile ? files.shortNoteFile.name : 'No file chosen...'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details Section */}
                    <h3 className="ks-section-title">4. Bank Details for Payments</h3>
                    <div className="ks-grid">
                        <div className="ks-input-group">
                            <label>Bank Name</label>
                            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. Bank of Ceylon" required />
                        </div>
                        <div className="ks-input-group">
                            <label>Account Number</label>
                            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="e.g. 123456789" required />
                        </div>
                    </div>

                    <div className="ks-grid">
                        <div className="ks-input-group">
                            <label>Account Holder Name</label>
                            <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} placeholder="As it appears on passbook" required />
                        </div>
                        <div className="ks-input-group">
                            <label>Branch Name</label>
                            <input type="text" name="branchName" value={formData.branchName} onChange={handleChange} placeholder="e.g. Borella" required />
                        </div>
                    </div>

                    <div className="ks-terms-box">
                        <h4>Terms:</h4>
                        <p><strong>Website Registration Fee</strong></p>
                        <p>To register and host a Kuppi session, you must pay to website as registration fee.</p>
                    </div>

                    <div className="ks-input-group fill-width ks-fee-input-wrap">
                        <label>Registration Fee: (Rs.)</label>
                        <input type="text" name="registrationFee" value={String(REGISTRATION_FEE)} readOnly />
                    </div>

                    <div className="ks-submit-row">
                        <button type="submit" className="ks-submit-btn" disabled={loading}>
                            {loading ? <span className="loader"></span> : 'Register Session'}
                        </button>
                    </div>

                    </form>
                </div>
            </div>
        </KuppiLayout>
    );
};

export default KuppiSessionForm;
