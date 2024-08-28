const express = require('express');
const { getTopTickers } = require('../db');

const router = express.Router();

router.get('/tickers', async (req, res) => {
  try {
    const tickers = await getTopTickers();
    res.json(tickers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;