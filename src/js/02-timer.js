import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const TIME_DELAY = 1000;

const refs = {
  dateTimePicker: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let timerId = null;
let targetTimestamp = null;

init();

function init() {
  refs.startBtn.disabled = true;
  refs.startBtn.addEventListener('click', onStartBtnClick);

  flatpickr(refs.dateTimePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose: onPickerClose,
  });
}

function onPickerClose(selectedDates) {
  const pickedDate = selectedDates[0];
  const pickedTimestamp = pickedDate?.getTime?.();

  if (!pickedTimestamp) {
    refs.startBtn.disabled = true;
    return;
  }

  if (pickedTimestamp <= Date.now()) {
    Notify.failure('Please choose a date in the future');
    refs.startBtn.disabled = true;
    targetTimestamp = null;
    return;
  }

  targetTimestamp = pickedTimestamp;
  refs.startBtn.disabled = false;
  Notify.success('Success');
}

function onStartBtnClick() {
  if (!targetTimestamp || timerId) return;

  refs.startBtn.disabled = true;
  refs.dateTimePicker.disabled = true;

  tick(); // show immediately
  timerId = setInterval(tick, TIME_DELAY);
}

function tick() {
  const timeLeftMs = targetTimestamp - Date.now();

  if (timeLeftMs <= 0) {
    updateTimerDisplay(0, 0, 0, 0);
    stopTimer();
    Notify.success('Time over');
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeLeftMs);
  updateTimerDisplay(days, hours, minutes, seconds);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;

  refs.dateTimePicker.disabled = false;

  // start button should be enabled only if we still have a valid future target date
  refs.startBtn.disabled = !(targetTimestamp && targetTimestamp > Date.now());
}

function updateTimerDisplay(days, hours, minutes, seconds) {
  refs.days.textContent = formatDays(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

// If days can be 100+, it's nicer not to force "2 digits" for days
function formatDays(value) {
  return String(value);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
