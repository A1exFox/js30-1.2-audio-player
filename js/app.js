(() => {
  const player = audioPlayer('./assets/audio.json');
  // player.callback.image = updateImage;

  function updateImage(image) {
    try {
      const ids = ['bgimages'];
      ids.forEach(id => changeImg(id, image.cloneNode(true)));
    }
    catch (error) {
      console.log(error);
    }

    function changeImg(id, target) {
      const container = document.getElementById(id);
      if (!container) throw new Error(`id: #${id} not found`);
      const current = container.querySelector('img');
      target.alt = current.alt;
      target.classList.value = current.classList.value;
      target.classList.remove('_show');
      container.insertAdjacentElement('beforeend', target);
      target.classList.add('_show');
      current.classList.add('_hide');
      current.addEventListener('animationend', removeOldImg, { once: true });
      target.addEventListener('animationend', removeClassShow, { once: true });
    }
    function removeOldImg(event) {
      event.target.remove();
    }
    function removeClassShow(event) {
      event.target.classList.remove('_show');
    }
  }
})();


// const element = document.getElementById('background');
// element.addEventListener('animationend', (event) => {
//   console.log(event.target);
//   event.target.remove();
// }, { once: true });