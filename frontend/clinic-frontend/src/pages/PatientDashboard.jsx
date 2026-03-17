import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import "./PatientDashboard.css";

const navItems = [
    {
        to: 'new',
        label: 'حجز موعد جديد',
        icon: (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="nav-icon">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
            </svg>
        ),
    },
    {
        to: 'appointments',
        label: 'حجوزاتي',
        icon: (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="nav-icon">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
        ),
    },
];

function SidebarBody({ onClose, displayName, initials, location, logout }) {
    return (
        <>
            <div className="sb-orb-1" />
            <div className="sb-orb-2" />

            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', left: '16px',
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'white', zIndex: 2,
                        transition: 'background 0.2s',
                    }}
                >
                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            )}

            <div style={{ padding: '24px 20px 20px', position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', animation: 'fadeSlideUp 0.6s cubic-bezier(.16,1,.3,1) 0.15s both' }}>
                    <div className="logo-icon-box" style={{
                        width: '38px', height: '38px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(55,138,221,0.4), rgba(12,68,124,0.6))',
                        border: '1px solid rgba(96,165,250,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 900, color: 'white', lineHeight: 1.2 }}>بوابة المريض</div>
                        <div style={{ fontSize: '11px', color: '#85B7EB', marginTop: '2px' }}>نظام المواعيد</div>
                    </div>
                </div>

                <div style={{ animation: 'fadeSlideUp 0.6s cubic-bezier(.16,1,.3,1) 0.25s both' }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: '#378ADD', letterSpacing: '0.08em', marginBottom: '8px', padding: '0 4px' }}>القائمة</p>
                    <div className="divider-line" />
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    {navItems.map((item, idx) => {
                        const isActive = location.pathname.includes(item.to);
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={onClose}
                                className={`nav-item nav-item-${idx + 1} ${isActive ? 'active' : ''}`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '16px', animation: 'fadeSlideUp 0.5s cubic-bezier(.16,1,.3,1) 0.45s both' }}>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '14px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div className="avatar-ring">
                            <div className="avatar-inner">{initials}</div>
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: '13px', fontWeight: 800, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                                {displayName}
                            </p>
                            <p style={{ fontSize: '11px', color: '#85B7EB', margin: 0 }}>مريض</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={() => { onClose?.(); logout(); }}>
                        <svg className="lout-icon" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </>
    );
}

export default function PatientDashboard() {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const displayName = user?.name || 'المريض';
    const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2);

    useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const sharedProps = { displayName, initials, location, logout };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', direction: 'rtl', fontFamily: "'Tajawal', sans-serif" }}>


            <div className="mobile-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                    </svg>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>بوابة المريض</span>
                </div>
                <button className="hamburger" onClick={() => setSidebarOpen(true)}>
                    <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                <aside className="psb psb-desktop">
                    <SidebarBody {...sharedProps} onClose={null} />
                </aside>

                <div className="psb-mobile-wrap">
                    {sidebarOpen && (
                        <>
                            <div className="sb-overlay" onClick={() => setSidebarOpen(false)} />
                            <aside className="psb psb-mobile">
                                <SidebarBody {...sharedProps} onClose={() => setSidebarOpen(false)} />
                            </aside>
                        </>
                    )}
                </div>

                <main className="patient-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}