const formatName = (value) => value.trim().toLowerCase();


const GodsofPokemon = {
    Arceus: "The creator of all Pokémon",
    "Giratina-altered" : "The god of antimatter",
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
        .map((type) => {
            return `<span class="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">${type.type.name}</span>`;
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
        const pokemonList = data.results.map(pokemon => pokemon.name);
        console.log('List of Pokemon:', pokemonList.sort());
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
    }
};

listofpokemon();

const info = async (name) => {
    const formattedName = formatName(name);
    if (!formattedName) {
        setStatus('Enter a Pokemon name.', true);
        return;
    }

    const godInfo = GodsofPokemon[formattedName.charAt(0).toUpperCase() + formattedName.slice(1)];


    setStatus('Loading...');
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${formattedName}/`);
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }
        const data = await response.json();
        const image = data.sprites.other['official-artwork'].front_default || data.sprites.front_shiny || data.sprites.front_default;

        const pokemonContainer = document.getElementById('pokemon');
        if (pokemonContainer) {
            pokemonContainer.innerHTML = image
                ? `<img src="${image}" alt="${data.name}" class="h-48 w-48 drop-shadow-[0_12px_20px_rgba(15,23,42,0.35)] image-rendering-crisp-edges" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;">`
                : '<div class="text-sm font-semibold text-slate-500">No sprite available</div>';
        }

        const nameEl = document.getElementById('pokemon-name');
        if (nameEl) {
            nameEl.innerHTML = `<p class='text-sm font-semibold uppercase tracking-[0.2em]'>${data.name.toUpperCase()}</p>`;
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
                    <p id="pokemon-speciality" class="text-base font-semibold">${godInfo.toUpperCase()}</p>`
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
    } catch (error) {
        setStatus('Pokemon not found.', true);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('pokemon-input');
    const button = document.getElementById('search-button');

    // const enteredPokemon = formatName(input.value);

    // const suggestions = listofpokemon().then(pokemonList => {
    //     const matchedPokemon = pokemonList.filter(pokemon => pokemon.startsWith(enteredPokemon)).sort();
    //     console.log('Suggestions:', matchedPokemon);
    // }).catch(error => {
    //     console.error('Error fetching Pokemon suggestions:', error);
    // });
    // suggestions();

    if (form && input) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            info(input.value);
        });
    }

    if (button && input) {
        button.addEventListener('click', () => {
            info(input.value);
        });
    }

    info('pikachu');
});
