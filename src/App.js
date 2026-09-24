import React, { useEffect, useState } from 'react';
import './App.css';
import ScatterPlot from './components/ScatterPlot';
import {
  calculateMse,
  createInitialData,
  formatEquation,
  parseCsv,
  getKeysFromData,
  mapRawToPoints,
} from './utils/regression';

function App() {
  const [data, setData] = useState(createInitialData());
  const [rawData, setRawData] = useState(null);
  const [xKey, setXKey] = useState('x');
  const [yKey, setYKey] = useState('y');
  const [availableKeys, setAvailableKeys] = useState([]);
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(2);
  const [mse, setMse] = useState(0);

  useEffect(() => {
    setMse(calculateMse(data, slope, intercept));
  }, [data, slope, intercept]);

  useEffect(() => {
    if (!rawData) return;
    const keys = getKeysFromData(rawData);
    setAvailableKeys(keys);
    // If keys include default x/y, keep them, otherwise pick first two
    if (keys.includes('x') && keys.includes('y')) {
      setXKey('x');
      setYKey('y');
      setData(mapRawToPoints(rawData, 'x', 'y'));
    } else if (keys.length >= 2) {
      setXKey(keys[0]);
      setYKey(keys[1]);
      setData(mapRawToPoints(rawData, keys[0], keys[1]));
    }
  }, [rawData]);

  useEffect(() => {
    if (!rawData) return;
    if (xKey && yKey) {
      setData(mapRawToPoints(rawData, xKey, yKey));
    }
  }, [xKey, yKey, rawData]);

  return (
    <div className="App">
      <header className="Title">
        <h1 className="Title-large">Interactive Linear Regression Tuner</h1>
        <p className="Title-small">Adjust the slope and intercept to find the best fit for the data.</p>
      </header>

      <div className="Grid">
        <div className="Grid-item-1">
          <h2 className="Title">Parameters</h2>
          <div>
            <p className="Title-small">Linear Equation</p>
            <p className="Title-small">{formatEquation(slope, intercept)}</p>
          </div>

          <div className="Input-container">
            <div>
              <label htmlFor="slope" className="Slope-input-label">
                Slope (m): <span className="font-bold text-indigo-600">{slope.toFixed(2)}</span>
              </label>
              <input
                type="range"
                id="slope"
                min="-5"
                max="5"
                step="0.01"
                value={slope}
                onChange={(e) => setSlope(parseFloat(e.target.value))}
                className="Slope-input"
              />
            </div>

            <div>
              <label htmlFor="intercept" className="Intercept-input-label">
                Y-Intercept (b): <span className="font-bold text-indigo-600">{intercept.toFixed(2)}</span>
              </label>
              <input
                type="range"
                id="intercept"
                min="-10"
                max="10"
                step="0.1"
                value={intercept}
                onChange={(e) => setIntercept(parseFloat(e.target.value))}
                className="Intercept-input"
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <h3 className="Title">Dataset</h3>
            <div>
              <input
                type="file"
                accept=".csv,application/csv,text/csv"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const text = ev.target.result;
                    const parsed = parseCsv(text);
                    setRawData(parsed);
                  };
                  reader.readAsText(file);
                }}
              />
            </div>

            {availableKeys.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <label style={{ marginRight: 8 }}>X:</label>
                <select value={xKey} onChange={(e) => setXKey(e.target.value)}>
                  {availableKeys.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>

                <label style={{ marginLeft: 12, marginRight: 8 }}>Y:</label>
                <select value={yKey} onChange={(e) => setYKey(e.target.value)}>
                  {availableKeys.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="Performance-metrics-container">
            <h3 className="Title">Model Performance</h3>
            <div className="Performance-metrics">
              <p className="Mse-title Title-small">Mean Squared Error (MSE)</p>
              <p className="Mse Title-small">{mse.toFixed(4)}</p>
            </div>
          </div>

          <div className="Reset-button-container">
            <button onClick={() => { setSlope(1); setIntercept(2); }} className="Reset-button">
              Reset Parameters
            </button>
          </div>
        </div>

        <div className="Grid-item-2">
          <ScatterPlot
            data={data}
            slope={slope}
            intercept={intercept}
            xLabel={xKey}
            yLabel={yKey}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
