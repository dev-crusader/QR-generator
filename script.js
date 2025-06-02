const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const inputField = document.getElementById("text-input");
const qrImage = document.getElementById("qrImage");
const sizeInput = document.getElementById("sizeInput");

console.log(qrImage.clientWidth);
let size = document.getElementById("qrcode-container").clientWidth;
console.log(size);

generateBtn.onclick = function () {
  const text = inputField.value.trim();
  if (!text) {
    alert("Please enter some text or URL");
    return;
  }
  QRCode.toDataURL(text, { width: size, margin: 0 }, function (err, url) {
    if (err) {
      console.error(err);
      return;
    }
    qrImage.classList.remove("qr-fade-in");

    // Force reflow (so the browser registers the class removal)
    void qrImage.offsetWidth;

    // Add the class again to animate
    qrImage.classList.add("qr-fade-in");
    qrImage.src = url;
    qrImage.style.opacity = 1;
    downloadBtn.disabled = false;
  });
};

downloadBtn.onclick = function () {
  // const downloadSize = parseInt(sizeInput.value) || 256;

  const data = inputField.value.trim();

  // Generate QR code at user-specified size for download
  QRCode.toDataURL(data, { width: 800, margin: 0 }).then((url) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `qrcode_${Date.now()}.png`;
        link.click();
      });
  });
};
