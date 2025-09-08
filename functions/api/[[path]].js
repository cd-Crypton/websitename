export async function onRequest(context) {
  // Get the path and search parameters from the incoming request.
  const url = new URL(context.request.url);
  const path = url.pathname.replace('/api/', ''); // e.g., "trending/movie/week"
  const searchParams = url.search; // e.g., "?page=2" or "?query=avatar"

  // The base URL for the real TMDB API.
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  // Get your secret API key from the Cloudflare environment variables.
  // This is where you use the 'TMDB_API_KEY' secret you set up.
  const TMDB_API_KEY = context.env.TMDB_API_KEY;

  // Construct the final URL to fetch from TMDB.
  // It checks if there are already params (like '?query=') to decide whether to use '?' or '&'.
  const separator = searchParams ? '&' : '?';
  const fullURL = `${TMDB_BASE_URL}/${path}${searchParams}${separator}api_key=${TMDB_API_KEY}`;

  // Make the actual request to the TMDB API.
  const response = await fetch(fullURL);

  // Return the response from TMDB directly to your frontend.
  return response;
}
