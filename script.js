const qrcodeDiv = document.getElementById("qrcode");
const txt = document.getElementById("preTxt");

function showPlaceholder() {
  qrcodeDiv.innerHTML = `
    <div class="placeholder">
      <svg width="256" height="256" fill="#ccc" viewBox="0 0 24 24">
        <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm10-2h4v4h-4V3zm2 2v4h4V5h-4zm-2 10h8v8h-8v-8zm2 2v4h4v-4h-4zm-10 0h4v4H3v-4zm2 2v4h4v-4H5z"/>
      </svg>
    </div>
  `;
  txt.style.color = "#ccc";
}

document.addEventListener("DOMContentLoaded", function () {
  showPlaceholder();
});

const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const inputField = document.getElementById("text-input");
const qrContainer = document.getElementById("qrcode");

let qrCodeInstance = null;

generateBtn.addEventListener("click", () => {
  const text = inputField.value.trim();
  if (!text) {
    alert("Please enter some text or URL");
    return;
  }

  qrContainer.innerHTML = "";
  qrCodeInstance = new QRCode(qrContainer, {
    text: text,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
  qrContainer.setAttribute("title", "");
  qrContainer.classList.remove("qr-fade-in");

  // Force reflow (so the browser registers the class removal)
  void qrContainer.offsetWidth;

  // Add the class again to animate
  qrContainer.classList.add("qr-fade-in");

  downloadBtn.disabled = false;
  txt.style.color = "black";
});

// download the QR code
downloadBtn.addEventListener("click", () => {
  const container = document.querySelector(".qrcode-container");

  setTimeout(() => {
    html2canvas(container, { backgroundColor: "#ffffff" })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = imgData;
        link.download = `qrcode_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error capturing container:", error);
      });
  }, 200);
});
