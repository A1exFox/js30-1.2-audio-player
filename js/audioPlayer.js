function audioPlayer(option) {
  const player = {
    play,
    pause,
    next,
    previous,
    getTime,
    setTime,
  };
  let index;
  const audio = new Audio();
  const image = new Image();
  let source;

  (async function create(url) {
    const response = await fetch(url);
    source = await response.json();
    init(0);
  })(option.url);

  function init(newIndex) {
    index = newIndex;
    preload(source[index].info);
    image.src = source[index].src.image;
    audio.src = source[index].src.audio;
    image.onload = () => setTimeout(() => imgload(), 1000);
    audio.oncanplay = () => setTimeout(() => audioload(), 1000);
  }
  function audioload() {
    audio.onended = next;
    audio.ontimeupdate = option.callback.timeupdate;
    const duration = audio.duration;
    option.callback.audioload(duration);
  }
  function imgload() {
    option.callback.imgload(image);
  }
  function preload(info) {
    option.callback.preload(info);
  }
  function setTime(seconds) {
    audio.currentTime = seconds;
  }
  function getTime() {
    return audio.currentTime;
  }
  function next() {
    const expectIndex = index + 1;
    const maxIndex = source.length - 1;
    const validIndex = expectIndex > maxIndex ? 0 : expectIndex;
    init(validIndex);
  }
  function previous() {
    const expectIndex = index - 1;
    const maxIndex = source.length - 1;
    const validIndex = expectIndex < 0 ? maxIndex : expectIndex;
    init(validIndex);
  }
  function play() {
    audio.play();
  }
  function pause() {
    audio.pause();
  }
  return player;
}