import React, { useState } from 'react';
import { ShoppingCart, History, Edit, FileText, ArrowLeft, CheckCircle, X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Main Transaction Management Component
const TransactionManagement = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Manajemen Transaksi</h1>
        <p className="text-gray-600">Kelola semua transaksi penjualan dalam satu tempat</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        <Link
            to="/manajemen-transaksi/create"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center transition-colors block"
        >
            <ShoppingCart className="mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">Buat Transaksi</h3>
            <p className="text-sm opacity-90">Buat transaksi penjualan baru</p>
        </Link>

        <Link
            to="/manajemen-transaksi/history"
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-center transition-colors block"
        >
            <History className="mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">Kelola Transaksi</h3>
            <p className="text-sm opacity-90">Lihat dan kelala transaksi</p>
        </Link>
    </div>

    <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fitur Utama</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start">
            <CheckCircle className="text-green-500 mr-3 mt-1" size={20} />
            <div>
            <h4 className="font-medium text-gray-800">Buat Transaksi</h4>
            <p className="text-sm text-gray-600">Buat transaksi penjualan baru dengan memilih produk dan customer</p>
            </div>
        </div>
        <div className="flex items-start">
            <CheckCircle className="text-green-500 mr-3 mt-1" size={20} />
            <div>
            <h4 className="font-medium text-gray-800">Lihat Transaksi</h4>
            <p className="text-sm text-gray-600">Lihat riwayat dan detail lengkap dari semua transaksi</p>
            </div>
        </div>
        <div className="flex items-start">
            <CheckCircle className="text-green-500 mr-3 mt-1" size={20} />
            <div>
            <h4 className="font-medium text-gray-800">Perbarui Transaksi</h4>
            <p className="text-sm text-gray-600">Edit transaksi yang masih dalam status pending atau in-progress</p>
            </div>
        </div>
        <div className="flex items-start">
            <CheckCircle className="text-green-500 mr-3 mt-1" size={20} />
            <div>
            <h4 className="font-medium text-gray-800">Hapus Transaksi</h4>
            <p className="text-sm text-gray-600">Batalkan atau hapus transaksi dengan pengembalian stok otomatis</p>
            </div>
        </div>
        </div>
    </div>
    </div>
);
};

export default TransactionManagement;