import React, { useState } from 'react';
import axios from 'axios';
import './KuppiSessionForm.css';

const KuppiSessionForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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
        qualificationFile: null,
        shortNoteFile: null
    });

    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Handle standard inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file inputs
    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    // Form submission and validation
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Frontend Validations
        const nameRegex = /^[A-Za-z\s]{3,}$/;
        if (!nameRegex.test(formData.name)) {
            return setMessage({ type: 'error', text: 'Name must be at least 3 letters long and contain only letters.' });
        }

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

        if (!files.qualificationFile || !files.shortNoteFile) {
            return setMessage({ type: 'error', text: 'Both Qualification (JPG) and Short Note (PDF) are required.' });
        }

        // Prepare FormData
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            // Split skills input by comma to create an array format for the backend if needed
            if (key === 'skills') {
                submitData.append(key, JSON.stringify(formData[key].split(',').map(s => s.trim())));
            } else {
                submitData.append(key, formData[key]);
            }
        });

        submitData.append('qualificationFile', files.qualificationFile);
        submitData.append('shortNoteFile', files.shortNoteFile);

        // Instead of immediate submit, show the payment modal
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async () => {
        setShowPaymentModal(false);
        setLoading(true);

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'skills') {
                submitData.append(key, JSON.stringify(formData[key].split(',').map(s => s.trim())));
            } else {
                submitData.append(key, formData[key]);
            }
        });
        submitData.append('qualificationFile', files.qualificationFile);
        submitData.append('shortNoteFile', files.shortNoteFile);

        try {
            const response = await axios.post('http://localhost:5000/api/kuppi-sessions', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage({ type: 'success', text: response.data.message || 'Session registered successfully!' });

            // Clear form
            setFormData({
                name: '', email: '', faculty: '', skills: '', moduleName: '',
                moduleCode: '', date: '', time: '', duration: '', price: '', meetingLink: '',
                bankName: '', accountNumber: '', accountHolderName: '', branchName: ''
            });
            setFiles({ qualificationFile: null, shortNoteFile: null });

            // Reset file inputs visually by clearing value
            document.getElementById('file-form').reset();

        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to connect to the server. Please try again later.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
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
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" required />
                        </div>
                        <div className="ks-input-group">
                            <label>Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="johndoe@example.com" required />
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
                            <label>Qualification Proof (JPG)</label>
                            <div className="file-input-wrapper">
                                <input type="file" name="qualificationFile" accept=".jpg,.jpeg" onChange={handleFileChange} required />
                                <span className="file-custom-btn">Choose Image</span>
                                <span className="file-name">{files.qualificationFile ? files.qualificationFile.name : 'No file chosen...'}</span>
                            </div>
                        </div>

                        <div className="ks-file-group">
                            <label>Short Notes (PDF)</label>
                            <div className="file-input-wrapper">
                                <input type="file" name="shortNoteFile" accept=".pdf" onChange={handleFileChange} required />
                                <span className="file-custom-btn">Choose PDF</span>
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

                    <div className="ks-submit-row">
                        <button type="submit" className="ks-submit-btn" disabled={loading}>
                            {loading ? <span className="loader"></span> : 'Register Session'}
                        </button>
                    </div>

                </form>
            </div>

            {/* Payment Confirmation Modal */}
            {showPaymentModal && (
                <div className="ks-modal-overlay">
                    <div className="ks-modal-content">
                        <div className="ks-modal-header">
                            <h3>Website Registration Fee</h3>
                        </div>
                        <div className="ks-modal-body">
                            <p>To register and host a Kuppi session, you must pay Rs. 1000 as a website registration fee.</p>
                        </div>
                        <div className="ks-modal-footer">
                            <button className="ks-modal-btn ks-confirm-btn" onClick={handleConfirmPayment}>
                                Pay Rs. 1000
                            </button>
                            <button className="ks-modal-btn ks-cancel-btn" onClick={() => setShowPaymentModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KuppiSessionForm;
