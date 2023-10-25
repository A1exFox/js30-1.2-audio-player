(() => {
  const optionPlayer = {
    url: './assets/audio.json',
    callback: {
      preload,
      imgload,
      audioload,
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
    }
    elements.play.onclick = play;
    elements.pause.onclick = pause;
    elements.next.onclick = next;
    elements.previous.onclick = previous;
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
    player.play();
  }
  function pause() {
    element.play.classList.add('_show');
    element.pause.classList.remove('_show');
    player.pause();
  }
  function audioload() {
    loaded.audio = true;
    changeoverSwitch();
    element.play.disabled = false;
    element.pause.disabled = false;
    if (isPlay) play();
    else isPlay = true;
  }
  function imgload() {
    loaded.image = true;
    changeoverSwitch();
  }
  function preload(info) {
    loaded.image = false;
    loaded.audio = false;
    changeoverSwitch();
    element.play.disabled = true;
    element.pause.disabled = true;
    pause();
    element.author.textContent = info.author;
    element.title.textContent = info.title;
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