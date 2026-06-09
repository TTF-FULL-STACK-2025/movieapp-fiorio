import config from "./config.js";

let series = [];

async function updateSeries() {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.TMDB_TOKEN}`
      }
    };

    const response = await fetch('https://api.themoviedb.org/3/tv/popular?language=it-IT&page=1', options);
    const data = await response.json();
    
    series = data.results;
    console.log("Serie TV popolari caricate con successo:", series);

    updateSeriesHtml();
  } catch (err) {
    console.error("Errore durante il recupero delle serie TV:", err);
    const gridContainer = document.getElementById("seriesGrid");
    gridContainer.innerHTML = `
      <div class="text-center py-12 text-red-500 font-semibold w-full">
        Si è verificato un errore nel caricamento delle serie TV. Riprova più tardi.
      </div>
    `;
    const countContainer = document.getElementById("seriesCount");
    if (countContainer) countContainer.textContent = "Errore";
  }
}

function updateSeriesHtml() {
  const gridContainer = document.getElementById("seriesGrid");
  const countContainer = document.getElementById("seriesCount");
  
  gridContainer.innerHTML = "";
  
  if (countContainer) {
    countContainer.textContent = `${series.length} serie TV trovate`;
  }

  if (series.length === 0) {
    gridContainer.innerHTML = `
      <div class="text-center py-12 text-zinc-500 font-semibold w-full">
        Nessuna serie TV trovata.
      </div>
    `;
    return;
  }

  series.forEach(serie => {
    const serieElement = document.createElement("a");
    serieElement.href = `detail.html?id=${serie.id}&type=tv`;

    serieElement.className = `
        movie-card
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

    const serieTitle = serie.name || serie.original_name || "Titolo Sconosciuto";

    serieElement.innerHTML = `
        <div class="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800 flex-shrink-0">
            <img 
                src="https://image.tmdb.org/t/p/w300${serie.poster_path}" 
                alt="${serieTitle}" 
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
                ⭐${serie.vote_average ? serie.vote_average.toFixed(1) : "0.0"}
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
            " title="${serieTitle}">
                ${serieTitle}
            </h2>
            <p class="text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-[10px] text-zinc-500 font-semibold mt-auto">
                ${serie.first_air_date?.split("-")[0] || "N/D"}
            </p>
        </div>
    `;

    gridContainer.appendChild(serieElement);
  });
}

updateSeries();
