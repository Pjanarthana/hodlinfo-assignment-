const API_URL = 'http://127.0.0.1:5500/frontend//api/tickers';

function fetchData() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            updateTable(data);
            updateAveragePrices(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateTable(data) {
    const tableBody = document.querySelector('#tickerTable tbody');
    tableBody.innerHTML = '';
    data.forEach((ticker, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${ticker.name}</td>
                <td>₹ ${parseFloat(ticker.last).toLocaleString('en-IN')}</td>
                <td>₹ ${parseFloat(ticker.buy).toLocaleString('en-IN')} / ₹ ${parseFloat(ticker.sell).toLocaleString('en-IN')}</td>
                <td>${calculateDifference(ticker.last, ticker.buy)}%</td>
                <td>₹ ${calculateSavings(ticker.last, ticker.buy).toLocaleString('en-IN')}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function updateAveragePrices(data) {
    const averagePrice = data.reduce((sum, ticker) => sum + parseFloat(ticker.last), 0) / data.length;
    const buyPrice = Math.min(...data.map(ticker => parseFloat(ticker.buy)));
    const sellPrice = Math.max(...data.map(ticker => parseFloat(ticker.sell)));

    document.getElementById('averagePrice').textContent = `₹ ${averagePrice.toLocaleString('en-IN')}`;
    document.getElementById('buyPrice').textContent = `₹ ${buyPrice.toLocaleString('en-IN')}`;
    document.getElementById('sellPrice').textContent = `₹ ${sellPrice.toLocaleString('en-IN')}`;
}

function calculateDifference(last, buy) {
    return (((last - buy) / buy) * 100).toFixed(2);
}

function calculateSavings(last, buy) {
    return Math.abs(last - buy);
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    let seconds = 60;
    setInterval(() => {
        timerElement.textContent = seconds;
        if (seconds === 0) {
            fetchData();
            seconds = 60;
        } else {
            seconds--;
        }
    }, 1000);
}

document.getElementById('telegramButton').addEventListener('click', () => {
    window.open('https://t.me/hodlinfo', '_blank');
});

fetchData();
updateTimer();