import './Footer.css';

function Footer() {
    const socials = ['Facebook', 'LinkedIn', 'Instagram'];

    return (
        <footer className="uc-footer">
            <div className="uc-footer-inner">
                <div>
                    <div className="uc-footer-brand">
                        <div className="uc-brand-mark" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6" /><path d="M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                        </div>
                        <div>
                            <h3 className="uc-footer-title">Uni-Connect</h3>
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