
const sizes = [50, 100, 250, 500, 970, 1720, 2720];

const makeBlock = (size = 0) => {
  const div = document.createElement("div");
  div.classList.add("block");
  div.innerHTML = `<p>Image with width ${size}px</p>
                  <div class="inner">
                    <img src="assets/tests/image-${size}.jpg"/>
                    <img alt="" id="imagesource${size}"/>
                    <canvas id="image${size}"></canvas>
                  </div>
                  `;
  return div;
};
document.addEventListener("DOMContentLoaded", function () {
  //make images, final result and pixelate all of them
  const mainElement = document.getElementById("content");
  sizes.forEach((size) => {
    
    mainElement.appendChild(makeBlock(size));
    document.getElementById("imagesource" + size).onload = ()=>{
      const px = new pixelit({
        from: document.getElementById("imagesource" + size),
        to: document.getElementById("image" + size),
        scale: 12
      });
      //console.log(document.getElementById("imagesource" + size), "is loaded");
      px
      .draw()
      .pixelate();
      //.saveImage();
    }
    document.getElementById("imagesource" + size).src = `assets/tests/image-${size}.jpg`;
    //console.log(document.getElementById("imagesource" + size),document.getElementById("image" + size));
  });
});
