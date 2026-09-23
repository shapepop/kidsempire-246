const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ products: [] }, null, 2));
  }
}

function readProducts() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.products) ? parsed.products : [];
  } catch (error) {
    return [];
  }
}

function writeProducts(products) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ products }, null, 2));
}

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Kidsempire API is running' });
});

app.get('/api/products', (req, res) => {
  res.json(readProducts());
});

app.post('/api/products', (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Expected an array of products' });
  }

  writeProducts(req.body);
  res.json(req.body);
});

app.listen(PORT, () => {
  console.log(`Kidsempire API listening on http://localhost:${PORT}`);
});
