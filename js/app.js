const player = audioPlayer('./assets/audio.json');
player.callback.image = updateImage;

let background = document.getElementById('background');
let preview = document.getElementById('preview');

function updateImage() {
  try {
    const image = player.track.image.cloneNode(true);
    if (!background) throw new Error('#background not found');
    image.id = background.id;
    background.replaceWith(image);

    // background.replaceWith(image);
    console.log(background);
    console.dir(background);
  }
  catch (error) {
    console.log(error);
  }

}