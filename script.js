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

            if (this.cardsToCheck){ // check for match cards
                this.checkForCardMatch(card);
            }else{
                this.cardsToCheck = card;
            }
        }
    }

    checkForCardMatch(card){
        if (this.getCardType(card) === this.getCardType(this.cardsToCheck)){
            this.cardMatch(card, this.cardsToCheck);
        }else{
            this.cardMissMatch(card, this.cardsToCheck);
        }
        this.cardsToCheck = null;
    }

    cardMatch(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);

        card1.classList.add('matched');
        card2.classList.add('matched');

        this.audioController.match();

        if (this.matchedCards.length == this.cardsArray.length){
            this.victory();
        }
    }

    cardMissMatch(card1, card2){
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }

    canFlipCard(card){
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardsToCheck);
    }

    shuffleCards(){
        for (let i = this.cardsArray.length - 1; i > 0; i--){
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    startCountdown(){
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerHTML = this.timeRemaining;
            if (this.timeRemaining === 0){
                this.gameOver();
            }
        }, 1000);
    }

    gameOver(){
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible')
    }

    victory(){
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible')
    }

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