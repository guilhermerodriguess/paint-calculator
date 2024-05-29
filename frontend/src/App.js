import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [walls, setWalls] = useState([
    { height: '', width: '', windows: '', doors: '' },
    { height: '', width: '', windows: '', doors: '' },
    { height: '', width: '', windows: '', doors: '' },
    { height: '', width: '', windows: '', doors: '' },
  ]);

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  function formatCansList(cansList) {
    const cansCount = {};
    cansList.forEach((can) => {
      cansCount[can] = (cansCount[can] || 0) + 1;
    });
  
    const formattedCans = [];
    for (const [size, count] of Object.entries(cansCount)) {
      formattedCans.push(`${count} Lata${count > 1 ? 's' : ''} de ${size}L`);
    }
  
    return formattedCans.join(' e ');
  }

  const handleChange = (index, field, value) => {
    const newWalls = [...walls];
    newWalls[index][field] = value;
    setWalls(newWalls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const response = await axios.post('http://localhost:3000/api/calculate-paint', { walls });
      setResult({
        paintRequired: response.data.paintRequired,
        cans: formatCansList(response.data.cans),
      });
    } catch (err) {
      console.log(err, 'ERROR')
      setError(err.response ? err.response.data.error : 'Error: Network Error');
    }
  };

  return (
    <div className="container">
      <h1>Calculadora de Tinta</h1>
      <form onSubmit={handleSubmit}>
        {walls.map((wall, index) => (
          <div key={index} className="wall-input">
            <h2>Parede {index + 1}</h2>
            <input
              type="number"
              placeholder="Altura (m)"
              value={wall.height}
              onChange={(e) => handleChange(index, 'height', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Comprimento (m)"
              value={wall.width}
              onChange={(e) => handleChange(index, 'width', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Janelas"
              value={wall.windows}
              onChange={(e) => handleChange(index, 'windows', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Portas"
              value={wall.doors}
              onChange={(e) => handleChange(index, 'doors', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Calcular</button>
      </form>
      {result && (
        <div className="result">
          <h2>Resultado</h2>
          <p>Tinta Necessária: {result.paintRequired} litros</p>
          <p>Latas Necessárias: {result.cans}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
