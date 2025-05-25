import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentPage() {
    const navigate = useNavigate();

    const handleCreatePayment = () => {
        console.log("Tombol 'Buat Pembayaran' diklik.");
        navigate('/payment/create');
    };

    const handleViewHistory = () => {
        console.log("Tombol 'Lihat Riwayat Pembayaran' diklik.");
        navigate('/payment/history')
    };

    const primaryDark = '#201E43';
    const secondaryDark = '#134B70';
    const secondaryLight = '#508C9B';
    const textColor = '#EEEEEE';
    const subtleTextColor = '#BDC3C7';

    const containerStyle = {
        padding: '40px 20px',
        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        backgroundColor: primaryDark,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: textColor,
        textAlign: 'center',
    };

    const headingStyle = {
        fontSize: '2.8em',
        fontWeight: '600',
        marginBottom: '50px',
        color: textColor,
        textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
    };

    const buttonContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '25px',
        marginBottom: '40px',
        maxWidth: '900px',
        width: '100%',
    };

    const baseButtonStyle = {
        padding: '15px 30px',
        fontSize: '1.1em',
        color: textColor,
        backgroundColor: secondaryDark,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
        fontWeight: '500',
        minWidth: '240px',
        textAlign: 'center',
        transform: 'scale(1)',
    };

    const hoverButtonProperties = {
        backgroundColor: secondaryLight,
        transform: 'scale(1.05)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    };

    const infoTextStyle = {
        marginTop: '20px',
        fontSize: '1.0em',
        lineHeight: '1.7',
        maxWidth: '600px',
        color: subtleTextColor,
        marginLeft: 'auto',
        marginRight: 'auto',
    };

    return (
        <div style={containerStyle}>
            <header>
                <h1 style={headingStyle}>Manajemen Pembayaran</h1>
            </header>

            <main>
                <div style={buttonContainerStyle}>
                    <button
                        onClick={handleCreatePayment}
                        style={{ ...baseButtonStyle }} // Terapkan base style
                        onMouseEnter={(e) => Object.assign(e.target.style, hoverButtonProperties)}
                        onMouseLeave={(e) => Object.assign(e.target.style, {
                            backgroundColor: baseButtonStyle.backgroundColor,
                            transform: baseButtonStyle.transform,
                            boxShadow: baseButtonStyle.boxShadow
                        })}
                    >
                        Buat Pembayaran Baru
                    </button>
                    <button
                        onClick={handleViewHistory}
                        style={{ ...baseButtonStyle }}
                        onMouseEnter={(e) => Object.assign(e.target.style, hoverButtonProperties)}
                        onMouseLeave={(e) => Object.assign(e.target.style, {
                            backgroundColor: baseButtonStyle.backgroundColor,
                            transform: baseButtonStyle.transform,
                            boxShadow: baseButtonStyle.boxShadow
                        })}
                    >
                        Lihat Riwayat Pembayaran
                    </button>
                </div>

                <section style={infoTextStyle}>
                    <p>
                        Kelola semua transaksi pembayaran Anda dengan mudah melalui opsi di atas.
                        Anda dapat membuat catatan pembayaran baru, memperbarui status transaksi yang ada,
                        atau melihat riwayat lengkap pembayaran pelanggan.
                    </p>
                </section>
            </main>
        </div>
    );
}

export default PaymentPage;
