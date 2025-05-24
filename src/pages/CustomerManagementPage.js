// src/pages/CustomerManagementPage.js
import React, { useState, useEffect, useCallback, useRef } from 'react'; // Tambahkan useRef
import customerService from '../services/customerService';
import Modal from '../components/Modal';
import CustomerForm from '../components/CustomerForm';
import { PlusCircle, Edit3, Trash2, Search } from 'lucide-react'; // Tambah icon Search
import { toast } from 'react-toastify'; // <-- Import toast

function CustomerManagementPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Error tetap bisa ditampilkan di halaman

    // State untuk Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // State untuk search
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('fullname');
    const debounceTimeoutRef = useRef(null); // Untuk debounce search

    const fetchCustomers = useCallback(async (term = '', by = '') => {
        // Jika term kosong, set loading menjadi true hanya jika customers juga kosong
        // Ini agar tidak ada flicker loading saat live search dengan term kosong
        if (term || customers.length === 0) {
            setLoading(true);
        }
        try {
            const response = await customerService.getAllCustomers(term, by);
            setCustomers(response.data);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
            setError('Gagal memuat data pelanggan: ' + errorMessage);
            // toast.error('Gagal memuat data pelanggan: ' + errorMessage); // Bisa juga pakai toast untuk error fetch
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    }, [customers.length]); // Tambahkan customers.length sebagai dependency

    useEffect(() => {
        fetchCustomers(searchTerm, searchBy);
    }, [fetchCustomers]); // Panggil saat mount awal

    // --- Live Search Logic ---
    useEffect(() => {
        // Hapus timeout sebelumnya jika ada
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set timeout baru
        // Hanya fetch jika searchTerm tidak kosong, ATAU jika searchTerm kosong tapi sebelumnya tidak kosong (untuk reset)
        if (searchTerm.trim() !== '' || (searchTerm.trim() === '' && customers.length > 0 && !loading)) {
            debounceTimeoutRef.current = setTimeout(() => {
                fetchCustomers(searchTerm.trim(), searchBy);
            }, 500); // Debounce 500ms
        } else if (searchTerm.trim() === '' && !loading) {
            // Jika searchTerm kosong dan tidak sedang loading, langsung fetch semua data (reset)
             fetchCustomers('', searchBy);
        }


        // Cleanup timeout saat komponen unmount atau searchTerm/searchBy berubah
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchTerm, searchBy, fetchCustomers, customers.length, loading]);


    // --- Handler untuk Modal Tambah Pelanggan ---
    const handleOpenAddModal = () => {
        setSelectedCustomer(null);
        setIsAddModalOpen(true);
    };
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleAddCustomer = async (formData) => {
        try {
            await customerService.createCustomer(formData);
            toast.success('Pelanggan berhasil ditambahkan!'); // Ganti alert
            handleCloseAddModal();
            fetchCustomers(searchTerm, searchBy);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
            toast.error('Gagal menambahkan pelanggan: ' + errorMessage); // Ganti alert
        }
    };

    // --- Handler untuk Modal Edit Pelanggan ---
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
            toast.success('Pelanggan berhasil diperbarui!'); // Ganti alert
            handleCloseEditModal();
            fetchCustomers(searchTerm, searchBy);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
            toast.error('Gagal memperbarui pelanggan: ' + errorMessage); // Ganti alert
        }
    };

    // --- Handler untuk Modal Delete Pelanggan ---
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
            toast.success('Pelanggan berhasil dihapus.'); // Ganti alert
            handleCloseDeleteModal();
            fetchCustomers(searchTerm, searchBy);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
            toast.error('Gagal menghapus pelanggan: ' + errorMessage); // Ganti alert
            handleCloseDeleteModal();
        }
    };
    
    // Fungsi Search Customer (sekarang otomatis) - Tombol submit bisa dihilangkan
    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     fetchCustomers(searchTerm, searchBy);
    // };

    // Fungsi untuk mereset search bar dan memuat semua pelanggan
    const handleResetSearch = () => {
        setSearchTerm('');
        // setSearchBy('fullname'); // Opsional: reset juga searchBy jika diinginkan
        // fetchCustomers('', searchBy); // fetchCustomers akan dipicu oleh useEffect karena searchTerm berubah
    };


    if (loading && customers.length === 0) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading pelanggan...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Manajemen Pelanggan</h1>
                <button 
                    onClick={handleOpenAddModal}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1em'
                    }}
                >
                    <PlusCircle size={20} style={{ marginRight: '8px' }} />
                    Tambah Pelanggan
                </button>
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px', padding: '10px', background: '#ffebee', border: '1px solid #ef9a9a', borderRadius: '4px' }}>{error}</p>}

            {/* Fitur Live Search */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
                <div style={{ position: 'relative', flexGrow: 1 }}>
                    <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
                    <input 
                        type="text" 
                        placeholder="Ketik untuk mencari..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        style={{padding: '10px 10px 10px 40px', width: '100%', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box'}}
                    />
                </div>
                <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)} style={{padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}>
                    <option value="fullname">Nama</option>
                    <option value="email">Email</option>
                    <option value="phonenumber">Telepon</option>
                </select>
                {/* Tombol Cari dan Reset bisa dihilangkan karena search otomatis */}
                {searchTerm && ( // Tampilkan tombol X untuk clear search term
                    <button 
                        type="button" 
                        onClick={handleResetSearch} 
                        title="Clear Search"
                        style={{padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6c757d', fontSize: '1.2em' }}
                    >
                        × 
                    </button>
                )}
            </div>

            {/* Tabel Daftar Pelanggan */}
            {/* Kondisi loading di sini agar tidak hilang saat live search */}
            {loading && customers.length > 0 && <p style={{ textAlign: 'center' }}>Memuat data...</p>} 
            {!loading && customers.length === 0 && searchTerm && <p style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '5px' }}>Pelanggan tidak ditemukan dengan kata kunci "{searchTerm}".</p>}
            {!loading && customers.length === 0 && !searchTerm && <p style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '5px' }}>Belum ada data pelanggan.</p>}
            
            {customers.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {/* ... isi tabel tetap sama ... */}
                        <thead style={{backgroundColor: '#e9ecef'}}>
                            <tr>
                                <th style={{padding: '12px 15px', borderBottom: '2px solid #dee2e6'}}>ID</th>
                                <th style={{padding: '12px 15px', borderBottom: '2px solid #dee2e6'}}>Nama Lengkap</th>
                                <th style={{padding: '12px 15px', borderBottom: '2px solid #dee2e6'}}>Email</th>
                                <th style={{padding: '12px 15px', borderBottom: '2px solid #dee2e6'}}>No. Telepon</th>
                                <th style={{padding: '12px 15px', borderBottom: '2px solid #dee2e6'}}>Alamat</th>
                                <th style={{padding: '12px 15px', borderBottom: '2px solid #dee2e6'}}>Status</th>
                                <th style={{padding: '12px 15px', borderBottom: '2px solid #dee2e6'}}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} style={{borderBottom: '1px solid #dee2e6'}}>
                                    <td style={{padding: '12px 15px', wordBreak: 'break-all', fontSize: '0.9em'}}>{customer.id}</td>
                                    <td style={{padding: '12px 15px'}}>{customer.fullName}</td>
                                    <td style={{padding: '12px 15px'}}>{customer.email}</td>
                                    <td style={{padding: '12px 15px'}}>{customer.phoneNumber || '-'}</td>
                                    <td style={{padding: '12px 15px'}}>{customer.address || '-'}</td>
                                    <td style={{padding: '12px 15px'}}>
                                        <span style={{
                                            padding: '5px 10px', 
                                            borderRadius: '15px', 
                                            color: 'white', 
                                            backgroundColor: customer.isActive ? '#28a745' : '#dc3545',
                                            fontSize: '0.85em'
                                        }}>
                                            {customer.isActive ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td style={{padding: '12px 15px', display: 'flex', gap: '10px'}}>
                                        <button onClick={() => handleOpenEditModal(customer)} title="Edit" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#007bff'}}>
                                            <Edit3 size={20} />
                                        </button>
                                        <button onClick={() => handleOpenDeleteModal(customer)} title="Delete" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545'}}>
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal untuk Tambah Pelanggan */}
            <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal} title="Tambah Pelanggan Baru">
                <CustomerForm 
                    onSubmit={handleAddCustomer} 
                    onCancel={handleCloseAddModal}
                    isEditing={false} 
                />
            </Modal>

            {/* Modal untuk Edit Pelanggan */}
            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} title="Edit Data Pelanggan">
                <CustomerForm 
                    initialData={selectedCustomer} 
                    onSubmit={handleUpdateCustomer} 
                    onCancel={handleCloseEditModal}
                    isEditing={true} 
                />
            </Modal>

            {/* Modal untuk Konfirmasi Delete */}
            <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} title="Konfirmasi Hapus Pelanggan">
                {selectedCustomer && (
                    <div>
                        <p>Apakah Anda yakin ingin menghapus pelanggan dengan nama: <strong>{selectedCustomer.fullName}</strong> (ID: {selectedCustomer.id})?</p>
                        <p style={{color: 'red', fontSize: '0.9em'}}>Tindakan ini tidak dapat diurungkan.</p>
                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                            <button 
                                onClick={handleCloseDeleteModal} 
                                style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleDeleteCustomer} 
                                style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default CustomerManagementPage;