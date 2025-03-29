export async function getPlayerInfo(filterList = []) {
    try {
        let validFighter = false;
        let data;
        let randomPlayerId;
        let attempts = 0;
        const MAX_ATTEMPTS = 5;

        while (!validFighter && attempts < MAX_ATTEMPTS) {
            attempts++;
            randomPlayerId = Math.floor(Math.random() * 2000) + 1;

            const response = await fetch(`https://v1.mma.api-sports.io/fighters?id=${randomPlayerId}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "v1.mma.api-sports.io",
                    "x-rapidapi-key": import.meta.env.VITE_FIGHTER_API_KEY
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            data = await response.json();

            // Check if we got a valid fighter that's not in banned categories
            if (data.response && data.response.length > 0) {
                const fighterCategory = data.response[0].category;

                // If no filter list provided, or fighter's category isn't banned
                if (!filterList.length || !fighterCategory || !filterList.includes(fighterCategory)) {
                    validFighter = true;
                }
            }
        }

        if (attempts >= MAX_ATTEMPTS) {
            throw new Error('Max attempts reached finding a non-banned fighter');
        }

        const playerInfo = {
            name: data.response[0].name,
            nickname: data.response[0].nickname || 'N/A',
            age: data.response[0].age || 'N/A',
            photo: data.response[0].photo || null,
            category: data.response[0].category || 'N/A',
            height: data.response[0].height || 'N/A',
            weight: data.response[0].weight || 'N/A',
            reach: data.response[0].reach || 'N/A'
        };

        return playerInfo;
    } catch (err) {
        console.error('Error fetching player information:', err);
        return {
            name: attempts >= MAX_ATTEMPTS
                ? 'Could not find fighter not in banned categories. Try removing some bans.'
                : 'Sorry, I\'m too broke to find more than 10 fighters a minute. Please try again later.',
            nickname: '',
            age: '',
            photo: null,
            category: '',
            height: '',
            weight: '',
            reach: ''
        };
    }
}