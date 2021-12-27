'use strict';
const play = document.querySelector('.play');
const playground = document.querySelector('.playground');

const carrot_size = 80;
let bug_count = 5;
let carrot_count = 5;
const gameTimer = document.querySelector('.timer');
const gameScore = document.querySelector('.left_carrot');

const popup = document.querySelector('.pop-up');
const popupR = document.querySelector('.pop-up_refresh');
const popupM = document.querySelector('.pop-up-message');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

let GAME_DURATION = 8;
let started = false;
let score = 0;
let timer = undefined;
let nowlevel = 0;

const level = document.querySelector('.level');

playground.addEventListener('click', onFieldClick);
play.addEventListener('click', () =>{
  if(started){
    game_stop();
  }
  else{
    game_start();
  }
});

function game_start() {
  started=true;
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}
function game_stop() {
  started=false;
  hideStartBtn();
  stopGameTimer();
  showPopUpWithText('Re Play?');
  playSound(alertSound);
  stopSound(bgSound);
}
function finishGame(win){
  started=false;
  hideStartBtn();
  stopGameTimer();
  showPopUpWithText(win? 'You Won' : 'You Lost');
  if(win === true){
    playSound(winSound);
    stopSound(bgSound);
  }
  else{
    playSound(bugSound);
    stopSound(bgSound);
    nowlevel=0;
    carrot_count=5;
    bug_count=5;
  }
}

function   showStopBtn(){
  const icon = play.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  play.style.visibility = 'visible';
}
function hideStartBtn(){
  play.style.visibility = 'hidden';
}
function   showTimerAndScore(){
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}
function   showPopUpWithText(text){
  popupM.innerText = text;
  popup.classList.remove('pop-up-hide');
}
function hidePopUp(){
  popup.classList.add('pop-up-hide');
}
function   startGameTimer(){
  var time = GAME_DURATION;
  var min = "";
  var sec = "";
  
  timer = setInterval(function() {
    min = parseInt(time/60);
    sec = time%60;
    const locar_timer = document.querySelector('.timer');
    locar_timer.innerHTML=`<span>${min} : ${sec} </span>`;
    time--;
    if (time<0){
      clearInterval(timer);
      finishGame(carrot_count === score);
    }
  }, 980);  
}
function stopGameTimer(){
  clearInterval(timer);
}
const playground_Rect = playground.getBoundingClientRect();
const width = playground_Rect.width;
const height = playground_Rect.height;

function initGame(){
  levelDP();
  score=0;
  playground.innerHTML ='';
  gameScore.innerText = carrot_count;
  addItem('carrot', carrot_count++, 'img/carrot.png');
  addItem('bug', bug_count++, 'img/bug.png');
}
function addItem(className, count, imgPath){
  const x1 = 0;
  const y1 = 0;
  const x2 = playground_Rect.width - carrot_size;
  const y2 = playground_Rect.height - carrot_size;
  for(let i=0;i<count;i++){
      const item = document.createElement('img');
      item.setAttribute('class', className)
      item.setAttribute('src', imgPath)
      item.setAttribute('data-id', `id-${className}`);
      `id-${className}++`;
      item.style.position = 'absolute';
      const x = getRD(x1, x2);
      const y = getRD(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      playground.append(item);
  }
}
function getRD(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}
function onFieldClick(event){
  if(!started){return;}
  const target =event.target;
  if(target.matches('.carrot')){
    playSound(carrotSound);
    target.remove('');
    score++;
    updateScoreBoard();
    //당근
    if(score === carrot_count-1){
      finishGame(true);
    }
  }
  else if(target.matches('.bug')){
    stopGameTimer();
    finishGame(false);
    //벌래
  }
}
function playSound(sound){
  sound.currentTime=0;
  sound.play();
}
function stopSound(sound){
  sound.pause();
}
function     updateScoreBoard(){
  gameScore.innerText= carrot_count-score;
}

popupR.addEventListener('click', () =>{
  hidePopUp();
  game_start();
});
function levelDP(){
  level.innerText= `Level ${carrot_count-4}`;
}