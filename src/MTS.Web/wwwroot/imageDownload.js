function captureAndDownloadImages() {
  // Get all divs with class 'to-image'
  var divs = document.querySelectorAll('.to-image');


  var zip = new JSZip();

  var promises = [];
  var i = 0;

  // Loop through each div and capture its contents as an image
  divs.forEach(div => {
    // file-name class for restaurantName(filename)
    console.log(div);
    var header = div.querySelector('.file-name');
    console.log(header)
      var restaurantName = header ? header.textContent : null;
    var promise = html2canvas(div).then(canvas => {
      try {

        // Convert canvas to base64 image data
        var imageData = canvas.toDataURL("image/png");

        restaurantName = restaurantName ? restaurantName : i;
        // Add the image to the zip file
        zip.file(restaurantName + ".png", imageData.split("base64,")[1], {base64: true});
        i++;

      } catch (error) {
        console.log(error);
      }
    });
    promises.push(promise);
  });

  // Generate the zip file and provide download link
  Promise.all(promises).then(() => {
    zip.generateAsync({type: "blob"}).then(function (content) {
      // Create a link element
      var link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'images.zip';
      link.click();
    });
  });
}
function captureAndDownloadImage(id) {
  // Get element with id
  var div = document.getElementById(id);
  // get
  // remove all box-shadows
  var elements = div.querySelectorAll('*');
  elements.forEach(element => {
    element.style.boxShadow = "none";
  });


  // turn div to image and copy to clipboard
  html2canvas(div).then(canvas => {
    try {
      // Convert canvas to base64 image data
      var imageData = canvas.toDataURL("image/png");
      // // copy to navigator clipboard
      // navigator.clipboard.writeText(imageData);

      var imageDataAsBlob = canvas.toBlob(function(blob) {
        var item = new ClipboardItem({'image/png': blob});
        navigator.clipboard.write([item]);
      });

    } catch (error) {
      console.log(error);
    }
  });

}
