import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPaymentById as getPaymentByIdApi, updatePaymentStatus as updatePaymentStatusApi } from '../api/PaymentApi';

function UpdatePaymentStatusPage() {
    const navigate = useNavigate();
    const { paymentId } = useParams();

    const [currentPayment, setCurrentPayment] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            if (!paymentId) return;

            setIsLoadingData(true);
            setFetchError(null);
            try {
                const response = await getPaymentByIdApi(paymentId);
                if (response) {
                    setCurrentPayment(response);
                    setNewStatus(response.status || '');
                } else {
                    setFetchError(`Detail pembayaran dengan ID ${paymentId} tidak ditemukan atau format respons tidak sesuai.`);
                }

            } catch (error) {
                console.error(`Gagal mengambil detail pembayaran untuk ID ${paymentId}:`, error);
                const errorMessage = error.response?.data?.message || error.message || "Gagal memuat detail pembayaran.";
                setFetchError(errorMessage);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchPaymentDetails();
    }, [paymentId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsUpdating(true);
        setUpdateError(null);

        if (!newStatus) {
            setUpdateError("Silakan pilih status baru.");
            setIsUpdating(false);
            return;
        }

        try {
            console.log(`Memperbarui status untuk payment ID ${paymentId} ke ${newStatus}`);
            await updatePaymentStatusApi(paymentId, newStatus);
            console.log("Status pembayaran berhasil diperbarui.");

            alert('Status pembayaran berhasil diperbarui!');
            navigate('/payment');
        } catch (apiError) {
            console.error("Gagal memperbarui status pembayaran:", apiError);
            const errorMessage = apiError.response?.data?.message ||
                apiError.message ||
                "Terjadi kesalahan saat memperbarui status.";
            setUpdateError(errorMessage);
            alert(`Gagal memperbarui status: ${errorMessage}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const primaryDark = '#201E43';
    const secondaryDark = '#134B70';
    const secondaryLight = '#508C9B';
    const textColor = '#EEEEEE';
    const subtleTextColor = '#BDC3C7';
    const inputBackgroundColor = '#2a2c52';
    const inputBorderColor = '#508C9B';
    const errorColor = '#E74C3C';

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
        fontSize: '2.5em',
        fontWeight: '600',
        marginBottom: '40px',
        color: textColor,
        textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
    };

    const mainStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: secondaryDark,
        padding: '30px 40px',
        borderRadius: '10px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '500px',
    };

    const formGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
    };

    const labelStyle = {
        marginBottom: '8px',
        fontSize: '1em',
        fontWeight: '500',
        color: subtleTextColor,
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        fontSize: '1em',
        backgroundColor: inputBackgroundColor,
        color: textColor,
        border: `1px solid ${inputBorderColor}`,
        borderRadius: '6px',
        boxSizing: 'border-box',
    };

    const infoTextStyle = {
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: inputBackgroundColor,
        borderRadius: '6px',
        border: `1px solid ${inputBorderColor}`,
        textAlign: 'left',
        color: subtleTextColor,
        width: '100%',
    };

    const submitButtonStyle = {
        padding: '15px 30px',
        fontSize: '1.1em',
        color: textColor,
        backgroundColor: secondaryLight,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
        fontWeight: '600',
        marginTop: '10px',
        width: '100%',
        transform: 'scale(1)',
        opacity: isUpdating ? 0.7 : 1,
    };

    const hoverSubmitButtonStyle = {
        backgroundColor: '#3E7C8B',
        transform: 'scale(1.03)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    };

    const backButtonStyle = {
        padding: '10px 20px',
        fontSize: '1em',
        color: textColor,
        backgroundColor: 'transparent',
        border: `1px solid ${secondaryLight}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        fontWeight: '500',
        marginTop: '30px',
    };

    const hoverBackButtonStyle = {
        backgroundColor: secondaryLight,
        color: primaryDark,
    };

    const messageStyle = {
        marginTop: '15px',
        padding: '10px',
        borderRadius: '5px',
        width: '100%',
        maxWidth: '500px',
        boxSizing: 'border-box',
    };

    const errorTextStyle = {
        ...messageStyle,
        backgroundColor: '#5c2a2a',
        color: errorColor,
        border: `1px solid ${errorColor}`,
    };


    if (isLoadingData) {
        return <div style={containerStyle}><p style={{ color: textColor, fontSize: '1.2em' }}>Memuat detail pembayaran...</p></div>;
    }

    if (fetchError) {
        return (
            <div style={containerStyle}>
                <p style={errorTextStyle}>{fetchError}</p>
                <button
                    onClick={() => navigate('/payment')}
                    style={backButtonStyle}
                    onMouseEnter={(e) => Object.assign(e.target.style, hoverBackButtonStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, {
                        backgroundColor: backButtonStyle.backgroundColor,
                        color: backButtonStyle.color
                    })}
                >
                    Kembali ke Manajemen Pembayaran
                </button>
            </div>
        );
    }

    if (!currentPayment) {
        return <div style={containerStyle}><p style={{ color: errorColor }}>Pembayaran tidak ditemukan.</p></div>;
    }

    return (
        <div style={containerStyle}>
            <header>
                <h1 style={headingStyle}>Perbarui Status Pembayaran</h1>
            </header>

            <main style={mainStyle}>
                <div style={formStyle}>
                    <div style={infoTextStyle}>
                        <p><strong>ID Pembayaran:</strong> {currentPayment.id}</p>
                        <p><strong>ID Pelanggan:</strong> {currentPayment.customerId}</p>
                        <p><strong>Jumlah:</strong> Rp {currentPayment.amount?.toLocaleString('id-ID') || 'N/A'}</p>
                        <p><strong>Metode:</strong> {currentPayment.method || 'N/A'}</p>
                        <p><strong>Status Saat Ini:</strong> <span style={{fontWeight: 'bold', color: currentPayment.status === 'LUNAS' ? 'lightgreen' : (currentPayment.status === 'CICILAN' ? 'yellow' : textColor)}}>{currentPayment.status || 'N/A'}</span></p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={formGroupStyle}>
                            <label htmlFor="status" style={labelStyle}>Status Pembayaran Baru:</label>
                            <select
                                id="status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                style={inputStyle}
                                required
                                disabled={isUpdating}
                            >
                                <option value="" disabled={newStatus !== ''}>Pilih status baru...</option>
                                <option value="CICILAN">Cicilan</option>
                                <option value="LUNAS">Lunas</option>
                            </select>
                        </div>

                        {updateError && (
                            <div style={errorTextStyle}>
                                {updateError}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={submitButtonStyle}
                            disabled={isUpdating}
                            onMouseEnter={(e) => { if (!isUpdating) Object.assign(e.target.style, hoverSubmitButtonStyle);}}
                            onMouseLeave={(e) => { if (!isUpdating) Object.assign(e.target.style, {
                                backgroundColor: submitButtonStyle.backgroundColor,
                                transform: submitButtonStyle.transform,
                                boxShadow: submitButtonStyle.boxShadow
                            });}}
                        >
                            {isUpdating ? 'Memperbarui...' : 'Simpan Perubahan Status'}
                        </button>
                    </form>
                </div>

                <button
                    onClick={() => navigate('/payment')}
                    style={backButtonStyle}
                    disabled={isUpdating}
                    onMouseEnter={(e) => { if (!isUpdating) Object.assign(e.target.style, hoverBackButtonStyle);}}
                    onMouseLeave={(e) => { if (!isUpdating) Object.assign(e.target.style, {
                        backgroundColor: backButtonStyle.backgroundColor,
                        color: backButtonStyle.color
                    });}}
                >
                    Kembali ke Manajemen Pembayaran
                </button>
            </main>
        </div>
    );
}

export default UpdatePaymentStatusPage;
