import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  dateTimePickerEl: document.querySelector('#datetime-picker'),
  startBtnEl: document.querySelector('button[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

let timerID = null;
let currentDate = null;
const TIME_DELAY = 1000;

refs.startBtnEl.addEventListener('click', onStartBtnCounter);
refs.startBtnEl.disabled = true;

function onStartBtnCounter() {
  timerID = setInterval(() => {
    refs.startBtnEl.disabled = true;
    refs.dateTimePickerEl.disabled = true;
    const timeLeft = currentDate - new Date();
    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    refs.daysEl.textContent = addLeadingZero(days);
    refs.hoursEl.textContent = addLeadingZero(hours);
    refs.minutesEl.textContent = addLeadingZero(minutes);
    refs.secondsEl.textContent = addLeadingZero(seconds);

    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      Notify.success('Time over');
      clearInterval(timerID);
      refs.startBtnEl.disabled = false;
      refs.dateTimePickerEl.disabled = false;
    }
  }, TIME_DELAY);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      Notify.failure('Please choose a date in the future');
    } else {
      refs.startBtnEl.disabled = false;
      Notify.success('Success');
      currentDate = selectedDates[0];
    }
  },
};

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

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

flatpickr(refs.dateTimePickerEl, options);
