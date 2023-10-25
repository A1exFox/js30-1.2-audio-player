function audioPlayer(url) {
  let loadedData;
  let currentIndex;
  const player = {
    audio: null,
    callback: {
      image: null,
      audio: null,
      preload: null,
      postload: null,
    },
    next,
    previous,
    play,
    pause,
    isplay,
  };
  create();
  function play() {
    const validPlay = isaudio() && !isplay();
    if (!validPlay) return false;
    console.log('play');
    player.audio.play();
    return true;
  }
  function pause() {
    // 
    const validPause = isaudio() && isplay();
    if (!validPause) return false;
    console.log('pause');
    player.audio.pause();
    return true;
  }
  function previous() {
    const expectIndex = currentIndex - 1;
    const maxIndex = loadedData.length - 1;
    const minIndex = 0;
    const index = expectIndex < minIndex ? maxIndex : expectIndex;
    init(index);
  }
  function next() {
    const expectIndex = currentIndex + 1;
    const maxIndex = loadedData.length - 1;
    const minIndex = 0;
    const index = expectIndex > maxIndex ? minIndex : expectIndex;
    init(index);
  }
  function updateImage(image) {
    const callback = player.callback.image;
    if (callback) callback(image);
  }
  function updateAudio(audio) {
    addAudio(audio);
    const callback = player.callback.audio;
    if (callback) callback();
  }
  function updatePreload(index) {
    currentIndex = index;
    const callback = player.callback.preload;
    if (callback) callback();
    removeAudio();
  }
  function updatePostload() {
    const callback = player.callback.postload;
    if (callback) callback();
  }
  function addAudio(audio) {
    if (isaudio()) return false;
    player.audio = audio;
    return true;
  }
  function removeAudio() {
    if (isaudio()) {
      player.audio.remove();
      player.audio = null;
    }
    return true;
  }
  function isplay() {
    return !player.audio.paused;
  }
  function isaudio() {
    if (player.audio) return true;
    return false;
  }

  async function create() {
    try {
      const response = await fetch(url);
      const json = await response.json();
      loadedData = json;
      init(0);
    }
    catch (error) {
      console.log(error);
    }
  }
  function init(index) {
    const config = {
      image: {
        src: loadedData[index].src.image,
        resolve: 'onload',
        reject: 'onerror',
        update: updateImage,
      },
      audio: {
        src: loadedData[index].src.audio,
        resolve: 'oncanplay',
        reject: 'onerror',
        update: updateAudio,
      }
    }
    updatePreload(index);
    const image = load(new Image(), config.image);
    const audio = load(new Audio(), config.audio);
    Promise.allSettled([image, audio])
      .then(updatePostload);

    function load(object, config) {
      function executor(resolve, reject) {
        object.src = config.src;
        object[config.resolve] = () => setTimeout(() => resolve(object), 1000);
        // object[config.resolve] = () => resolve(object);
        object[config.reject] = () => reject(new Error(`Can not loading "${config.src}"`));
      }
      const result = res => config.update(res);
      const error = err => console.log(err);
      return new Promise(executor).then(result).catch(error);
    }
  }
  return player;
}