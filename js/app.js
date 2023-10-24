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
        changeover: false,
      },
      image: {
        loadImage: false,
        loadAnimate: false,
      },
    }
    function updateAudio(audio) {

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
        if (!state.complete.changeover) return;
        player.next();
      }
      function previous() {
        if (!state.complete.changeover) return;
        player.previous();
      }
      return controls;
    }
    function updatePostload() {
      if (state.image.loadImage) {
        state.image.loadImage = false;
        stateUpdate();
      }
    }
    function updatePreload() {
      state.image.loadImage = true;
      state.complete.changeover = false;
      changeoverDisable();
    }
    function stateUpdate() {
      const isloadImg = !state.image.loadImage;
      const isloadAnimate = !state.image.loadAnimate;
      const isImageComplete = isloadImg && isloadAnimate;
      const complete = isImageComplete;
      state.complete.changeover = complete;
      if (complete) changeoverEnable();
    }
    function changeoverDisable() {
      controls.next.disabled = true;
      controls.previous.disabled = true;
    }
    function changeoverEnable() {
      controls.next.disabled = false;
      controls.previous.disabled = false;
    }
    function updateImage(image) {
      state.image.loadImage = false;
      state.image.loadAnimate = true;
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
        if (state.image.loadAnimate) {
          state.image.loadAnimate = false;
          stateUpdate();
        }
      }
    }
  }
  catch (error) {
    console.log(error);
  }
})();