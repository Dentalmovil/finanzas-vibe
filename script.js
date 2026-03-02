//---LÓGICA DE PRECIOS Y GRÁFICA---
async function actualizarPrecios() {
    try {
        const res = await fetch('/api/get-prices');
        const data = await res.json();
        
        const balanceEl = document.getElementById('total-balance');

        // 1. Establecer Bitcoin como balance inicial al cargar
        if (balanceEl && !balanceEl.dataset.manual) {
            balanceEl.textContent = `$${data.bitcoin.usd.toLocaleString()}`;
        }

        const cryptoList = document.getElementById('crypto-list');
        if (!cryptoList) return;
        
        cryptoList.innerHTML = ''; 

        const coins = [
            { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
            { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
            { id: 'binancecoin', symbol: 'BNB', name: 'BNB', img: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
            { id: 'solana', symbol: 'SOL', name: 'Solana', img: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
            { id: 'ripple', symbol: 'XRP', name: 'XRP', img: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
            { id: 'usd-coin', symbol: 'USDC', name: 'USDC', img: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' }
        ];

        coins.forEach(coin => {
            if (data[coin.id]) {
                const price = data[coin.id].usd;
                const change = data[coin.id].usd_24h_change ? data[coin.id].usd_24h_change.toFixed(2) : "0.00";

                const card = document.createElement('div');
                card.className = 'asset-item';
                // Añadimos estilo de cursor pointer para que sepa que se puede clicar
                card.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#1e2329; padding:12px; border-radius:12px; margin-bottom:10px; border:1px solid #2b3139; cursor:pointer; transition: 0.2s;";
                
                card.innerHTML = `
                    <div style="display:flex; align-items:center; gap:10px; pointer-events: none;">
                        <img src="${coin.img}" style="width:24px; height:24px;">
                        <div>
                            <strong style="display:block; font-size:14px; color:#fff;">${coin.name}</strong>
                            <small style="color:#848e9c; font-size:11px;">${coin.symbol}</small>
                        </div>
                    </div>
                    <div style="text-align:right; pointer-events: none;">
                        <div style="font-weight:bold; font-size:14px; color:#fff;">$${price < 1.1 ? price.toFixed(4) : price.toLocaleString()}</div>
                        <small style="color: ${change >= 0 ? '#f7931a' : '#ff4d4d'}; font-size:11px;">
                            ${change >= 0 ? '▲' : '▼'} ${Math.abs(change)}%
                        </small>
                    </div>
                `;

                // --- LÓGICA DE CLIC PARA EL BALANCE ---
                card.addEventListener('click', () => {
                    // Marcamos que el usuario eligió una moneda manualmente
                    balanceEl.dataset.manual = "true"; 
                    
                    // Actualizamos el balance con el precio de la moneda clicada
                    const formattedPrice = price < 1.1 ? price.toFixed(4) : price.toLocaleString();
                    balanceEl.textContent = `$${formattedPrice}`;
                    
                    // Efecto visual de selección (opcional)
                    document.querySelectorAll('.asset-item').forEach(i => i.style.borderColor = '#2b3139');
                    card.style.borderColor = '#f7931a';
                });

                cryptoList.appendChild(card);
            }
        });

    } catch (error) {
        console.error("Error al obtener precios:", error);
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

