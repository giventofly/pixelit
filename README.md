# Pixel It
Javascript library to create pixel art from an image.
See [Pixel It](https://giventofly.github.io/pixelit#tryit) in action.

## Files

On /dist you can find the files you need

| file | description  |
|--|--|
| [pixelit.js](https://raw.githubusercontent.com/giventofly/pixelit/master/dist/pixelit.js) | javascript es6 file |
| [pixelitmin.js](https://raw.githubusercontent.com/giventofly/pixelit/master/dist/pixelitmin.js) | javascript minified and babeljs.io parsed for es5 |


## Examples

Original image and after Pixel It did some work on it.

No filter applied and color palette used. 

![default use](https://giventofly.github.io/pixelit/assets/px-normal.jpg)
![4 color palette used](https://giventofly.github.io/pixelit/assets/px-palette4c.jpg)

## Documentation

To use the quick default configuration you need an element from where to draw the image and canvas element with the id pixelitcanvas. Then load the pixelit.js script and apply it on an image.
```html
    <img src="sky.jpg"  id="pixelitimg" alt="">
    <canvas id="pixelitcanvas"></canvas>
    <script src="pixelit.js"></script>
    <script>
      //create object
      const px = new pixelit();
      px.draw().pixelate();
    </script>
```

You can use this option when creating the instance of Pixel It
```javascript
    const config = {
      to : elem,
      //defaults to document.getElementById("pixelitcanvas")
      from : elem, 
      //defaults to document.getElementById("pixelitimg")
      scale : int 
      //from 0-50, defaults to 8
      palette : [[r,g,b]], 
      //defaults to a fixed pallete
      maxHeight: int, 
      //defaults to null
      maxWidth: int, 
      //defaults to null
    }
    const px = new pixelit(config);
```
## Api



|method |  |
|--|--|
|.draw()  | draw to canvas from image source and resizes if max height or max width is reached |.hideFromImg()| hides the from image element, is applied on object creation|
|.setDrawFrom(elem)| elem to get the image to pixelate|
|.setDrawTo(elem)| canvas elem to draw the image|
|.setFromImgSource(src)| change the src from the image element|
|.setPalette(arr)| sets the color palette to use, takes an array of rgb colors: [[int,int,int]], int from 0 to 255|
|.setMaxWidth(int)| set canvas image maximum width, it can resize the output image, only used when .resizeImage() is applied|
|.setMaxHeight(int)| set canvas image maximum height, it can resize the output image, max height overrides max width, only used when .resizeImage() is applied|
|.setScale(int)| set pixelate scale [0...50]|
|.getpalette()| returns array of current palette, can't be chained|
|.convertGrayscale()| converts image to greyscale, apply only after .draw is called|
|.convertpalette()| converts image with the defined color palette, apply only after .draw is called|
|.resizeImage()| resizes the output image if bigger than the defined max Height or max Width|
|.pixelate()| draws a pixelated version of the from image to the to canvas, , apply only after .draw is called|
|.saveImage()| saves/downloads current image|

Working example:

```html
    <img  src="assets/sky.jpg"  id="pixelitimg"  alt="">
    <canvas  id="pixelitcanvas"></canvas>
    <script>
    const mypalette = [
    [26,28,44],[93,39,93],[177, 62, 83],[239, 125, 87],[255, 205, 117],[167, 240, 112],[56, 183, 100],[37, 113, 121],[41, 54, 111],[59, 93, 201],[65, 166, 246],[115, 239, 247],[244, 244, 244],[148, 176, 194],[86, 108, 134],[51, 60, 87]
    ];
    const  px  =  new  pixelit({from:  document.getElementById('pixelitimg'),
    "palette": mypalette});
    px.draw().pixelate().convertPalette();
    </script>
```
