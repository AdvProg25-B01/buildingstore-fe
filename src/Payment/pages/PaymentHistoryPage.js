import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getPaymentsByCustomerId as getPaymentsByCustomerIdApi,
    deletePayment as deletePaymentApi
} from '../api/PaymentApi';
import customerService from '../../services/customerService';

function PaymentHistoryPage() {
    const navigate = useNavigate();

    const [currentUserRole, setCurrentUserRole] = useState(null);

    useEffect(() => {
        const roleFromStorage = localStorage.getItem('role');
        console.log("Role from localStorage (key: 'role'):", roleFromStorage);

        if (roleFromStorage) {
            setCurrentUserRole(roleFromStorage);
            console.log("Setting currentUserRole to:", roleFromStorage);
        } else {
            console.warn("Role (key: 'role') tidak ditemukan di localStorage.");
            setCurrentUserRole(null);
        }
    }, []);

    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [payments, setPayments] = useState([]);

    const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
    const [fetchCustomersError, setFetchCustomersError] = useState(null);
    const [isLoadingPayments, setIsLoadingPayments] = useState(false);
    const [fetchPaymentsError, setFetchPaymentsError] = useState(null);

    const [isDeletingId, setIsDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        const fetchAllCustomers = async () => {
            setIsLoadingCustomers(true);
            setFetchCustomersError(null);
            try {
                const response = await customerService.getAllCustomers();
                if (response && response.data) {
                    setCustomers(response.data);
                } else {
                    setCustomers([]);
                    console.warn("Format data pelanggan tidak sesuai harapan:", response);
                    setFetchCustomersError("Gagal memuat daftar pelanggan: format data tidak valid.");
                }
            } catch (error) {
                console.error("Gagal mengambil daftar pelanggan:", error);
                const errorMessage = error.response?.data?.message || error.message || "Gagal memuat daftar pelanggan.";
                setFetchCustomersError(errorMessage);
            } finally {
                setIsLoadingCustomers(false);
            }
        };
        fetchAllCustomers();
    }, []);

    const fetchCustomerPayments = useCallback(async () => {
        if (!selectedCustomerId) {
            setPayments([]);
            setFetchPaymentsError(null);
            return;
        }

        setIsLoadingPayments(true);
        setFetchPaymentsError(null);
        try {
            const customerPaymentsData = await getPaymentsByCustomerIdApi(selectedCustomerId);
            setPayments(customerPaymentsData || []);
        } catch (error) {
            console.error(`Gagal mengambil pembayaran untuk pelanggan ID ${selectedCustomerId}:`, error);
            const errorMessage = error.response?.data?.message || error.message || "Gagal memuat riwayat pembayaran.";
            setFetchPaymentsError(errorMessage);
            setPayments([]);
        } finally {
            setIsLoadingPayments(false);
        }
    }, [selectedCustomerId]);

    useEffect(() => {
        fetchCustomerPayments();
    }, [fetchCustomerPayments]);

    const handleCustomerChange = (event) => {
        setSelectedCustomerId(event.target.value);
    };

    const handleUpdateStatus = (paymentId) => {
        navigate(`/payment/update/${paymentId}`);
    };

    const handleDeletePayment = async (paymentIdToDelete) => {
        if (!window.confirm(`Apakah Anda yakin ingin menghapus pembayaran dengan ID: ${paymentIdToDelete}? Tindakan ini tidak dapat diurungkan.`)) {
            return;
        }

        setIsDeletingId(paymentIdToDelete);
        setDeleteError(null);
        try {
            await deletePaymentApi(paymentIdToDelete);
            alert('Pembayaran berhasil dihapus.');
            fetchCustomerPayments();
        } catch (error) {
            console.error(`Gagal menghapus pembayaran ID ${paymentIdToDelete}:`, error);
            const errorMessage = error.response?.data?.message || error.message || "Gagal menghapus pembayaran.";
            setDeleteError(errorMessage);
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsDeletingId(null);
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
    const deleteButtonColor = '#c0392b';
    const deleteButtonHoverColor = '#a93226';

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
        marginBottom: '30px',
        color: textColor,
        textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
    };

    const mainStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1000px',
    };

    const selectionContainerStyle = {
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: secondaryDark,
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '600px',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '10px',
        fontSize: '1.1em',
        fontWeight: '500',
        color: subtleTextColor,
        textAlign: 'left',
    };

    const selectStyle = {
        width: '100%',
        padding: '12px 15px',
        fontSize: '1em',
        backgroundColor: inputBackgroundColor,
        color: textColor,
        border: `1px solid ${inputBorderColor}`,
        borderRadius: '6px',
        boxSizing: 'border-box',
    };

    const tableContainerStyle = {
        width: '100%',
        overflowX: 'auto',
        marginTop: '20px',
        backgroundColor: inputBackgroundColor,
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        color: textColor,
    };

    const thStyle = {
        backgroundColor: '#2c3e50',
        color: textColor,
        padding: '12px 15px',
        textAlign: 'left',
        borderBottom: `2px solid ${secondaryLight}`,
        fontSize: '0.95em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
    };

    const tdStyle = {
        padding: '10px 15px',
        borderBottom: `1px solid ${secondaryDark}`,
        fontSize: '0.9em',
        whiteSpace: 'nowrap',
    };

    const actionButtonStyle = {
        padding: '8px 12px',
        fontSize: '0.9em',
        color: textColor,
        backgroundColor: secondaryLight,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, opacity 0.2s ease',
        marginRight: '5px',
    };
    const hoverActionButtonStyle = {
        backgroundColor: '#3E7C8B',
    };

    const deleteBtnStyle = {
        ...actionButtonStyle,
        backgroundColor: deleteButtonColor,
    };
    const hoverDeleteBtnStyle = {
        backgroundColor: deleteButtonHoverColor,
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
        marginTop: '40px',
    };

    const hoverBackButtonStyle = {
        backgroundColor: secondaryLight,
        color: primaryDark,
    };

    const messageTextStyle = {
        marginTop: '20px',
        fontSize: '1.1em',
        color: subtleTextColor,
    };

    const errorTextStyle = {
        ...messageTextStyle,
        color: errorColor,
        backgroundColor: '#5c2a2a',
        padding: '10px',
        borderRadius: '5px',
        border: `1px solid ${errorColor}`,
        textAlign: 'left',
        display: 'inline-block',
    };

    return (
        <div style={containerStyle}>
            <header>
                <h1 style={headingStyle}>Riwayat Pembayaran Pelanggan</h1>
            </header>

            <main style={mainStyle}>
                <div style={selectionContainerStyle}>
                    <label htmlFor="customer-select" style={labelStyle}>Pilih Pelanggan:</label>
                    {isLoadingCustomers ? (
                        <p style={messageTextStyle}>Memuat daftar pelanggan...</p>
                    ) : fetchCustomersError ? (
                        <div style={errorTextStyle}>{fetchCustomersError}</div>
                    ) : (
                        <select
                            id="customer-select"
                            value={selectedCustomerId}
                            onChange={handleCustomerChange}
                            style={selectStyle}
                            disabled={isLoadingPayments || !!isDeletingId}
                        >
                            <option value="" disabled>-- Pilih seorang pelanggan --</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.fullName || customer.name || `ID: ${customer.id}`}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {deleteError && <div style={{...errorTextStyle, marginBottom: '15px'}}>{deleteError}</div>}

                {selectedCustomerId && (
                    isLoadingPayments ? (
                        <p style={messageTextStyle}>Memuat riwayat pembayaran...</p>
                    ) : fetchPaymentsError ? (
                        <div style={errorTextStyle}>{fetchPaymentsError}</div>
                    ) : payments.length > 0 ? (
                        <div style={tableContainerStyle}>
                            <table style={tableStyle}>
                                <thead>
                                <tr>
                                    <th style={thStyle}>ID Pembayaran</th>
                                    <th style={thStyle}>Jumlah</th>
                                    <th style={thStyle}>Metode</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Tanggal</th>
                                    <th style={thStyle}>Aksi</th>
                                </tr>
                                </thead>
                                <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td style={tdStyle}>{payment.id}</td>
                                        <td style={tdStyle}>Rp {payment.amount?.toLocaleString('id-ID') || 'N/A'}</td>
                                        <td style={tdStyle}>{payment.method || 'N/A'}</td>
                                        <td style={{...tdStyle, fontWeight: 'bold', color: payment.status === 'LUNAS' ? 'lightgreen' : (payment.status === 'CICILAN' ? 'yellow' : textColor)}}>
                                            {payment.status || 'N/A'}
                                        </td>
                                        <td style={tdStyle}>
                                            {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('id-ID', {
                                                year: 'numeric', month: 'long', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit', hour12: false
                                            }) : 'N/A'}
                                        </td>
                                        <td style={{...tdStyle, whiteSpace: 'nowrap'}}>
                                            <button
                                                onClick={() => handleUpdateStatus(payment.id)}
                                                style={actionButtonStyle}
                                                disabled={!!isDeletingId}
                                                onMouseEnter={(e) => {if(!isDeletingId) Object.assign(e.target.style, hoverActionButtonStyle)}}
                                                onMouseLeave={(e) => {if(!isDeletingId) Object.assign(e.target.style, {backgroundColor: actionButtonStyle.backgroundColor})}}
                                            >
                                                Update
                                            </button>
                                            {currentUserRole === 'ADMIN' && (
                                                <button
                                                    onClick={() => handleDeletePayment(payment.id)}
                                                    style={{
                                                        ...deleteBtnStyle,
                                                        opacity: isDeletingId === payment.id ? 0.7 : 1
                                                    }}
                                                    disabled={isDeletingId === payment.id || (!!isDeletingId && isDeletingId !== payment.id)}
                                                    onMouseEnter={(e) => {if(!(isDeletingId === payment.id || (!!isDeletingId && isDeletingId !== payment.id))) Object.assign(e.target.style, hoverDeleteBtnStyle)}}
                                                    onMouseLeave={(e) => {if(!(isDeletingId === payment.id || (!!isDeletingId && isDeletingId !== payment.id))) Object.assign(e.target.style, {backgroundColor: deleteBtnStyle.backgroundColor})}}
                                                >
                                                    {isDeletingId === payment.id ? 'Menghapus...' : 'Hapus'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={messageTextStyle}>Tidak ada riwayat pembayaran untuk pelanggan ini.</p>
                    )
                )}
                {!selectedCustomerId && !isLoadingCustomers && !fetchCustomersError && (
                    <p style={messageTextStyle}>Silakan pilih pelanggan untuk melihat riwayat pembayarannya.</p>
                )}

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
            </main>
        </div>
    );
}

export default PaymentHistoryPage;
