const express = require('express');
const router = express.Router();

// Autenticación migrada a /api/roles/login
router.post('/login', (req, res) => {
  res.status(410).json({ message: 'Este endpoint ya no está en uso. Usa /api/roles/login' });
});

module.exports = router;
