import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, ArrowLeft, User, CreditCard, Package, Calendar, 
  X, CheckCircle, AlertTriangle, Trash2, XCircle, Clock
} from 'lucide-react';
import { transactionService } from '../../services/transactionService';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [customer, setCustomer] = useState({});
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    fetchTransactionDetail();
  }, [id]);

  function uuidToTrxNumber(uuid) {
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
        const char = uuid.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    const number = Math.abs(hash) % 999999 + 1;
    return `TRX-${number}`;
  }

  const fetchTransactionDetail = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const transactionData = await transactionService.getTransactionById(id);
      const customerRes = await fetch(`http://localhost:8082/api/customers/${transactionData.customerId}`);
      const customerData = await customerRes.json();
      
      let paymentData = null;
      if (transactionData.paymentId) {
        const paymentRes = await fetch(`http://localhost:8081/payments/${transactionData.paymentId}`);
        paymentData = await paymentRes.json();
      }

      setCustomer(customerData.fullName);
      setTransaction(transactionData);
      setPayment(paymentData);
    } catch (error) {
      console.error('Error fetching transaction detail:', error);
      setErrorMessage(error.message || 'Gagal memuat detail transaksi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Clock, 
        label: 'Menunggu' 
      },
      IN_PROGRESS: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: Package, 
        label: 'Diproses' 
      },
      COMPLETED: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle, 
        label: 'Selesai' 
      },
      CANCELLED: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: XCircle, 
        label: 'Dibatalkan' 
      }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <div className={`flex items-center px-3 py-2 rounded-lg border ${config.color}`}>
        <IconComponent size={16} className="mr-2" />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      CASH: 'Tunai',
      CREDIT_CARD: 'Kartu Kredit',
      DEBIT_CARD: 'Kartu Debit',
      TRANSFER: 'Transfer Bank',
      INSTALLMENT: 'Cicilan'
    };
    return labels[method] || method;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    navigate('/manajemen-transaksi/history');
  };

  const handleCancelTransaction = async () => {
    setCancelling(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedTransaction = await transactionService.cancelTransaction(transaction.id);
      setTransaction(updatedTransaction);
      setSuccessMessage('Transaksi berhasil dibatalkan');
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      setErrorMessage(error.message || 'Gagal membatalkan transaksi');
    } finally {
      setCancelling(false);
    }
  };

  const handleDeleteTransaction = async () => {
    setDeleting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await transactionService.deleteTransaction(transaction.id);
      setSuccessMessage('Transaksi berhasil dihapus');
      setShowDeleteModal(false);
      // Navigate back after successful deletion
      setTimeout(() => {
        handleBack();
      }, 2000);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setErrorMessage(error.message || 'Gagal menghapus transaksi');
    } finally {
      setDeleting(false);
    }
  };

  const canCancel = transaction && transaction.status !== 'CANCELLED' && transaction.status !== 'COMPLETED';
  const canDelete = transaction && (transaction.status === 'CANCELLED' || transaction.status === 'PENDING');

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail transaksi...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">
            {errorMessage || 'Transaksi tidak ditemukan'}
          </p>
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

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={24} />
              </button>
              <FileText className="text-blue-700 mr-3" size={32} />
              <h1 className="text-3xl font-bold text-blue-900">Detail Transaksi {uuidToTrxNumber(transaction.id)}</h1>
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

          {/* Transaction Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Transaksi</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="mr-3 text-gray-400" size={16} />
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="text-sm font-medium text-gray-800 ml-2">{customer}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="mr-3 text-gray-400" size={16} />
                  <span className="text-sm text-gray-600">Pembayaran:</span>
                  <span className="text-sm font-medium text-gray-800 ml-2">
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-3 text-gray-400" size={16} />
                  <span className="text-sm text-gray-600">Dibuat:</span>
                  <span className="text-sm font-medium text-gray-800 ml-2">
                    {formatDate(transaction.createdAt)}
                  </span>
                </div>
                {transaction.updatedAt !== transaction.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="mr-3 text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Terakhir diubah:</span>
                    <span className="text-sm font-medium text-gray-800 ml-2">
                      {formatDate(transaction.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jumlah Item:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {transaction.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} pcs
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jenis Produk:</span>
                  <span className="text-sm font-medium text-gray-800">{transaction.items?.length || 0} jenis</span>
                </div>

                {transaction.status === 'IN_PROGRESS' && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Belum Dibayar:</span>
                    <span className="text-sm font-medium text-red-600">
                      Rp {(
                        transaction.totalAmount - 
                        (payment?.amount || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="border-t border-blue-200 pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      Rp {transaction.totalAmount?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Produk</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga Satuan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transaction.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="mr-3 text-gray-400" size={16} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.productName || item.product?.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rp {item.price?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Rp {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        Tidak ada item ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg"
            >
              Kembali
            </button>
            
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-lg flex items-center"
              >
                <X className="mr-2" size={16} />
                Batalkan Transaksi
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg flex items-center"
              >
                <Trash2 className="mr-2" size={16} />
                Hapus Transaksi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-yellow-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Pembatalan</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin membatalkan transaksi ini? 
              Stok produk akan dikembalikan dan transaksi tidak dapat diproses lebih lanjut.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleCancelTransaction}
                disabled={cancelling}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
              >
                {cancelling ? 'Membatalkan...' : 'Ya, Batalkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Penghapusan</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus transaksi {transaction.id}? 
              Tindakan ini tidak dapat dibatalkan dan semua data transaksi akan dihapus permanen.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteTransaction}
                disabled={deleting}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetail;