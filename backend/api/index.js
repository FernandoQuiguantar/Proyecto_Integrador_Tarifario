let app;
try {
  app = require('../app');
} catch (err) {
  app = (req, res) => {
    res.status(500).json({ error: err.message, stack: err.stack });
  };
}
module.exports = app;
