const { Pool } = require('pg');
const axios = require('axios');

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'hodlinfo',
  password: 'your_password',
  port: 5432,
});

async function fetchAndStoreData() {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = Object.values(response.data).slice(0, 10);

    for (const ticker of tickers) {
      await pool.query(
        `INSERT INTO tickers (name, last, buy, sell, volume, base_unit)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (name) DO UPDATE
         SET last = $2, buy = $3, sell = $4, volume = $5, base_unit = $6, updated_at = CURRENT_TIMESTAMP`,
        [ticker.name, ticker.last, ticker.buy, ticker.sell, ticker.volume, ticker.base_unit]
      );
    }

    console.log('Data fetched and stored successfully');
  } catch (error) {
    console.error('Error fetching and storing data:', error);
  }
}

async function getTopTickers() {
  try {
    const result = await pool.query('SELECT * FROM tickers ORDER BY volume DESC LIMIT 10');
    return result.rows;
  } catch (error) {
    console.error('Error fetching data from database:', error);
    throw error;
  }
}

module.exports = {
  fetchAndStoreData,
  getTopTickers,
};