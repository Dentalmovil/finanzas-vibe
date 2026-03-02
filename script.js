// Configuración de las monedas
const COIN_IDS = ['bitcoin', 'ethereum', 'binancecoin', 'pax-gold'];
let myChart;

// 1. Función para obtener precios de la API
async function fetchPrices() {
    try {
        const response = await fetch('/api/get-prices');
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        updateUI(data);
        updateChart(data.bitcoin.usd);
    } catch (error) {
        console.error('Error al obtener precios:', error);
    }
}

// 2. Función para actualizar la interfaz (HTML)
function updateUI(data) {
    // Actualizar Balance Principal (BTC)
    const btcPrice = data.bitcoin.usd;
    document.getElementById('total-balance').textContent = `$${btcPrice.toLocaleString()}`;

    // Actualizar las 4 tarjetas individuales
    document.getElementById('price-btc').textContent = `$${data.bitcoin.usd.toLocaleString()}`;
    document.getElementById('price-eth').textContent = `$${data.ethereum.usd.toLocaleString()}`;
    document.getElementById('price-bnb').textContent = `$${data.binancecoin.usd.toLocaleString()}`;
    document.getElementById('price-paxg').textContent = `$${data['pax-gold'].usd.toLocaleString()}`;

    // Revisar Alertas
    checkAlerts(data);
}

// 3. Lógica de Navegación (Tabs)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        // Quitar clase active de todos
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelectorAll('.app-section').forEach(sec => sec.style.display = 'none');

        // Activar el seleccionado
        item.classList.add('active');
        const target = item.getAttribute('data-target');
        document.getElementById(target).style.display = 'block';
    });
});

// 4. Configuración del Gráfico (Chart.js)
function initChart() {
    const ctx = document.getElementById('coinChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(10).fill(''),
            datasets: [{
                data: [],
                borderColor: '#00ffa3',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}

function updateChart(price) {
    if (!myChart) return;
    myChart.data.datasets[0].data.push(price);
    if (myChart.data.datasets[0].data.length > 10) {
        myChart.data.datasets[0].data.shift();
    }
    myChart.update();
}

// 5. Lógica de Alertas
document.getElementById('set-alert-btn').addEventListener('click', () => {
    const coin = document.getElementById('alert-coin').value;
    const price = document.getElementById('target-price').value;
    
    if (price) {
        localStorage.setItem('activeAlert', JSON.stringify({ coin, price }));
        document.getElementById('alert-status').textContent = `Alerta fijada para ${coin.toUpperCase()} en $${price}`;
        alert('¡Alerta guardada!');
    }
});

function checkAlerts(data) {
    const savedAlert = JSON.parse(localStorage.getItem('activeAlert'));
    if (savedAlert) {
        const currentPrice = data[savedAlert.coin].usd;
        if (currentPrice >= savedAlert.price) {
            alert(`¡ALERTA! ${savedAlert.coin.toUpperCase()} ha alcanzado los $${savedAlert.price}`);
            localStorage.removeItem('activeAlert');
            document.getElementById('alert-status').textContent = 'No hay alertas activas';
        }
    }
}

// Inicializar todo
initChart();
fetchPrices();
setInterval(fetchPrices, 30000); // Actualizar cada 30 segundos

async function fetchNews() {
    const newsList = document.getElementById('news-list');
    try {
        // Usamos una fuente de noticias cripto pública
        const res = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        const data = await res.json();
        
        newsList.innerHTML = ''; // Limpiar el "Buscando..."
        
        data.Data.slice(0, 5).forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.innerHTML = `
                <h4 style="color: #00ffa3; font-size: 0.9rem;">${article.title}</h4>
                <p style="font-size: 0.75rem; color: #ccc;">${article.source}</p>
                <a href="${article.url}" target="_blank" style="color: #888; font-size: 0.7rem;">Leer más</a>
            `;
            newsList.appendChild(newsItem);
        });
    } catch (error) {
        newsList.innerHTML = '<p>No se pudieron cargar las noticias.</p>';
    }
}

// Llama a esta función al final del script
fetchNews();
