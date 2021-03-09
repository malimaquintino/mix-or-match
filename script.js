class AudioController {
    constructor(){
        this.bgMusic = new Audio('./assets/Audio/creepy.mp3');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;

        this.flipSound = new Audio('./assets/Audio/flip.wav');
        this.matchSound = new Audio('./assets/Audio/match.wav');
        this.victorySound = new Audio('./assets/Audio/victory.wav');
        this.gameOverSound = new Audio('./assets/Audio/gameOver.wav');
    }

    startMusic(){
        this.bgMusic.play();
    }

    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime=0;
    }

    flip(){
        this.flipSound.play();
    }

    match(){
        this.matchSound.play();
    }

    victory(){
        this.stopMusic()
        this.victorySound.play();
    }

    gameOver(){
        this.stopMusic()
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards){
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips')
        this.audioController = new AudioController();
    }

    startGame(){
        this.cardsToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500);

        this.hideCards();
        this.timer.innerHTML = this.timeRemaining;
        this.ticker.innerHTML = this.totalClicks;
    }

    flipCard(card){
        if (this.canFlipCard()){
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerHTML = this.totalClicks;
            card.classList.add('visible');
        }
    }

    canFlipCard(card){
        return true;
        //return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardsToCheck);
    }

    shuffleCards(){
        for (let i = this.cardsArray.length - 1; i > 0; i--){
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    startCountdown(){}

    hideCards(){
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('match');
        });
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', ()=>{
            overlay.classList.remove('visible');
            game.startGame()
        })
    });

    cards.forEach(card =>{
        card.addEventListener('click', ()=>{
            game.flipCard(card);
        });
    });
}

if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready());
}else{
    ready();
}