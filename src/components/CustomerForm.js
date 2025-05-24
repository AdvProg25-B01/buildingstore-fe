// src/components/CustomerForm.js
import React, { useState, useEffect } from 'react';

const CustomerForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        phoneNumber: initialData.phoneNumber || '',
        email: initialData.email || '',
        address: initialData.address || '',
      });
    } else {
      // Reset form jika tidak ada initialData (untuk mode tambah)
      setFormData({ fullName: '', phoneNumber: '', email: '', address: '' });
    }
  }, [initialData]); // Update form jika initialData berubah

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      alert('Nama Lengkap dan Email wajib diisi!');
      return;
    }
    onSubmit(formData); // Kirim data form ke parent component
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="fullName" style={{ display: 'block', marginBottom: '5px' }}>Nama Lengkap:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px' }}>No. Telepon:</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="address" style={{ display: 'block', marginBottom: '5px' }}>Alamat:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div style={{ textAlign: 'right' }}>
        {onCancel && ( // Hanya tampilkan tombol batal jika ada fungsi onCancel (berguna untuk edit)
            <button 
                type="button" 
                onClick={onCancel} 
                style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
            Batal
            </button>
        )}
        <button 
            type="submit"
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isEditing ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;