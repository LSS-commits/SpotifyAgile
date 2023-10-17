// API ACCESS
import { Credentials } from "./credentials.js";

const credentials = Credentials();

// liste des artistes (récupérer ids en utilisant l'API Search Item sur le site Spotify Dev)
const artists = [
  { name: "Justin Bieber", id: "1uNFoZAHBGtllmzznpCI3s" },
  { name: "Vianney", id: "4Nrd0CtP8txoQhnnlRA6V6" },
  { name: "Céline Dion", id: "4S9EykWXhStSc15wEx8QFK" },
  { name: "Michael Jackson", id: "3fMbdgg4jU18AjLCKBhRSm" },
  { name: "AC/DC", id: "711MCceyCBcFnzjGY4Q7Un" },
  { name: "IAM", id: "56Q6weEROZ1RsVrTak8Bm7" },
  { name: "Whitney Houston", id: "6XpaIBNiVzIetEPCWDvAFP" },
  { name: "Francis Cabrel", id: "5uo5NwSONVNfvSHHMQrHAv" },
  { name: "Ed Sheeran", id: "6eUKZXaKkcviH0Ku9w2n3V" },
  { name: "Daft Punk", id: "4tZwfgrHOc3mvqYlEYSvVi" },
];

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
  // pick an artist randomly
  let randomArtist = artists[Math.floor(Math.random() * artists.length)];
  // define country market to make data available
  let market = "US";
  // apiUrl with chosen artist's id
  let apiUrl = `https://api.spotify.com/v1/artists/${randomArtist.id}/top-tracks?market=${market}`;


  // get data
  try {
    // retirer l'éventuel ancien message d'erreur
    gameError.style.display = "none";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const data = await response.json();

    let allTracks = data.tracks;
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
