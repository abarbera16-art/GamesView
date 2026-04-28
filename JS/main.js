/* ==========================================
   MAIN.JS - MOTOR INTEGRAL GAMESVIEW V6.0
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ 1. El motor JavaScript se ha cargado correctamente.");

    // ==========================================
    // 1. LÓGICA DE LA VENTANA MODAL (TRÁILERS)
    // ==========================================
    if (!document.getElementById('cyber-modal')) {
        const modalHTML = `
            <div id="cyber-modal">
                <div class="modal-content">
                    <button id="close-modal" class="close-btn">✖</button>
                    <video id="modal-video" controls>
                        <source src="" type="video/mp4">
                        Tu navegador no soporta vídeos.
                    </video>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log("✅ 2. Ventana Modal inyectada correctamente.");
    }

    const modal = document.getElementById('cyber-modal');
    const video = document.getElementById('modal-video');
    const closeBtn = document.getElementById('close-modal');
    const trailerButtons = document.querySelectorAll('.btn-trailer');

    console.log(`✅ 3. He encontrado ${trailerButtons.length} botones de tráiler.`);

    trailerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const videoSrc = button.getAttribute('data-video');
            console.log(`🎬 4. Intentando cargar el vídeo: ${videoSrc}`);
            
            if (videoSrc) {
                video.src = videoSrc;
                modal.classList.add('modal-visible');
                video.play().catch(err => console.error("❌ Error al reproducir:", err));
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('modal-visible');
        video.pause();
        video.currentTime = 0;
        console.log("⏹️ 5. Tráiler cerrado.");
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

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
    // 4. AUTO-CAROUSEL (Hero Section)
    // ==========================================
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        let scrollAmount = 0;
        setInterval(() => {
            scrollAmount += 400; // Salto de ancho de slide
            if (scrollAmount >= carousel.scrollWidth) scrollAmount = 0;
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }, 5000);
        console.log("✅ 8. Carrusel automático activado.");
    }

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