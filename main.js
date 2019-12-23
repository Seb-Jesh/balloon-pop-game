let clockCount = document.getElementById("time-count");

// #region Game Logic & Data
let buttonClick = 0;
let height = 0;
let width = 0;
let heightRate = 12;
let widthRate = 10;
let maxSize = 300;
let currentPopCounter = 0;
let highestPopCount = 0;
let gameLength = 18000;
let clockId;
let timeRemaining;
let currentPlayer = {};
let currentColor = "blue";
let balloonColors = ["red", "indigo", "green", "blue"];

function startGame() {
    resetGame();
    currentPopCounter = 0;
    document.getElementById("game-controls").classList.add("hidden");
    document.getElementById("game-stats").classList.remove("hidden");
    document.getElementById("scoreboard").classList.add("hidden");
    drawtoScreen();
    startClock();
    setTimeout(stopGame, gameLength);
}

function startClock() {
    clockCount.textContent = (gameLength / 1000);
    timeRemaining = gameLength;
    clockId = setInterval(drawClock, 1000);
}

function stopClock() {
    clearInterval(clockId);
}

function drawClock() {
    timeRemaining -= 1000;
    clockCount.textContent = timeRemaining / 1000;
}

function inflate() {
    buttonClick++;
    height += heightRate; 
    width += widthRate;
    balloonPopped();
    drawtoScreen();
}

function balloonPopped() {
    if(height >= maxSize) {
        document.getElementById("pop-sound").play();
        let balloonInflate = document.getElementById("balloon");
        balloonInflate.classList.remove(currentColor);
        randomColor();
        balloonInflate.classList.add(currentColor);
        currentPopCounter++;
        resetGame();
    }
} 

function randomColor() {
   let i = Math.floor(Math.random() * balloonColors.length);
   currentColor = balloonColors[i];
}

function drawtoScreen() {
    let balloonInflate = document.getElementById("balloon");
    let clickCount = document.getElementById("click-count");
    let popCount = document.getElementById("pop-count");
    let highPopCount = document.getElementById("high-pop-count");
    let playerNameDisplay = document.getElementById("player-name");
    
    balloonInflate.style.height = height + "px";
    balloonInflate.style.width = width + "px";
    
    clickCount.textContent = buttonClick;
    popCount.textContent = currentPopCounter;
    highPopCount.textContent = currentPlayer.topScore;
    playerNameDisplay.textContent = currentPlayer.name;
}

function stopGame() {
    //alert("Your time has elapsed!");

        resetGame();
        
        document.getElementById("game-stats").classList.add("hidden");
        document.getElementById("game-controls").classList.remove("hidden");
        document.getElementById("scoreboard").classList.remove("hidden");

        if(currentPopCounter > currentPlayer.topScore) {
            currentPlayer.topScore = currentPopCounter;
        }
        savePlayers();

        stopClock();
        drawtoScreen();
        drawScoreboard();
} 

function resetGame() {
    height = 12;
    width = 10;
    buttonClick = 0;
}

// #endregion Game Logic & Data

let players = []
loadPlayers();

function setPlayer(event) {
   event.preventDefault();
   let form = event.target;

   let playerName = form.playerName.value;
   currentPlayer = players.find(player => player.name == playerName);
   if(!currentPlayer) {
       currentPlayer = {name: playerName, topScore: 0};
       players.push(currentPlayer);
       savePlayers();
    }
    console.log(currentPlayer);
   form.reset();
   document.getElementById("game").classList.remove("hidden");
   form.classList.add("hidden");
   drawtoScreen();
   drawScoreboard();
}

function changePlayer() {
    document.getElementById("player-form").classList.remove("hidden");
    document.getElementById("game").classList.add("hidden");
}

function savePlayers() {
    window.localStorage.setItem("players", JSON.stringify(players));
}

function loadPlayers() {
    let playersData = JSON.parse(window.localStorage.getItem("players"));
    if(playersData) {
        players = playersData;
    }
}

function drawScoreboard() {
    let template = '';

    players.sort((a, b) => b.topScore - a.topScore);

    players.forEach(player => {
        template += `
        <div class="d-flex space">
                <span>${player.name}</span>
                <span>${player.topScore}</span>
            </div>
        `
    })
    document.getElementById("players").innerHTML = template
}

drawScoreboard();