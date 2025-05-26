import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Save, ArrowLeft, User, CreditCard, Package, AlertCircle, Banknote } from 'lucide-react';
import { transactionService, TransactionStatus } from '../../services/transactionService';
import { getPaymentById } from '../../Payment/api/PaymentApi';

const API_CUSTOMER_URL = process.env.REACT_APP_CUSTOMER_API_URL || 'http://localhost:8082';
const BASE_CUSTOMER_URL = `${API_CUSTOMER_URL}/api/customers`;

const UpdateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [payment, setPayment] = useState(null);
  const [updateData, setUpdateData] = useState({
    customerId: '',
    paymentMethod: '',
    amount: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  function uuidToTrxNumber(uuid) {
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
        const char = uuid.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const number = Math.abs(hash) % 999999 + 1;
    return `TRX-${number}`;
  }

  const fetchTransaction = async () => {
    try {
      const transactionData = await transactionService.getTransactionById(id);
      const customerRes = await fetch(`${BASE_CUSTOMER_URL}/${transactionData.customerId}`);
      const customerData = await customerRes.json();
      setCustomer(customerData.fullName);
      setTransaction(transactionData);
      
      try {
        const paymentRes = await getPaymentById(transactionData.paymentId);
        const paymentData = await paymentRes.json();
        setPayment(paymentData);
      } catch (paymentError) {
        console.warn('Could not fetch payment data:', paymentError);
        setPayment(null);
      }
      
      // Set initial form data
      setUpdateData({
        customerId: transactionData.customerId || '',
        paymentMethod: transactionData.paymentMethod || 'CASH',
        amount: transactionData.payment?.amount || 0
      });

    } catch (error) {
      console.error('Error fetching transaction:', error);
      setErrorMessage(error.message || 'Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      [TransactionStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [TransactionStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
      [TransactionStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [TransactionStatus.CANCELLED]: 'bg-red-100 text-red-800'
    };

    const statusLabels = {
      [TransactionStatus.PENDING]: 'Menunggu',
      [TransactionStatus.IN_PROGRESS]: 'Diproses',
      [TransactionStatus.COMPLETED]: 'Selesai',
      [TransactionStatus.CANCELLED]: 'Dibatalkan'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const colors = status === 'LUNAS' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors}`}>
        {status || 'N/A'}
      </span>
    );
  };

  const handleBack = () => {
    navigate('/manajemen-transaksi/history');
  };

  const handleSave = async () => {
    if (!updateData.customerId.trim()) {
      return;
    }

    // Validate payment amount for installment transactions
    if (payment?.status === 'CICILAN') {
      const totalAmount = transaction?.totalAmount || 0;
      if (updateData.amount < 0) {
        setErrorMessage('Jumlah pembayaran tidak boleh negatif');
        return;
      }
      if (updateData.amount > totalAmount) {
        setErrorMessage('Jumlah pembayaran tidak boleh melebihi total transaksi');
        return;
      }
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const transactionUpdateDTO = {
        customerId: updateData.customerId,
        paymentMethod: updateData.paymentMethod,
        amount: updateData.amount + payment.amount,
      };

      await transactionService.updateTransaction(transaction.id, transactionUpdateDTO);
      
      setSuccessMessage('Transaksi berhasil diperbarui');
      
      setTimeout(() => {
        fetchTransaction();
        setSuccessMessage('');
        navigate('/manajemen-transaksi/history');
      }, 2000);

    } catch (error) {
      console.error('Error updating transaction:', error);
      setErrorMessage(error.message || 'Terjadi kesalahan saat memperbarui transaksi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data transaksi...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Transaksi tidak ditemukan</p>
          <button
            onClick={handleBack}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Kembali ke daftar transaksi
          </button>
        </div>
      </div>
    );
  }

  // Check if transaction can be updated
  const canUpdate = transaction.status === TransactionStatus.PENDING || transaction.status === TransactionStatus.IN_PROGRESS;

  if (!canUpdate) {
    return (
      <div className="min-h-screen bg-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button
                  onClick={handleBack}
                  className="mr-4 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-blue-900">
                  Detail Transaksi {transaction.id ? uuidToTrxNumber(transaction.id) : 'N/A'}
                </h1>
              </div>
              {getStatusBadge(transaction.status)}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="text-yellow-600 mr-3" size={20} />
                <p className="text-yellow-800">
                  Transaksi dengan status "{transaction.status}" tidak dapat diubah.
                  Hanya transaksi dengan status "PENDING" atau "IN_PROGRESS" yang dapat diperbarui.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Transaksi</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="mr-2 text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Customer: </span>
                    <span className="text-sm font-medium text-gray-800 ml-1">{transaction.customerId}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Pembayaran: </span>
                    <span className="text-sm font-medium text-gray-800 ml-1">{transaction.paymentMethod}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="mr-2 text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Total: </span>
                    <span className="text-sm font-bold text-blue-600 ml-1">
                      Rp {transaction.totalAmount?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Banknote className="mr-2 text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Dibayar: </span>
                    <span className="text-sm font-medium text-gray-800 ml-1">
                      Rp {payment?.amount?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">Status Pembayaran: </span>
                    <span className="ml-1">
                      {getPaymentStatusBadge(payment?.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Produk dalam Transaksi</h3>
                <div className="space-y-2">
                  {transaction.items && transaction.items.length > 0 ? (
                    transaction.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {item.productName || item.product?.name || `Product ${item.productId}`}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.quantity} x Rp {item.price?.toLocaleString() || '0'}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          Rp {((item.price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Tidak ada produk</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getReadablePaymentMethod = (method) => {
    switch (method) {
      case 'CASH':
        return 'Tunai';
      case 'CREDIT_CARD':
        return 'Kartu Kredit';
      case 'DEBIT_CARD':
        return 'Kartu Debit';
      case 'BANK_TRANSFER':
        return 'Transfer Bank';
      case 'OVO':
        return 'OVO';
      case 'GOPAY':
        return 'GoPay';
      case 'DANA':
        return 'DANA';
      case 'OTHER':
        return 'Lainnya';
      default:
        return 'Metode Tidak Diketahui';
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={24} />
              </button>
              <Edit className="text-blue-700 mr-3" size={32} />
              <h1 className="text-3xl font-bold text-blue-900">
                Edit Transaksi {transaction.id ? uuidToTrxNumber(transaction.id) : 'N/A'}
              </h1>
            </div>
            {getStatusBadge(transaction.status)}
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
                  Customer
                </label>
                {customer}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="mr-2" size={16} />
                  Metode Pembayaran
                </label>
                <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {getReadablePaymentMethod(updateData.paymentMethod)}
                </p>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Informasi Pembayaran</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status Pembayaran:</span>
                    {getPaymentStatusBadge(payment?.status)}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Transaksi:</span>
                    <span className="text-sm font-medium text-gray-800">
                      Rp {(transaction.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <label className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Banknote className="mr-2" size={16} />
                        Jumlah Sudah Dibayar
                      </div>
                      <span className="text-gray-800">
                        {payment?.amount ? `Rp ${payment.amount.toLocaleString()}` : 'Rp 0'}
                      </span>
                    </label>

                    <label className="flex items-center mt-2">
                      <Banknote className="mr-2" size={16} />
                      Jumlah Dibayar
                    </label>
                    {payment?.status === 'CICILAN' ? (
                      <input
                        type="number"
                        value={updateData.amount}
                        onChange={(e) => setUpdateData({...updateData, amount: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan jumlah yang dibayar"
                        min="0"
                        max={transaction.totalAmount || 0}
                      />
                    ) : (
                      <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-600">
                        Rp {(updateData.amount || 0).toLocaleString()}
                        <span className="text-xs text-gray-500 ml-2">
                          (Tidak dapat diubah - status: {payment?.status})
                        </span>
                      </div>
                    )}
                  </div>

                  {payment?.status === 'CICILAN' && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Sisa Pembayaran:</span>
                      <span className="font-medium text-red-600">
                        Rp {Math.max(0, (transaction.totalAmount || 0) - (payment.amount || 0) - (updateData.amount || 0)).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transaction Items (Read-only) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Produk dalam Transaksi</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  {transaction.items && transaction.items.length > 0 ? (
                    transaction.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {item.productName || item.product?.name || `Product ${item.productId}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            Rp {item.price?.toLocaleString() || '0'} / {item.product?.unit || 'unit'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-800">
                            Rp {((item.price || 0) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">Tidak ada produk dalam transaksi</p>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      Rp {(transaction.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg flex items-center"
            >
              <Save className="mr-2" size={16} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTransaction;