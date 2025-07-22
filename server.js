const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Update these credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Haider@72',
  database: 'My_shop'
});

// Get all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Place an order
app.post('/order', (req, res) => {
  const { customer, cart } = req.body;
  db.query('INSERT INTO customers (name, email) VALUES (?, ?)', [customer.name, customer.email], (err, results) => {
    if (err) return res.status(500).send(err);
    const customerId = results.insertId;
    let total = 0;
    cart.forEach(item => { total += item.price * item.quantity; });
    db.query('INSERT INTO orders (customer_id, total) VALUES (?, ?)', [customerId, total], (err, orderRes) => {
      if (err) return res.status(500).send(err);
      const orderId = orderRes.insertId;
      const items = cart.map(item => [orderId, item.productId, item.quantity, item.price]);
      db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?', [items], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ success: true });
      });
    });
  });
});

app.listen(3000, () => console.log('API server running on port 3000'));
