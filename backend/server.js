const express = require('express');
const cors = require('cors');
const tickersRouter = require('./routes/tickers');
const { fetchAndStoreData } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', tickersRouter);

// Fetch and store data every 5 minutes
setInterval(fetchAndStoreData, 5 * 60 * 1000);

// Initial fetch and store
fetchAndStoreData();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});