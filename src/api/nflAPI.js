export async function getPlayerInfo(filterList = []) {
    let attempts = 0;
    const MAX_ATTEMPTS = 7;
    try {
        let validPlayer = false;
        let data;
        let randomPlayerId;

        while (!validPlayer && attempts < MAX_ATTEMPTS) {
            attempts++;
            randomPlayerId = Math.floor(Math.random() * 50) + 1;

            const response = await fetch(`https://v1.american-football.api-sports.io/players?id=${randomPlayerId}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "v1.american-football.api-sports.io",
                    "x-rapidapi-key": import.meta.env.VITE_FIGHTER_API_KEY
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            data = await response.json();

            if (data.response && data.response.length > 0) {
                const playerCategory = data.response[0].position;

                if (!filterList.length || !filterList.includes(playerCategory)) {
                    validPlayer = true;
                }
            }
        }

        if (attempts >= MAX_ATTEMPTS) {
            throw new Error('Max attempts reached finding a non-banned player');
        }

        const playerInfo = {
            name: data.response[0].name,
            age: data.response[0].age || 'N/A',
            image: data.response[0].image || null,
            position: data.response[0].position || 'N/A',
            height: data.response[0].height || 'N/A',
            weight: data.response[0].weight || 'N/A',
            college: data.response[0].college || 'N/A',
        };

        return playerInfo;
    } catch (err) {
        console.error('Error fetching player information:', err);
        return {
            name: attempts >= MAX_ATTEMPTS
                ? 'Could not find player not in banned categories in 7 tries. Try again.'
                : 'Sorry, I\'m too broke to find more than 10 fighters a minute. Please try again later.',
            age: '',
            image: null,
            position: '',
            height: '',
            weight: '',
            college: ''
        };
    }
}