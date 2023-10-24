// const player = {
//   source: null,
//   isReady: null,
//   index: null,
//   callback: {
//     preload: [],
//     postload: [],
//     imageload: [],
//     audioload: [],
//   },
//   track: {
//     image: null,
//     audio: null,
//     title: null,
//     author: null,
//   },
//   runcallback(callbacks) {
//     for (const callback of callbacks) {
//       callback();
//     }
//   },
//   preupdate() { },
//   postupdate() { },
//   imageupdate(image) {
//     // this.track.image = image;
//     console.log(this);
//     // this.runcallback(this.callback.imageload);
//     return image;
//   },
//   audioupdate(audio) {
//     return audio;
//   },
//   async create(url) {
//     try {
//       const response = await fetch(url);
//       const json = await response.json();
//       this.source = json;
//       this.init(0);
//     }
//     catch (error) {
//       console.log(error);
//     }
//   },
//   init(index) {
//     const upd = this.imageupdate;
//     upd();
//     const config = {
//       image: {
//         src: this.source[index].src.image,
//         resolve: 'onload',
//         reject: 'onerror',
//         update: this.imageupdate,
//       },
//       audio: {
//         src: this.source[index].src.audio,
//         resolve: 'oncanplay',
//         reject: 'onerror',
//         update: this.audioupdate,
//       }
//     }
//     this.preupdate(index);
//     const image = load(new Image(), config.image);
//     const audio = load(new Audio(), config.audio);
//     Promise.allSettled([image, audio])
//       .then((result) => {
//         console.log(result);
//       });
//     // .then(this.postupdate);

//     function load(object, config) {
//       function executor(resolve, reject) {
//         object.src = config.src;
//         object[config.resolve] = () => resolve(object);
//         object[config.reject] = () => reject(new Error(`Can not loading "${config.src}"`));
//       }
//       const result = res => config.update(res);
//       const error = err => console.log(err);
//       return new Promise(executor).then(result).catch(error);
//     }

//   }
// }

function audioPlayer(url) {
  let loadedData = null;
  const player = {
    track: {
      index: null,
      title: null,
      author: null,
      image: null,
      audio: null,
    },
    callback: {
      image: null,
      audio: null,
      preload: null,
      postload: null,
    },
  };
  create();
  function updateImage(image) {
    // player.track.image = image;
    const callback = player.callback.image;
    if (callback) callback(image);
  }
  function updateAudio(audio) {
    player.track.audio = audio;
    const callback = player.callback.audio;
    if (callback) callback();
  }
  function updatePreload() {
    const callback = player.callback.preload;
    if (callback) callback();
  }
  function updatePostload() {
    const callback = player.callback.postload;
    if (callback) callback();
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
    updatePreload();
    const image = load(new Image(), config.image);
    const audio = load(new Audio(), config.audio);
    Promise.allSettled([image, audio])
      .then(updatePostload);

    function load(object, config) {
      function executor(resolve, reject) {
        object.src = config.src;
        object[config.resolve] = () => resolve(object);
        object[config.reject] = () => reject(new Error(`Can not loading "${config.src}"`));
      }
      const result = res => config.update(res);
      const error = err => console.log(err);
      return new Promise(executor).then(result).catch(error);
    }
  }
  return player;
}