/**
 * pixelit - convert an image to Pixel Art, with/out grayscale and based on a color palette.
 * @author José Moreira @ <https://github.com/giventofly/pixelit>
 **/

class pixelit {
  constructor(config = {}) {
    //target for canvas
    this.drawto = config.to || document.getElementById("pixelitcanvas");
    //origin of uploaded image/src img
    this.drawfrom = config.from || document.getElementById("pixelitimg");
    //hide image element
    this.hideFromImg();
    //range between 0 to 100
    this.scale =
      config.scale && config.scale > 0 && config.scale <= 50
        ? config.scale * 0.01
        : 8 * 0.01;
    this.palette = config.palette || [
      [140, 143, 174],
      [88, 69, 99],
      [62, 33, 55],
      [154, 99, 72],
      [215, 155, 125],
      [245, 237, 186],
      [192, 199, 65],
      [100, 125, 52],
      [228, 148, 58],
      [157, 48, 59],
      [210, 100, 113],
      [112, 55, 127],
      [126, 196, 193],
      [52, 133, 157],
      [23, 67, 75],
      [31, 14, 28],
    ];
    this.maxHeight = config.maxHeight;
    this.maxWidth = config.maxWidth;
    this.ctx = this.drawto.getContext("2d");
  }

  /** hide from image */
  hideFromImg() {
    this.drawfrom.style.visibility = "hidden";
    this.drawfrom.style.position = "fixed";
    this.drawfrom.style.top = 0;
    this.drawfrom.style.left = 0;
    return this;
  }

  /**
   * @param {string} src Change the src from the image element
   */
  setFromImgSource(src) {
    this.drawfrom.src = src;
    return this;
  }

  /**
   *
   * @param {elem} elem set element to read image from
   */
  setDrawFrom(elem) {
    this.drawfrom = elem;
    return this;
  }

  /**
   *
   * @param {elem} elem set element canvas to write the image
   */
  setDrawTo(elem) {
    this.drawto = elem;
    return this;
  }

  /**
   *
   * @param {array} arr Array of rgb colors: [[int,int,int]]
   */
  setPalette(arr) {
    this.palette = arr;
    return this;
  }

  /**
   *
   * @param {int} width set canvas image maxWidth
   */
  setMaxWidth(width) {
    this.maxWidth = width;
    return this;
  }

  /**
   *
   * @param {int} Height set canvas image maxHeight
   */
  setMaxHeight(height) {
    this.maxHeight = height;
    return this;
  }

  /**
   *
   * @param {int} scale set pixelate scale [0...50]
   */
  setScale(scale) {
    this.scale = scale > 0 && scale <= 50 ? scale * 0.01 : 8 * 0.01;
    return this;
  }

  /**
   * 
    returns {arr} of current palette
   */
  getPalette() {
    return this.palette;
  }

  /**
   * color similarity between colors, lower is better
   * @param {array} rgbColor array of ints to make a rgb color: [int,int,int]
   * @param {array} compareColor array of ints to make a rgb color: [int,int,int]
   * @returns {number} limits [0-441.6729559300637]
   */

  colorSim(rgbColor, compareColor) {
    let i;
    let max;
    let d = 0;
    for (i = 0, max = rgbColor.length; i < max; i++) {
      d += (rgbColor[i] - compareColor[i]) * (rgbColor[i] - compareColor[i]);
    }
    return Math.sqrt(d);
  }

  /**
   * given actualColor, check from the paletteColors the most aproximated color
   * @param {array} actualColor rgb color to compare [int,int,int]
   * @returns {array} aproximated rgb color
   */
  similarColor(actualColor) {
    let selectedColor = [];
    let currentSim = this.colorSim(actualColor, this.palette[0]);
    let nextColor;
    this.palette.forEach((color) => {
      nextColor = this.colorSim(actualColor, color);
      if (nextColor <= currentSim) {
        selectedColor = color;
        currentSim = nextColor;
      }
    });
    return selectedColor;
  }

  /**
   * pixelate based on @author rogeriopvl <https://github.com/rogeriopvl/8bit>
   * Draws a pixelated version of an image in a given canvas
   */
  pixelate() {
    this.drawto.width = this.drawfrom.naturalWidth;
    this.drawto.height = this.drawfrom.naturalHeight;

    let scaledW = this.drawto.width * this.scale;
    let scaledH = this.drawto.height * this.scale;

    //make temporary canvas to make new scaled copy
    const tempCanvas = document.createElement("canvas");

    //corner case of bigger images, increase the temporary canvas size to fit everything
    if(this.drawto.width > 800 || this.drawto.width > 800 ){
      //fix sclae to pixelate bigger images
      this.scale *= 0.25;
      scaledW = this.drawto.width * this.scale;
      scaledH = this.drawto.height * this.scale;
      //make it big enough to fit
      tempCanvas.width = Math.max(scaledW, scaledH ) + 50;
      tempCanvas.height = Math.max(scaledW, scaledH ) + 50;
    }
    // get the context
    const tempContext = tempCanvas.getContext("2d");
    // draw the image into the canvas
    tempContext.drawImage(this.drawfrom, 0, 0, scaledW, scaledH);
    document.body.appendChild(tempCanvas);

    //configs to pixelate
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    //draw to final canvas
    this.ctx.drawImage(
      tempCanvas,
      0,
      0,
      scaledW,
      scaledH,
      0,
      0,
      this.drawfrom.naturalWidth,
      this.drawfrom.naturalHeight
    );
    //remove temp element
    tempCanvas.remove();

    return this;
  }

  /**
   * Converts image to grayscale
   */
  convertGrayscale() {
    const w = this.drawto.width;
    const h = this.drawto.height;
    var imgPixels = this.ctx.getImageData(0, 0, w, h);
    for (var y = 0; y < imgPixels.height; y++) {
      for (var x = 0; x < imgPixels.width; x++) {
        var i = y * 4 * imgPixels.width + x * 4;
        var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
        imgPixels.data[i] = avg;
        imgPixels.data[i + 1] = avg;
        imgPixels.data[i + 2] = avg;
      }
    }
    this.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return this;
  }

  /**
   * converts image to palette using the defined palette or default palette
   */
  convertPalette() {
    const w = this.drawto.width;
    const h = this.drawto.height;
    var imgPixels = this.ctx.getImageData(0, 0, w, h);
    for (var y = 0; y < imgPixels.height; y++) {
      for (var x = 0; x < imgPixels.width; x++) {
        var i = y * 4 * imgPixels.width + x * 4;
        //var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
        const finalcolor = this.similarColor([
          imgPixels.data[i],
          imgPixels.data[i + 1],
          imgPixels.data[i + 2],
        ]);
        imgPixels.data[i] = finalcolor[0];
        imgPixels.data[i + 1] = finalcolor[1];
        imgPixels.data[i + 2] = finalcolor[2];
      }
    }
    this.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return this;
  }

  /**
   * Resizes image proportionally according to a max width or max height
   * height takes precedence if definied
   */
  resizeImage() {
    //var ctx = canvas.getContext("2d")
    const canvasCopy = document.createElement("canvas");
    const copyContext = canvasCopy.getContext("2d");
    let ratio = 1.0;

    //if none defined skip
    if (!this.maxWidth && !this.maxHeight) {
      return 0;
    }

    if (this.maxWidth && this.drawto.width > this.maxWidth) {
      ratio = this.maxWidth / this.drawto.width;
    }
    //max height overrides max width
    if (this.maxHeight && this.drawto.height > this.maxHeight) {
      ratio = this.maxHeight / this.drawto.height;
    }

    canvasCopy.width = this.drawto.width;
    canvasCopy.height = this.drawto.height;
    copyContext.drawImage(this.drawto, 0, 0);

    this.drawto.width = this.drawto.width * ratio;
    this.drawto.height = this.drawto.height * ratio;
    this.ctx.drawImage(
      canvasCopy,
      0,
      0,
      canvasCopy.width,
      canvasCopy.height,
      0,
      0,
      this.drawto.width,
      this.drawto.height
    );

    return this;
  }

  /**
   * draw to canvas from image source and resize
   *
   */
  draw() {
    //draw image to canvas
    this.drawto.width = this.drawfrom.width;
    this.drawto.height = this.drawfrom.height;
    //draw
    this.ctx.drawImage(this.drawfrom, 0, 0);
    //resize is always done
    this.resizeImage();
    return this;
  }

  /**
   * Save image from canvas
   */

  saveImage() {
    const link = document.createElement("a");
    link.download = "pxArt.png";
    link.href = this.drawto
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    document.querySelector("body").appendChild(link);
    link.click();
    document.querySelector("body").removeChild(link);
  }

  //end class
}
