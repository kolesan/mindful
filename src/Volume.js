import * as VolumeModel from './VolumeModel';
import * as log from './Logging';

const volumeObj = VolumeModel.newInstance();

function getVolume() {
  return volumeObj.volume;
}

function isMuted() {
  return volumeObj.muted;
}

function setVolume(event) {
  volumeObj.volume = event.target.value;

  setVolumeIcon();
  setVolumeSliderValue();
}

function toggleMuted(event) {
  volumeObj.muted = !volumeObj.muted;

  setVolumeIcon();
  setVolumeSliderValue();
}

function setVolumeIcon() {
  let icon = document.querySelector(".controls__button__volume").querySelector(".fas");
  if (volumeObj.muted || volumeObj.volume == 0) {
    icon.classList.remove("fa-volume-up");
    icon.classList.add("fa-volume-mute");
  } else {
    icon.classList.remove("fa-volume-mute");
    icon.classList.add("fa-volume-up");
  }
}

function setVolumeSliderValue() {
  document.querySelector(".controls__volume__slider").value = volumeObj.muted ? 0 : volumeObj.volume;
}

export { getVolume, isMuted, setVolume, toggleMuted };