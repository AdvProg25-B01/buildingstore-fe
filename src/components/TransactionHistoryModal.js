// src/components/TransactionHistoryModal.js
import React from 'react';
import Modal from './Modal'; // Asumsi Anda menggunakan komponen Modal yang sama

// --- Color Palette (ambil dari CustomerManagementPage atau definisikan di satu tempat) ---
const PRIMARY_COLOR = '#1E3A8A';
const TEXT_COLOR_DARK = '#333333';
const LIGHT_GRAY_BACKGROUND = '#F0F4F8';

const TransactionHistoryModal = ({ 
    isOpen, 
    onClose, 
    customer, 
    transactions, 
    loading, 
    error 
}) => {
    if (!customer) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Riwayat Transaksi untuk ${customer.fullName}`}>
            {loading && <p style={{ textAlign: 'center', color: TEXT_COLOR_DARK }}>Memuat riwayat...</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
            {!loading && !error && transactions.length === 0 && (
                <p style={{ textAlign: 'center', color: TEXT_COLOR_DARK }}>Pelanggan ini belum memiliki riwayat transaksi.</p>
            )}
            {!loading && !error && transactions.length > 0 && (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
                        <thead style={{ backgroundColor: PRIMARY_COLOR, color: 'white', position: 'sticky', top: 0 }}>
                            <tr>
                                <th style={{ padding: '10px', textAlign: 'left' }}>ID Transaksi</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Tanggal</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                                <th style={{ padding: '10px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Metode Bayar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid #eee', backgroundColor: LIGHT_GRAY_BACKGROUND }}>
                                    <td style={{ padding: '8px 10px', color: TEXT_COLOR_DARK }} title={tx.id}>
                                        {tx.id.substring(0, 8)}...
                                    </td>
                                    <td style={{ padding: '8px 10px', color: TEXT_COLOR_DARK }}>
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '8px 10px', textAlign: 'right', color: TEXT_COLOR_DARK }}>
                                        Rp {tx.totalAmount.toLocaleString('id-ID')}
                                    </td>
                                    <td style={{ padding: '8px 10px', textAlign: 'center', color: TEXT_COLOR_DARK }}>
                                        <span style={{ 
                                            padding: '3px 8px', 
                                            borderRadius: '4px', 
                                            backgroundColor: tx.status === 'COMPLETED' ? '#28a745' : (tx.status === 'IN_PROGRESS' ? '#ffc107' : (tx.status === 'CANCELLED' ? '#dc3545' : '#6c757d')),
                                            color: tx.status === 'IN_PROGRESS' ? TEXT_COLOR_DARK : 'white',
                                            fontSize: '0.85em'
                                        }}>
                                            {tx.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '8px 10px', color: TEXT_COLOR_DARK }}>
                                        {tx.paymentMethod}
                                    </td>
                                    {/* Anda bisa menambahkan detail item transaksi jika perlu dengan klik pada baris transaksi */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <button 
                    onClick={onClose}
                    style={{ 
                        padding: '8px 15px', 
                        backgroundColor: '#6c757d', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                    }}
                >
                    Tutup
                </button>
            </div>
        </Modal>
    );
};

export default TransactionHistoryModal;