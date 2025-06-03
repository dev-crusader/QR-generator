const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const inputField = document.getElementById("text-input");
const qrImage = document.getElementById("qrImage");
const sizeInput = document.getElementById("sizeInput");
const fontFamily = "Manrope, Segoe UI, Tahoma, Geneva, Verdana, sans-serif";

let size = document.getElementById("qrcode-container").clientWidth;

// generateBtn.onclick = function () {
//   const text = inputField.value.trim();
//   if (!text) {
//     alert("Please enter some text or URL");
//     return;
//   }
//   QRCode.toDataURL(text, { width: size, margin: 0 }, function (err, url) {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     qrImage.classList.remove("qr-fade-in");

//     // Force reflow (so the browser registers the class removal)
//     void qrImage.offsetWidth;

//     // Add the class again to animate
//     qrImage.classList.add("qr-fade-in");
//     qrImage.src = url;
//     qrImage.style.opacity = 1;
//     downloadBtn.disabled = false;
//   });
// };

// downloadBtn.onclick = function () {
//   // const downloadSize = parseInt(sizeInput.value) || 256;

//   const data = inputField.value.trim();

//   // Generate QR code at user-specified size for download
//   QRCode.toDataURL(data, { width: 800, margin: 0 }).then((url) => {
//     fetch(url)
//       .then((res) => res.blob())
//       .then((blob) => {
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(blob);
//         link.download = `qrcode_${Date.now()}.png`;
//         link.click();
//       });
//   });
// };

generateBtn.onclick = function () {
  const text = inputField.value.trim();
  if (!text) {
    alert("Please enter some text or URL");
    return;
  }
  QRCode.toDataURL(text, { width: 800, margin: 0 }).then((url) => {
    window.generatedImageDataUrl = null;

    generateHighResQR(url, (highResDataUrl) => {
      window.generatedImageDataUrl = highResDataUrl;
      qrImage.classList.remove("qr-fade-in");

      void qrImage.offsetWidth;

      qrImage.classList.add("qr-fade-in");
      qrImage.src = highResDataUrl;
      qrImage.style.opacity = 1;
      downloadBtn.disabled = false;
    });
  });
};

function generateHighResQR(data, callback) {
  const qrImage = new Image();

  qrImage.onload = () => {
    const qrSize = 800; // high-res size
    const textHeight = 50; // space for "Scan me"
    const totalHeight = qrSize + textHeight;

    const canvas = document.createElement("canvas");
    canvas.width = qrSize;
    canvas.height = totalHeight;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, qrSize, totalHeight);

    ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Scan me", qrSize / 2, qrSize + 40);

    const dataUrl = canvas.toDataURL("image/png");
    callback(dataUrl);
  };

  qrImage.src = data;
}

downloadBtn.onclick = () => {
  if (window.generatedImageDataUrl) {
    const link = document.createElement("a");
    link.href = window.generatedImageDataUrl;
    link.download = `qrcode_${Date.now()}.png`;
    link.click();
  } else {
    alert("Please generate the QR code first.");
  }
};
