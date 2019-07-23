"use strict";

//create object
var px = new pixelit({
  from: document.getElementById('pixelitimg')
}); //stuff for webpage functionality

var paletteList = [  [
  [13,43,69],
  [32,60,86],
  [84,78,104],
  [141,105,122],
  [208,129,89],
  [255,170,94],
  [255,212,163],
  [255,236,214],
],
[
  [48,0,48],
  [96,40,120],
  [248,144,32],
  [248,240,136]
],
 [
    [38,48,95],
    [14,46,71],
    [37,32,48],
    [99,93,92],
   [72,130,134],
   [198,207,216]
  ],
[[26, 28, 44], [93, 39, 93], [177, 62, 83], [239, 125, 87], [255, 205, 117], [167, 240, 112], [56, 183, 100], [37, 113, 121], [41, 54, 111], [59, 93, 201], [65, 166, 246], [115, 239, 247], [244, 244, 244], [148, 176, 194], [86, 108, 134], [51, 60, 87]], [[44, 33, 55], [118, 68, 98], [237, 180, 161], [169, 104, 104]], [[7, 5, 5], [33, 25, 25], [82, 58, 42], [138, 107, 62], [193, 156, 77], [234, 219, 116], [160, 179, 53], [83, 124, 68], [66, 60, 86], [89, 111, 175], [107, 185, 182], [251, 250, 249], [184, 170, 176], [121, 112, 126], [148, 91, 40]], [[140, 143, 174], [88, 69, 99], [62, 33, 55], [154, 99, 72], [215, 155, 125], [245, 237, 186], [192, 199, 65], [100, 125, 52], [228, 148, 58], [157, 48, 59], [210, 100, 113], [112, 55, 127], [126, 196, 193], [52, 133, 157], [23, 67, 75], [31, 14, 28]], [[94, 96, 110], [34, 52, 209], [12, 126, 69], [68, 170, 204], [138, 54, 34], [235, 138, 96], [0, 0, 0], [92, 46, 120], [226, 61, 105], [170, 92, 61], [255, 217, 63], [181, 181, 181], [255, 255, 255]], [[21, 25, 26], [138, 76, 88], [217, 98, 117], [230, 184, 193], [69, 107, 115], [75, 151, 166], [165, 189, 194], [255, 245, 247]]];
var currentPalette = 3;
var maxPalette = paletteList.length;
document.addEventListener("DOMContentLoaded", function () {
  //load image to canvas
  document.getElementById("pixlInput").onchange = function (e) {
    var img = new Image();
    img.src = URL.createObjectURL(this.files[0]);

    img.onload = function () {
      //create element
      //document.getElementById('teste').src = img.src;
      px.setFromImgSource(img.src);
      pixelit(); //.pixelate()
      //.convertGrayscale()
      //.convertPalette();
      //.saveImage();
      //console.log(px.getPalette());
    };
  }; //function to apply effects


  var pixelit = function pixelit() {
    document.querySelector('.loader').classList.toggle('active');
    setTimeout(function () {
      document.querySelector('.loader').classList.toggle('active');
    }, 500);
    px.setScale(blocksize.value).setPalette(paletteList[currentPalette]).draw().pixelate();
    greyscale.checked ? px.convertGrayscale() : null;
    palette.checked ? px.convertPalette() : null;
    maxheight.value ? px.setMaxHeight(maxheight.value).resizeImage() : null;
    maxwidth.value ? px.setMaxWidth(maxwidth.value).resizeImage() : null;

  };

  var makePaletteGradient = function makePaletteGradient() {
    //create palette
    var pdivs = ""; //create palette of colors

    document.querySelector('#palettecolor').innerHTML = '';
    paletteList[currentPalette].forEach(function (elem) {
      var div = document.createElement('div');
      div.classList = 'colorblock';
      div.style.backgroundColor = "rgba(".concat(elem[0], ",").concat(elem[1], ",").concat(elem[2], ",1)"); //div.innerHTML = `<div class="colorblock" style="background-color: rgba(${elem[0]},${elem[1]},${elem[2]},1)"></div>`;

      document.querySelector('#palettecolor').appendChild(div); //pdivs += `<div class="colorblock" style="background-color: rgba(${elem[0]},${elem[1]},${elem[2]},1)"></div>`;
    }); //document.querySelector('#palettecolor').innerHTML = pdivs;
  };

  makePaletteGradient(); //block size

  var blocksize = document.querySelector('#blocksize');
  blocksize.addEventListener('change', function (e) {
    document.querySelector('#blockvalue').innerText = this.value;
    pixelit();
  }); //greyscale

  var greyscale = document.querySelector('#greyscale');
  greyscale.addEventListener('change', pixelit); //palette

  var palette = document.querySelector('#palette');
  palette.addEventListener('change', pixelit); //maxheight

  var maxheight = document.querySelector('#maxheight');
  maxheight.addEventListener('change', pixelit); //maxwidth

  var maxwidth = document.querySelector('#maxwidth');
  maxwidth.addEventListener('change', pixelit); //change palette

  var changePalette = document.querySelector('#changepalette');
  changePalette.addEventListener('click', function (e) {
    currentPalette > 0 ? currentPalette-- : currentPalette = maxPalette - 1;
    makePaletteGradient();
    palette.checked = true;
    pixelit();
  }); //downloadimage options

  var downloadimage = document.querySelector('#downloadimage');
  downloadimage.addEventListener('click', function (e) {
    //download image
    px.saveImage();
  });
  pixelit();
});
