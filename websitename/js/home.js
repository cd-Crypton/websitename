// ===================================
// CONFIGURATION
// ===================================
const BASE_URL = '/api';
const POSTER_URL = 'https://image.tmdb.org/t/p/w500'; // For movie cards
const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280'; // For the main banner
let currentItem;
let movieGenres = new Map();
let tvGenres = new Map();
let bannerSlidesData = [];
let currentBannerIndex = 0;
let bannerInterval;

// ===================================
// DATA FETCHING FUNCTIONS
// ===================================

async function fetchGenres() {
  try {
    const movieRes = await fetch(`${BASE_URL}/genre/movie/list`);
    const movieData = await movieRes.json();
    movieData.genres.forEach(genre => movieGenres.set(genre.id, genre.name));

    const tvRes = await fetch(`${BASE_URL}/genre/tv/list`);
    const tvData = await tvRes.json();
    tvData.genres.forEach(genre => tvGenres.set(genre.id, genre.name));
  } catch (error) {
    console.error("Failed to fetch genres:", error);
  }
}

async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week`);
  const data = await res.json();
  return data.results;
}

async function fetchTrendingAnime() {
  // Directly discover TV shows with the Animation genre (ID 16) and 'anime' keyword (ID 210024)
  const res = await fetch(`${BASE_URL}/discover/tv?with_genres=16&with_keywords=210024&sort_by=popularity.desc`);
  const data = await res.json();
  return data.results;
}

async function searchTMDB() {
  const query = document.getElementById('search-input').value;
  const container = document.getElementById('search-results');

  if (!query.trim()) {
    container.innerHTML = '';
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  container.innerHTML = ''; // Clear previous results

  data.results.forEach(item => {
    if (item.media_type === 'person' || !item.poster_path) return;

    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.onclick = () => {
      closeSearchModal();
      showDetails(item);
    };

    const title = item.title || item.name;
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const year = item.release_date ? item.release_date.substring(0, 4) : (item.first_air_date ? item.first_air_date.substring(0, 4) : '');
    const description = item.overview;

    movieCard.innerHTML = `
      <img src="${POSTER_URL}${item.poster_path}" alt="${title}" loading="lazy">
      <div class="card-content">
        <h3 class="card-title">${title}</h3>
        <div class="card-meta">
          <span class="rating">★ ${rating}</span>
          <span class="year">${year}</span>
        </div>
        <p class="card-description">${description}</p>
      </div>
    `;
    container.appendChild(movieCard);
  });
}


// ===================================
// UI DISPLAY FUNCTIONS (These were missing)
// ===================================

function displayBanner(item) {
  document.getElementById('banner').style.backgroundImage = `url(${BACKDROP_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
}

function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    // Skip items without a poster
    if (!item.poster_path) return;

    // Create the main card container
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.onclick = () => showDetails(item);

    // Get data with fallbacks
    const title = item.title || item.name;
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const year = item.release_date ? item.release_date.substring(0, 4) : (item.first_air_date ? item.first_air_date.substring(0, 4) : '');
    const description = item.overview;

    // Use innerHTML to build the card structure
    movieCard.innerHTML = `
      <img src="${POSTER_URL}${item.poster_path}" alt="${title}" loading="lazy">
      <div class="card-content">
        <h3 class="card-title">${title}</h3>
        <div class="card-meta">
          <span class="rating">★ ${rating}</span>
          <span class="year">${year}</span>
        </div>
        <p class="card-description">${description}</p>
      </div>
    `;

    container.appendChild(movieCard);
  });
}

async function showDetails(item) {
  currentItem = item;
  const type = item.media_type === "movie" || item.release_date ? "movie" : "tv";

  // Populate basic info immediately
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview;
  document.getElementById('modal-image').src = `${POSTER_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));

  const watchButton = document.getElementById('watch-button');
  watchButton.href = `watch.html?type=${type}&id=${item.id}`;

  // Set loading text for dynamic content
  const genresSpan = document.getElementById('modal-genres');
  const castSpan = document.getElementById('modal-cast');
  genresSpan.textContent = 'Loading...';
  castSpan.textContent = 'Loading...';

  // Look up and display genres
  const genreMap = type === 'movie' ? movieGenres : tvGenres;
  const genreNames = item.genre_ids.map(id => genreMap.get(id)).filter(Boolean); // filter(Boolean) removes any undefined genres
  genresSpan.textContent = genreNames.join(', ') || 'N/A';

  // Fetch credits to display cast
  try {
    const res = await fetch(`${BASE_URL}/${type}/${item.id}/credits`);
    const creditsData = await res.json();
    const castNames = creditsData.cast.slice(0, 4).map(actor => actor.name); // Get top 4 actors
    castSpan.textContent = castNames.join(', ') || 'N/A';
  } catch (error) {
    console.error("Failed to fetch credits:", error);
    castSpan.textContent = 'Could not load cast info.';
  }

  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('search-input').value = '';
}

function slide(listId, direction) {
  const list = document.getElementById(listId);
  if (!list) return;

  // Calculate the amount to scroll. We'll scroll by 80% of the visible width.
  const scrollAmount = list.clientWidth * 0.8;

  if (direction === 'left') {
    list.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  } else {
    list.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
}

// ===================================
// BANNER SLIDER FUNCTIONS
// ===================================

function setupBannerSlider(movies) {
  bannerSlidesData = movies.slice(0, 5); // Use the first 5 movies for the banner
  const slidesContainer = document.getElementById('banner-slides');
  const dotsContainer = document.getElementById('banner-dots');

  // **Error prevention**: Check if elements exist
  if (!slidesContainer || !dotsContainer) {
    console.error("Banner slider HTML elements not found!");
    return;
  }

  slidesContainer.innerHTML = '';
  dotsContainer.innerHTML = '';

  bannerSlidesData.forEach((movie, index) => {
    // 1. Create the slide container
    const slide = document.createElement('div');
    slide.className = 'banner-slide';
    slide.style.backgroundImage = `url(${BACKDROP_URL}${movie.backdrop_path})`;
    
    // 2. Create the content container for text and buttons
    const content = document.createElement('div');
    content.className = 'banner-content';

    // 3. Create Title
    const title = document.createElement('h1');
    title.textContent = movie.title || movie.name;

    // 4. Create Metadata (Year, Rating)
    const meta = document.createElement('div');
    meta.className = 'banner-meta';
    const year = movie.release_date ? movie.release_date.substring(0, 4) : (movie.first_air_date ? movie.first_air_date.substring(0, 4) : 'N/A');
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    meta.innerHTML = `<span>${year}</span> &bull; <span class="rating">★ ${rating}</span>`;

    // 5. Create Description
    const desc = document.createElement('p');
    desc.className = 'banner-description';
    desc.textContent = movie.overview;

    // 6. Create Buttons
    const buttons = document.createElement('div');
    buttons.className = 'banner-buttons';

    const playBtn = document.createElement('a');
    playBtn.className = 'btn btn-primary';
    playBtn.href = `watch.html?type=movie&id=${movie.id}`; // Assumes banner content is always 'movie'
    playBtn.innerHTML = `<i class="fas fa-play"></i> Play Now`;

    const infoBtn = document.createElement('button');
    infoBtn.className = 'btn btn-secondary';
    infoBtn.innerHTML = `<i class="fas fa-info-circle"></i> More Info`;
    // When clicked, it calls the same function as clicking a poster
    infoBtn.onclick = () => showDetails(movie);

    // 7. Append everything together
    buttons.append(playBtn, infoBtn);
    content.append(title, meta, desc, buttons);
    slide.appendChild(content);
    slidesContainer.appendChild(slide);

    // 8. Create Dot for navigation
    const dot = document.createElement('div');
    dot.className = 'banner-dot';
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  showSlide(0);
  startBannerAutoplay();
}

function showSlide(index) {
  const slidesContainer = document.getElementById('banner-slides');
  if (!slidesContainer) return; // Add safety check
  
  const dots = document.querySelectorAll('.banner-dot');
  currentBannerIndex = index;
  slidesContainer.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// This new function is for the automatic timer ONLY
function autoAdvanceSlide() {
    const nextIndex = (currentBannerIndex + 1) % bannerSlidesData.length;
    showSlide(nextIndex);
}

function goToSlide(index) {
  showSlide(index);
  resetBannerAutoplay();
}

function startBannerAutoplay() {
  // Use the new auto-advance function for the timer
  bannerInterval = setInterval(autoAdvanceSlide, 5000);
}

function resetBannerAutoplay() {
  clearInterval(bannerInterval);
  startBannerAutoplay();
}

// ===================================
// INITIALIZATION
// ===================================

async function init() {
  await fetchGenres(); // Fetch genres right at the start
  try {
    const movies = await fetchTrending('movie');
    const tvShows = await fetchTrending('tv');
    const anime = await fetchTrendingAnime();

    if (movies && movies.length > 0) {
      setupBannerSlider(movies);
      displayList(movies, 'movies-list');
    }
    if (tvShows && tvShows.length > 0) {
      displayList(tvShows, 'tvshows-list');
    }
    if (anime && anime.length > 0) {
      displayList(anime, 'anime-list');
    }
  } catch (error) {
    console.error("Failed to initialize page:", error);
    // Optionally display an error message to the user on the page
  }
}

// Run the app
init();