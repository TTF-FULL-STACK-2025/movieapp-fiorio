import config from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.history.back();
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const type = urlParams.get("type"); // movie o tv

  if (!id || !type || (type !== "movie" && type !== "tv")) {
    showError();
    return;
  }

  fetchDetails(id, type);
});

async function fetchDetails(id, type) {
  const loadingSpinner = document.getElementById("loadingSpinner");
  const detailContainer = document.getElementById("detailContainer");

  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${config.TMDB_TOKEN}`
      }
    };

    const endpoint = `https://api.themoviedb.org/3/${type}/${id}?language=it-IT`;
    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw new Error(`Errore di rete: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dettagli caricati:", data);

    renderDetails(data, type);

    if (loadingSpinner) loadingSpinner.classList.add("hidden");
    if (detailContainer) detailContainer.classList.remove("hidden");

  } catch (err) {
    console.error("Errore durante il fetch dei dettagli:", err);
    showError();
  }
}

function renderDetails(data, type) {

  const detailBackdrop = document.getElementById("detailBackdrop");
  const detailPoster = document.getElementById("detailPoster");
  const detailTitle = document.getElementById("detailTitle");
  const detailTagline = document.getElementById("detailTagline");
  const detailBadgeType = document.getElementById("detailBadgeType");
  const detailRating = document.getElementById("detailRating");
  const detailReleaseDate = document.getElementById("detailReleaseDate");
  const detailRuntime = document.getElementById("detailRuntime");
  const detailGenres = document.getElementById("detailGenres");
  const detailOverview = document.getElementById("detailOverview");

  document.title = `${data.title || data.name} - MovieApp`;

  if (detailBackdrop) {
    if (data.backdrop_path) {
      detailBackdrop.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${data.backdrop_path}')`;
    } else {
      detailBackdrop.style.background = "linear-gradient(to bottom, #1f2937, #000000)";
    }
  }

  if (detailPoster) {
    if (data.poster_path) {
      detailPoster.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
      detailPoster.alt = data.title || data.name;
    } else {
      detailPoster.src = "img/logo-m.png"; 
      detailPoster.classList.add("p-8", "bg-zinc-800", "object-contain");
    }
  }

  if (detailTitle) {
    detailTitle.textContent = data.title || data.name;
  }
  if (detailTagline) {
    detailTagline.textContent = data.tagline ? `"${data.tagline}"` : "";
  }

  if (detailBadgeType) {
    detailBadgeType.textContent = type === "movie" ? "Film" : "Serie TV";
  }

  if (detailRating) {
    detailRating.textContent = `⭐ ${data.vote_average ? data.vote_average.toFixed(1) : "0.0"}`;
  }

  if (detailReleaseDate) {
    const rawDate = data.release_date || data.first_air_date;
    if (rawDate) {
      const year = rawDate.split("-")[0];
      const formattedDate = rawDate.split("-").reverse().join("/");
      detailReleaseDate.textContent = `${formattedDate} (${year})`;
    } else {
      detailReleaseDate.textContent = "Data non disponibile";
    }
  }

  if (detailRuntime) {
    if (type === "movie") {
      detailRuntime.textContent = data.runtime ? `${data.runtime} min` : "N/D";
    } else {
      const seasons = data.number_of_seasons || 0;
      const episodes = data.number_of_episodes || 0;
      detailRuntime.textContent = `${seasons} Stag. (${episodes} ep.)`;
    }
  }

  if (detailGenres) {
    detailGenres.innerHTML = "";
    if (data.genres && data.genres.length > 0) {
      data.genres.forEach(genre => {
        const genreBadge = document.createElement("span");
        genreBadge.className = "bg-zinc-800 border border-zinc-700/80 px-2 py-0.5 rounded text-xs font-semibold text-zinc-300";
        genreBadge.textContent = genre.name;
        detailGenres.appendChild(genreBadge);
      });
    } else {
      detailGenres.innerHTML = "<span class='text-zinc-500 text-xs font-semibold'>Nessun genere</span>";
    }
  }

  if (detailOverview) {
    detailOverview.textContent = data.overview || "Trama non disponibile in italiano.";
  }
}

function showError() {
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const detailContainer = document.getElementById("detailContainer");

  if (loadingSpinner) loadingSpinner.classList.add("hidden");
  if (detailContainer) detailContainer.classList.add("hidden");
  if (errorMessage) errorMessage.classList.remove("hidden");
}
