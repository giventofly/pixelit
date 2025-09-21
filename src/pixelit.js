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
    //range between 0 to 50 (input 0..50 -> 0..0.5)
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
    //save latest converted colors
    this.endColorStats = {};
  }

  /** hide from image */
  hideFromImg() {
    if (!this.drawfrom) return this;
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
    if (this.drawfrom) this.drawfrom.src = src;
    return this;
  }

  /**
   *
   * @param {elem} elem set element to read image from
   */
  setDrawFrom(elem) {
    this.drawfrom = elem;
    this.hideFromImg();
    return this;
  }

  /**
   *
   * @param {elem} elem set element canvas to write the image
   */
  setDrawTo(elem) {
    this.drawto = elem;
    this.ctx = this.drawto.getContext("2d");
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
    @return {arr} of current palette
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
      const diff = rgbColor[i] - compareColor[i];
      d += diff * diff;
    }
    return Math.sqrt(d);
  }

  /**
   * given actualColor, check from the paletteColors the most aproximated color
   * @param {array} actualColor rgb color to compare [int,int,int]
   * @returns {array} aproximated rgb color
   */
  similarColor(actualColor) {
    let selectedColor = this.palette[0];
    let currentSim = this.colorSim(actualColor, selectedColor);
    for (let i = 1; i < this.palette.length; i++) {
      const color = this.palette[i];
      const nextColor = this.colorSim(actualColor, color);
      if (nextColor <= currentSim) {
        selectedColor = color;
        currentSim = nextColor;
      }
    }
    return selectedColor;
  }

  /**
   * pixelate based on @author rogeriopvl <https://github.com/rogeriopvl/8bit>
   * Draws a pixelated version of an image in a given canvas
   */
  pixelate() {
    if (!this.drawfrom) return this;
    const natW = this.drawfrom.naturalWidth || this.drawfrom.width;
    const natH = this.drawfrom.naturalHeight || this.drawfrom.height;
    this.drawto.width = natW;
    this.drawto.height = natH;

    // do not mutate user-defined this.scale; use local working scale
    let workScale = this.scale;
    let scaledW = natW * workScale;
    let scaledH = natH * workScale;

    //make temporary canvas to make new scaled copy
    const tempCanvas = document.createElement("canvas");

    // Set temp canvas width/height & hide (fixes higher scaled cutting off image bottom)
    tempCanvas.width = natW;
    tempCanvas.height = natH;
    tempCanvas.style.visibility = "hidden";
    tempCanvas.style.position = "fixed";
    tempCanvas.style.top = "0";
    tempCanvas.style.left = "0";

    //corner case of bigger images, increase the temporary canvas size to fit everything
    if (natW > 900 || natH > 900) {
      workScale *= 0.5;
      scaledW = natW * workScale;
      scaledH = natH * workScale;
      tempCanvas.width = Math.max(scaledW, scaledH) + 50;
      tempCanvas.height = Math.max(scaledW, scaledH) + 50;
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

    //calculations to remove extra border
    let finalWidth = natW;
    if (natW > 300) {
      finalWidth +=
        natW > natH
          ? parseInt(natW / (natW * workScale)) / 1.5
          : parseInt(natW / (natW * workScale));
    }
    let finalHeight = natH;
    if (natH > 300) {
      finalHeight +=
        natH > natW
          ? parseInt(natH / (natH * workScale)) / 1.5
          : parseInt(natH / (natH * workScale));
    }
    //draw to final canvas
    this.ctx.drawImage(
      tempCanvas,
      0,
      0,
      scaledW,
      scaledH,
      0,
      0,
      finalWidth,
      finalHeight
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
    const imgPixels = this.ctx.getImageData(0, 0, w, h);
    const data = imgPixels.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
    this.ctx.putImageData(imgPixels, 0, 0);
    return this;
  }

  /**
   * converts image to palette using the defined palette or default palette
   */
  convertPalette() {
    const w = this.drawto.width;
    const h = this.drawto.height;
    const imgPixels = this.ctx.getImageData(0, 0, w, h);
    const data = imgPixels.data;
    for (let i = 0; i < data.length; i += 4) {
      const finalcolor = this.similarColor([data[i], data[i + 1], data[i + 2]]);
      data[i] = finalcolor[0];
      data[i + 1] = finalcolor[1];
      data[i + 2] = finalcolor[2];
    }
    this.ctx.putImageData(imgPixels, 0, 0);
    return this;
  }

  /**
   * Resizes image proportionally according to a max width or max height
   * height takes precedence if definied
   */
  resizeImage() {
    if (!this.maxWidth && !this.maxHeight) {
      return this;
    }

    const canvasCopy = document.createElement("canvas");
    const copyContext = canvasCopy.getContext("2d");
    let ratio = 1.0;

    if (this.maxWidth && this.drawto.width > this.maxWidth) {
      ratio = this.maxWidth / this.drawto.width;
    }
    if (this.maxHeight && this.drawto.height > this.maxHeight) {
      ratio = this.maxHeight / this.drawto.height;
    }

    canvasCopy.width = this.drawto.width;
    canvasCopy.height = this.drawto.height;
    copyContext.drawImage(this.drawto, 0, 0);

    this.drawto.width = Math.max(1, this.drawto.width * ratio);
    this.drawto.height = Math.max(1, this.drawto.height * ratio);
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
    if (!this.drawfrom) return this;
    const w = this.drawfrom.naturalWidth || this.drawfrom.width;
    const h = this.drawfrom.naturalHeight || this.drawfrom.height;
    this.drawto.width = w;
    this.drawto.height = h;
    this.ctx.drawImage(this.drawfrom, 0, 0);
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
