// ==UserScript==
// @name         Script Unificado para YouLikeHits y StayFocusd
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Monitorea y maneja ventanas en YouLikeHits y cierra ventanas emergentes de StayFocusd
// @match        https://www.youlikehits.com/viewwebsite.php*
// @match        https://www.youlikehits.com/youtubenew2.php
// @match        https://www.youlikehits.com/websites.php
// @match        https://www.stayfocusd.com/blocked*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ================================
    // Sección 1: Auto-cierre en YouLikeHits
    // ================================
    function checkYouLikeHitsPage() {
        const phrases = [
            "We couldn't locate the website you're attempting to visit.",
            "You got"
        ];

        for (const phrase of phrases) {
            if (document.body.innerText.includes(phrase)) {
                // Redirige a about:blank
                window.location.href = 'about:blank';
                // Intenta cerrar la pestaña inmediatamente después
                setTimeout(() => window.close(), 0); // Tiempo de espera de 0 para cerrar de inmediato
                break;
            }
        }
    }

    // Usar un observador de mutaciones para detectar cambios en el contenido de YouLikeHits
    const youLikeHitsObserver = new MutationObserver(checkYouLikeHitsPage);
    youLikeHitsObserver.observe(document.body, { childList: true, subtree: true });

    // Ejecuta la verificación inicial en YouLikeHits
    checkYouLikeHitsPage();

    // ================================
    // Sección 2: Actualizar página YouLikeHits al detectar texto
    // ================================
    function checkYouLikeHitsTextUpdate() {
        const targetTexts = [
            "There are no videos available to view at this time. Try coming back or refreshing.",
            "YouTube Limit\nYou have hit your Views Limit per 15 minutes. This limit is in place to ensure the best possible experience. You can still use YouTube Likes/Subscribers sections but you must wait 15 minutes until you can do Views again.",
            "There are no Websites currently visitable for Points.",
            "You have hit your Views Limit per 15 minutes. This limit is in place to ensure the best possible experience. You can still use YouTube Likes/Subscribers sections but you must wait 2 minutes until you can do Views again."
        ];

        for (let text of targetTexts) {
            if (document.body.textContent.includes(text)) {
                // Si encuentra uno de los textos, actualiza la página automáticamente
                location.reload();
                break;
            }
        }
    }

    // Monitorea el contenido de YouLikeHits cada 1.5 segundos
    setInterval(checkYouLikeHitsTextUpdate, 1500);

    // ================================
    // Sección 3: Cerrar ventanas emergentes de StayFocusd
    // ================================
    function closeStayFocusdWindows() {
        const popups = document.querySelectorAll('div.popup'); // Ajustar según el selector correcto
        popups.forEach(popup => {
            if (popup.textContent.includes("YouTube")) { // Ajustar según el contenido específico
                popup.style.display = 'none'; // Oculta la ventana emergente
            }
        });
    }

    // Usar un observador de mutaciones para detectar nuevas ventanas emergentes en StayFocusd
    const stayFocusdObserver = new MutationObserver(closeStayFocusdWindows);
    stayFocusdObserver.observe(document.body, { childList: true, subtree: true });

    // Ejecuta la función para cerrar ventanas emergentes al cargar
    closeStayFocusdWindows();

})();