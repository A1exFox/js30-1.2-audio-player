(() => {
  try {
    const player = audioPlayer('./assets/audio.json');
    player.callback.preload = updatePreload;
    player.callback.image = updateImage;
    player.callback.audio = updateAudio;
    player.callback.postload = updatePostload;

    const controls = getControls();
    const state = {
      complete: {
        image: false,
        audio: false,
      },
      image: {
        load: false,
        animate: false,
      },
      audio: {
        load: false,
      }
    }
    function updateAudio(audio) {
      state.audio.load = false;
    }
    function getControls() {
      const ids = ['next', 'previous'];
      const controls = {};
      const click = { next, previous };
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) {
          console.error(new Error(`Element id:#${id} is not found`));
          continue;
        }
        if (!click[id]) {
          console.error(new Error(`handler(onclick) for id:#${id} is not found`));
          continue;
        }
        controls[id] = element;
        element.onclick = click[id];
      }
      function next() {
        if (!state.complete.image) return;
        player.next();
      }
      function previous() {
        if (!state.complete.image) return;
        player.previous();
      }
      return controls;
    }
    function updatePostload() {
      if (state.image.load) {
        state.image.load = false;
        updateState();
      }
      if (state.audio.load) {
        state.audio.load = false;
        updateState();
      }
    }
    function updatePreload() {
      state.image.load = true;
      state.audio.load = true;
      state.complete.image = false;
      state.complete.audio = false;
      updateState();
      // changeoverDisable();
    }
    function updateState() {
      const image = isImageComplete();
      state.complete.image = image;
      if (image) changeoverEnable();
      else changeoverDisable();

      function isImageComplete() {
        const isloadImg = !state.image.load;
        const isloadAnimate = !state.image.animate;
        return isloadImg && isloadAnimate;
      }
      function changeoverDisable() {
        controls.next.disabled = true;
        controls.previous.disabled = true;
      }
      function changeoverEnable() {
        controls.next.disabled = false;
        controls.previous.disabled = false;
      }
    }
    function updateImage(image) {
      state.image.load = false;
      state.image.animate = true;
      const ids = ['bgimages', 'previewcontainer'];
      ids.forEach(id => changeImg(id, image.cloneNode(true)));

      function changeImg(id, target) {
        const container = document.getElementById(id);
        if (!container) throw new Error(`id: #${id} not found`);
        const current = container.querySelector('img');
        if (!current) throw new Error(`tag: <img> into #${id} not found`);
        current.classList.remove('_show');
        current.classList.remove('_hide');
        target.alt = current.alt;
        target.classList.value = current.classList.value;
        container.insertAdjacentElement('beforeend', target);
        target.classList.add('_show');
        current.classList.add('_hide');
        current.addEventListener('animationend', removeOldImg, { once: true });
        target.addEventListener('animationend', removeClassShow, { once: true });
      }
      function removeOldImg(event) {
        event.target.remove();
        removeStateAnimate()
      }
      function removeClassShow(event) {
        event.target.classList.remove('_show');
        removeStateAnimate();
      }
      function removeStateAnimate() {
        if (state.image.animate) {
          state.image.animate = false;
          updateState();
        }
      }
    }
  }
  catch (error) {
    console.log(error);
  }
})();