let startBtn = document.getElementById("start-btn");
let inflateBtn = document.getElementById("inflate-btn");

// #region Game Logic & Data
let buttonClick = 0;
let height = 120;
let width = 100;
let heightRate = 12;
let widthRate = 10;
let maxSize = 240;
let currentPopCounter = 0;
let highestPopCount = 0;
let gameLength = 9000;
let clockId;
let timeRemaining;
let currentPlayer = {};
let clockCount = document.getElementById("time-count");

function startGame() {
    currentPopCounter = 0;
    startBtn.setAttribute("disabled", true);
    inflateBtn.removeAttribute("disabled");
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
    if(height >= maxSize) {
        console.log("Pop the Balloon");
        height = 120;
        width = 100;
        buttonClick = 0;
        currentPopCounter++;
    }
    drawtoScreen();
} 

function drawtoScreen() {
    let balloonInflate = document.getElementById("balloon");
    let clickCount = document.getElementById("click-count");
    let popCount = document.getElementById("pop-count");
    let highPopCount = document.getElementById("high-pop-count");
    
    balloonInflate.style.height = height + "px";
    balloonInflate.style.width = width + "px";
    
    clickCount.textContent = buttonClick;
    popCount.textContent = currentPopCounter;
    highPopCount.textContent = currentPlayer.topScore;
}

function stopGame() {
    //alert("Your time has elapsed!");

        height = 120;
        width = 100;
        buttonClick = 0;
        
        inflateBtn.setAttribute("disabled", true);
        startBtn.removeAttribute("disabled");

        if(currentPopCounter > currentPlayer.topScore) {
            currentPlayer.topScore = currentPopCounter;
        }
        savePlayers();

        stopClock();
        drawtoScreen();
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