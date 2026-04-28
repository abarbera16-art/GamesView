/* ==========================================
    MAIN.JS - MOTOR INTEGRAL GAMESVIEW V8.0
   ========================================== */

// 1. CONFIGURACIÓN ÚNICA DE LA BASE DE DATOS
const FIREBASE_URL = "https://gamesview-db-default-rtdb.firebaseio.com/reviews.json";

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Sistema GamesView cargado y conectado a Firebase.");

    // Cargar las reseñas que ya existen en la nube
    cargarResenas();

    // ==========================================
    // 2. GESTIÓN DEL FORMULARIO DE RESEÑAS
    // ==========================================
    const formResena = document.getElementById('form-resena');

    if (formResena) {
        formResena.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            console.log("🚀 Detectado click en el botón. Procesando envío...");

            // Capturamos los valores de los inputs de tu HTML
            const puntuacion = document.getElementById('rango').value;
            const texto = document.getElementById('texto-resena').value;

            // Creamos el objeto con los datos
            const nuevaResena = {
                juegoId: "nier_replicant",
                puntuacion: parseFloat(puntuacion),
                comentario: texto,
                fecha: new Date().toISOString()
            };

            // Llamamos a la función para subirlo a Firebase
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
            const items = document.querySelectorAll('.cyber-table tbody tr, .review-card-mini, .release-card, .meta-card');
            
            items.forEach(item => {
                item.style.display = item.innerText.toLowerCase().includes(term) ? "" : "none";
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
    // 5. CONTADORES ANIMADOS
    // ==========================================
    const scores = document.querySelectorAll('.count-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const end = parseFloat(target.innerText);
                let current = 0;
                const step = end / 50;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= end) {
                        target.innerText = end.toFixed(1);
                        clearInterval(timer);
                    } else {
                        target.innerText = current.toFixed(1);
                    }
                }, 30);
                observer.unobserve(target);
            }
        });
    });
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
            // Reseteamos el numerito del output a 5
            const output = formulario.querySelector('output[name="res"]');
            if (output) output.innerText = "5";
            
            // Recargamos la lista para ver la nueva reseña
            cargarResenas();
        } else {
            throw new Error("Error en la respuesta del servidor");
        }
    } catch (error) {
        console.error("Fallo al enviar:", error);
        alert("❌ Error: No se ha podido conectar con la base de datos.");
    }
}

// RECUPERAR DATOS (GET)
async function cargarResenas() {
    const contenedor = document.getElementById('contenedor-resenas');
    if (!contenedor) return;

    try {
        const respuesta = await fetch(FIREBASE_URL);
        const datos = await respuesta.json();

        // Mantenemos el título de la sección
        contenedor.innerHTML = '<h2 style="margin-top: 40px; border-bottom: 2px solid var(--neon-purple); padding-bottom: 10px; color: var(--neon-purple);">COMUNIDAD // DATALOGS</h2>';

        if (datos) {
            // Recorremos los datos de Firebase (del más nuevo al más viejo)
            Object.values(datos).reverse().forEach(res => {
                contenedor.innerHTML += `
                    <div class="meta-card" style="margin-bottom: 20px; padding: 20px; border-left: 5px solid var(--neon-blue); background: rgba(10, 10, 10, 0.7); border-radius: 4px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="background: var(--neon-blue); color: black; padding: 2px 10px; font-weight: bold; border-radius: 2px;">SCORE: ${res.puntuacion}</span>
                            <small style="color: #444;">${new Date(res.fecha).toLocaleDateString()}</small>
                        </div>
                        <p style="color: #e0e0e0; line-height: 1.6; font-style: italic;">"${res.comentario}"</p>
                    </div>
                `;
            });
        } else {
            contenedor.innerHTML += '<p style="color: #555; padding: 20px;">No hay registros previos en este terminal.</p>';
        }
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}