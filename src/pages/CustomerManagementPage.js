// src/pages/CustomerManagementPage.js
import React, { useState, useEffect } from 'react';
import customerService from '../services/customerService'; // Import service kita
// Anda mungkin perlu membuat komponen CustomerTable dan CustomerForm nanti
// import CustomerTable from '../components/CustomerTable';
// import CustomerForm from '../components/CustomerForm';

function CustomerManagementPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk form tambah pelanggan
    const [newCustomer, setNewCustomer] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({ ...newCustomer, [name]: value });
    };

    const handleCreateCustomer = async (e) => {
        e.preventDefault(); // Mencegah reload halaman standar form HTML
        if (!newCustomer.fullName || !newCustomer.email) {
            alert('Nama Lengkap dan Email wajib diisi!');
            return;
        }
        try {
            await customerService.createCustomer(newCustomer);
            alert('Pelanggan berhasil ditambahkan!');
            setNewCustomer({ fullName: '', phoneNumber: '', email: '', address: '' }); // Reset form
            fetchCustomers(); // Muat ulang daftar pelanggan
        } catch (err) {
            alert('Gagal menambahkan pelanggan: ' + (err.response?.data?.message || err.message));
        }
    };

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
    
    const handleSearch = (e) => {
        e.preventDefault();
        fetchCustomers(searchTerm, searchBy);
    };

    if (loading) return <p>Loading pelanggan...</p>;
    // if (error) return <p style={{ color: 'red' }}>Error: {error}</p>; // Komentari dulu jika ingin tetap menampilkan form dan tabel

    return (
        <div style={{ padding: '20px' }}>
            <h1>Manajemen Pelanggan</h1>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {/* Form Tambah Pelanggan */}
            <h2>Tambah Pelanggan Baru</h2>
            <form onSubmit={handleCreateCustomer} style={{ marginBottom: '20px' }}>
                <div>
                    <label>Nama Lengkap: </label>
                    <input type="text" name="fullName" value={newCustomer.fullName} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Email: </label>
                    <input type="email" name="email" value={newCustomer.email} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>No. Telepon: </label>
                    <input type="text" name="phoneNumber" value={newCustomer.phoneNumber} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Alamat: </label>
                    <input type="text" name="address" value={newCustomer.address} onChange={handleInputChange} />
                </div>
                <button type="submit">Tambah Pelanggan</button>
            </form>

            {/* Fitur Search */}
            <h2>Cari Pelanggan</h2>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Masukkan kata kunci..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="fullname">Nama</option>
                    <option value="email">Email</option>
                    <option value="phonenumber">Telepon</option>
                </select>
                <button type="submit">Cari</button>
                <button type="button" onClick={() => { setSearchTerm(''); setSearchBy('fullname'); fetchCustomers(); }}>Reset</button>
            </form>

            {/* Tabel Daftar Pelanggan */}
            <h2>Daftar Pelanggan</h2>
            {customers.length === 0 && !loading && <p>Belum ada data pelanggan.</p>}
            {customers.length > 0 && (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama Lengkap</th>
                            <th>Email</th>
                            <th>No. Telepon</th>
                            <th>Alamat</th>
                            <th>Status Aktif</th>
                            <th>Dibuat Pada</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.fullName}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phoneNumber}</td>
                                <td>{customer.address}</td>
                                <td>{customer.isActive ? 'Aktif' : 'Tidak Aktif'}</td>
                                <td>{new Date(customer.createdAt).toLocaleString()}</td>
                                <td>
                                    {/* Tombol Edit akan butuh form dan state terpisah, mirip create */}
                                    <button onClick={() => alert(`Edit customer ID: ${customer.id} (Fitur belum diimplementasikan)`)}>Edit</button>
                                    <button onClick={() => handleDeleteCustomer(customer.id)} style={{ marginLeft: '5px', backgroundColor: 'salmon' }}>Delete</button>
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