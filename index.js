const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 1. Serve current folder as static
app.use(express.static(__dirname));

// 2. Force root route '/' to show index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Optional: Serve other pages
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Website running at: http://localhost:${PORT}`);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static public files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Set up file uploads
const upload = multer({ dest: 'uploads/' });

// Contact endpoint
app.post('/contact', upload.array('photos', 3), (req, res) => {
  const { name, email, message } = req.body;
  const images = req.files || [];

  console.log('👉 Contact submitted:');
  console.log({ name, email, message, images });

  res.send('✅ Your message has been submitted. We will contact you soon!');
});