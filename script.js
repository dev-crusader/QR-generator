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

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
    resetCanvas();
  });
});

bgColorInput.addEventListener("change", () => {
  bgTextInput.value = bgColorInput.value;
});

fgColorInput.addEventListener("change", () => {
  fgTextInput.value = fgColorInput.value;
});

size.addEventListener("blur", () => {
  const message = validateInput(size, 100);
  if (message) {
    alert(message);
  }
});

margin.addEventListener("blur", () => {
  const message = validateInput(margin, 0);
  if (message) {
    alert(message);
  }
});

document.getElementById("generate-btn").addEventListener("click", () => {
  const activeTab = document.querySelector(".tab.active").dataset.tab;
  let text = "";

  if (activeTab === "url") {
    const url = document.getElementById("text-input").value.trim();
    text = url;
    if (!text) {
      alert("Please enter some text or URL");
      return;
    }
  } else if (activeTab === "wifi") {
    const ssid = document.getElementById("wifi-ssid").value;
    const pass = document.getElementById("wifi-pass").value;
    const security = document.getElementById("wifi-security").value;
    if (security) {
      text = `WIFI:T:${security};S:${ssid};P:${pass};;`;
    } else {
      text = `WIFI:S:${ssid};;`;
    }
  } else if (activeTab === "vcard") {
    const name = document.getElementById("vcard-name").value;
    const phone = document.getElementById("vcard-phone").value;
    const email = document.getElementById("vcard-email").value;
    const address = document.getElementById("vcard-address").value;
    text = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nADR;TYPE=HOME:;;${address}\nTEL;TYPE=CELL:${phone}\nEMAIL:${email}\nEND:VCARD`;
  }

  defaultInit();
  let sizeValid = validateInput(size, 100);
  if (sizeValid !== "") {
    alert(sizeValid);
    return;
  }
  let marginValid = validateInput(margin, 0);
  if (marginValid !== "") {
    alert(marginValid);
    return;
  }

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
    qrImage.style.border = "1px solid rgba(128, 128, 128, 0.281)";
    downloadBtn.disabled = false;
  });
});

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

function validateInput(ele, minm) {
  const element = ele.value.trim();
  let inp = minm == 0 ? "Margin" : "Size";
  if (element != "" && isNaN(element)) {
    return `Please enter a valid number for ${inp}.`;
  }
  let val = parseInt(element);
  if (val < minm) {
    return `${inp} atleast ${minm} expected`;
  }
  return "";
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
