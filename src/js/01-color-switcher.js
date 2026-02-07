const refs = {
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
};

let timerId = null;
const delay = 1000;

refs.stopBtn.disabled = true;

refs.startBtn.addEventListener('click', onStartButtonClick);
refs.stopBtn.addEventListener('click', onStopButtonClick);

function onStartButtonClick() {
  if (timerId) return;

  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = false;

  timerId = setInterval(() => {
    changeBackgroundColor();
  }, delay);
}

function onStopButtonClick() {
  refs.startBtn.disabled = false;
  refs.stopBtn.disabled = true;

  clearInterval(timerId);
  timerId = null;
}

function changeBackgroundColor() {
  document.body.style.backgroundColor = getRandomHexColor();
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
