import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

function MonthlyChart({ transactions }) {
  // Ayları YYYY-MM formatında grupla
  const grouped = {};

  transactions.forEach(t => {
    const month = t.date.slice(0, 7); // "2025-05"
    if (!grouped[month]) grouped[month] = { income: 0, expense: 0 };

    if (t.type === 'income') grouped[month].income += t.amount;
    else grouped[month].expense += t.amount;
  });

  const months = Object.keys(grouped).sort();
  const incomeData = months.map(m => grouped[m].income);
  const expenseData = months.map(m => grouped[m].expense);

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Gelir',
        data: incomeData,
        backgroundColor: 'rgba(0, 200, 100, 0.6)',
      },
      {
        label: 'Gider',
        data: expenseData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value} TL`,
        },
      },
    },
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginTop: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: 16 }}>📊 Aylık Gelir & Gider</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default MonthlyChart;