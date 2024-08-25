
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}


async function fetchMovies(query) {
    const apiKey = 'your_api_key_here';
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
    const data = await response.json();
    return data.Search || [];
}


function displayResults(movies) {
    const resultsBox = document.getElementById('searchResults');
    resultsBox.innerHTML = ''; 
    movies.forEach(movie => {
        const movieTitleDiv = document.createElement('div');
        movieTitleDiv.textContent = movie.Title;
        movieTitleDiv.classList.add('movie-title');
        movieTitleDiv.addEventListener('click', () => displayMovieDetails(movie));
        resultsBox.appendChild(movieTitleDiv);
    });
}


async function displayMovieDetails(movie) {
    const apiKey = 'your_api_key_here';
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`);
    const data = await response.json();
    const detailsBox = document.getElementById('movieDetails');
    detailsBox.innerHTML = `
        <h2>${data.Title}</h2>
        <p><strong>Year:</strong> ${data.Year}</p>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <img src="${data.Poster}" alt="Movie Poster">
    `;
}


const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', throttle(async function() {
    const query = searchInput.value;
    if (query.trim().length > 0) {
        const movies = await fetchMovies(query);
        displayResults(movies);
    }
}, 500));
