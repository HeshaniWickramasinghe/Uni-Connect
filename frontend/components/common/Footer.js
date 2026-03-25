import React from 'react';

function Footer() {
    // Theme Colors
    const primaryBlue = '#023E8A';
    const darkGray = '#4A5568';
    const lightBg = '#F7F9FC';
    const borderGray = '#DDE3ED';

    return (
        <footer className="w-full bg-white border-t mt-auto py-12 px-6" style={{ borderColor: borderGray }}>
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">

                <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: primaryBlue }}
                        >
                            U
                        </div>
                        <span className="text-xl font-black italic tracking-tighter" style={{ color: primaryBlue }}>
                            UniConnect
                        </span>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: darkGray }}>
                        Empowering Student Life at SLIIT
                    </p>
                </div>

                <div className="flex-1 px-8 hidden md:block">
                    {/* Placeholder or empty space as requested to remove the middle links */}
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                    <p className="text-[10px] font-bold text-gray-400">
                        © {new Date().getFullYear()} UniConnect Portal
                    </p>
                    <div className="flex gap-4">
                        {['Facebook', 'LinkedIn', 'Instagram'].map(social => (
                            <span
                                key={social}
                                className="text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors hover:opacity-75"
                                style={{ color: darkGray }}
                            >
                                {social}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
