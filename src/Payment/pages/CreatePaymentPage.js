import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment as createPaymentApi } from '../api/PaymentApi';
import customerService from '../../services/customerService';

function CreatePaymentPage() {
    const navigate = useNavigate();

    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('');
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const [customers, setCustomers] = useState([]);
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
    const [fetchCustomersError, setFetchCustomersError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            setIsLoadingCustomers(true);
            setFetchCustomersError(null);
            try {
                const response = await customerService.getAllCustomers();
                if (response && response.data) {
                    setCustomers(response.data);
                } else {
                    setCustomers([]);
                    console.warn("Format data pelanggan tidak sesuai harapan:", response);
                }
            } catch (error) {
                console.error("Gagal mengambil daftar pelanggan:", error);
                setFetchCustomersError("Gagal memuat daftar pelanggan. Silakan coba lagi nanti.");
            } finally {
                setIsLoadingCustomers(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        if (!customerId) {
            setSubmitError("Silakan pilih pelanggan.");
            setIsSubmitting(false);
            return;
        }
        if (!status) {
            setSubmitError("Silakan pilih status pembayaran.");
            setIsSubmitting(false);
            return;
        }

        const newPaymentData = {
            customerId,
            amount: parseFloat(amount),
            method,
            status: status,
        };

        try {
            console.log("Mengirim data pembayaran baru ke API:", newPaymentData);
            const createdPayment = await createPaymentApi(newPaymentData);
            console.log("Pembayaran berhasil dibuat via API:", createdPayment);

            alert('Pembayaran baru berhasil dibuat!');
            navigate('/payment');
        } catch (apiError) {
            console.error("Gagal membuat pembayaran via API:", apiError);
            const errorMessage = apiError.response?.data?.message ||
                apiError.message ||
                "Terjadi kesalahan saat membuat pembayaran.";
            setSubmitError(errorMessage);
            alert(`Gagal membuat pembayaran: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
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
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
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
        opacity: isSubmitting ? 0.7 : 1,
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


    return (
        <div style={containerStyle}>
            <header>
                <h1 style={headingStyle}>Buat Pembayaran Baru</h1>
            </header>

            <main style={mainStyle}>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={formGroupStyle}>
                        <label htmlFor="customerId" style={labelStyle}>Pelanggan:</label>
                        {isLoadingCustomers ? (
                            <p style={{ color: subtleTextColor }}>Memuat daftar pelanggan...</p>
                        ) : fetchCustomersError ? (
                            <p style={{ color: errorColor }}>{fetchCustomersError}</p>
                        ) : (
                            <select
                                id="customerId"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                style={inputStyle}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="" disabled>Pilih pelanggan...</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.fullName || customer.name || `Customer ID: ${customer.id}`}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="amount" style={labelStyle}>Jumlah:</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={inputStyle}
                            required
                            min="0.01"
                            step="0.01"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="method" style={labelStyle}>Metode Pembayaran:</label>
                        <select
                            id="method"
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            style={inputStyle}
                            required
                            disabled={isSubmitting}
                        >
                            <option value="" disabled>Pilih metode...</option>
                            <option value="Credit Card">Kartu Kredit</option>
                            <option value="Debit Card">Kartu Debit</option>
                            <option value="Bank Transfer">Transfer Bank</option>
                            <option value="OVO">OVO</option>
                            <option value="GoPay">GoPay</option>
                            <option value="DANA">DANA</option>
                            <option value="Other">Lainnya</option>
                        </select>
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="status" style={labelStyle}>Status Pembayaran:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={inputStyle}
                            required
                            disabled={isSubmitting}
                        >
                            <option value="" disabled>Pilih status...</option>
                            <option value="CICILAN">Cicilan</option>
                            <option value="LUNAS">Lunas</option>
                        </select>
                    </div>

                    {submitError && (
                        <div style={errorTextStyle}>
                            {submitError}
                        </div>
                    )}

                    <button
                        type="submit"
                        style={submitButtonStyle}
                        disabled={isSubmitting}
                        onMouseEnter={(e) => { if (!isSubmitting) Object.assign(e.target.style, hoverSubmitButtonStyle);}}
                        onMouseLeave={(e) => { if (!isSubmitting) Object.assign(e.target.style, {
                            backgroundColor: submitButtonStyle.backgroundColor,
                            transform: submitButtonStyle.transform,
                            boxShadow: submitButtonStyle.boxShadow
                        });}}
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Pembayaran'}
                    </button>
                </form>

                <button
                    onClick={() => navigate('/payment')}
                    style={backButtonStyle}
                    disabled={isSubmitting}
                    onMouseEnter={(e) => { if (!isSubmitting) Object.assign(e.target.style, hoverBackButtonStyle);}}
                    onMouseLeave={(e) => { if (!isSubmitting) Object.assign(e.target.style, {
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

export default CreatePaymentPage;
