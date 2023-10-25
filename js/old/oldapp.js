(() => {
  try {
    const player = audioPlayer('./assets/audio.json');
    player.callback.preload = updatePreload;
    player.callback.image = updateImage;
    player.callback.audio = updateAudio;
    player.callback.postload = updatePostload;

    const control = getControls();
    const state = {
      changeover: false,
      image: '',
      audio: '',
    }

    function getControls() {
      const element = {
        next: getElement('next'),
        previous: getElement('previous'),
        play: getElement('buttonplay'),
        pause: getElement('buttonpause'),
      };
      const action = {
        next() {
          if (!state.changeover) return;
          player.next();
        },
        previous() {
          if (!state.changeover) return;
          player.previous();
        },
        play() {
          element.pause.classList.add('_show');
          element.play.classList.remove('_show');
          player.play();
        },
        pause() {
          element.pause.classList.remove('_show');
          element.play.classList.add('_show');
          player.pause();
        },
      };
      for (const [key, value] of Object.entries(element)) {
        if (!value) continue;
        if (!(key in action)) {
          console.error(new Error(`Key: '${key}' in action is not found`));
          continue;
        }
        value.onclick = action[key];
      }

      function getElement(id) {
        const element = document.getElementById(id);
        if (!element) console.error(new Error(`Element id:#${id} is not found`));
        return element;
      }
      return { element, action };
    }
    function updatePostload() {
      if (state.image == 'loadingImage') state.image = 'failed';
      if (state.audio == 'loadingAudio') state.audio = 'failed';
      updateState();
    }
    function updatePreload() {
      state.image = 'loadingImage';
      state.audio = 'loadingAudio';
      updateState();
    }
    function updateState() {
      const changeover = {
        enable() {
          control.element.next.disabled = false;
          control.element.previous.disabled = false;
        },
        disable() {
          control.element.next.disabled = true;
          control.element.previous.disabled = true;
        },
      }
      const buttonPlayPause = {
        disable() {
          control.element.pause.disabled = true;
          control.element.play.disabled = true;
          control.action.pause();
        },
        enable() {
          control.element.pause.disabled = false;
          control.element.play.disabled = false;
          control.action.play();
        },
      }
      const imageFailed = state.image == 'failed';
      const imageComplete = state.image == 'complete';
      const imageEnd = imageFailed || imageComplete;

      const audioLoading = state.audio == 'loadingAudio';
      const audioFailed = state.audio == 'failed';
      const audioComplete = state.audio == 'complete';
      const audioEnd = audioFailed || audioComplete;

      state.changeover = imageEnd && audioEnd;

      if (audioLoading || audioFailed) buttonPlayPause.disable();
      if (audioComplete) buttonPlayPause.enable();

      if (state.changeover) changeover.enable();
      else changeover.disable();

    }
    function updateAudio() {
      state.audio = 'complete';
      updateState();
    }
    function updateImage(image) {
      state.image = 'loadingAnimate';
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
        if (state.image == 'loadingAnimate') {
          state.image = 'complete';
          updateState();
        }
      }
    }
  }
  catch (error) {
    console.log(error);
  }
})();