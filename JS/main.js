/* ==========================================
   MAIN.JS - MOTOR CON SISTEMA DE DEBUGGING
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ 1. El motor JavaScript se ha cargado correctamente.");

    // INYECTAR EL MODAL SOLO SI NO EXISTE YA
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
        console.log("✅ 2. Ventana Modal inyectada oculta en el HTML.");
    }

    const modal = document.getElementById('cyber-modal');
    const video = document.getElementById('modal-video');
    const closeBtn = document.getElementById('close-modal');
    const trailerButtons = document.querySelectorAll('.btn-trailer');

    console.log(`✅ 3. He encontrado ${trailerButtons.length} botones de tráiler en esta página.`);

    // FUNCIÓN PARA ABRIR
    trailerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            const videoSrc = button.getAttribute('data-video');
            console.log(`🎬 4. Has hecho clic. Intentando cargar el vídeo: ${videoSrc}`);
            
            if (videoSrc) {
                video.src = videoSrc;
                modal.classList.add('modal-visible'); // Añadimos la clase que lo muestra
                
                // Intentamos reproducir el vídeo, si falla nos avisa
                video.play().catch(err => console.error("❌ Error al reproducir el vídeo:", err));
            } else {
                console.error("❌ Error: Este botón no tiene ruta en 'data-video'.");
            }
        });
    });

    // FUNCIÓN PARA CERRAR
    const closeModal = () => {
        modal.classList.remove('modal-visible'); // Quitamos la clase para ocultarlo
        video.pause();
        video.currentTime = 0;
        console.log("⏹️ 5. Tráiler cerrado y rebobinado.");
    };

    // Al hacer clic en la X
    closeBtn.addEventListener('click', closeModal);

    // Al hacer clic en el fondo negro
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});