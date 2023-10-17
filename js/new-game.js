import { getSongAndConfigurePlayer, showPlayer, showLoader } from "./main.js";
// import { getSongAndConfigurePlayer, showPlayer, showLoader } from "./test-main.js";

const nextButton = document.getElementById("next-button");

if (!nextButton) {
    throw new Exception("Bouton Nouvelle Partie non présent");
}

// Gestionnaire d'événements pour le bouton "Nouvelle partie"
nextButton.addEventListener("click", (e) => {
    e.preventDefault();

    // cacher le player et afficher l'animation
    showLoader();

    // Réinitialise la couleur verte de tous les joueurs
    document.querySelectorAll('.player').forEach((player) => {
        player.classList.remove('selected');
    });

    // changer le morceau
    getSongAndConfigurePlayer();

    // afficher le player
    setTimeout(showPlayer, 2000);

    // Masquer le bouton "Suivant"
    nextButton.style.display = "none";
})