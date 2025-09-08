// js/watch.js

document.addEventListener('DOMContentLoaded', async () => {
    // Get HTML elements
    const videoFrame = document.getElementById('video-frame');
    const serverButtonsContainer = document.getElementById('server-buttons');
    const episodeGuide = document.getElementById('episode-guide');
    const seasonSelector = document.getElementById('season-selector');
    const episodeList = document.getElementById('episode-list');

    // Get content details from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const id = urlParams.get('id');

    // State to keep track of current selection
    let currentServer;
    let currentSeason = 1;
    let currentEpisode = 1;

    if (!type || !id) {
        document.body.innerHTML = '<h1>Error: Content information missing.</h1>';
        return;
    }

    // --- Server Definitions (with updated, more reliable URL formats) ---
    const servers = [
        // Using the /season-episode path format which is often more reliable
        { name: 'VidSrc', getUrl: (s, e) => `https://vidsrc.to/embed/${type}/${id}/${type === 'tv' ? `${s}-${e}` : ''}` },
        { name: 'VidSrc.me', getUrl: (s, e) => `https://vidsrc.net/embed/${type}/?tmdb=${id}${type === 'tv' ? `&season=${s}&episode=${e}` : ''}` },
        // Assuming Videasy uses a similar path format; adjust if needed
        { name: 'Videasy', getUrl: (s, e) => `https://player.videasy.net/${type}/${id}${type === 'tv' ? `/${s}/${e}` : ''}` }
    ];

    // --- Core Functions ---
    function updateVideoSource() {
        if (currentServer) {
            videoFrame.src = currentServer.getUrl(currentSeason, currentEpisode);
            // **DEBUGGING**: This will show the generated URL in the browser console (F12)
            console.log('Loading new video source:', videoFrame.src);
        }
    }

    async function fetchAndDisplayEpisodes(seasonNumber) {
        const res = await fetch(`/api/tv/${id}/season/${seasonNumber}`);
        const data = await res.json();
        
        episodeList.innerHTML = '';
        data.episodes.forEach(episode => {
            const button = document.createElement('button');
            button.className = 'episode-btn';
            button.innerText = `Ep ${episode.episode_number}: ${episode.name}`;
            
            button.addEventListener('click', () => {
                currentEpisode = episode.episode_number;
                updateVideoSource();
                document.querySelectorAll('.episode-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });

            episodeList.appendChild(button);
        });

        const firstEpisodeButton = episodeList.querySelector('.episode-btn');
        if (firstEpisodeButton) {
            firstEpisodeButton.classList.add('active');
        }
    }

    // --- Initialization Logic ---
    // 1. Generate Server Buttons
    servers.forEach((server, index) => {
        const button = document.createElement('button');
        button.className = 'server-btn';
        button.innerText = server.name;

        button.addEventListener('click', () => {
            currentServer = server;
            updateVideoSource();
            document.querySelectorAll('.server-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });

        serverButtonsContainer.appendChild(button);
        if (index === 0) {
            currentServer = server;
            button.classList.add('active');
        }
    });

    // 2. Handle TV Shows vs Movies
    if (type === 'tv') {
        episodeGuide.style.display = 'block';
        const res = await fetch(`/api/tv/${id}`);
        const data = await res.json();

        data.seasons.forEach(season => {
            if (season.season_number > 0) {
                const option = document.createElement('option');
                option.value = season.season_number;
                option.innerText = season.name;
                seasonSelector.appendChild(option);
            }
        });

        seasonSelector.addEventListener('change', async () => {
            currentSeason = seasonSelector.value;
            currentEpisode = 1; // Reset to episode 1
            await fetchAndDisplayEpisodes(currentSeason); // Wait for episodes to load
            updateVideoSource();
        });

        await fetchAndDisplayEpisodes(currentSeason);
    }
    
    // 3. Load the initial video
    updateVideoSource();
});