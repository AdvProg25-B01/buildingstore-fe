// src/pages/CustomerManagementPage.js
import React, { useState, useEffect } from 'react';
import customerService from '../services/customerService'; // Import service kita

function CustomerManagementPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk form (digunakan untuk create dan edit)
    const [currentCustomer, setCurrentCustomer] = useState({
        id: null, // Akan diisi saat mode edit
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
    });
    const [isEditing, setIsEditing] = useState(false); // Status apakah sedang mode edit

    // State untuk search
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('fullname'); // default search by fullname

    // Fungsi untuk fetch data pelanggan
    const fetchCustomers = async (term = '', by = '') => {
        setLoading(true);
        try {
            const response = await customerService.getAllCustomers(term, by);
            setCustomers(response.data); // response.data berisi array CustomerResponseDTO
            setError(null);
        } catch (err) {
            setError('Gagal memuat data pelanggan: ' + (err.response?.data?.message || err.message));
            setCustomers([]); // Kosongkan jika error
        } finally {
            setLoading(false);
        }
    };

    // useEffect untuk memuat data saat komponen pertama kali di-mount
    useEffect(() => {
        fetchCustomers();
    }, []); // Array kosong berarti hanya dijalankan sekali saat mount

    // Handle input change untuk form
    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCustomer(prev => ({ ...prev, [name]: value }));
    };

    // Handle submit form (untuk create dan update)
    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Mencegah reload halaman standar form HTML
        if (!currentCustomer.fullName || !currentCustomer.email) {
            alert('Nama Lengkap dan Email wajib diisi!');
            return;
        }

        // Payload data yang akan dikirim, sesuai dengan CreateCustomerRequestDTO atau UpdateCustomerRequestDTO
        const customerDataPayload = {
            fullName: currentCustomer.fullName,
            phoneNumber: currentCustomer.phoneNumber,
            email: currentCustomer.email,
            address: currentCustomer.address,
        };

        if (isEditing) { // Jika mode edit, panggil updateCustomer
            try {
                await customerService.updateCustomer(currentCustomer.id, customerDataPayload);
                alert('Pelanggan berhasil diperbarui!');
                setIsEditing(false); // Keluar dari mode edit
            } catch (err) {
                alert('Gagal memperbarui pelanggan: ' + (err.response?.data?.message || err.message));
                // Optional: jangan reset form jika gagal, agar pengguna bisa koreksi
                // return; 
            }
        } else { // Jika bukan mode edit, panggil createCustomer
            try {
                await customerService.createCustomer(customerDataPayload);
                alert('Pelanggan berhasil ditambahkan!');
            } catch (err) {
                alert('Gagal menambahkan pelanggan: ' + (err.response?.data?.message || err.message));
                // Optional: jangan reset form jika gagal
                // return;
            }
        }
        
        // Reset form dan muat ulang daftar pelanggan setelah operasi sukses (atau selalu)
        setCurrentCustomer({ id: null, fullName: '', phoneNumber: '', email: '', address: '' });
        fetchCustomers(searchTerm, searchBy); // Muat ulang daftar pelanggan dengan filter search jika ada
    };
    
    // Handle klik tombol Edit pada baris tabel
    const handleEditClick = (customer) => {
        setIsEditing(true);
        setCurrentCustomer({ // Isi form dengan data pelanggan yang dipilih
            id: customer.id,
            fullName: customer.fullName,
            phoneNumber: customer.phoneNumber || '', // Handle jika null/undefined dari backend
            email: customer.email,
            address: customer.address || '', // Handle jika null/undefined dari backend
        });
        window.scrollTo(0, 0); // Scroll ke atas halaman agar form terlihat (opsional)
    };

    // Handle klik tombol Batal Edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentCustomer({ id: null, fullName: '', phoneNumber: '', email: '', address: '' }); // Reset form
    };

    // Fungsi Delete Customer (sudah ada dan OK)
    const handleDeleteCustomer = async (customerId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
            try {
                await customerService.deleteCustomer(customerId);
                alert('Pelanggan berhasil dihapus.');
                fetchCustomers(searchTerm, searchBy); // Muat ulang daftar pelanggan dengan filter search jika ada
            } catch (err) {
                alert('Gagal menghapus pelanggan: ' + (err.response?.data?.message || err.message));
            }
        }
    };
    
    // Fungsi Search Customer (sudah ada dan OK)
    const handleSearch = (e) => {
        e.preventDefault();
        fetchCustomers(searchTerm, searchBy);
    };

    // Tampilkan loading hanya jika data belum ada sama sekali
    if (loading && customers.length === 0) return <p>Loading pelanggan...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Manajemen Pelanggan</h1>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {/* Form Dinamis untuk Tambah/Edit Pelanggan */}
            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h2>{isEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</h2>
                {isEditing && <p style={{fontSize: '0.9em', color: 'gray'}}>Mengedit Pelanggan ID: {currentCustomer.id}</p>}
                <form onSubmit={handleFormSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Nama Lengkap: </label>
                        <input type="text" name="fullName" value={currentCustomer.fullName} onChange={handleFormInputChange} required 
                               style={{width: '100%', padding: '8px', boxSizing: 'border-box'}} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Email: </label>
                        <input type="email" name="email" value={currentCustomer.email} onChange={handleFormInputChange} required 
                               style={{width: '100%', padding: '8px', boxSizing: 'border-box'}} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>No. Telepon: </label>
                        <input type="text" name="phoneNumber" value={currentCustomer.phoneNumber} onChange={handleFormInputChange} 
                               style={{width: '100%', padding: '8px', boxSizing: 'border-box'}} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Alamat: </label>
                        <input type="text" name="address" value={currentCustomer.address} onChange={handleFormInputChange} 
                               style={{width: '100%', padding: '8px', boxSizing: 'border-box'}} />
                    </div>
                    <button type="submit" style={{ marginRight: '10px', padding: '10px 15px' }}>
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={handleCancelEdit} style={{ padding: '10px 15px', backgroundColor: 'grey', color: 'white', border: 'none' }}>
                            Batal
                        </button>
                    )}
                </form>
            </div>

            {/* Fitur Search */}
            <h2>Cari Pelanggan</h2>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                    type="text" 
                    placeholder="Masukkan kata kunci..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{padding: '8px'}}
                />
                <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)} style={{padding: '8px'}}>
                    <option value="fullname">Nama</option>
                    <option value="email">Email</option>
                    <option value="phonenumber">Telepon</option>
                </select>
                <button type="submit" style={{padding: '8px 15px'}}>Cari</button>
                <button type="button" onClick={() => { setSearchTerm(''); setSearchBy('fullname'); fetchCustomers(); }} style={{padding: '8px 15px'}}>Reset</button>
            </form>

            {/* Tabel Daftar Pelanggan */}
            <h2>Daftar Pelanggan</h2>
            {loading && <p>Memuat ulang data...</p>} 
            {!loading && customers.length === 0 && <p>Belum ada data pelanggan atau tidak ditemukan.</p>}
            {customers.length > 0 && (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr>
                            <th style={{padding: '8px'}}>ID</th>
                            <th style={{padding: '8px'}}>Nama Lengkap</th>
                            <th style={{padding: '8px'}}>Email</th>
                            <th style={{padding: '8px'}}>No. Telepon</th>
                            <th style={{padding: '8px'}}>Alamat</th>
                            <th style={{padding: '8px'}}>Status Aktif</th>
                            <th style={{padding: '8px'}}>Dibuat Pada</th>
                            <th style={{padding: '8px'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td style={{padding: '8px', wordBreak: 'break-all'}}>{customer.id}</td>
                                <td style={{padding: '8px'}}>{customer.fullName}</td>
                                <td style={{padding: '8px'}}>{customer.email}</td>
                                <td style={{padding: '8px'}}>{customer.phoneNumber}</td>
                                <td style={{padding: '8px'}}>{customer.address}</td>
                                <td style={{padding: '8px'}}>{customer.isActive ? 'Aktif' : 'Tidak Aktif'}</td>
                                <td style={{padding: '8px'}}>{new Date(customer.createdAt).toLocaleString()}</td>
                                <td style={{padding: '8px'}}>
                                    <button onClick={() => handleEditClick(customer)} style={{ marginRight: '5px', padding: '5px 10px' }}>Edit</button>
                                    <button onClick={() => handleDeleteCustomer(customer.id)} style={{ backgroundColor: 'salmon', color: 'white', border: 'none', padding: '5px 10px' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default CustomerManagementPage;