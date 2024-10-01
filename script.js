// Global variables for the game
let players = [];
let gamePhase = 'Night'; // Night or Day
let mafia, doctor, detective;
let gameOver = false;

// Function to assign roles
function assignRoles() {
    let numMafia = Math.floor(players.length / 3);
    let roles = ['Mafia', 'Doctor', 'Detective'];
    roles = roles.concat(Array(players.length - roles.length).fill('Townsperson'));
    roles.sort(() => Math.random() - 0.5);

    players = players.map((player, index) => {
        return { name: player.trim(), role: roles[index], alive: true };
    });
}

// Function to start the game
document.getElementById('start-game').addEventListener('click', () => {
    const playerNames = document.getElementById('player-names').value.split(',');
    if (playerNames.length < 4) {
        alert('Please enter at least 4 players.');
        return;
    }
    players = playerNames;
    assignRoles();

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    updatePlayersList();
});

// Function to update the players list in the UI
function updatePlayersList() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = ''; // Clear the current list

    players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.classList.add(player.alive ? 'alive' : 'dead');
        playerDiv.textContent = `${player.name} (${player.role}) - ${player.alive ? 'Alive' : 'Dead'}`;
        playersList.appendChild(playerDiv);
    });
}

// Function to toggle between night and day phases
document.getElementById('next-phase').addEventListener('click', () => {
    if (gameOver) return;

    if (gamePhase === 'Night') {
        nightPhase();
    } else {
        dayPhase();
    }

    updatePlayersList();
    checkGameOver();
});

// Night phase logic
function nightPhase() {
    document.getElementById('game-phase').textContent = 'Night';

    // Mafia eliminates a random player
    const mafia = players.find(p => p.role === 'Mafia' && p.alive);
    let target = getRandomAlivePlayer(mafia);
    const doctor = players.find(p => p.role === 'Doctor' && p.alive);
    const detective = players.find(p => p.role === 'Detective' && p.alive);
    
    // Doctor protects a random player (including possibly the target)
    let protectedPlayer = getRandomAlivePlayer(doctor);

    if (target !== protectedPlayer) {
        target.alive = false;
        alert(`${target.name} was killed by the Mafia.`);
    } else {
        alert(`${target.name} was protected by the Doctor!`);
    }

    // Detective investigates a random player
    let investigatedPlayer = getRandomAlivePlayer(detective);
    alert(`Detective investigated ${investigatedPlayer.name}. Role: ${investigatedPlayer.role}`);
    
    gamePhase = 'Day';
}

// Day phase logic
function dayPhase() {
    document.getElementById('game-phase').textContent = 'Day';
    let alivePlayers = players.filter(p => p.alive);

    // Ask the players to vote on who to eliminate
    let suspect = prompt('Enter the name of the player to vote out:');
    let suspectPlayer = players.find(p => p.name.toLowerCase() === suspect.trim().toLowerCase());

    if (suspectPlayer && suspectPlayer.alive) {
        suspectPlayer.alive = false;
        alert(`${suspectPlayer.name} has been voted out by the town.`);
    } else {
        alert('Invalid vote.');
    }

    gamePhase = 'Night';
}

// Helper function to get a random alive player
function getRandomAlivePlayer(excludePlayer = null) {
    let alivePlayers = players.filter(p => p.alive && p !== excludePlayer);
    return alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
}

// Check if the game is over
function checkGameOver() {
    let mafiaAlive = players.filter(p => p.alive && p.role === 'Mafia');
    let townspeopleAlive = players.filter(p => p.alive && p.role !== 'Mafia');

    if (mafiaAlive.length === 0) {
        document.getElementById('game-over-message').textContent = 'Townspeople win!';
        endGame();
    } else if (mafiaAlive.length >= townspeopleAlive.length) {
        document.getElementById('game-over-message').textContent = 'Mafia win!';
        endGame();
    }
}

// End the game and show the restart button
function endGame() {
    gameOver = true;
    document.getElementById('game-area').classList.add('hidden');
    document.getElementById('game-over').classList.remove('hidden');
}

// Restart the game
document.getElementById('restart-game').addEventListener('click', () => {
    location.reload(); // Reload the page to start fresh
});
