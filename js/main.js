import { apiData } from "./api.js";
import { displayPlayers } from "./game.js";

// animation d'attente puis affichage du player
const spotifyPlayer = document.getElementById("spotifyPlayer");
const loaderContainer = document.querySelector(".loaderContainer");

export function showPlayer () {
    loaderContainer.style.visibility = "hidden";
    spotifyPlayer.style.visibility = "visible";
}
export function showLoader () {
  loaderContainer.style.visibility = "visible";
  spotifyPlayer.style.visibility = "hidden";
}



// récupérer données du morceau pour configurer le player
export async function getSongAndConfigurePlayer() {

  // récupérer les données du morceau
  const trackInfos = await apiData();

  // passer l'url du morceau dans le src de l'iframe
  spotifyPlayer.setAttribute("src", trackInfos.player_src);
}

// récupérer et stocker les joueurs au clic sur le bouton ajouter
function initializeStartPlayers() {
  const playerForm = document.getElementById("playerForm");
  const playerInput = document.getElementById("player");
  const displayPlayersElement = document.getElementById("displayPlayers");
  const addBtn = document.getElementById("addBtn");
  const startBtn = document.getElementById("startBtn");
  const formError = document.getElementById("formError");

  let playersList = [];
  let counter = 0;

  if (!addBtn) {
    throw new Exception("Bouton Ajouter non présent");
  }

  // ajouter un joueur à la liste et l'afficher
  addBtn.addEventListener("click", (e) => {
    // empêcher le rechargement de la page
    e.preventDefault();

    // afficher un message d'erreur si le champ est vide ou ne contient que des espaces
    if (playerInput.value.match(/^\s*$/)) {

      formError.style.display = "block";
      
      // vider le formulaire
      playerForm.reset();
      
    }else{

      // retirer l'éventuel ancien message d'erreur
      formError.style.display = "none";

       // afficher le nom du joueur
      let displayPlayer = document.createElement("p");
      counter += 1;
      displayPlayer.innerHTML = `<i class="fa-solid fa-user"></i> ${counter} : ${playerInput.value}`;
      displayPlayersElement.insertAdjacentElement("beforeend", displayPlayer);
  
      // créer un objet joueur
      let player = {
        name: playerInput.value,
        score: 0,
      };
  
      // vider le formulaire
      playerForm.reset();
  
      // ajouter le joueur au tableau
      playersList.push(player);
  
      // dès qu'on a 2 joueurs, afficher le bouton Jouer
      if (playersList.length == 2) {
        startBtn.style.display = "block";
      }
      
      return playersList, counter;
    }
  });

  // toggle les vues accueil / jeu au clic sur le bouton démarrer
  const homeSection = document.querySelector(".home");
  const gameSection = document.querySelector(".game");

  startBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    homeSection.style.display = "none";
    gameSection.style.display = "block";

    // configurer le player
    getSongAndConfigurePlayer();

    // lancer l'animation de chargement avant d'afficher le player
    setTimeout(showPlayer, 2000);

    // afficher les joueurs dans la vue Jeu
    displayPlayers(playersList);
  });
}

// récupérer et stocker les joueurs + configurer le player
initializeStartPlayers();

