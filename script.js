// --- LÓGICA DE PRECIOS Y GRÁFICA ---
async function actualizarPrecios() {
    try {
        const res = await fetch('/api/get-prices');
        const data = await res.json();
        
        // Actualizar balance (ejemplo con BTC)
        const btcPrice = data.bitcoin.usd;
        document.getElementById('total-balance').textContent = 
            `$${btcPrice.toLocaleString()}`;

        // Lógica para actualizar tu gráfica aquí...
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

