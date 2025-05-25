// src/pages/CustomerManagementPage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import customerService from '../services/customerService';
import Modal from '../components/Modal';
import CustomerForm from '../components/CustomerForm';
import { PlusCircle, Edit3, Trash2, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react'; // Added Eye, ChevronLeft, ChevronRight
import { toast } from 'react-toastify';
import { transactionService } from '../services/transactionService';
import TransactionHistoryModal from '../components/TransactionHistoryModal'; // Import sudah ada

// --- Color Palette ---
const PRIMARY_COLOR = '#1E3A8A'; // Main web color
const SECONDARY_COLOR = '#1D4DD5'; // Navbar color (can be used for accents)
const WHITE_COLOR = '#FFFFFF';
const LIGHT_GRAY_BACKGROUND = '#F0F4F8'; // A light background for sections
const TEXT_COLOR_DARK = '#333333';
const TEXT_COLOR_LIGHT = '#FFFFFF';
const DANGER_COLOR = '#DC3545';
const SUCCESS_COLOR = '#28A745'; // Kept for success messages, can be changed
const INFO_COLOR = '#0DCAF0'; // For View History button or info messages

function CustomerManagementPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('fullname');
    const debounceTimeoutRef = useRef(null);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage] = useState(10);

    // --- State Baru untuk Modal Histori Transaksi ---
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState(null);
    const [customerTransactions, setCustomerTransactions] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    const fetchCustomers = useCallback(async (term = '', by = '') => {
        if (term || customers.length === 0) {
            setLoading(true);
        }
        try {
            const response = await customerService.getAllCustomers(term, by);
            setCustomers(response.data);
            setCurrentPage(1); // Reset to first page on new search/fetch
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
            setError('Gagal memuat data pelanggan: ' + errorMessage);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    }, [customers.length]); // customers.length dependency ensures initial load behavior

    useEffect(() => {
        fetchCustomers(searchTerm, searchBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Initial fetch only on mount, search handled by debounce

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        if (searchTerm.trim() !== '' || (searchTerm.trim() === '' && !loading)) {
            debounceTimeoutRef.current = setTimeout(() => {
                fetchCustomers(searchTerm.trim(), searchBy);
            }, 500);
        } else if (searchTerm.trim() === '' && !loading && customers.length > 0) { // If search term is cleared
                fetchCustomers('', searchBy);
        }
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchTerm, searchBy, fetchCustomers, loading, customers.length]);


    const handleOpenAddModal = () => {
        setSelectedCustomer(null);
        setIsAddModalOpen(true);
    };
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleAddCustomer = async (formData) => {
        try {
            await customerService.createCustomer(formData);
            toast.success('Pelanggan berhasil ditambahkan!');
            handleCloseAddModal();
            fetchCustomers(searchTerm, searchBy);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
            toast.error('Gagal menambahkan pelanggan: ' + errorMessage);
        }
    };

    const handleOpenEditModal = (customer) => {
        setSelectedCustomer(customer);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleUpdateCustomer = async (formData) => {
        if (!selectedCustomer || !selectedCustomer.id) return;
        try {
            await customerService.updateCustomer(selectedCustomer.id, formData);
            toast.success('Pelanggan berhasil diperbarui!');
            handleCloseEditModal();
            fetchCustomers(searchTerm, searchBy);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
            toast.error('Gagal memperbarui pelanggan: ' + errorMessage);
        }
    };

    const handleOpenDeleteModal = (customer) => {
        setSelectedCustomer(customer);
        setIsDeleteModalOpen(true);
    };
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleDeleteCustomer = async () => {
        if (!selectedCustomer || !selectedCustomer.id) return;
        try {
            await customerService.deleteCustomer(selectedCustomer.id);
            toast.success('Pelanggan berhasil dihapus.');
            handleCloseDeleteModal();
            fetchCustomers(searchTerm, searchBy);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
            toast.error('Gagal menghapus pelanggan: ' + errorMessage);
            handleCloseDeleteModal();
        }
    };

    // --- Fungsi Baru untuk Fetch Histori Transaksi ---
    const fetchCustomerHistory = async (customerId) => {
        if (!customerId) return;
        setLoadingHistory(true);
        setHistoryError(null);
        setCustomerTransactions([]); // Kosongkan transaksi sebelumnya
        try {
            const params = { customerId: customerId };
            const response = await transactionService.getAllTransactions(params); // Menggunakan getAllTransactions dengan filter customerId
            setCustomerTransactions(response); // Asumsi response adalah array transaksi
        } catch (err) {
            const errorMessage = err.message || 'Gagal memuat riwayat transaksi.';
            setHistoryError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        // fetchCustomers('', searchBy); // useEffect for searchTerm will trigger this
    };

    // --- View History Handler ---
    const handleViewHistory = (customer) => {
        setSelectedCustomerForHistory(customer); // Simpan customer yang dipilih
        setIsHistoryModalOpen(true);
        fetchCustomerHistory(customer.id); // Panggil fetch history dengan ID customer
    };

    const handleCloseHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setSelectedCustomerForHistory(null);
        setCustomerTransactions([]);
        setHistoryError(null);
    };

    // --- Pagination Logic ---
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(customers.length / customersPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    if (loading && customers.length === 0) return <p style={{ textAlign: 'center', marginTop: '20px', color: TEXT_COLOR_DARK }}>Loading pelanggan...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', backgroundColor: WHITE_COLOR, minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h1 style={{ margin: 0, color: PRIMARY_COLOR, fontSize: '2rem' }}>Manajemen Pelanggan</h1>
                <button 
                    onClick={handleOpenAddModal}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: PRIMARY_COLOR, 
                        color: WHITE_COLOR, 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1em',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <PlusCircle size={20} style={{ marginRight: '8px' }} />
                    Tambah Pelanggan
                </button>
            </div>

            {error && <p style={{ color: DANGER_COLOR, textAlign: 'center', marginBottom: '15px', padding: '10px', background: '#f8d7da', border: `1px solid ${DANGER_COLOR}`, borderRadius: '4px' }}>{error}</p>}

            <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', alignItems: 'center', padding: '15px', background: LIGHT_GRAY_BACKGROUND, borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ position: 'relative', flexGrow: 1 }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
                    <input 
                        type="text" 
                        placeholder="Ketik untuk mencari..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        style={{
                            padding: '10px 10px 10px 40px', 
                            width: '100%', 
                            border: '1px solid #ced4da', 
                            borderRadius: '4px', 
                            boxSizing: 'border-box',
                            color: TEXT_COLOR_DARK
                        }}
                    />
                </div>
                <select 
                    value={searchBy} 
                    onChange={(e) => setSearchBy(e.target.value)} 
                    style={{
                        padding: '10px', 
                        border: '1px solid #ced4da', 
                        borderRadius: '4px', 
                        backgroundColor: WHITE_COLOR,
                        color: TEXT_COLOR_DARK
                    }}
                >
                    <option value="fullname">Nama</option>
                    <option value="email">Email</option>
                    <option value="phonenumber">Telepon</option>
                </select>
                {searchTerm && (
                    <button 
                        type="button" 
                        onClick={handleResetSearch} 
                        title="Clear Search"
                        style={{
                            padding: '8px', 
                            backgroundColor: 'transparent', 
                            border: 'none', 
                            cursor: 'pointer', 
                            color: '#6c757d', 
                            fontSize: '1.5em',
                            lineHeight: '1'
                        }}
                    >
                        × 
                    </button>
                )}
            </div>

            {loading && customers.length > 0 && <p style={{ textAlign: 'center', color: TEXT_COLOR_DARK }}>Memuat data...</p>} 
            {!loading && customers.length === 0 && searchTerm && <p style={{ textAlign: 'center', padding: '20px', background: LIGHT_GRAY_BACKGROUND, borderRadius: '5px', color: TEXT_COLOR_DARK }}>Pelanggan tidak ditemukan dengan kata kunci "{searchTerm}".</p>}
            {!loading && customers.length === 0 && !searchTerm && <p style={{ textAlign: 'center', padding: '20px', background: LIGHT_GRAY_BACKGROUND, borderRadius: '5px', color: TEXT_COLOR_DARK }}>Belum ada data pelanggan.</p>}
            
            {customers.length > 0 && (
                <>
                    <div style={{ overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{backgroundColor: PRIMARY_COLOR, color: WHITE_COLOR}}>
                                <tr>
                                    <th style={{padding: '12px 15px'}}>Nama Lengkap</th>
                                    <th style={{padding: '12px 15px'}}>Email</th>
                                    <th style={{padding: '12px 15px'}}>No. Telepon</th>
                                    <th style={{padding: '12px 15px'}}>Alamat</th>
                                    <th style={{padding: '12px 15px', textAlign: 'center'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCustomers.map(customer => (
                                    <tr key={customer.id} style={{borderBottom: '1px solid #dee2e6', backgroundColor: WHITE_COLOR }}>
                                        <td style={{padding: '12px 15px', color: TEXT_COLOR_DARK}}>{customer.fullName}</td>
                                        <td style={{padding: '12px 15px', color: TEXT_COLOR_DARK}}>{customer.email}</td>
                                        <td style={{padding: '12px 15px', color: TEXT_COLOR_DARK}}>{customer.phoneNumber || '-'}</td>
                                        <td style={{padding: '12px 15px', color: TEXT_COLOR_DARK, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={customer.address}>{customer.address || '-'}</td>
                                        
                                        <td style={{padding: '10px 15px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center'}}>
                                            <button 
                                                onClick={() => handleViewHistory(customer)} 
                                                title="Lihat Riwayat" 
                                                style={{background: 'none', border: 'none', cursor: 'pointer', color: INFO_COLOR, padding: '5px'}}
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <button 
                                                onClick={() => handleOpenEditModal(customer)} 
                                                title="Edit" 
                                                style={{background: 'none', border: 'none', cursor: 'pointer', color: PRIMARY_COLOR, padding: '5px'}}
                                            >
                                                <Edit3 size={20} />
                                            </button>
                                            <button 
                                                onClick={() => handleOpenDeleteModal(customer)} 
                                                title="Delete" 
                                                style={{background: 'none', border: 'none', cursor: 'pointer', color: DANGER_COLOR, padding: '5px'}}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '25px', padding: '10px', userSelect: 'none' }}>
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{
                                    marginRight: '10px',
                                    padding: '8px 12px',
                                    backgroundColor: currentPage === 1 ? '#e9ecef' : PRIMARY_COLOR,
                                    color: currentPage === 1 ? '#6c757d' : WHITE_COLOR,
                                    border: `1px solid ${currentPage === 1 ? '#ced4da' : PRIMARY_COLOR}`,
                                    borderRadius: '4px',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <ChevronLeft size={18} style={{marginRight: '4px'}} />
                                Sebelumnya
                            </button>
                            <span style={{ color: TEXT_COLOR_DARK, margin: '0 10px' }}>
                                Halaman {currentPage} dari {totalPages}
                            </span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{
                                    marginLeft: '10px',
                                    padding: '8px 12px',
                                    backgroundColor: currentPage === totalPages ? '#e9ecef' : PRIMARY_COLOR,
                                    color: currentPage === totalPages ? '#6c757d' : WHITE_COLOR,
                                    border: `1px solid ${currentPage === totalPages ? '#ced4da' : PRIMARY_COLOR}`,
                                    borderRadius: '4px',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                Selanjutnya
                                <ChevronRight size={18} style={{marginLeft: '4px'}}/>
                            </button>
                        </div>
                    )}
                </>
            )}

            <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal} title="Tambah Pelanggan Baru">
                <CustomerForm 
                    onSubmit={handleAddCustomer} 
                    onCancel={handleCloseAddModal}
                    isEditing={false} 
                    // Pass colors if CustomerForm needs them
                    // primaryColor={PRIMARY_COLOR}
                    // whiteColor={WHITE_COLOR}
                />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} title="Edit Data Pelanggan">
                <CustomerForm 
                    initialData={selectedCustomer} 
                    onSubmit={handleUpdateCustomer} 
                    onCancel={handleCloseEditModal}
                    isEditing={true}
                    // primaryColor={PRIMARY_COLOR}
                    // whiteColor={WHITE_COLOR}
                />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} title="Konfirmasi Hapus Pelanggan">
                {selectedCustomer && (
                    <div>
                        <p style={{color: TEXT_COLOR_DARK}}>Apakah Anda yakin ingin menghapus pelanggan dengan nama: <strong>{selectedCustomer.fullName}</strong> (ID: {selectedCustomer.id})?</p>
                        <p style={{color: DANGER_COLOR, fontSize: '0.9em'}}>Tindakan ini tidak dapat diurungkan.</p>
                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                            <button 
                                onClick={handleCloseDeleteModal} 
                                style={{ 
                                    marginRight: '10px', 
                                    padding: '10px 20px', 
                                    backgroundColor: '#6c757d', // Standard gray for cancel
                                    color: WHITE_COLOR, 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer' 
                                }}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleDeleteCustomer} 
                                style={{ 
                                    padding: '10px 20px', 
                                    backgroundColor: DANGER_COLOR, 
                                    color: WHITE_COLOR, 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer' 
                                }}
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* --- Modal Baru untuk Histori Transaksi --- */}
            {selectedCustomerForHistory && ( // Hanya render jika ada customer yang dipilih
                <TransactionHistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={handleCloseHistoryModal}
                    customer={selectedCustomerForHistory}
                    transactions={customerTransactions}
                    loading={loadingHistory}
                    error={historyError}
                />
            )}
        </div>
    );
}

export default CustomerManagementPage;