async function actualizarPrecios() {
    try {
        const respuesta = await fetch('/api/get-prices');
        const datos = await respuesta.json();

        const lista = document.getElementById('crypto-list');
        lista.innerHTML = ''; // Limpiamos el "Cargando..."

        // Creamos las tarjetas para cada moneda
        const monedas = [
            { id: 'bitcoin', nombre: 'Bitcoin', simbolo: 'BTC', color: '#f3ba2f' },
            { id: 'ethereum', nombre: 'Ethereum', simbolo: 'ETH', color: '#627eea' },
            { id: 'solana', nombre: 'Solana', simbolo: 'SOL', color: '#14f195' }
        ];

        monedas.forEach(m => {
            const precio = datos[m.id].usd;
            const cambio = datos[m.id].usd_24h_change.toFixed(2);
            const claseCambio = cambio >= 0 ? 'up' : 'down';

            lista.innerHTML += `
                <div class="asset-item" style="border-left-color: ${m.color}">
                    <div>
                        <strong>${m.nombre}</strong>
                        <small>${m.simbolo}</small>
                    </div>
                    <div style="text-align: right">
                        <div>$${precio.toLocaleString()}</div>
                        <span class="${claseCambio}">${cambio}%</span>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error cargando precios:", error);
    }
}

// Ejecutar al cargar la página
actualizarPrecios();
let miGrafica; // Variable global para poder actualizarla

function actualizarGrafica(datosCripto) {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    // Usamos el cambio de Bitcoin como referencia para el color general
    const cambio24h = datosCripto.bitcoin.usd_24h_change;
    const esPositivo = cambio24h >= 0;
    const colorPrincipal = esPositivo ? '#00ffcc' : '#ff4444';
    const colorFondo = esPositivo ? 'rgba(0, 255, 204, 0.1)' : 'rgba(255, 68, 68, 0.1)';

    // Si la gráfica ya existe, la destruimos para crear la nueva con nuevos datos
    if (miGrafica) {
        miGrafica.destroy();
    }

    miGrafica = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['6h ago', '4h ago', '2h ago', 'Ahora'], 
            datasets: [{
                data: [
                    datosCripto.bitcoin.usd * 0.98, // Simulación de tendencia
                    datosCripto.bitcoin.usd * 0.99,
                    datosCripto.bitcoin.usd * 0.97,
                    datosCripto.bitcoin.usd
                ],
                borderColor: colorPrincipal,
                backgroundColor: colorFondo,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
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

// Modifica tu función principal para que llame a la gráfica
async function actualizarPrecios() {
    try {
        const respuesta = await fetch('/api/get-prices');
        const datos = await respuesta.json();

        // ... (aquí va tu código anterior que llena la lista de criptos)

        // Llamamos a la nueva gráfica con los datos reales
        actualizarGrafica(datos);

    } catch (error) {
        console.error("Error:", error);
    }
}
// 1. Recuperar alerta guardada al iniciar
let precioObjetivo = localStorage.getItem('btc_alert_price');

if (precioObjetivo) {
    document.getElementById('alert-status').innerText = `Vigilando BTC a $${precioObjetivo}`;
    document.getElementById('alert-status').style.color = "#00ffcc";
}

// 2. Configurar el botón para guardar permanentemente
document.getElementById('set-alert-btn').addEventListener('click', () => {
    const valor = document.getElementById('target-price').value;
    if (valor) {
        precioObjetivo = parseFloat(valor);
        localStorage.setItem('btc_alert_price', precioObjetivo); // Guarda en el navegador

        document.getElementById('alert-status').innerText = `Vigilando BTC a $${precioObjetivo}`;
        document.getElementById('alert-status').style.color = "#00ffcc";
    }
});

    const valor = document.getElementById('target-price').value;
    if (valor) {
        precioObjetivo = parseFloat(valor);
        document.getElementById('alert-status').innerText = `Vigilando BTC a $${precioObjetivo}`;
        document.getElementById('alert-status').style.color = "#00ffcc";
    }
});

// Dentro de tu función actualizarPrecios, añade esto al final:
function revisarAlerta(precioActual) {
    const tarjeta = document.querySelector('.balance-card');
    
    if (precioObjetivo && precioActual >= precioObjetivo) {
        tarjeta.classList.add('alert-active');
        // Opcional: Sonido de alerta
        // alert("🎯 ¡Bitcoin alcanzó tu objetivo!");
        document.getElementById('alert-status').innerText = "¡OBJETIVO ALCANZADO! 🚀";
    } else {
        tarjeta.classList.remove('alert-active');
    }
}


