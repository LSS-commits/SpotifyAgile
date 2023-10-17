
// afficher le vainqueur
function endGame(winnerName){
    const gameSection = document.querySelector(".game");
    const trophySection = document.querySelector(".trophy");
    const winner = document.querySelector(".bravo");

    winner.textContent = `Bravo ! ${winnerName} a remporté la partie en gagnant 5 points !`;
    trophySection.style.display = "block";
    gameSection.style.display = "none";
}


// Fonction pour créer un élément de lecteur HTML
function createPlayerElement(player, index) {

    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");

    const icon = document.createElement("p");
    icon.innerHTML = '<i class="fa-solid fa-music fa-bounce" style="color: #000000;"></i>';

    const playerName = document.createElement("p");
    playerName.textContent = `${player.name}`;

    // limite score
    const scoreLimit = 5;

    const scoreSpan = document.createElement("span");
    scoreSpan.id = `score${index + 1}`;
    scoreSpan.textContent = `Score: ${player.score}/${scoreLimit}`;

    playerDiv.appendChild(icon);
    playerDiv.appendChild(playerName);
    playerDiv.appendChild(scoreSpan);


    // Gestionnaire d'événements pour cliquer sur le joueur
    playerDiv.addEventListener("click", function() {
        // Mettre le player en pause
        const spotifyEmbedWindow = document.querySelector('iframe[src*="spotify.com/embed"]').contentWindow;
        spotifyEmbedWindow.postMessage({command: 'toggle'}, '*');
        

        // Réinitialise la couleur verte de tous les joueurs
        document.querySelectorAll('.player').forEach((p) => {
            p.classList.remove('selected');
        });

        // le joueur sélectionné devient vert
        playerDiv.classList.add("selected");

        let victoryIcon = document.createTextNode(" 🥳");
        playerName.appendChild(victoryIcon);

        // Incrémente le score du joueur sélectionné
        player.score += 1;
        scoreSpan.textContent = `Score: ${player.score}/${scoreLimit}`;
        

        // Fin du jeu si score = 5
        if (player.score >= scoreLimit) {
            endGame(player.name);
        } else {
            // Afficher le bouton "Suivant"
            document.getElementById("next-button").style.display = "block";
        }

    });

    return playerDiv;
}

// Fonction pour afficher les joueurs dans le conteneur
export function displayPlayers(playersArr) {
    const container = document.getElementById("container");

    // Créer dynamiquement des éléments de joueur
    playersArr.forEach((player, index) => {
        const playerDiv = createPlayerElement(player, index);
        container.appendChild(playerDiv);
    });
}

