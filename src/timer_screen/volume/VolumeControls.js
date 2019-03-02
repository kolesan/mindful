import './volume_input.css';

import { log } from '../../utils/Logging';
import Volume from './Volume';
import { saveSettings } from "../../storage/local_storage/LocalStorage";

const SLIDER_STYLESHEET_ID = "sliderStyleSheet";

//TODO cleanup this mess (same elements and etc.)
let icon = document.querySelector(".controls__button__volume").querySelector(".fas");
let slider = document.querySelector(".controls__volume__slider");
let volumeBtn = document.getElementById("volumeBtn");
let volumeSlider = document.getElementById("volumeSlider");
volumeBtn.addEventListener("click", toggleMuted);
volumeSlider.addEventListener("input", volumeChangeListener);

setVolumeIcon();
setVolumeSliderValue(Volume.volume);
initSliderStyleSheet(Volume.volume);
setSliderBackground(Volume.volume);


function volumeChangeListener(event) {
  let volume = event.target.value;
  setVolume(volume);
  saveSettings({volume});
}

function setVolume(val) {
  log("Setting volume to", val);
  Volume.volume = val;

  setVolumeIcon();
  setSliderBackground(val);
}

function setSliderBackground(val) {
  let style = document.getElementById(SLIDER_STYLESHEET_ID);
  setSliderStyles(style, val);
}

function setVolumeSlider(volume) {
  setVolumeSliderValue(volume);
  setVolume(volume)
}

function toggleMuted(event) {
  Volume.muted = !Volume.muted;

  let volume = Volume.muted ? 0 : Volume.volume;

  setVolumeIcon();
  setVolumeSliderValue(volume);
  setSliderBackground(volume);
}

function setVolumeIcon() {
  if (Volume.muted || Volume.volume == 0) {
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

export { setVolumeSlider, volumeChangeListener, toggleMuted };