/* ==========================================
   MAIN.JS - MOTOR INTEGRAL GAMESVIEW V6.0
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ 1. El motor JavaScript se ha cargado correctamente.");


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