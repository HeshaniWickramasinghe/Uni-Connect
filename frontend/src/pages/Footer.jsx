import React from 'react';
import './Footer.css';

function Footer() {
    const socials = ['Facebook', 'LinkedIn', 'Instagram'];

    return (
        <footer className="uc-footer">
            <div className="uc-footer-inner">
                <div>
                    <div className="uc-footer-brand">
                        <span className="uc-footer-mark">U</span>
                        <div>
                            <h3 className="uc-footer-title">UniConnect</h3>
                            <p className="uc-footer-tagline">Empowering student life at SLIIT</p>
                        </div>
                    </div>
                </div>

                <div className="uc-footer-right">
                    <p className="uc-footer-copy">© {new Date().getFullYear()} UniConnect Portal</p>
                    <div className="uc-socials">
                        {socials.map((social) => (
                            <a key={social} className="uc-social" href="#" onClick={(e) => e.preventDefault()}>
                                {social}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;