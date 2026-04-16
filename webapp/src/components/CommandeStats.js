import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#e91e63', '#9c27b0', '#3f51b5', '#4caf50', '#ff9800', '#795548', '#607d8b', '#f44336'];

const CommandeStats = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/commandes')
      .then(res => {
        const commandes = res.data;
        const qteByMonth = {};

        commandes.forEach(cmd => {
          const dateStr = cmd.dateCom; // Corrige le champ de date
          if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date)) {
              const month = date.toLocaleString('default', { month: 'long' });
              qteByMonth[month] = (qteByMonth[month] || 0) + (cmd.QteCom || 0);
            }
          }
        });

        const formattedData = Object.entries(qteByMonth).map(([month, value]) => ({
          name: month,
          value,
        }));

        setData(formattedData);
      })
      .catch(err => console.error("Erreur chargement des commandes :", err));
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Statistiques des Quantités par Mois (2025)</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={150}
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} unités`} />
        <Legend />
      </PieChart>
      <p><strong>Total des quantités :</strong> {data.reduce((sum, entry) => sum + entry.value, 0)} unités</p>
    </div>
  );
};

export default CommandeStats;