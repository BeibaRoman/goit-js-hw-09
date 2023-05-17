const refs = {
  startBtn: document.querySelector('button[data-start]'),
  stopBtn: document.querySelector('button[data-stop]'),
};
const DELAY_SWITCHER = 1000;
let timerID = null;

refs.startBtn.addEventListener('click', onStartSwitchColor);
refs.stopBtn.addEventListener('click', onStopSwitchColor);

refs.stopBtn.disabled = true;

function onStartSwitchColor() {
  timerID = setInterval(() => {
    document.body.style.backgroundColor = getRandomHexColor();
    refs.startBtn.disabled = true;
    refs.stopBtn.disabled = false;
  }, DELAY_SWITCHER);
}

function onStopSwitchColor() {
  clearInterval(timerID);
  refs.startBtn.disabled = false;
  refs.stopBtn.disabled = true;
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
