import config from "./config.js";

let movies = [];
let series = [];

async function updateMovies() {
  try {

    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.TMDB_TOKEN}`
    }
    };

    
    const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options);
    const data = await response.json();
    
    movies = data.results;
    
    console.log("Film caricati con successo:", movies);

    updateMoviesHtml();

  } catch (err) {
    console.error("Errore durante il recupero dei film:", err);
  }
}

function updateMoviesHtml() {
    const moviesContainer = document.getElementById("moviesList");
    moviesContainer.innerHTML = "";

    movies.forEach(movie => {
        const movieElement = document.createElement("div");

        // Card ultra-compatta: larghezza fissata a 110px
        movieElement.className = `
            w-[110px]
            min-w-[110px]
            max-w-[110px]
            bg-zinc-900
            rounded-md
            overflow-hidden
            border
            border-zinc-800/80
            hover:scale-105
            transition-all
            duration-200
            flex-shrink-0
            group
            shadow-sm
        `;

        movieElement.innerHTML = `
            <div class="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800">
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
                    text-[8px] 
                    px-1 
                    py-0.2
                    rounded-[3px]
                    font-black
                ">
                    ⭐${movie.vote_average.toFixed(1)}
                </span>
            </div>

            <div class="p-1.5 whitespace-normal leading-tight">
                <h2 class="
                    text-[9px]
                    font-bold 
                    text-zinc-200 
                    line-clamp-1
                    truncate
                    group-hover:text-red-500
                    transition-colors
                " title="${movie.title}">
                    ${movie.title}
                </h2>
                <p class="text-[8px] text-zinc-500 font-semibold mt-0.5">
                    ${movie.release_date?.split("-")[0] || "N/D"}
                </p>
            </div>
        `;

        moviesContainer.appendChild(movieElement);
    });
}



async function updateSeries() {
  try {

    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.TMDB_TOKEN}`
    }
    };

    
    const response = await fetch('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', options);
    const data = await response.json();
    
    series = data.results;
    
    console.log("Serie caricate con successo:", series);

    updateSeriesHtml();

  } catch (err) {
    console.error("Errore durante il recupero delle serie:", err);
  }
}

function updateSeriesHtml() {
    const seriesContainer = document.getElementById("seriesList");
    seriesContainer.innerHTML = "";

    series.forEach(serie => {
        const serieElement = document.createElement("div");

        console.log(serie);

        // Card ultra-compatta: larghezza fissata a 110px
        serieElement.className = `
            w-[110px]
            min-w-[110px]
            max-w-[110px]
            bg-zinc-900
            rounded-md
            overflow-hidden
            border
            border-zinc-800/80
            hover:scale-105
            transition-all
            duration-200
            flex-shrink-0
            group
            shadow-sm
        `;

        serieElement.innerHTML = `
            <div class="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800">
                <img 
                    src="https://image.tmdb.org/t/p/w300${serie.poster_path}" 
                    alt="${serie.original_name}" 
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
                    text-[8px] 
                    px-1 
                    py-0.2
                    rounded-[3px]
                    font-black
                ">
                    ⭐${serie.vote_average.toFixed(1)}
                </span>
            </div>

            <div class="p-1.5 whitespace-normal leading-tight">
                <h2 class="
                    text-[9px]
                    font-bold 
                    text-zinc-200 
                    line-clamp-1
                    truncate
                    group-hover:text-red-500
                    transition-colors
                " title="${serie.original_name}">
                    ${serie.original_name}
                </h2>
                <p class="text-[8px] text-zinc-500 font-semibold mt-0.5">
                    ${serie.first_air_date?.split("-")[0] || "N/D"}
                </p>
            </div>
        `;

        seriesContainer.appendChild(serieElement);
    });
}

updateMovies();
updateSeries();



