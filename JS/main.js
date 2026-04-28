/* ==========================================
   MAIN.JS - MOTOR INTEGRAL GAMESVIEW V6.0
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ 1. El motor JavaScript se ha cargado correctamente.");
// ==========================================
    // CAPTURA DE RESEÑAS
    // ==========================================
    const formResena = document.getElementById('form-resena');
    
    if (formResena) {
        formResena.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita la recarga de la página

            // Capturar valores
            const puntuacion = document.getElementById('rango').value;
            const texto = document.getElementById('texto-resena').value;

            // Construir el objeto JSON
            const nuevaResena = {
                juegoId: "nier_replicant", // Identificador único del juego
                puntuacion: parseFloat(puntuacion),
                comentario: texto,
                fecha: new Date().toISOString()
            };

            console.log("Procesando reseña...");
            await enviarResenaAGitHub(nuevaResena, formResena);
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



async function enviarResenaAGitHub(nuevaResenaObj, formularioElemento) {
    // REEMPLAZAR CON TUS DATOS EXACTOS
    const usuario = "TU_USUARIO_GITHUB";
    const repositorio = "TU_REPOSITORIO";
    const rutaArchivo = "ruta/al/archivo/reviews.json"; 
    const token = "TU_TOKEN_PAT"; // Pegar aquí el token de la Fase 1

    const urlApi = `https://api.github.com/repos/${usuario}/${repositorio}/contents/${rutaArchivo}`;
    
    const cabeceras = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    };

    try {
        // FASE 2: Obtener JSON actual
        const respuestaGet = await fetch(urlApi, { method: "GET", headers: cabeceras });
        
        if (!respuestaGet.ok) throw new Error("No se pudo leer el archivo de GitHub");
        
        const datosGithub = await respuestaGet.json();

        // FASE 3: Decodificar y modificar
        const jsonTextoActual = decodeURIComponent(escape(atob(datosGithub.content)));
        const listaResenas = JSON.parse(jsonTextoActual);

        // Añadir nuevo dato
        listaResenas.push(nuevaResenaObj);

        // Volver a codificar a Base64
        const nuevoJsonTexto = JSON.stringify(listaResenas, null, 2);
        const nuevoBase64 = btoa(unescape(encodeURIComponent(nuevoJsonTexto)));

        // FASE 4: Sobrescribir
        const cuerpoPeticion = JSON.stringify({
            message: `Nueva reseña añadida: ${nuevaResenaObj.juegoId}`,
            content: nuevoBase64,
            sha: datosGithub.sha
        });

        const respuestaPut = await fetch(urlApi, {
            method: "PUT",
            headers: cabeceras,
            body: cuerpoPeticion
        });

        if (respuestaPut.ok) {
            alert("✅ Reseña almacenada en la base de datos con éxito.");
            formularioElemento.reset(); // Limpia el formulario HTML
        } else {
            throw new Error("Fallo al escribir en GitHub");
        }

    } catch (error) {
        console.error("Error crítico en el protocolo de guardado:", error);
        alert("❌ Error de conexión con la base de datos.");
    }
}