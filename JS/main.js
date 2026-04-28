/* ==========================================
    MAIN.JS - MOTOR INTEGRAL GAMESVIEW V7.0
   ========================================== */

// 1. CONFIGURACIÓN GLOBAL
const FIREBASE_URL = "https://gamesview-db-default-rtdb.firebaseio.com/reviews.json";

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Motor JavaScript iniciado correctamente.");

    // CARGAR RESEÑAS AL INICIAR
    cargarResenas();

    // ==========================================
    // 2. CAPTURA DE RESEÑAS (FIREBASE)
    // ==========================================
    const formResena = document.getElementById('form-resena');

    if (formResena) {
        formResena.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("🚀 Enviando reseña a Firebase...");

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
    // 3. SISTEMA DE ACCESIBILIDAD
    // ==========================================
    const ajustesAccesibilidad = [
        { idBoton: '#acc-contraste', claveStorage: 'pref-contraste' },
        { idBoton: '#acc-dislexia', claveStorage: 'pref-dislexia' },
        { idBoton: '#acc-texto', claveStorage: 'pref-texto' },
        { idBoton: '#acc-subtitulos', claveStorage: 'pref-subtitulos' }
    ];

    ajustesAccesibilidad.forEach(ajuste => {
        const input = document.querySelector(ajuste.idBoton);
        if (!input) return;

        if (localStorage.getItem(ajuste.claveStorage) === 'activado') {
            input.checked = true;
        }

        input.addEventListener('change', (evento) => {
            const estado = evento.target.checked ? 'activado' : 'desactivado';
            localStorage.setItem(ajuste.claveStorage, estado);
        });
    });

    // ==========================================
    // 4. BUSCADOR EN TIEMPO REAL
    // ==========================================
    const searchInput = document.getElementById('main-search');
    const itemsToFilter = document.querySelectorAll('.cyber-table tbody tr, .review-card-mini, .release-card, .meta-card, .news-list-item');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            itemsToFilter.forEach(item => {
                const text = item.innerText.toLowerCase();
                item.style.display = text.includes(term) ? "" : "none";
            });
        });
    }

    // ==========================================
    // 5. CONTADORES ANIMADOS
    // ==========================================
    const scores = document.querySelectorAll('.count-up');
    const scoreObserver = new IntersectionObserver((entries) => {
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
                scoreObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    scores.forEach(score => scoreObserver.observe(score));
});

/* ==========================================
    FUNCIONES DE COMUNICACIÓN (FIREBASE)
   ========================================== */

// FUNCIÓN PARA ENVIAR (POST)
async function enviarResena(resena, formulario) {
    try {
        const respuesta = await fetch(FIREBASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resena)
        });

        if (respuesta.ok) {
            alert("✅ Reseña guardada con éxito.");
            formulario.reset();
            document.getElementsByName('res')[0].innerText = "5"; // Resetea el numerito del output
            cargarResenas(); // Recarga la lista inmediatamente
        }
    } catch (error) {
        console.error("Error al enviar:", error);
        alert("❌ Error de conexión con la base de datos.");
    }
}

// FUNCIÓN PARA CARGAR Y MOSTRAR (GET)
async function cargarResenas() {
    const contenedor = document.getElementById('contenedor-resenas');
    if (!contenedor) return;

    try {
        const respuesta = await fetch(FIREBASE_URL);
        const datos = await respuesta.json();
        
        // Limpiamos el contenedor pero mantenemos el título si lo pusiste fuera
        contenedor.innerHTML = '<h2 style="margin-top: 40px; border-bottom: 1px solid #bc13fe; padding-bottom: 10px;">COMUNIDAD // DATALOGS</h2>'; 

        if (datos) {
            // Convertimos el objeto de Firebase a array y le damos la vuelta para ver lo más nuevo primero
            Object.values(datos).reverse().forEach(res => {
                contenedor.innerHTML += `
                    <div class="meta-card" style="margin-bottom: 15px; padding: 15px; border-left: 3px solid #bc13fe; background: rgba(20,20,20,0.5);">
                        <p style="color: #bc13fe; font-weight: bold; margin-bottom: 5px;">PUNTUACIÓN: ${res.puntuacion}/10</p>
                        <p style="color: #fff; margin-bottom: 10px;">${res.comentario}</p>
                        <small style="color: #666; font-size: 0.8em;">${new Date(res.fecha).toLocaleString()}</small>
                    </div>`;
            });
        } else {
            contenedor.innerHTML += '<p style="color: #666; padding: 20px;">Aún no hay reseñas. ¡Sé el primero!</p>';
        }
    } catch (e) { 
        console.error("Error al cargar reseñas:", e); 
    }
}