function audioPlayer(url) {
  let loadedData;
  let currentIndex;
  const player = {
    track: {
      // index: null,
      // title: null,
      // author: null,
      image: null,
      audio: null,
    },
    callback: {
      image: null,
      audio: null,
      preload: null,
      postload: null,
    },
    next,
    previous,
  };
  create();
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
    player.track.audio = audio;
    const callback = player.callback.audio;
    if (callback) callback(audio);
  }
  function updatePreload() {
    const callback = player.callback.preload;
    if (callback) callback();
  }
  function updatePostload(index) {
    currentIndex = index;
    const callback = player.callback.postload;
    if (callback) callback();
  }
  async function create() {
    try {
      const response = await fetch(url);
      const json = await response.json();
      loadedData = json;
      currentIndex = 0;
      init(currentIndex);
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
    updatePreload();
    const image = load(new Image(), config.image);
    const audio = load(new Audio(), config.audio);
    Promise.allSettled([image, audio])
      .then(() => updatePostload(index));

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