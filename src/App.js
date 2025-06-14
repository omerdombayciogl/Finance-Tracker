import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TransactionForm from './TransactionForm';
import MonthlyChart from './components/MonthlyChart';
import './styles.css';

const exportToCSV = (transactions) => {
  if (!transactions.length) return;

  const header = ['Tarih', 'Kategori', 'Açıklama', 'Tutar'];
  const rows = transactions.map(t =>
    [
      t.date ?? '',
      t.category ?? '',
      t.description ?? '',
      t.amount ?? ''
    ]
  );

  const csvContent = [header, ...rows]
    .map(row =>
      row.map(cell => `"${cell.toString()}"`).join(',')
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t) =>
    setTransactions((prev) => [...prev, { ...t, id: Date.now() }]);

  const deleteTransaction = (id) => {
    const confirmed = window.confirm("Bu işlemi silmek istediğinize emin misiniz?");
    if (!confirmed) return;
  
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };
  
  

  const total = transactions.reduce(
    (sum, t) => (t.type === 'income' ? sum + t.amount : sum - t.amount),
    0
  );

  const categories = [...new Set(transactions.map((t) => t.category))];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchCategory = selectedCategory === 'Tümü' || t.category === selectedCategory;
      const matchStart = !startDate || new Date(t.date) >= new Date(startDate);
      const matchEnd = !endDate || new Date(t.date) <= new Date(endDate);
      const matchSearch = 
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) || (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCategory && matchSearch && matchStart && matchEnd;
    });
  }, [transactions, selectedCategory, startDate, endDate, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').slice(1); // başlığı atla
      const imported = lines
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          const [date, category, description, amount] = line.split(',').map(cell => cell.replace(/"/g, ''));
          return {
            id: Date.now() + Math.random(), // unique id
            date,
            category,
            description,
            amount: parseFloat(amount),
            type: parseFloat(amount) >= 0 ? 'income' : 'expense'
          };
        });

      setTransactions(prev => [...prev, ...imported]);
    };

    reader.readAsText(file, 'utf-8');
  };
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTransactions]);

  useEffect(() => {
    console.log("Aktif sayfa:", currentPage);
  }, [currentPage]);

  return (
    <div className="container">
      <header className="header">
        <h1>Finance Flow</h1>
        <p>
          Toplam Bakiye: <strong>{total.toLocaleString()} TL</strong>
        </p>
      </header>

      <TransactionForm onAdd={addTransaction} />

      <input
        type="text"
        placeholder="Açıklama veya kategori ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input-field"
        style={{ width: '100%', marginBottom: '20px' }}
      />

      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field"
        >
          <option value="Tümü">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="date-filter">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="input-field"
        />
      </div>

      <button onClick={() => exportToCSV(transactions)} className="input-field" style={{ marginTop: '10px', cursor:'pointer', marginBottom:'20px', color:'#fff' }}>
        📤 Dışa Aktar (CSV)
      </button>
      <label htmlFor="csvInput" className="btn-file">
        📥 CSV Yükle
      </label>
      <input
        id="csvInput"
        type="file"
        accept=".csv"
        onChange={handleImportCSV}
        style={{ display: 'none' }}
      />

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <p>📭 Henüz hiç kayıt yok</p>
          <small>Yeni bir gelir veya gider ekleyerek başlayabilirsin.</small>
        </div>
      ) : (
        <ul className="transaction-list">
          <AnimatePresence>
            {currentItems.map((t) => (
              <motion.li
                key={t.id}
                className={`transaction-item ${t.type === 'expense' ? 'expense' : ''}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="transaction-info">
                  <time>{t.date}</time>
                  <p>
                    {t.category}
                    {t.note && <> — {t.note}</>}
                  </p>
                  <p className="amount">
                    {t.type === 'income' ? '+' : '-'}
                    {t.amount} TL
                  </p>
                </div>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="btn-delete"
                >
                  🗑
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅️ Önceki
          </button>

          <span className="pagination-info">Sayfa {currentPage} / {totalPages}</span>

          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Sonraki ➡️
          </button>
        </div>

      <MonthlyChart transactions={filteredTransactions} />
    </div>
  );
}

export default App;
