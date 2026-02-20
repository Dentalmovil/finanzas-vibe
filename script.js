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
