import React, { useState } from 'react';
import './styles.css';

export default function TransactionForm({ onAdd }) {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(+amount) || !category || !date) return;
    onAdd({ type, amount: +amount, category, note, date });
    setAmount('');
    setCategory('');
    setNote('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="input-group">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field"
        >
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
        </select>
        <input
          type="number"
          placeholder="₺ Tutar"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
      </div>
      <input
        type="text"
        placeholder="Açıklama (opsiyonel)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="input-field"
      />
      <button type="submit" className="btn-primary">
        Kaydet ve Ekle
      </button>
    </form>
  );
}
