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
function crearGrafica() {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'], // Días
            datasets: [{
                label: 'Rendimiento Semanal',
                data: [12, 19, 15, 25, 22, 30, 45], // Datos de prueba
                borderColor: '#00ffcc', // El verde neón que elegimos
                backgroundColor: 'rgba(0, 255, 204, 0.1)',
                borderWidth: 3,
                tension: 0.4, // Esto hace que la línea sea curva y suave
                pointRadius: 0 // Oculta los puntos para que sea más limpia
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }, // Quitamos la leyenda
            scales: {
                x: { display: false }, // Ocultamos los ejes para estilo "Mini"
                y: { display: false }
            }
        }
    });
}

// Llama a la función al final de tu archivo
crearGrafica();

