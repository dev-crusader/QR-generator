const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const inputField = document.getElementById("text-input");
const qrImage = document.getElementById("qrImage");
const fontFamily = "Manrope, Segoe UI, Tahoma, Geneva, Verdana, sans-serif";

const size = document.getElementById("size-input");
const margin = document.getElementById("margin-input");
const bgColorInput = document.getElementById("bgcolor-pick");
const bgTextInput = document.getElementById("bg-color");
const fgColorInput = document.getElementById("forecolor-pick");
const fgTextInput = document.getElementById("fore-color");

bgColorInput.addEventListener("change", () => {
  bgTextInput.value = bgColorInput.value;
});

fgColorInput.addEventListener("change", () => {
  fgTextInput.value = fgColorInput.value;
});

generateBtn.onclick = function () {
  const text = inputField.value.trim();
  if (!text) {
    alert("Please enter some text or URL");
    return;
  }
  defaultInit();
  const options = {
    color: {
      dark: fgTextInput.value,
      light: bgTextInput.value,
    },
    margin: margin.value,
    width: size.value,
    errorCorrectionLevel: "H",
  };

  QRCode.toDataURL(text, options).then((url) => {
    qrImage.classList.remove("qr-fade-in");
    window.generatedImageDataUrl = url;
    void qrImage.offsetWidth;

    qrImage.classList.add("qr-fade-in");
    qrImage.src = url;
    qrImage.style.opacity = 1;
    downloadBtn.disabled = false;
  });
};

function defaultInit() {
  if (!bgTextInput.value) {
    bgTextInput.value = "#ffffff";
  }

  if (!fgTextInput.value) {
    fgTextInput.value = "#000000";
  }
  if (!size.value) {
    size.value = 256;
  }
  if (!margin.value) {
    margin.value = 0;
  }
}

size.addEventListener("blur", () => {
  const value = size.value.trim();
  if (value != "" && isNaN(value)) {
    alert("Please enter a valid number.");
  }
});
// QRCode.toDataURL(text, options).then((url) => {
//   window.generatedImageDataUrl = null;

//   generateHighResQR(url, (highResDataUrl) => {
//     window.generatedImageDataUrl = highResDataUrl;
//     qrImage.classList.remove("qr-fade-in");

//     void qrImage.offsetWidth;

//     qrImage.classList.add("qr-fade-in");
//     qrImage.src = highResDataUrl;
//     qrImage.style.opacity = 1;
//     downloadBtn.disabled = false;
//   });
// });
// };

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
