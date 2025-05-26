import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, User, CreditCard, Save, CheckCircle, Banknote } from 'lucide-react';

import { getAllProducts } from '../../services/ProductApi';
import { transactionService } from '../../services/transactionService';

const API_CUSTOMER_URL = process.env.REACT_APP_CUSTOMER_API_URL || 'http://localhost:8082';
const BASE_CUSTOMER_URL = `${API_CUSTOMER_URL}/api/customers`;

const CreateTransaction = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    paymentMethod: 'CASH',
    productQuantities: {},
    amountPaid: 0,
    paymentStatus: 'LUNAS'
  });
  
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data || []);
      } catch (error) {
        setErrorMessage('Gagal memuat produk');
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearchCustomer();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    if (formData.paymentStatus === 'LUNAS') {
      setFormData(prev => ({
        ...prev,
        amountPaid: calculateTotal()
      }));
    }
  }, [formData.paymentStatus, selectedProducts]);

  const handleSearchCustomer = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(`${BASE_CUSTOMER_URL}?searchTerm=${encodeURIComponent(searchQuery)}&searchBy=fullname`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setErrorMessage('Gagal mencari pelanggan');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.fullName || !newCustomer.email) {
      setErrorMessage('Nama lengkap, email, nomor hp, dan address wajib diisi');
      return;
    }
    
    setErrorMessage('');
    try {
      const response = await fetch(BASE_CUSTOMER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormData({...formData, customerId: data.id});
        setSearchQuery(data.email);
        setShowCustomerModal(false);
        setNewCustomer({ fullName: '', email: '', phoneNumber: '', address: '' });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Gagal membuat pelanggan');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const addProduct = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      updateQuantity(product.id, existingProduct.quantity + 1);
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
      setFormData({
        ...formData,
        productQuantities: {
          ...formData.productQuantities,
          [product.id]: 1
        }
      });
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
      setErrorMessage(`Stok tidak mencukupi untuk ${product.name}. Stok tersedia: ${product.stock}`);
      return;
    }

    setSelectedProducts(selectedProducts.map(p => 
      p.id === productId ? { ...p, quantity: newQuantity } : p
    ));
    
    setFormData({
      ...formData,
      productQuantities: {
        ...formData.productQuantities,
        [productId]: newQuantity
      }
    });
    setErrorMessage('');
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    const newQuantities = { ...formData.productQuantities };
    delete newQuantities[productId];
    setFormData({
      ...formData,
      productQuantities: newQuantities
    });
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

  const calculateChange = () => {
    return Math.max(0, formData.amountPaid - calculateTotal());
  };

  const calculateOutstanding = () => {
    return Math.max(0, calculateTotal() - formData.amountPaid);
  };

  const handleAmountPaidChange = (value) => {
    const numericValue = parseFloat(value) || 0;
    setFormData({
      ...formData,
      amountPaid: numericValue
    });
  };

  const handlePaymentStatusChange = (status) => {
    setFormData(prev => ({
      ...prev,
      paymentStatus: status,
      // Auto-set amount paid to total when switching to LUNAS
      amountPaid: status === 'LUNAS' ? calculateTotal() : prev.amountPaid
    }));
  };

  const validatePayment = () => {
    const total = calculateTotal();
    
    if (formData.paymentStatus === 'LUNAS' && formData.amountPaid < total) {
      return 'Jumlah pembayaran tidak boleh kurang dari total untuk status Lunas';
    }
    
    if (formData.paymentStatus === 'CICILAN' && formData.amountPaid >= total) {
      return 'Untuk status Cicilan, jumlah pembayaran harus kurang dari total';
    }
    
    if (formData.amountPaid < 0) {
      return 'Jumlah pembayaran tidak boleh negatif';
    }
    
    return null;
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      setErrorMessage('Pilih minimal satu produk');
      return;
    }

    if (!formData.customerId) {
      setErrorMessage('Silakan pilih atau tambahkan pelanggan');
      return;
    }

    const paymentError = validatePayment();
    if (paymentError) {
      setErrorMessage(paymentError);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const transactionRequestDTO = {
        customerId: formData.customerId,
        paymentMethod: formData.paymentMethod,
        amount: formData.amountPaid,
        productQuantities: formData.productQuantities,
      };

      const result = await transactionService.createTransaction(transactionRequestDTO);
      setSuccessMessage(`Transaksi berhasil!`);
      
      setFormData({
        customerId: '',
        paymentMethod: 'CASH',
        productQuantities: {},
        amountPaid: 0,
        paymentStatus: 'LUNAS'
      });
      setSelectedProducts([]);
      setSearchQuery('');
      
      setTimeout(() => {
        navigate('/manajemen-transaksi/history');
      }, 1500);
      
    } catch (error) {
      setErrorMessage(error.message || 'Terjadi kesalahan saat memproses transaksi');
      console.error('Transaction error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Tambah Pelanggan Baru</h2>
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.fullName}
                    onChange={(e) => setNewCustomer({...newCustomer, fullName: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    required
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                  <input
                    type="tel"
                    value={newCustomer.phoneNumber}
                    onChange={(e) => setNewCustomer({...newCustomer, phoneNumber: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alamat</label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCustomerModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateCustomer}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <ShoppingCart className="text-blue-700 mr-3" size={32} />
            <h1 className="text-3xl font-bold text-blue-900">Buat Transaksi Baru</h1>
          </div>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer & Payment Info */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="mr-2" size={16} />
                  Cari Pelanggan
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cari dengan nama"
                />
                {isSearching && <p className="text-sm text-gray-500 mt-1">Mencari...</p>}
                {!isSearching && searchResults.length > 0 && (
                  <div className="mt-2 border rounded-md bg-white shadow-sm max-h-48 overflow-y-auto">
                    {searchResults.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => {
                          setFormData({...formData, customerId: customer.id});
                          setSearchQuery(customer.email);
                          setSearchResults([]);
                        }}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{customer.fullName}</div>
                        <div className="text-sm text-gray-600">{customer.email}</div>
                      </div>
                    ))}
                  </div>
                )}
                {!isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => setShowCustomerModal(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Tambah Pelanggan Baru
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="mr-2" size={16} />
                  Metode Pembayaran
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CASH">Tunai</option>
                  <option value="CREDIT_CARD">Kartu Kredit</option>
                  <option value="DEBIT_CARD">Kartu Debit</option>
                  <option value="BANK_TRANSFER">Transfer Bank</option>
                  <option value="OVO">OVO</option>
                  <option value="GOPAY">GoPay</option>
                  <option value="DANA">DANA</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircle className="mr-2" size={16} />
                  Status Pembayaran
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => handlePaymentStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LUNAS">Lunas</option>
                  <option value="CICILAN">Cicilan</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Banknote className="mr-2" size={16} />
                  Jumlah Dibayar (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.amountPaid}
                  onChange={(e) => handleAmountPaidChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan jumlah yang dibayar"
                />
              </div>
            </div>

            {/* Product Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Produk</h3>
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                {products.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Tidak ada produk tersedia
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="p-3 border-b border-gray-100 hover:bg-gray-50 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            Rp {product.price?.toLocaleString() || '0'} / {product.unit || 'pcs'}
                          </p>
                          <p className="text-xs text-gray-500">Stok: {product.stock || 0}</p>
                        </div>
                        <button
                          onClick={() => addProduct(product)}
                          disabled={product.stock === 0}
                          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Produk Terpilih</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">Rp {product.price?.toLocaleString() || '0'} / {product.unit || 'pcs'}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(product.id, product.quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-1 bg-white border rounded text-center min-w-[3rem] font-medium">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, product.quantity + 1)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-sm text-gray-600 ml-2 min-w-[6rem] text-right font-semibold">
                        Rp {((product.price || 0) * product.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      Rp {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  
                  {formData.amountPaid > 0 && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Dibayar:</span>
                        <span className="font-semibold text-green-600">
                          Rp {formData.amountPaid.toLocaleString()}
                        </span>
                      </div>
                      
                      {formData.paymentStatus === 'LUNAS' && calculateChange() > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Kembalian:</span>
                          <span className="font-semibold text-orange-600">
                            Rp {calculateChange().toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {formData.paymentStatus === 'CICILAN' && calculateOutstanding() > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Sisa Hutang:</span>
                          <span className="font-semibold text-red-600">
                            Rp {calculateOutstanding().toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || selectedProducts.length === 0 || !formData.customerId}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg flex items-center transition-colors"
            >
              <Save className="mr-2" size={16} />
              {loading ? 'Memproses...' : 'Buat Transaksi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTransaction;