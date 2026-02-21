// --- LÓGICA DE PRECIOS Y GRÁFICA ---
async function actualizarPrecios() {
    try {
        const res = await fetch('/api/get-prices');
        const data = await res.json();
        
        // 1. Actualizar Balance Principal
        const btcPrice = data.bitcoin.usd;
        document.getElementById('total-balance').textContent = `$${btcPrice.toLocaleString()}`;

        // 2. Lista de Criptos con Logotipos
        const cryptoList = document.getElementById('crypto-list');
        cryptoList.innerHTML = '';

        const coins = [
            { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
            { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
            { id: 'solana', symbol: 'SOL', name: 'Solana', img: 'https://cryptologos.cc/logos/solana-sol-logo.png' }
        ];

        coins.forEach(coin => {
            const price = data[coin.id].usd;
            const change = data[coin.id].usd_24h_change.toFixed(2);
            
            const card = document.createElement('div');
            card.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#1e2329; padding:12px; border-radius:12px; margin-bottom:10px; border:1px solid #2b3139;";
            
            card.innerHTML = `
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${coin.img}" alt="${coin.name}" style="width:32px; height:32px;">
                    <div>
                        <strong style="display:block; font-size:14px;">${coin.name}</strong>
                        <small style="color:#848e9c; font-size:12px;">${coin.symbol}</small>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:bold; font-size:14px;">$${price.toLocaleString()}</div>
                    <small style="color: ${change >= 0 ? '#00ffcc' : '#ff4d4d'}; font-size:12px;">
                        ${change >= 0 ? '+' : ''}${change}%
                    </small>
                </div>
            `;
            cryptoList.appendChild(card);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}



// --- LÓGICA DE NOTICIAS ---
async function obtenerNoticias() {
    const newsList = document.getElementById('news-list');
    if (!newsList) return;

    // Mostrar spinner mientras carga
    newsList.innerHTML = `
        <div class="spinner"></div>
        <p id="loading-text">Buscando las últimas noticias...</p>
    `;

    try {
        const res = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        const data = await res.json();
        
        newsList.innerHTML = ''; // Limpiar cargando

        data.Data.slice(0, 5).forEach(noticia => {
            const item = document.createElement('div');
            item.className = 'news-item';
            item.innerHTML = `
                <a href="${noticia.url}" target="_blank" style="text-decoration:none; color:inherit;">
                    <h4 style="color:#00ffcc; margin-bottom:5px;">${noticia.title}</h4>
                    <small style="color:#848e9c;">${noticia.source} • Cripto News</small>
                </a>
                <hr style="border:0; border-top:1px solid #2b3139; margin:10px 0;">
            `;
            newsList.appendChild(item);
        });
    } catch (error) {
        newsList.innerHTML = '<p>No se pudieron cargar las noticias.</p>';
    }
}

// --- LÓGICA DE NAVEGACIÓN (Corregida) ---
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.app-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // CORRECCIÓN: Obtener el valor de data-target correctamente
        const targetId = item.getAttribute('data-target');

        // 1. Cambiar estado visual de los iconos
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // 2. Ocultar todas las secciones
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // 3. Mostrar la sección seleccionada
        const selectedSection = document.getElementById(targetId);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }

        // 4. Cargar noticias solo si se entra a esa sección
        if (targetId === 'view-news') {
            obtenerNoticias();
        }
    });
});

// Inicializar la App
actualizarPrecios();
setInterval(actualizarPrecios, 30000); // Actualizar cada 30 segundos

// Variables globales para la alerta
let precioObjetivo = null;

// 1. Función para establecer la alerta
document.getElementById('set-alert-btn').addEventListener('click', () => {
    const input = document.getElementById('target-price');
    const valor = parseFloat(input.value);

    if (valor > 0) {
        precioObjetivo = valor;
        document.getElementById('alert-status').innerHTML = `🔔 Alerta activa para BTC a: <strong>$${precioObjetivo.toLocaleString()}</strong>`;
        document.getElementById('alert-status').style.color = "#00ffcc";
        
        // Guardar en el navegador para que no se borre al recargar
        localStorage.setItem('alertaBTC', precioObjetivo);
        alert("¡Alerta programada!");
    } else {
        alert("Por favor, ingresa un precio válido.");
    }
});

// 2. Modifica tu función actualizarPrecios para que revise la alerta
async function actualizarPrecios() {
    try {
        const res = await fetch('/api/get-prices');
        const data = await res.json();
        
        const btcPrice = data.bitcoin.usd;
        document.getElementById('total-balance').textContent = `$${btcPrice.toLocaleString()}`;

        // --- LÓGICA DE VERIFICACIÓN DE ALERTA ---
        // Recuperar alerta guardada si existe
        const alertaGuardada = localStorage.getItem('alertaBTC');
        if (alertaGuardada) precioObjetivo = parseFloat(alertaGuardada);

        if (precioObjetivo) {
            // Si el precio de BTC cruza tu objetivo (hacia arriba o hacia abajo)
            if (btcPrice >= precioObjetivo) {
                enviarNotificacionVisual(`¡BTC ha alcanzado tu objetivo de $${precioObjetivo}!`);
                // Opcional: limpiar alerta después de que suene
                // precioObjetivo = null;
                // localStorage.removeItem('alertaBTC');
            }
        }
        // ---------------------------------------

        // (Aquí sigue el resto de tu código de la lista de criptos...)
    } catch (error) {
        console.error("Error:", error);
    }
}

// 3. Función para mostrar el aviso en pantalla
function enviarNotificacionVisual(mensaje) {
    const status = document.getElementById('alert-status');
    status.innerHTML = `🚀 <strong>${mensaje}</strong>`;
    status.style.color = "#ff4d4d";
    
    // Si el usuario permite notificaciones del navegador
    if (Notification.permission === "granted") {
        new Notification("Alerta de Finanzas Vibe", { body: mensaje });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}


