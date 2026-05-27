import movies from './movies.json' with { type: 'json' };

const moviesContainer = document.getElementById("moviesList");

movies.forEach(movie => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.classList.add("bg-white", "rounded-lg", "shadow-md", "p-4");
    movieElement.innerHTML = `
        <h2 class="text-xl font-bold mb-2">${movie.title}</h2>
        <p class="text-gray-600 mb-4">Data: ${movie.release_date}</p>
        <p class="text-gray-600 mb-4">Valutazione: ${movie.vote_average}</p>
        
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Vedi Dettagli</button>
    `;
    moviesContainer.appendChild(movieElement);
});
