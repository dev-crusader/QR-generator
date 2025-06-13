const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");

const qrImage = document.getElementById("qrImage");
const fontFamily = "Manrope, Segoe UI, Tahoma, Geneva, Verdana, sans-serif";

const size = document.getElementById("size-input");
const margin = document.getElementById("margin-input");
const bgColorInput = document.getElementById("bgcolor-pick");
const bgTextInput = document.getElementById("bg-color");
const fgColorInput = document.getElementById("forecolor-pick");
const fgTextInput = document.getElementById("fore-color");
const alertTxt = document.getElementById("alert-msg");
const err = "* ";

const ssid = document.getElementById("wifi-ssid");
const pass = document.getElementById("wifi-pass");

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
    hideError();
  });
});

document.getElementById("generate-btn").addEventListener("click", () => {
  const activeTab = document.querySelector(".tab.active").dataset.tab;
  let text = "";

  if (activeTab === "url") {
    const url = document.getElementById("text-input");
    text = url.value.trim();
    if (!text) {
      showError(url, err + "Please enter some text or URL");
      errorEffect();
      return;
    }
  } else if (activeTab === "wifi") {
    let ssidVal = ssid.value;
    let passVal = pass.value;
    const security = document.getElementById("wifi-security").value;
    if (!ssidVal) {
      showError(ssid, err + "SSID required!");
      errorEffect();
      return;
    }
    if (security && !passVal) {
      showError(pass, err + "Password required!");
      errorEffect();
      return;
    }
    if (security) {
      text = `WIFI:T:${security};S:${ssidVal};P:${passVal};;`;
    } else {
      text = `WIFI:S:${ssidVal};;`;
    }
  } else if (activeTab === "vcard") {
    const name = document.getElementById("vcard-name").value;
    const phone = document.getElementById("vcard-phone").value;
    const email = document.getElementById("vcard-email").value;
    const address = document.getElementById("vcard-address").value;
    let isValid = validateVcard(name, phone, email, address);
    if (isValid !== "") {
      showError(null, err + isValid);
      errorEffect();
      return;
    }
    text = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nADR;TYPE=HOME:;;${address}\nTEL;TYPE=CELL:${phone}\nEMAIL:${email}\nEND:VCARD`;
  }

  defaultInit();
  let sizeValid = validateInput(size, 100);
  if (sizeValid !== "") {
    showError(size, err + sizeValid);
    errorEffect();
    return;
  }
  let marginValid = validateInput(margin, 0);
  if (marginValid !== "") {
    showError(margin, err + marginValid);
    errorEffect();
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
    hideError();
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

function validateVcard(name, phone, email, address) {
  if (name === "" && phone === "" && email === "" && address === "") {
    return "Atlease one info required !";
  }
  if (phone != "" && isNaN(phone)) {
    return "Not a number";
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

//Event listener functions

bgColorInput.addEventListener("change", () => {
  bgTextInput.value = bgColorInput.value;
});

fgColorInput.addEventListener("change", () => {
  fgTextInput.value = fgColorInput.value;
});

size.addEventListener("blur", () => {
  const message = validateInput(size, 100);
  if (message) {
    showError(size, err + message);
  } else {
    hideError();
  }
});

size.addEventListener("input", () => {
  if (size.value.trim() !== "") {
    size.classList.remove("error");
    hideError();
  }
});

margin.addEventListener("blur", () => {
  const message = validateInput(margin, 0);
  if (message) {
    showError(margin, err + message);
  } else {
    hideError();
  }
});

margin.addEventListener("input", () => {
  if (margin.value.trim() !== "") {
    margin.classList.remove("error");
    hideError();
  }
});

const textInput = document.getElementById("text-input");
textInput.addEventListener("input", () => {
  if (textInput.value.trim() !== "") {
    textInput.classList.remove("error");
    hideError();
  }
});

ssid.addEventListener("input", () => {
  if (ssid.value.trim() !== "") {
    ssid.classList.remove("error");
    hideError();
  }
});

pass.addEventListener("input", () => {
  if (pass.value.trim() !== "") {
    pass.classList.remove("error");
    hideError();
  }
});

const wifiSecuritySelect = document.getElementById("wifi-security");
wifiSecuritySelect.addEventListener("change", () => {
  if (wifiSecuritySelect.value === "") {
    pass.value = "";
    pass.classList.remove("error");
    hideError();
  }
});

function resetCanvas() {
  fgTextInput.value = null;
  bgTextInput.value = null;
  fgColorInput.value = "#000000";
  bgColorInput.value = "#ffffff";
  size.value = null;
  margin.value = null;
  textInput.classList.remove("error");
  size.classList.remove("error");
  margin.classList.remove("error");
  ssid.classList.remove("error");
}

function showError(element, text) {
  alertTxt.textContent = text;
  alertTxt.classList.add("show");
  if (element) {
    element.classList.add("error");
  }
}

function hideError() {
  alertTxt.classList.remove("show");
}

function errorEffect() {
  generateBtn.classList.remove("buzz");

  void generateBtn.offsetWidth;
  generateBtn.classList.add("buzz");

  generateBtn.addEventListener(
    "animationend",
    () => {
      button.classList.remove("buzz");
    },
    { once: true }
  );
}
