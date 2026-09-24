export function calculateMse(data, slope, intercept) {
  if (!data || data.length === 0) {
    return 0;
  }

  const totalError = data.reduce((sum, point) => {
    const prediction = slope * point.x + intercept;
    return sum + Math.pow(point.y - prediction, 2);
  }, 0);

  return totalError / data.length;
}

export function getKeysFromData(rawData) {
  if (!rawData || rawData.length === 0) return [];
  return Object.keys(rawData[0]);
}

export function mapRawToPoints(rawData, xKey, yKey) {
  if (!rawData || !xKey || !yKey) return [];

  return rawData
    .map((d) => {
      const x = parseFloat(d[xKey]);
      const y = parseFloat(d[yKey]);
      return { x, y };
    })
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
}

export function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];

  const header = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = line.split(',');
    const obj = {};
    header.forEach((key, i) => {
      obj[key] = cols[i] ? cols[i].trim() : '';
    });
    return obj;
  });
}

export function formatEquation(slope, intercept) {
  const slopeLabel = slope.toFixed(2);
  const interceptLabel = Math.abs(intercept).toFixed(2);
  const sign = intercept >= 0 ? '+' : '-';

  return `y = ${slopeLabel}x ${sign} ${interceptLabel}`;
}

export function createInitialData() {
  return [
    { x: 1, y: 3.5 },
    { x: 2, y: 4 },
    { x: 3, y: 5.5 },
    { x: 4, y: 6 },
    { x: 5, y: 8 },
    { x: 6, y: 7.5 },
    { x: 7, y: 9 },
    { x: 8, y: 10.5 },
    { x: 9, y: 11 },
    { x: 10, y: 12 }
  ];
}
