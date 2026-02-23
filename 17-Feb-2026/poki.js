const formatName = (value) => value.trim().toLowerCase();


const GodsofPokemon = {
    Arceus: "The creator of all Pokémon",
    Giratina : "The god of antimatter",
    Rayquaza: "The god of Fire",
    Palkia: "The god of the sky",
    Dialga: "The god of time",
    Uxie: "The god of water",
    Azelf: "The god of the ocean", 
    Mew: "The god of the moon",
    Mesprit: "The god of emotion", 
    Kyogre: "The god of the sea"
};

const setStatus = (message, isError = false) => {
    const status = document.getElementById('status-message');
    if (!status) {
        return;
    }
    status.textContent = message;
    status.className = isError
        ? 'text-center text-sm font-semibold uppercase tracking-[0.25em] text-rose-600'
        : 'text-center text-sm font-semibold uppercase tracking-[0.25em] text-slate-600';
};

const setListStatus = (message, isError = false) => {
    const status = document.getElementById('status-message-list');
    if (!status) {
        return;
    }
    status.textContent = message;
    status.className = isError
        ? 'mt-4 text-center text-sm font-semibold uppercase tracking-[0.25em] text-rose-600'
        : 'mt-4 text-center text-sm font-semibold uppercase tracking-[0.25em] text-slate-600';
};

const renderStats = (stats) => {
    const statsContainer = document.getElementById('pokemon-stats');
    if (!statsContainer) {
        return;
    }
    statsContainer.innerHTML = stats
        .slice(0, 4)
        .map((stat) => {
            const name = stat.stat.name.replace('-', ' ');
            return `
                <div class="flex items-center justify-between rounded-xl bg-slate-900/10 px-3 py-2">
                    <span class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">${name}</span>
                    <span class="text-sm font-semibold text-slate-900">${stat.base_stat}</span>
                </div>
            `;
        })
        .join('');
};

const renderTypes = (types) => {
    const typesContainer = document.getElementById('pokemon-types');
    if (!typesContainer) {
        return;
    }
    typesContainer.innerHTML = types
        .map((type, index) => {
            return `<span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${index === 0 ? 'bg-white text-slate-900' : 'border border-white/20 bg-white/15 text-white'}">${type.type.name}</span>`;
        })
        .join('');
};


const listofpokemon = async () => {
    try {
        const PokiMap = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1400');
        if (!PokiMap.ok) {
            throw new Error('Failed to fetch Pokemon list');
        }   
        const data = await PokiMap.json();
        return data.results.map(pokemon => pokemon.name);
        

    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
        return [];
    }
};

let pokemonList = [];
listofpokemon().then(list => pokemonList = list);

let selectedSuggestionIndex = -1;
let currentMatches = [];
let selectedListSuggestionIndex = -1;
let currentListMatches = [];

// List view state
let allPokemonData = [];
let filteredPokemon = [];
let currentPage = 1;
const itemsPerPage = 20;
let selectedType = 'all';

const pokemonTypes = ['all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

const listViewBackground = 'radial-gradient(900px circle at 10% 10%, #fff0c4 10%, #ffd1a6 35%, #f2a6a6 60%, #b48fe3 100%)';
const detailViewBackground = './thimo-pedersen-dip9IIwUK6w-unsplash.jpg';

const applyPageBackground = (view) => {
    const body = document.body;
    if (!body) {
        return;
    }

    if (view === 'detail') {
        body.style.backgroundImage = `url('${detailViewBackground}')`;
    } else {
        body.style.backgroundImage = listViewBackground;
    }
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
};

const selectSuggestion = (name) => {
    const input = document.getElementById('pokemon-input');
    const container = document.getElementById('suggestions-container');
    
    if (input) {
        input.value = name;
        if (container) {
            container.classList.add('hidden');
        }
        
        const searchName = formatName(name);
        const currentParams = new URLSearchParams(window.location.search);
        const currentPokemon = currentParams.get('pokemon');
        
        if (searchName !== currentPokemon) {
            history.pushState(null, '', `?pokemon=${searchName}`);
        }
        info(name);
    }
};

const showSuggestions = (matches) => {
    const container = document.getElementById('suggestions-container');
    if (!container) return;
    
    currentMatches = matches;
    selectedSuggestionIndex = -1;
    
    if (matches.length === 0) {
        container.classList.add('hidden');
        return;
    }
    
    container.innerHTML = matches
        .slice(0, 8)
        .map((name, index) => `
            <button type="button" class="suggestion-item w-full px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.2em] text-slate-800 transition hover:bg-slate-900/10" data-name="${name}" data-index="${index}">
                ${name}
            </button>
        `)
        .join('');
    
    container.classList.remove('hidden');
    
    // Use mousedown instead of click to fire before blur event
    container.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent blur event
            const name = item.dataset.name;
            selectSuggestion(name);
        });
    });
};

const updateSuggestionHighlight = () => {
    const container = document.getElementById('suggestions-container');
    if (!container) return;
    
    const items = container.querySelectorAll('.suggestion-item');
    items.forEach((item, index) => {
        if (index === selectedSuggestionIndex) {
            item.classList.add('bg-slate-900/20');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('bg-slate-900/20');
        }
    });
};

const hideSuggestions = () => {
    const container = document.getElementById('suggestions-container');
    if (container) {
        container.classList.add('hidden');
    }
    selectedSuggestionIndex = -1;
    currentMatches = [];
};

const updateListSuggestionHighlight = () => {
    const container = document.getElementById('suggestions-container-list');
    if (!container) {
        return;
    }

    const items = container.querySelectorAll('.suggestion-item-list');
    items.forEach((item, index) => {
        if (index === selectedListSuggestionIndex) {
            item.classList.add('bg-slate-900/20');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('bg-slate-900/20');
        }
    });
};

const hideListSuggestions = () => {
    const container = document.getElementById('suggestions-container-list');
    if (container) {
        container.classList.add('hidden');
    }
    selectedListSuggestionIndex = -1;
    currentListMatches = [];
};

// Fetch detailed Pokemon data for list view
const fetchPokemonDetails = async (name) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
        if (!response.ok) return null;
        const data = await response.json();
        return {
            name: data.name,
            id: data.id,
            image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
            types: data.types.map(t => t.type.name)
        };
    } catch (error) {
        return null;
    }
};

// Load Pokemon data in batches
const loadPokemonData = async (limit = 1000) => {
    const statusEl = document.getElementById('status-message-list');
    if (statusEl) statusEl.textContent = 'Loading Pokemon...';
    
    const promises = pokemonList.slice(0, limit).map(name => fetchPokemonDetails(name));
    allPokemonData = (await Promise.all(promises)).filter(p => p !== null);
    
    // Apply selected type filter
    if (selectedType === 'all') {
        filteredPokemon = allPokemonData;
    } else {
        filteredPokemon = allPokemonData.filter(p => p.types.includes(selectedType));
    }
    
    if (statusEl) statusEl.textContent = '';
    renderTypeFilters();
    renderPokemonGrid();
    renderPagination();
};

// Render type filter pills
const renderTypeFilters = () => {
    const container = document.getElementById('type-filters');
    if (!container) return;
    
    container.innerHTML = pokemonTypes.map(type => {
        const isActive = type === selectedType;
        return `
            <button data-type="${type}" class="type-filter rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${isActive ? 'bg-slate-900 text-white' : 'border border-white/60 bg-white/80 text-slate-800 hover:bg-white/90'} backdrop-blur">
                ${type}
            </button>
        `;
    }).join('');
    
    container.querySelectorAll('.type-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedType = btn.dataset.type;
            currentPage = 1;
            filterPokemon();
        });
    });
};

// Filter Pokemon by type
const filterPokemon = () => {
    if (selectedType === 'all') {
        filteredPokemon = allPokemonData;
    } else {
        filteredPokemon = allPokemonData.filter(p => p.types.includes(selectedType));
    }
    
    // Update URL when filtering (reset to page 1)
    currentPage = 1;
    const params = new URLSearchParams(window.location.search);
    params.delete('page');
    
    if (selectedType !== 'all') {
        params.set('type', selectedType);
    } else {
        params.delete('type');
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    history.pushState(null, '', newUrl);
    
    renderTypeFilters();
    renderPokemonGrid();
    renderPagination();
};

// Render Pokemon grid
const renderPokemonGrid = () => {
    const grid = document.getElementById('pokemon-grid');
    if (!grid) return;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredPokemon.slice(start, end);
    
    if (pageData.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-slate-600">No Pokemon found</div>';
        return;
    }
    
        grid.innerHTML = pageData.map(pokemon => `
                <button data-pokemon="${pokemon.name}"
                class="pokemon-card group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg backdrop-blur"
                >
            <div class="pointer-events-none absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20" style="background-image: url('./typeimages/${pokemon.types[0]}.png');"></div>
            <div class="relative z-10 mb-2 flex aspect-square items-center justify-center rounded-xl bg-transparent">
                <img src="${pokemon.image}" alt="${pokemon.name}" class="h-full w-full object-contain p-2" loading="lazy">
            </div>
            <p class="relative z-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-800">#${pokemon.id.toString().padStart(3, '0')}</p>
            <p class="relative z-10 text-center text-sm font-bold uppercase tracking-[0.15em] text-slate-900">${pokemon.name}</p>
            <div class="relative z-10 mt-2 flex flex-wrap justify-center gap-1">
                ${pokemon.types.map((type, index) => `<span class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${index === 0 ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-700'}">${type}</span>`).join('')}
            </div>
        </button>
    `).join('');
    
    grid.querySelectorAll('.pokemon-card').forEach(card => {
        card.addEventListener('click', () => {
            const name = card.dataset.pokemon;
            showDetailView(name);
        });
    });
};

// Render pagination controls
const renderPagination = () => {
    const container = document.getElementById('pagination');
    if (!container) return;
    
    const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let pages = [];
    
    // First page
    pages.push(1);
    
    // Pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) pages.push(i);
    }
    
    // Last page
    if (!pages.includes(totalPages)) pages.push(totalPages);
    
    let html = currentPage > 1 
        ? '<button class="page-btn prev rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white/90 backdrop-blur">←</button>'
        : '<button class="rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-sm font-semibold text-slate-400 backdrop-blur" disabled>←</button>';
    
    let lastPage = 0;
    pages.forEach(page => {
        if (page - lastPage > 1) {
            html += '<span class="px-2 text-slate-600">...</span>';
        }
        const isActive = page === currentPage;
        html += `
            <button class="page-btn rounded-xl px-3 py-2 text-sm font-semibold transition backdrop-blur ${isActive ? 'bg-slate-900 text-white' : 'border border-white/60 bg-white/80 text-slate-800 hover:bg-white/90'}" data-page="${page}">
                ${page}
            </button>
        `;
        lastPage = page;
    });
    
    html += currentPage < totalPages
        ? '<button class="page-btn next rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white/90 backdrop-blur">→</button>'
        : '<button class="rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-sm font-semibold text-slate-400 backdrop-blur" disabled>→</button>';
    
    container.innerHTML = html;
    
    container.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('prev')) {
                currentPage = Math.max(1, currentPage - 1);
            } else if (btn.classList.contains('next')) {
                currentPage = Math.min(totalPages, currentPage + 1);
            } else {
                currentPage = parseInt(btn.dataset.page);
            }
            
            // Update URL with page parameter
            const params = new URLSearchParams(window.location.search);
            if (currentPage > 1) {
                params.set('page', currentPage);
            } else {
                params.delete('page');
            }
            const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
            history.pushState(null, '', newUrl);
            
            renderPokemonGrid();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
};

// View switching
const showListView = (page = 1, type = 'all') => {
    document.getElementById('list-view')?.classList.remove('hidden');
    document.getElementById('detail-view')?.classList.add('hidden');
    applyPageBackground('list');
    
    currentPage = page;
    selectedType = type;
    
    const params = new URLSearchParams();
    if (page > 1) {
        params.set('page', page);
    }
    if (type !== 'all') {
        params.set('type', type);
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    history.pushState(null, '', newUrl);
    
    // Re-apply filter
    if (selectedType === 'all') {
        filteredPokemon = allPokemonData;
    } else {
        filteredPokemon = allPokemonData.filter(p => p.types.includes(selectedType));
    }
    
    renderTypeFilters();
    renderPokemonGrid();
    renderPagination();
};

const showDetailView = async (pokemonName, shouldPushState = true) => {
    const loaded = await info(pokemonName);
    if (!loaded) {
        setListStatus('Pokemon not found.', true);
        return false;
    }

    setListStatus('');
    document.getElementById('list-view')?.classList.add('hidden');
    document.getElementById('detail-view')?.classList.remove('hidden');
    applyPageBackground('detail');
    if (shouldPushState) {
        history.pushState(null, '', `?pokemon=${pokemonName}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
};


const info = async (name) => {
    const formattedName = formatName(name).split('-')[0]; // Handle forms like "giratina-altered"
    if (!formattedName) {
        setStatus('Enter a Pokemon name.', true);
        return false;
    }

    const godInfo = GodsofPokemon[formattedName.charAt(0).toUpperCase() + formattedName.slice(1)];


    setStatus('Loading...');
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${formattedName}/`);
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }
 
        const data = await response.json();

        //console.log('Fetched Pokemon data:', data);
        //console.log('No of Forms :', data.forms.length - 1, 'Forms available:', data.forms.map(f => f.name).slice(1).join(', '));

        const image = data.sprites.other['official-artwork'].front_default ;
        const primaryType = data.types?.[0]?.type?.name || 'normal';

        const pokemonContainer = document.getElementById('pokemon');

        if (pokemonContainer) {
            pokemonContainer.innerHTML = image
                ? `<img src="${image}" alt="${data.name}" class="h-48 w-48 drop-shadow-[0_12px_20px_rgba(15,23,42,0.35)]">`
                : '<div class="text-sm font-semibold text-slate-500">No sprite available</div>';
        }

        const detailInfoPanel = document.getElementById('detail-info-panel');
        const detailMediaStatsPanel = document.getElementById('detail-media-stats-panel');
        const detailMainCard = document.getElementById('detail-main-card');

        if (detailMainCard) {
            detailMainCard.style.backgroundImage = 'none';
            detailMainCard.style.backgroundSize = '';
            detailMainCard.style.backgroundPosition = '';
            detailMainCard.style.backgroundRepeat = '';
            detailMainCard.style.backgroundBlendMode = '';
        }

        if (detailInfoPanel) {
            detailInfoPanel.style.backgroundImage = 'none';
            detailInfoPanel.style.backgroundSize = '';
            detailInfoPanel.style.backgroundPosition = '';
            detailInfoPanel.style.backgroundRepeat = '';
        }

        if (detailMediaStatsPanel) {
            detailMediaStatsPanel.style.backgroundImage = `linear-gradient(rgba(255,255,255,0.68), rgba(255,255,255,0.68)), url('./typeimages/${primaryType}.png')`;
            detailMediaStatsPanel.style.backgroundSize = 'cover';
            detailMediaStatsPanel.style.backgroundPosition = 'center';
            detailMediaStatsPanel.style.backgroundRepeat = 'no-repeat';
        }

        const nameEl = document.getElementById('pokemon-name');
        if (nameEl) {
            nameEl.innerHTML = `<p class='text-sm font-semibold uppercase tracking-[0.2em]'>${data.name.toUpperCase()}</p>`;
        }
        const idEl = document.getElementById('pokemon-id');
        if (idEl) {
            idEl.textContent = `#${data.id.toString().padStart(3, '0')}`;
        }
        const heightEl = document.getElementById('pokemon-height');
        if (heightEl) {
            heightEl.textContent = `${(data.height / 3.048).toFixed(1)} ft`;
        }

        const weightEl = document.getElementById('pokemon-weight');
        if (weightEl) {
            weightEl.textContent = `${(data.weight / 10).toFixed(1)} kg`;
        }

        const abilityEl = document.getElementById('pokemon-ability');
        if (abilityEl) {
            abilityEl.textContent = data.abilities[0]?.ability?.name ?? 'Unknown';
        }

        const xpEl = document.getElementById('pokemon-xp');
        if (xpEl) {
            xpEl.textContent = data.base_experience ?? 'Unknown';
        }
        
        
        if(godInfo){
            const specialAbility = document.getElementById('pokemon-speciality-container');
            if (specialAbility) {
                specialAbility.innerHTML = godInfo ?
                `
                    <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Specaility</p>
                    <p id="pokemon-speciality" class="text-base font-semibold flex-none">${godInfo.toUpperCase()}</p>`
                : '';
            }
        }
        else{
            const specialAbility = document.getElementById('pokemon-speciality-container');
            if (specialAbility) {
                specialAbility.innerHTML = '';
            }
        }

        renderTypes(data.types || []);
        renderStats(data.stats || []);

        setStatus('');
        return true;
    } catch (error) {
        setStatus('Pokemon not found.', true);
        return false;
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // Check if we should show detail view or list view
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonName = urlParams.get('pokemon');
    const pageParam = urlParams.get('page');
    const typeParam = urlParams.get('type');
    
    if (pokemonName) {
        const opened = await showDetailView(pokemonName, false);
        if (!opened) {
            const page = pageParam ? parseInt(pageParam) : 1;
            const type = typeParam || 'all';
            currentPage = page;
            selectedType = type;

            document.getElementById('list-view')?.classList.remove('hidden');
            document.getElementById('detail-view')?.classList.add('hidden');
            applyPageBackground('list');

            pokemonList = await listofpokemon();
            await loadPokemonData(200);
        }
    } else {
        const page = pageParam ? parseInt(pageParam) : 1;
        const type = typeParam || 'all';
        currentPage = page;
        selectedType = type;
        
        document.getElementById('list-view')?.classList.remove('hidden');
        document.getElementById('detail-view')?.classList.add('hidden');
        applyPageBackground('list');
        
        // Load Pokemon data for list view
        pokemonList = await listofpokemon();
        await loadPokemonData(200);
    }
    
    // Back button handler
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            showListView();
            setListStatus('');
        });
    }
    
    // List view search functionality
    const inputList = document.getElementById('pokemon-input-list');
    const formList = document.getElementById('search-form-list');
    
    if (inputList) {
        inputList.addEventListener('input', (e) => {
            const searchTerm = formatName(e.target.value);
            
            if (searchTerm.length < 2) {
                hideListSuggestions();
                return;
            }
            
            const matches = pokemonList.filter(name => 
                name.startsWith(searchTerm)
            ).sort();
            
            showSuggestionsForList(matches);
        });

        inputList.addEventListener('keydown', async (e) => {
            const container = document.getElementById('suggestions-container-list');
            if (!container || container.classList.contains('hidden')) {
                return;
            }

            const visibleMatches = currentListMatches.slice(0, 8);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedListSuggestionIndex = Math.min(selectedListSuggestionIndex + 1, visibleMatches.length - 1);
                updateListSuggestionHighlight();
                if (selectedListSuggestionIndex >= 0) {
                    inputList.value = visibleMatches[selectedListSuggestionIndex];
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedListSuggestionIndex = Math.max(selectedListSuggestionIndex - 1, -1);
                updateListSuggestionHighlight();
                if (selectedListSuggestionIndex >= 0) {
                    inputList.value = visibleMatches[selectedListSuggestionIndex];
                }
            } else if (e.key === 'Enter' && selectedListSuggestionIndex >= 0) {
                e.preventDefault();
                await showDetailView(visibleMatches[selectedListSuggestionIndex]);
                inputList.value = '';
                hideListSuggestions();
            } else if (e.key === 'Escape') {
                hideListSuggestions();
            }
        });
        
        inputList.addEventListener('blur', () => {
            setTimeout(hideListSuggestions, 150);
        });
        
        inputList.addEventListener('focus', (e) => {
            const searchTerm = formatName(e.target.value);
            if (searchTerm.length >= 2) {
                const matches = pokemonList.filter(name => 
                    name.startsWith(searchTerm)
                ).sort();
                showSuggestionsForList(matches);
            }
        });
    }
    
    if (formList && inputList) {
        formList.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = inputList.value;
            if (name) {
                await showDetailView(name);
                inputList.value = '';
                hideListSuggestions();
            }
        });
    }
});

// Suggestions for listview
const showSuggestionsForList = (matches) => {
    const container = document.getElementById('suggestions-container-list');
    if (!container) return;

    currentListMatches = matches;
    selectedListSuggestionIndex = -1;
    
    if (matches.length === 0) {
        container.classList.add('hidden');
        return;
    }
    
    container.innerHTML = matches
        .slice(0, 8)
        .map((name) => `
            <button type="button" class="suggestion-item-list w-full px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.2em] text-slate-800 transition hover:bg-slate-900/10" data-name="${name}">
                ${name}
            </button>
        `)
        .join('');
    
    container.classList.remove('hidden');
    
    container.querySelectorAll('.suggestion-item-list').forEach(item => {
        item.addEventListener('mousedown', async (e) => {
            e.preventDefault();
            const name = item.dataset.name;
            await showDetailView(name);
            const input = document.getElementById('pokemon-input-list');
            if (input) input.value = '';
            hideListSuggestions();
        });
    });
};

addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonName = urlParams.get('pokemon');
    const pageParam = urlParams.get('page');
    const typeParam = urlParams.get('type');
    
    if (pokemonName) {
        showDetailView(pokemonName, false);
    } else {
        const page = pageParam ? parseInt(pageParam) : 1;
        const type = typeParam || 'all';
        currentPage = page;
        selectedType = type;
        
        // Re-apply filter
        if (selectedType === 'all') {
            filteredPokemon = allPokemonData;
        } else {
            filteredPokemon = allPokemonData.filter(p => p.types.includes(selectedType));
        }
        
        document.getElementById('list-view')?.classList.remove('hidden');
        document.getElementById('detail-view')?.classList.add('hidden');
        applyPageBackground('list');
        renderTypeFilters();
        renderPokemonGrid();
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
