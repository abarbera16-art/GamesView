/* ==========================================
    MAIN.JS - MOTOR INTEGRAL GAMESVIEW V9.0
    ESTADO: COMPLETO - CON COLORES EDITADOS
   ========================================== */

// 1. CONFIGURACIÓN ÚNICA DE LA BASE DE DATOS
const FIREBASE_URL = "https://gamesview-db-default-rtdb.firebaseio.com/reviews.json";

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Sistema GamesView cargado y conectado a Firebase.");

    // Cargar las reseñas que ya existen en la nube nada más empezar
    cargarResenas();

    // ==========================================
    // 2. GESTIÓN DEL FORMULARIO DE RESEÑAS
    // ==========================================
    const formResena = document.getElementById('form-resena');

    if (formResena) {
        formResena.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            console.log("🚀 Detectado click en el botón. Procesando envío...");

            const puntuacion = document.getElementById('rango').value;
            const texto = document.getElementById('texto-resena').value;

            const nuevaResena = {
                juegoId: "nier_replicant",
                puntuacion: parseFloat(puntuacion),
                comentario: texto,
                fecha: new Date().toISOString()
            };

            await enviarResena(nuevaResena, formResena);
        });
    }

    // ==========================================
    // 3. BUSCADOR EN TIEMPO REAL
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
    // 4. ACCESIBILIDAD Y PERSISTENCIA
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
    // 5. CONTADORES ANIMADOS (Scores)
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
});

/* ==========================================
    FUNCIONES DE COMUNICACIÓN CON FIREBASE
   ========================================== */

// ENVIAR DATOS (POST)
async function enviarResena(resena, formulario) {
    try {
        const respuesta = await fetch(FIREBASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resena)
        });

        if (respuesta.ok) {
            alert("✅ ¡Enviado! Tu reseña ya está en la base de datos.");
            formulario.reset();
            const output = formulario.querySelector('output[name="res"]');
            if (output) output.innerText = "5";
            
            cargarResenas(); // Recarga la lista para que aparezca la nueva
        } else {
            throw new Error("Error en la respuesta del servidor");
        }
    } catch (error) {
        console.error("Fallo al enviar:", error);
        alert("❌ Error: No se ha podido conectar con la base de datos.");
    }
}

// RECUPERAR DATOS Y PINTARLOS (GET)
async function cargarResenas() {
    const contenedor = document.getElementById('contenedor-resenas');
    if (!contenedor) return;

    try {
        const respuesta = await fetch(FIREBASE_URL);
        const datos = await respuesta.json();

        // Título de la sección (He puesto el color Púrpura Neón)
        contenedor.innerHTML = '<h2 style="margin-top: 40px; border-bottom: 2px solid #bc13fe; padding-bottom: 10px; color: #bc13fe; text-transform: uppercase;">COMUNIDAD // DATALOGS</h2>';

        if (datos) {
            // Recorremos los datos de Firebase (del más nuevo al más viejo)
            Object.values(datos).reverse().forEach(res => {
                contenedor.innerHTML += `
                    <div class="meta-card" style="margin-bottom: 20px; padding: 20px; border-left: 5px solid #00f3ff; background: rgba(0, 0, 0, 0.85); border-radius: 4px; box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            
                            <span style="background: #00f3ff; color: #000000; padding: 3px 12px; font-weight: bold; border-radius: 2px; font-family: monospace;">
                                SCORE: ${res.puntuacion}
                            </span>
                            
                            <small style="color: #00f3ff; font-family: monospace; letter-spacing: 1px;">
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
            contenedor.innerHTML += '<p style="color: #666; padding: 20px;">No hay registros previos en este terminal.</p>';
        }
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}