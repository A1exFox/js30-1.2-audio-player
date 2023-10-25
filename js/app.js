(() => {
  const optionPlayer = {
    url: './assets/audio.json',
    callback: {
      preload,
      imgload,
      audioload,
      timeupdate,
    }
  }
  const player = audioPlayer(optionPlayer);
  const element = getElements();
  let isPlay = false;
  const loaded = {
    image: false,
    audio: false,
  };

  function getElements() {
    const elements = {
      play: document.getElementById('play'),
      pause: document.getElementById('pause'),
      title: document.getElementById('title'),
      author: document.getElementById('author'),
      next: document.getElementById('next'),
      previous: document.getElementById('previous'),
      progress: document.getElementById('progress'),
      duration: document.getElementById('duration'),
      currentTime: document.getElementById('currentTime'),
      background: document.getElementById('background'),
      preview: document.getElementById('preview'),
    }
    elements.play.onclick = play;
    elements.pause.onclick = pause;
    elements.next.onclick = next;
    elements.previous.onclick = previous;
    elements.progress.oninput = setProgress;
    return elements;
  }
  function next() {
    player.next();
  }
  function previous() {
    player.previous();
  }
  function play() {
    element.play.classList.remove('_show');
    element.pause.classList.add('_show');
    element.preview.classList.add('_isplay');
    player.play();
  }
  function pause() {
    element.play.classList.add('_show');
    element.pause.classList.remove('_show');
    element.preview.classList.remove('_isplay');
    player.pause();
  }
  function timeupdate() {
    const currentTime = player.getTime();
    element.progress.value = currentTime;
    element.currentTime.textContent = formatTime(currentTime);
  }
  function setProgress() {
    const progress = element.progress.value;
    player.setTime(progress);
  }
  function audioload(duration) {
    element.progress.disabled = false;
    element.progress.max = duration;
    element.duration.textContent = formatTime(duration);
    loaded.audio = true;
    changeoverSwitch();
    element.play.disabled = false;
    element.pause.disabled = false;
    if (isPlay) play();
    else isPlay = true;
  }
  function imgload(image) {
    loaded.image = true;
    changeoverSwitch();
    const background = image.cloneNode(true);
    const preview = image.cloneNode(true);
    background.alt = element.background.alt
    background.classList.value = element.background.classList.value;
    background.id = element.background.id;
    preview.alt = element.preview.alt;
    preview.classList.value = element.preview.classList.value;
    preview.id = element.preview.id;
    element.background.replaceWith(background);
    element.preview.replaceWith(preview);
    element.background = background;
    element.preview = preview;
  }
  function preload(info) {
    element.progress.disabled = true;
    loaded.image = false;
    loaded.audio = false;
    changeoverSwitch();
    element.play.disabled = true;
    element.pause.disabled = true;
    pause();
    element.author.textContent = info.author;
    element.title.textContent = info.title;
  }
  function formatTime(duration) {
    const minutes = Math.trunc(duration / 60).toString();
    const seconds = Math.trunc(duration % 60).toString();
    const minutesFormat = minutes.padStart(2, '0');
    const secontsFormat = seconds.padStart(2, '0');
    const time = `${minutesFormat}:${secontsFormat}`;
    return time;
  }
  function changeoverSwitch() {
    if (!loaded.image && !loaded.audio) {
      element.next.disabled = true;
      element.previous.disabled = true;
    }
    if (loaded.image && loaded.audio) {
      element.next.disabled = false;
      element.previous.disabled = false;
    }
  }
})();