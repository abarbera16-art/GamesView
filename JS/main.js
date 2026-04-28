/* ==========================================
   MAIN.JS - MOTOR INTEGRAL GAMESVIEW V6.0
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ 1. El motor JavaScript se ha cargado correctamente.");
// ==========================================
    // CAPTURA DE RESEÑAS
    // ==========================================
    // ==========================================
// CAPTURA DE RESEÑAS (ACTUALIZADO A FIREBASE)
// ==========================================
const formResena = document.getElementById('form-resena');

if (formResena) {
    formResena.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const puntuacion = document.getElementById('rango').value;
        const texto = document.getElementById('texto-resena').value;

        const nuevaResena = {
            juegoId: "nier_replicant", 
            puntuacion: parseFloat(puntuacion),
            comentario: texto,
            fecha: new Date().toISOString()
        };

        // CAMBIO CLAVE: Ahora llamamos a la función de Firebase
        await enviarResena(nuevaResena, formResena);
    });
}
    // ==========================================
    // 2. SISTEMA DE ACCESIBILIDAD (PERSISTENCIA)
    // ==========================================
    const ajustesAccesibilidad = [
        { idBoton: '#acc-contraste', claveStorage: 'pref-contraste' },
        { idBoton: '#acc-dislexia', claveStorage: 'pref-dislexia' },
        { idBoton: '#acc-texto', claveStorage: 'pref-texto' },
        { idBoton: '#acc-subtitulos', claveStorage: 'pref-subtitulos' } // Recuperado
    ];

    function gestionarPersistencia(ajuste) {
        const input = document.querySelector(ajuste.idBoton);
        if (!input) return;

        // Recuperar estado guardado
        if (localStorage.getItem(ajuste.claveStorage) === 'activado') {
            input.checked = true;
        }

        // Guardar cambios
        input.addEventListener('change', (evento) => {
            const estado = evento.target.checked ? 'activado' : 'desactivado';
            localStorage.setItem(ajuste.claveStorage, estado);
        });
    }

    ajustesAccesibilidad.forEach(gestionarPersistencia);
    console.log("✅ 6. Persistencia de accesibilidad cargada.");

    // ==========================================
    // 3. BUSCADOR EN TIEMPO REAL (FILTRADO TOTAL)
    // ==========================================
    const searchInput = document.getElementById('main-search');
    const itemsToFilter = document.querySelectorAll('.cyber-table tbody tr, .review-card-mini, .release-card, .meta-card, .news-list-item');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            
            itemsToFilter.forEach(item => {
                const text = item.innerText.toLowerCase();
                if (text.includes(term)) {
                    item.style.display = ""; 
                    item.style.opacity = "1";
                } else {
                    item.style.display = "none";
                }
            });
        });
        console.log("✅ 7. Buscador vinculado a todos los elementos.");
    }

    // ==========================================

    // ==========================================
    // 5. CONTADOR ANIMADO (Scores)
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
    console.log("✅ 9. Sistema de contadores listo.");
});

// URL de tu base de datos (¡No olvides el /reviews.json al final!)
const FIREBASE_URL = "https://gamesview-db-default-rtdb.firebaseio.com/reviews.json";

// 1. FUNCIÓN PARA ENVIAR (POST)
async function enviarResena(resena, formulario) {
    try {
        const respuesta = await fetch(FIREBASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resena)
        });

        if (respuesta.ok) {
            alert("✅ Reseña guardada en la base de datos.");
            formulario.reset();
            cargarResenas(); // Esto refresca la lista automáticamente
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión con Firebase.");
    }
}

// 2. FUNCIÓN PARA MOSTRAR (GET)
async function cargarResenas() {
    const contenedor = document.getElementById('contenedor-resenas');
    if (!contenedor) return;

    try {
        const respuesta = await fetch(FIREBASE_URL);
        const datos = await respuesta.json();
        contenedor.innerHTML = ""; 

        if (datos) {
            Object.values(datos).reverse().forEach(res => {
                contenedor.innerHTML += `
                    <div class="meta-card" style="margin-bottom: 15px; padding: 15px; border-left: 3px solid #bc13fe;">
                        <p><strong>Puntuación:</strong> ${res.puntuacion}/10</p>
                        <p>${res.comentario}</p>
                        <small style="color: #555;">${new Date(res.fecha).toLocaleString()}</small>
                    </div>`;
            });
        }
    } catch (e) { console.error("Error al cargar:", e); }
}
