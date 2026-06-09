import config from "./config.js";

let movies = [];

async function updateMovies() {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.TMDB_TOKEN}`
      }
    };

    // Chiamata dedicata per i film attualmente al cinema (now playing)
    const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=it-IT&page=1', options);
    const data = await response.json();
    
    movies = data.results;
    console.log("Film 'Now Playing' caricati con successo:", movies);

    updateMoviesGridHtml();
  } catch (err) {
    console.error("Errore durante il recupero dei film:", err);
    const gridContainer = document.getElementById("moviesGrid");
    gridContainer.innerHTML = `
      <div class="text-center py-12 text-red-500 font-semibold w-full">
        Si è verificato un errore nel caricamento dei film. Riprova più tardi.
      </div>
    `;
    const countContainer = document.getElementById("moviesCount");
    if (countContainer) countContainer.textContent = "Errore";
  }
}

function updateMoviesGridHtml() {
  const gridContainer = document.getElementById("moviesGrid");
  const countContainer = document.getElementById("moviesCount");
  
  gridContainer.innerHTML = "";
  
  if (countContainer) {
    countContainer.textContent = `${movies.length} film trovati`;
  }

  if (movies.length === 0) {
    gridContainer.innerHTML = `
      <div class="text-center py-12 text-zinc-500 font-semibold w-full">
        Nessun film trovato.
      </div>
    `;
    return;
  }

  movies.forEach(movie => {
    const movieElement = document.createElement("div");

    // Stesso pattern di card della home: w-[85px] su mobile, fino a w-[145px] su xl desktop.
    movieElement.className = `
        w-[85px] min-w-[85px] max-w-[85px]
        sm:w-[100px] sm:min-w-[100px] sm:max-w-[100px]
        md:w-[115px] md:min-w-[115px] md:max-w-[115px]
        lg:w-[130px] lg:min-w-[130px] lg:max-w-[130px]
        xl:w-[145px] xl:min-w-[145px] xl:max-w-[145px]
        h-[170px] sm:h-[195px] md:h-[215px] lg:h-[240px] xl:h-[265px]
        bg-zinc-900
        rounded-md
        overflow-hidden
        border
        border-zinc-800/80
        hover:scale-105
        transition-all
        duration-200
        flex-shrink-0
        flex flex-col
        group
        shadow-sm
    `;

    movieElement.innerHTML = `
        <div class="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800 flex-shrink-0">
            <img 
                src="https://image.tmdb.org/t/p/w300${movie.poster_path}" 
                alt="${movie.title}" 
                class="w-full h-full object-cover"
                loading="lazy"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

            <span class="
                absolute 
                top-1 
                right-1 
                bg-black/85 
                text-white 
                text-[7px] sm:text-[7.5px] md:text-[8px] lg:text-[9px] xl:text-[10px]
                px-1 
                py-0.2
                rounded-[3px]
                font-black
            ">
                ⭐${movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
            </span>
        </div>

        <div class="p-1 sm:p-1.5 whitespace-normal leading-tight flex flex-col justify-between flex-grow overflow-hidden">
            <h2 class="
                text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px]
                font-bold 
                text-zinc-200 
                line-clamp-2
                group-hover:text-red-500
                transition-colors
            " title="${movie.title}">
                ${movie.title}
            </h2>
            <p class="text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-[10px] text-zinc-500 font-semibold mt-auto">
                ${movie.release_date?.split("-")[0] || "N/D"}
            </p>
        </div>
    `;

    gridContainer.appendChild(movieElement);
  });
}

// Inizializza il caricamento dei film
fetchNowPlayingMovies();
