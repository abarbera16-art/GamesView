/* ==========================================
    MAIN.JS - MOTOR INTEGRAL GAMESVIEW V10.0
    ESTADO: MULTI-JUEGO INTELIGENTE + COLORES
   ========================================== */

// 1. CONFIGURACIÓN BASE DE LA BASE DE DATOS
const FIREBASE_BASE_URL = "https://gamesview-db-default-rtdb.firebaseio.com/reviews";

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Sistema GamesView v10.0 iniciado.");

    // Detectamos el formulario y el ID del juego actual
    const formResena = document.getElementById('form-resena');
    const gameId = formResena ? formResena.getAttribute('data-game') : null;

    if (gameId) {
        console.log(`🎮 Cargando base de datos para: ${gameId}`);
        cargarResenas(gameId);

        formResena.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log("🚀 Enviando reporte a la base de datos...");

            const puntuacion = document.getElementById('rango').value;
            const texto = document.getElementById('texto-resena').value;

            const nuevaResena = {
                puntuacion: parseFloat(puntuacion),
                comentario: texto,
                fecha: new Date().toISOString()
            };

            await enviarResena(gameId, nuevaResena, formResena);
        });
    }

    // ==========================================
    // 2. BUSCADOR EN TIEMPO REAL
    // ==========================================
    const searchInput = document.getElementById('main-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.cyber-table tbody tr, .review-card-mini, .release-card, .meta-card, .news-list-item');
            
            items.forEach(item => {
                const text = item.innerText.toLowerCase();
                item.style.display = text.includes(term) ? "" : "none";
            });
        });
    }

    // ==========================================
    // 3. ACCESIBILIDAD Y PERSISTENCIA
    // ==========================================
    const ajustes = [
        { id: '#acc-contraste', clave: 'pref-contraste' },
        { id: '#acc-dislexia', clave: 'pref-dislexia' },
        { id: '#acc-texto', clave: 'pref-texto' },
        { id: '#acc-subtitulos', clave: 'pref-subtitulos' }
    ];

    ajustes.forEach(ajuste => {
        const input = document.querySelector(ajuste.id);
        if (!input) return;

        if (localStorage.getItem(ajuste.clave) === 'activado') input.checked = true;

        input.addEventListener('change', (e) => {
            localStorage.setItem(ajuste.clave, e.target.checked ? 'activado' : 'desactivado');
        });
    });

    // ==========================================
    // 4. CONTADORES ANIMADOS (Scores)
    // ==========================================
    const scores = document.querySelectorAll('.count-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseFloat(target.innerText);
                let startValue = 0;
                const duration = 1500;
                const stepTime = 20;
                const increment = endValue / (duration / stepTime);

                const timer = setInterval(() => {
                    startValue += increment;
                    if (startValue >= endValue) {
                        target.innerText = endValue.toFixed(1);
                        clearInterval(timer);
                    } else {
                        target.innerText = startValue.toFixed(1);
                    }
                }, stepTime);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    scores.forEach(s => observer.observe(s));

    // ==========================================
    // 5. CONTROL DEL POP-UP DE VÍDEO (NUEVO)
    // ==========================================
    const modal = document.getElementById('modal-trailer');
    const videoPlayer = document.getElementById('video-player');
    const closeBtn = document.querySelector('.close-modal');

    if(modal && videoPlayer) {
        // Al hacer clic en los botones de tráiler
        document.querySelectorAll('.btn-trailer').forEach(boton => {
            boton.addEventListener('click', () => {
                const rutaVideo = boton.getAttribute('data-video');
                videoPlayer.src = rutaVideo;
                modal.style.display = 'block';
                videoPlayer.play();
            });
        });

        // Función para cerrar
        const cerrarModal = () => {
            modal.style.display = 'none';
            videoPlayer.pause();
            videoPlayer.src = ""; 
        };

        // Cerrar al darle a la X
        if (closeBtn) closeBtn.addEventListener('click', cerrarModal);

        // Cerrar al hacer clic fuera del vídeo
        window.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
    }
});

/* ==========================================
    FUNCIONES DE COMUNICACIÓN CON FIREBASE
   ========================================== */

// ENVIAR DATOS (POST) - Ahora usa gameId para la ruta
async function enviarResena(gameId, resena, formulario) {
    try {
        const url = `${FIREBASE_BASE_URL}/${gameId}.json`;
        const respuesta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resena)
        });

        if (respuesta.ok) {
            alert("✅ ¡Enviado! Tu reseña se ha guardado en el sector correspondiente.");
            formulario.reset();
            const output = formulario.querySelector('output[name="res"]');
            if (output) output.innerText = "5";
            
            cargarResenas(gameId);
        } else {
            throw new Error("Error en la respuesta del servidor");
        }
    } catch (error) {
        console.error("Fallo al enviar:", error);
        alert("❌ Error: No se ha podido conectar con el terminal de datos.");
    }
}

// RECUPERAR DATOS Y PINTARLOS (GET) - Filtrado por gameId
async function cargarResenas(gameId) {
    const contenedor = document.getElementById('contenedor-resenas');
    if (!contenedor) return;

    try {
        const url = `${FIREBASE_BASE_URL}/${gameId}.json`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        // Título con color Púrpura Neón
        contenedor.innerHTML = '<h2 style="margin-top: 40px; border-bottom: 2px solid #bc13fe; padding-bottom: 10px; color: #bc13fe; text-transform: uppercase;">COMUNIDAD // DATALOGS</h2>';

        if (datos) {
            Object.values(datos).reverse().forEach(res => {
                contenedor.innerHTML += `
                    <div class="meta-card" style="margin-bottom: 20px; padding: 20px; border-left: 5px solid #00f3ff; background: rgba(0, 0, 0, 0.85); border-radius: 4px; box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            
                            <span style="background: #00f3ff; color: #000000; padding: 3px 12px; font-weight: bold; border-radius: 2px; font-family: monospace;">
                                SCORE: ${res.puntuacion}
                            </span>
                            
                            <small style="color: #00f3ff; font-family: monospace;">
                                ${new Date(res.fecha).toLocaleDateString()}
                            </small>
                        </div>

                        <p style="color: #ffffff; line-height: 1.6; font-size: 1.1em; font-weight: 300; margin: 0;">
                            "${res.comentario}"
                        </p>
                    </div>
                `;
            });
        } else {
            contenedor.innerHTML += '<p style="color: #666; padding: 20px;">No hay transmisiones para este sector todavía.</p>';
        }
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}
