import React, { useState, useEffect } from 'react';
import './HandoverModal.css';

const HandoverModal = ({ itemId, itemName, finderName, receiverName, onClose, onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Form, 2: Verification Code Entry
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [handoverId, setHandoverId] = useState(null);
    const [inputCode, setInputCode] = useState(''); // Code entered by finder

    // Form State
    const [formData, setFormData] = useState({
        registrationNo: '',
        faculty: '',
        contactNumber: '',
        universityIdPhoto: null,
        email: ''
    });

    const faculties = [
        "Computing",
        "Business",
        "Engineering",
        "Humanities & Sciences",
        "Graduate Studies"
    ];

    // IT Number Regex: Prefix (IT,SE,DS,CS,EN,BM,IM) + 8 digits
    const itNumberRegex = /^(IT|SE|DS|CS|EN|BM|IM)\d{8}$/i;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        let newValue = value;

        // Special handling for registrationNo to auto-update email
        if (name === 'registrationNo') {
            // Limit length to 10
            if (value.length > 10) return;
            
            newValue = value.toUpperCase();
            
            // Auto-update email based on IT number
            const baseIT = newValue.toLowerCase();
            setFormData(prev => ({ 
                ...prev, 
                registrationNo: newValue,
                email: newValue.length >= 2 ? `${baseIT}@my.sliit.lk` : prev.email
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, universityIdPhoto: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const isEmailValid = (email) => {
        const emailRegex = /^(it|se|ds|cs|en|bm|im)\d{8}@my\.sliit\.lk$/i;
        return emailRegex.test(email);
    };

    const isFormValid = () => {
        return (
            itNumberRegex.test(formData.registrationNo) &&
            formData.faculty !== '' &&
            formData.contactNumber.length === 10 &&
            formData.universityIdPhoto !== null &&
            isEmailValid(formData.email)
        );
    };

    const handleProceed = async () => {
        if (!isFormValid()) return;

        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/handovers/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId,
                    finderName,
                    receiverName,
                    ...formData
                })
            });

            const data = await response.json();
            if (response.ok) {
                setHandoverId(data.handoverId);
                setStep(2);
            } else {
                setError(data.message || 'Failed to initiate handover');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmComplete = async () => {
        if (inputCode.trim().length === 0) {
            setError('Please enter the verification code');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/handovers/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    handoverId,
                    code: inputCode
                })
            });

            const data = await response.json();
            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="handover-overlay">
            <div className="handover-modal">
                <div className="handover-header">
                    <div className="handover-header-title">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                        </div>
                        <div>
                            <h2>{step === 1 ? 'Identity Verification' : 'Verify Handover Code'}</h2>
                            <p>{step === 1 ? 'Secure handover protocol' : 'Waiting for receiver'}</p>
                        </div>
                    </div>
                    <button className="handover-close" onClick={onClose}>✕</button>
                </div>

                <div className="handover-body">
                    {step === 1 ? (
                        <>
                            <div className="finder-note">
                                <div className="finder-note-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                </div>
                                <p className="finder-note-text">
                                    <strong>Finder Note:</strong> Code will be sent to the receiver's email and phone number to verify handover receipt.
                                </p>
                            </div>

                            <div className="handover-form-grid">
                                <div>
                                    <label className="handover-label">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10" /><path d="M7 12h10" /><path d="M7 17h10" /></svg>
                                        Registration No.
                                    </label>
                                    <input 
                                        type="text" 
                                        name="registrationNo"
                                        placeholder="e.g. IT23690998" 
                                        className={`handover-input ${formData.registrationNo && !itNumberRegex.test(formData.registrationNo) ? 'border-rose-500 bg-rose-50' : ''}`}
                                        value={formData.registrationNo}
                                        onChange={handleInputChange}
                                        maxLength={10}
                                    />
                                    {formData.registrationNo && !itNumberRegex.test(formData.registrationNo) && (
                                        <p className="text-[9px] text-rose-500 font-bold mt-1 px-1">Must be IT/SE/DS/CS/EN/BM/IM + 8 digits</p>
                                    )}
                                </div>
                                <div>
                                    <label className="handover-label">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4" /><path d="M2 14v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4" /><rect width="20" height="8" x="2" y="8" rx="2" /></svg>
                                        Faculty
                                    </label>
                                    <select 
                                        name="faculty"
                                        className="handover-select"
                                        value={formData.faculty}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select...</option>
                                        {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group-full">
                                <label className="handover-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><path d="m22 7-10 7L2 7"/></svg>
                                    University Email
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="itXXXXXXXX@my.sliit.lk" 
                                    className="handover-input bg-slate-50 text-slate-500 cursor-not-allowed"
                                    value={formData.email}
                                    readOnly
                                />
                                <p className="text-[9px] text-slate-400 font-bold mt-1 px-1 italic">Automatically generated from IT Number</p>
                            </div>

                            <div className="form-group-full">
                                <label className="handover-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                                    Contact Number
                                </label>
                                <input 
                                    type="text" 
                                    name="contactNumber"
                                    placeholder="Mobile Number" 
                                    className="handover-input"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    maxLength={10}
                                />
                            </div>

                            <div className="form-group-full">
                                <div className="upload-area" onClick={() => document.getElementById('id-upload').click()}>
                                    <input 
                                        type="file" 
                                        id="id-upload" 
                                        hidden 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {formData.universityIdPhoto ? (
                                        <div className="relative group">
                                            <img src={formData.universityIdPhoto} alt="ID Preview" className="h-32 mx-auto rounded-lg shadow-md" />
                                            <p className="mt-2 text-xs font-bold text-emerald-600">Photo Uploaded</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="upload-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                                            </div>
                                            <p className="upload-text">Upload University ID Photo</p>
                                            <p className="upload-subtext">Visible name & Reg. No. required</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {error && <p className="error-msg text-center mb-4">{error}</p>}

                            <div className="handover-footer">
                                <button className="btn-cancel" onClick={onClose}>Cancel</button>
                                <button 
                                    className={`btn-proceed ${isFormValid() && !loading ? 'active' : ''}`}
                                    disabled={!isFormValid() || loading}
                                    onClick={handleProceed}
                                >
                                    {loading ? 'Verifying IT No...' : (
                                        <>
                                            <span>Proceed to Verify</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m12 16 4-4-4-4" /><path d="M8 12h8" /></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="success-step">
                            <div className="success-icon-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                            </div>
                            <h2 className="success-title">Verify Code</h2>
                            <p className="success-description">
                                A verification code has been sent to <strong>{formData.email}</strong> and <strong>{formData.contactNumber}</strong>.
                            </p>

                            <div className="token-box">
                                <div className="token-label">
                                    <span>Enter Digital Receipt Token</span>
                                    <span className="secure-tag">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        Secure
                                    </span>
                                </div>
                                <input 
                                    type="text" 
                                    className="handover-input text-center text-2xl tracking-[10px] uppercase font-black py-6 mt-4" 
                                    placeholder="----"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                    maxLength={4}
                                />
                            </div>

                            {error && <p className="error-msg text-center mb-4">{error}</p>}

                            <button 
                                className={`btn-confirm ${inputCode.length === 4 ? '' : 'opacity-50 pointer-events-none'}`} 
                                onClick={handleConfirmComplete} 
                                disabled={loading || inputCode.length < 4}
                            >
                                {loading ? 'Verifying Code...' : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                        Confirm Handover Complete
                                    </>
                                )}
                            </button>
                            
                            <span className="close-link" onClick={() => setStep(1)}>Back to form</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HandoverModal;
