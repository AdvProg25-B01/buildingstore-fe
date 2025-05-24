// src/pages/CustomerManagementPage.js
import React, { useState, useEffect, useCallback } from 'react';
import customerService from '../services/customerService';
import Modal from '../components/Modal'; // Import Modal component
import CustomerForm from '../components/CustomerForm'; // Import CustomerForm component
import { PlusCircle, Edit3, Trash2 } from 'lucide-react'; // Icon untuk tombol (opsional, bisa ganti teks)

function CustomerManagementPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [selectedCustomer, setSelectedCustomer] = useState(null); // Untuk edit dan delete

    // State untuk search (tetap)
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('fullname');

    // Fungsi untuk fetch data pelanggan (gunakan useCallback untuk optimasi jika diperlukan)
    const fetchCustomers = useCallback(async (term = '', by = '') => {
        setLoading(true);
        try {
            const response = await customerService.getAllCustomers(term, by);
            setCustomers(response.data);
            setError(null);
        } catch (err) {
            setError('Gagal memuat data pelanggan: ' + (err.response?.data?.message || err.message));
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    }, []); // useCallback dependency array kosong, fetchCustomers tidak akan dibuat ulang kecuali komponen unmount/mount

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]); // Panggil fetchCustomers saat komponen mount atau jika referensi fetchCustomers berubah

    // --- Handler untuk Modal Tambah Pelanggan ---
    const handleOpenAddModal = () => {
        setSelectedCustomer(null); // Pastikan tidak ada data lama
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleAddCustomer = async (formData) => {
        try {
            await customerService.createCustomer(formData);
            alert('Pelanggan berhasil ditambahkan!');
            handleCloseAddModal();
            fetchCustomers(searchTerm, searchBy); // AJAX-like update
        } catch (err) {
            alert('Gagal menambahkan pelanggan: ' + (err.response?.data?.message || err.message));
            // Modal tetap terbuka agar pengguna bisa koreksi
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
            alert('Pelanggan berhasil diperbarui!');
            handleCloseEditModal();
            fetchCustomers(searchTerm, searchBy); // AJAX-like update
        } catch (err) {
            alert('Gagal memperbarui pelanggan: ' + (err.response?.data?.message || err.message));
            // Modal tetap terbuka
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
            alert('Pelanggan berhasil dihapus.');
            handleCloseDeleteModal();
            fetchCustomers(searchTerm, searchBy); // AJAX-like update
        } catch (err)
        {
            alert('Gagal menghapus pelanggan: ' + (err.response?.data?.message || err.message));
            handleCloseDeleteModal(); // Tutup modal walau gagal
        }
    };
    
    // Fungsi Search Customer (tetap)
    const handleSearch = (e) => {
        e.preventDefault();
        fetchCustomers(searchTerm, searchBy);
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

            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

            {/* Fitur Search */}
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
                <input 
                    type="text" 
                    placeholder="Cari berdasarkan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{padding: '10px', flexGrow: 1, border: '1px solid #ccc', borderRadius: '4px'}}
                />
                <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)} style={{padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}>
                    <option value="fullname">Nama</option>
                    <option value="email">Email</option>
                    <option value="phonenumber">Telepon</option>
                </select>
                <button type="submit" style={{padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Cari</button>
                <button type="button" onClick={() => { setSearchTerm(''); setSearchBy('fullname'); fetchCustomers(); }} style={{padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Reset</button>
            </form>

            {/* Tabel Daftar Pelanggan */}
            {loading && <p style={{ textAlign: 'center' }}>Memuat ulang data...</p>} 
            {!loading && customers.length === 0 && <p style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '5px' }}>Belum ada data pelanggan atau tidak ditemukan.</p>}
            {customers.length > 0 && (
                <div style={{ overflowX: 'auto' }}> {/* Untuk responsivitas tabel */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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