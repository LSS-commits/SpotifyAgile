// API ACCESS
import { Credentials } from "./credentials.js";

const credentials = Credentials();

// générer un tableau avec l'alphabet en minuscules, à passer dans la requête de l'endpoint
const alphabet = [...Array(26).keys()].map(i => String.fromCharCode(i + 97));


const gameError = document.getElementById("gameError");


const apiData = async () => {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      // 'redirectUri': credentials.redirectUri
    }),
  });
  const tokenResponse = await res.json();
  // récupérer le token d'accès, valide pour 1 heure
  let token = tokenResponse.access_token;

  // FOR THE API ENDPOINT
  // choisir une lettre aléatoirement
  let randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

  // apiUrl avec les paramètres
  let apiUrl = `https://api.spotify.com/v1/search?q=%25${randomLetter}%25&type=track&limit=20`;

  // get data
  try {
    // retirer l'éventuel ancien message d'erreur
    gameError.style.display = "none";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const data = await response.json();


    let allTracks = data.tracks.items;
    if (allTracks) {
      // filter out tracks where preview_url is null
      let filteredTracks = allTracks.filter(
        (item) => item.preview_url !== null
      );
      let track;

      // get a random track from the top tracks array
      if (filteredTracks.length > 0) {
        if (filteredTracks.length == 1) {
          track = filteredTracks[0];
        } else {
          track = filteredTracks[Math.floor(Math.random() * filteredTracks.length)];
        }
      } else {
        console.log("No song to play");
        
        gameError.innerText = "Une erreur est survenue, veuillez réessayer plus tard."
        gameError.style.display = "block";
      }

      // manipulate url to embed Spotify player
      let embedPlayer = track.external_urls.spotify.replace(
        "spotify.com/track/",
        "spotify.com/embed/track/"
      );

      // create object with useful info
      let trackInfos = {
        artists: track.artists.map((item) => item.name),
        title: track.name,
        images: track.album.images,
        player_src: embedPlayer,
        preview_url: track.preview_url,
      };

      return trackInfos;
    }
  } catch (error) {
    console.error("error : " + error);

    gameError.innerText = "Une erreur est survenue, veuillez réessayer plus tard."
    gameError.style.display = "block";
  }
};

export { apiData };


/* TODO: Playlist Filtr France Blindtest soirée => https://open.spotify.com/playlist/7oBeEkujcRybm7dCAUAIhG */