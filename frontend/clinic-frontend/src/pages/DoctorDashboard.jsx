import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import "./DoctorDashboard.css";


const navItems = [
    {
        to: 'appointments',
        label: 'جميع الحجوزات',
        icon: (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="d-nav-icon">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
        ),
    },
];

function SidebarBody({ onClose, displayName, initials, location, logout }) {
    return (
        <>
            <div className="dsb-orb-1" />
            <div className="dsb-orb-2" />

            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', left: '16px',
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'white', zIndex: 2,
                    }}
                >
                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            )}

            <div style={{ padding: '24px 20px 20px', position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', animation: 'fadeSlideUp 0.6s cubic-bezier(.16,1,.3,1) 0.15s both' }}>
                    <div className="d-logo-icon" style={{
                        width: '38px', height: '38px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(29,158,117,0.45), rgba(4,46,32,0.7))',
                        border: '1px solid rgba(74,222,128,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 14h-2v-4H7v-2h4V7h2v4h4v2h-4v4z" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 900, color: 'white', lineHeight: 1.2 }}>بوابة الطبيب</div>
                        <div style={{ fontSize: '11px', color: '#9FE1CB', marginTop: '2px' }}>نظام المواعيد</div>
                    </div>
                </div>

                <div style={{ animation: 'fadeSlideUp 0.6s cubic-bezier(.16,1,.3,1) 0.25s both' }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: '#1D9E75', letterSpacing: '0.08em', marginBottom: '8px', padding: '0 4px' }}>القائمة</p>
                    <div className="d-divider" />
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    {navItems.map((item, idx) => {
                        const isActive = location.pathname.includes(item.to);
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={onClose}
                                className={`d-nav-item d-nav-item-${idx + 1} ${isActive ? 'active' : ''}`}
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
                        <div className="d-avatar-ring">
                            <div className="d-avatar-inner">{initials}</div>
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: '13px', fontWeight: 800, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                                {displayName}
                            </p>
                            <p style={{ fontSize: '11px', color: '#9FE1CB', margin: 0 }}>طبيب</p>
                        </div>
                    </div>
                    <button className="d-logout-btn" onClick={() => { onClose?.(); logout(); }}>
                        <svg className="d-lout-icon" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </>
    );
}

export default function DoctorDashboard() {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const displayName = user?.name || 'الطبيب';
    const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2);

    useEffect(() => { setSidebarOpen(false); }, [location.pathname]);
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const sharedProps = { displayName, initials, location, logout };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', direction: 'rtl', fontFamily: "'Tajawal', sans-serif" }}>

            <div className="d-mobile-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 14h-2v-4H7v-2h4V7h2v4h4v2h-4v4z" />
                    </svg>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>بوابة الطبيب</span>
                </div>
                <button className="d-hamburger" onClick={() => setSidebarOpen(true)}>
                    <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                <aside className="dsb dsb-desktop">
                    <SidebarBody {...sharedProps} onClose={null} />
                </aside>

                <div className="dsb-mobile-wrap">
                    {sidebarOpen && (
                        <>
                            <div className="dsb-overlay" onClick={() => setSidebarOpen(false)} />
                            <aside className="dsb dsb-mobile">
                                <SidebarBody {...sharedProps} onClose={() => setSidebarOpen(false)} />
                            </aside>
                        </>
                    )}
                </div>

                <main className="d-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}