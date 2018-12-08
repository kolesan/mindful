import './volume_input.css';
import * as VolumeModel from './VolumeModel';
import * as log from '../../utils/Logging';

const SLIDER_STYLESHEET_ID = "sliderStyleSheet";

let icon = document.querySelector(".controls__button__volume").querySelector(".fas");
let slider = document.querySelector(".controls__volume__slider");

const volumeObj = VolumeModel.newInstance();

setVolumeIcon();
setVolumeSliderValue(volumeObj.volume);
initSliderStyleSheet(volumeObj.volume);
setSliderBackground(volumeObj.volume);



function getVolume() {
  return volumeObj.volume;
}

function isMuted() {
  return volumeObj.muted;
}

function setVolume(event) {
  let val = event.target.value;
  volumeObj.volume = val;

  setVolumeIcon();
  setSliderBackground(val);
}

function setSliderBackground(val) {
  let style = document.getElementById(SLIDER_STYLESHEET_ID);
  setSliderStyles(style, val);
}

function toggleMuted(event) {
  volumeObj.muted = !volumeObj.muted;

  let volume = volumeObj.muted ? 0 : volumeObj.volume;

  setVolumeIcon();
  setVolumeSliderValue(volume);
  setSliderBackground(volume);
}

function setVolumeIcon() {
  if (volumeObj.muted || volumeObj.volume == 0) {
    icon.classList.remove("fa-volume-up");
    icon.classList.add("fa-volume-mute");
  } else {
    icon.classList.remove("fa-volume-mute");
    icon.classList.add("fa-volume-up");
  }
}

function setVolumeSliderValue(val) {
  slider.value = val;
}

function initSliderStyleSheet(val) {
  let style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute("id", SLIDER_STYLESHEET_ID);
  setSliderStyles(style, val);
  document.head.appendChild(style);
}

function setSliderStyles(styleSheet, val) {
  styleSheet.innerHTML = `
    input[type=range]::-webkit-slider-runnable-track {
        background-size: ${val}% 100%;
    }
    
    input[type=range]::-moz-range-track {
        background-size: ${val}% 100%;
    }
  `;
}

export { getVolume, isMuted, setVolume, toggleMuted };