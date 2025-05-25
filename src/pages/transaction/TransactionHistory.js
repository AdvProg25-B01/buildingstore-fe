import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { History, Search, Eye, Edit, X, Calendar, User, CreditCard, Trash } from 'lucide-react';
import { transactionService } from '../../services/transactionService';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [errorMessage, setError] = useState('');
  const [customers, setCustomers] = useState({});
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  useEffect(() => {
    fetchTransactions();
  }, []);

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

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await transactionService.getAllTransactions();
      // Handle different possible response structures
      const transactionData = Array.isArray(response) ? response : response?.data || response?.transactions || [];

      const customersRes = await fetch('http://localhost:8082/api/customers');
      const customersData = await customersRes.json();

      const customerMap = customersData.reduce((acc, customer) => {
        acc[customer.id] = customer.fullName;
        return acc;
      }, {});
      
      setCustomers(customerMap);
      setTransactions(transactionData);
      setFilteredTransactions(transactionData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.message || 'Gagal memuat data transaksi');
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailTransaction = (transactionId) => {
    navigate(`/manajemen-transaksi/detail/${transactionId}`);
  };

  const handleEditTransaction = (transactionId) => {
    navigate(`/manajemen-transaksi/edit/${transactionId}`);
  };

  const handleTransactionAction = async (transactionId, action) => {
    try {
      setLoading(true);
      
      switch (action) {
        case 'cancel':
          await transactionService.cancelTransaction(transactionId);
          break;
        case 'delete':
          await transactionService.deleteTransaction(transactionId);
          break;
        default:
          return;
      }
      
      // Refresh transactions after action
      await fetchTransactions();
    } catch (error) {
      console.error(`Error ${action} transaction:`, error);
      setError(`Gagal ${action === 'complete' ? 'menyelesaikan' : action === 'cancel' ? 'membatalkan' : 'menghapus'} transaksi`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchKeyword) {
      filtered = filtered.filter(t => 
        t.id?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        t.customerId?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    // Payment method filter
    if (selectedPaymentMethod) {
      filtered = filtered.filter(t => t.paymentMethod === selectedPaymentMethod);
    }

    // Date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.createdAt);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'totalAmount':
          aValue = a.totalAmount || 0;
          bValue = b.totalAmount || 0;
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
      }

      if (sortDirection === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [searchKeyword, selectedStatus, selectedPaymentMethod, startDate, endDate, sortBy, sortDirection, transactions]);

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };

    const statusLabels = {
      PENDING: 'Menunggu',
      IN_PROGRESS: 'Diproses',
      COMPLETED: 'Selesai',
      CANCELLED: 'Dibatalkan'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      CASH: 'Tunai',
      CREDIT_CARD: 'Kartu Kredit',
      DEBIT_CARD: 'Kartu Debit',
      BANK_TRANSFER: 'Transfer Bank',
      OVO: 'OVO',
      GOPAY: 'GoPay',
      DANA: 'DANA',
      OTHER: 'Lainnya'
    };
    return labels[method] || method;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const clearFilters = () => {
    setSearchKeyword('');
    setSelectedStatus('');
    setSelectedPaymentMethod('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <History className="text-blue-700 mr-3" size={32} />
              <h1 className="text-3xl font-bold text-blue-900">Riwayat Transaksi</h1>
            </div>
            <button
              onClick={fetchTransactions}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="PENDING">Menunggu</option>
                <option value="IN_PROGRESS">Diproses</option>
                <option value="COMPLETED">Selesai</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>

              {/* Payment Method Filter */}
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Pembayaran</option>
                <option value="CASH">Tunai</option>
                <option value="CREDIT_CARD">Kartu Kredit</option>
                <option value="DEBIT_CARD">Kartu Debit</option>
                <option value="BANK_TRANSFER">Transfer Bank</option>
                <option value="OVO">OVO</option>
                <option value="GOPAY">GoPay</option>
                <option value="DANA">DANA</option>
                <option value="OTHER">Lainnya</option>
              </select>

              {/* Start Date */}
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* End Date */}
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Sort */}
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [sortField, direction] = e.target.value.split('-');
                  setSortBy(sortField);
                  setSortDirection(direction);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt-desc">Terbaru</option>
                <option value="createdAt-asc">Terlama</option>
                <option value="totalAmount-desc">Total Tertinggi</option>
                <option value="totalAmount-asc">Total Terendah</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <X size={16} className="mr-1" />
                Hapus Filter
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-sm text-gray-600">
            Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTransactions.length)} dari {filteredTransactions.length} transaksi
          </div>

          {/* Transaction Table */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Transaksi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {uuidToTrxNumber(transaction.id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                            <User size={16} className="mr-2 text-gray-400" />
                            {customers[transaction.customerId] || 'Loading...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CreditCard size={16} className="mr-2 text-gray-400" />
                          {getPaymentMethodLabel(transaction.paymentMethod)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Rp {transaction.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => handleDetailTransaction(transaction.id)} className="text-blue-600 hover:text-blue-900">
                            <Eye size={16} />
                          </button>
                          {(transaction.status === 'PENDING' || transaction.status === 'IN_PROGRESS') && (
                                <button
                                onClick={() => handleTransactionAction(transaction.id, 'cancel')}
                                className="text-orange-600 hover:text-orange-900"
                                >
                                <X size={16} />
                                </button>
                            )}
                            <button
                                onClick={() => handleTransactionAction(transaction.id, 'delete')}
                                className="text-red-600 hover:text-red-900"
                            >
                                <Trash size={16} />
                            </button>
                          {(transaction.status === 'PENDING' || transaction.status === 'IN_PROGRESS') && (
                            <button onClick={() => handleEditTransaction(transaction.id)} className="text-blue-600 hover:text-blue-900">
                                <Edit size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada transaksi yang ditemukan</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;