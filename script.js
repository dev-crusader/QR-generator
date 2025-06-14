const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");

const qrImage = document.getElementById("qrImage");
const fontFamily = "Manrope, Segoe UI, Tahoma, Geneva, Verdana, sans-serif";

const textInput = document.getElementById("text-input");
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
const hasError = false;

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const currentActiveTab = document.querySelector(".tab.active");
    if (currentActiveTab === tab) {
      return;
    }
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
    resetCanvas();
    fadeIn();
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
    let ssidVal = document.getElementById("wifi-ssid").value;
    let passVal = document.getElementById("wifi-pass").value;
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
    window.generatedImageDataUrl = url;
    fadeIn();
    qrImage.src = url;
    downloadBtn.disabled = false;
    hideError();
  });
});

function fadeIn() {
  qrImage.classList.remove("qr-fade-in");
  void qrImage.offsetWidth;

  qrImage.classList.add("qr-fade-in");
}

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

function colorCheck(value) {}

function validateInput(ele, minm, maxm) {
  const element = ele.value.trim();
  let inp = minm == 0 ? "Margin" : "Size";
  if (element != "" && isNaN(element)) {
    return `Please enter a valid number for ${inp}.`;
  }
  let val = parseInt(element);
  if (val < minm) {
    return `${inp} atleast ${minm} expected`;
  }

  if (val > maxm) {
    return `${inp} less than ${maxm} expected`;
  }

  return "";
}

function validateVcard(name, phone, email, address) {
  if (name === "" && phone === "" && email === "" && address === "") {
    return "Atleast one info required!";
  }
  if (phone != "" && isNaN(phone)) {
    return "Number expected for phone";
  }

  if (!isValidEmail(email)) {
    return "Invalid email format.";
  }
  return "";
}

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
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
// Remove error class on inserting input
document.querySelectorAll('input[type="text"]').forEach((input) => {
  input.addEventListener("input", (e) => {
    if (e.target.id === "bg-color" || e.target.id === "fore-color") {
      return;
    }

    if (e.target.value.trim() !== "") {
      e.target.classList.remove("error");
      hideError();
    }
  });
});

document
  .querySelectorAll('.color-section input[type="color"]')
  .forEach((input) => {
    input.addEventListener("input", (e) => {
      if (e.target.id === "forecolor-pick") {
        document.getElementById("fore-color").value = e.target.value;
        document.getElementById("fore-color").classList.remove("error");
      }
      if (e.target.id === "bgcolor-pick") {
        document.getElementById("bg-color").value = e.target.value;
        document.getElementById("bg-color").classList.remove("error");
      }
      hideError();
    });
  });

document
  .querySelectorAll('.size-inputs input[type="text"]')
  .forEach((input) => {
    input.addEventListener("blur", (e) => {
      let minm = 0;
      minm = e.target.id === "size-input" ? 100 : 0;
      let maxm = e.target.id === "size-input" ? 10000 : 10;
      const message = validateInput(e.target, minm, maxm);
      if (message) {
        showError(e.target, err + message);
      } else {
        e.target.classList.remove("error");
        hideError();
      }
    });
  });

document
  .querySelectorAll('.color-section input[type="text"]')
  .forEach((input) => {
    input.addEventListener("blur", (e) => {
      colorAnalyzer(e);
    });
  });

function colorAnalyzer(e) {
  let val = e.target.value.trim();
  if (val === "") {
    if (e.target.id === "bg-color") {
      document.getElementById("bgcolor-pick").value = "#ffffff";
    }
    if (e.target.id === "fore-color") {
      document.getElementById("forecolor-pick").value = "#000000";
    }
    e.target.classList.remove("error");
    hideError();
    return;
  }

  if (val.startsWith("#")) {
    val = val.substring(1);
  }

  const hexRegex = /^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

  if (hexRegex.test(val)) {
    if (val.length == 3) {
      const r = val[0];
      const g = val[1];
      const b = val[2];
      val = `${r}${r}${g}${g}${b}${b}`;
    }
    const hexColor = `#${val}`;
    const testDiv = document.createElement("div");
    testDiv.style.color = hexColor;

    if (testDiv.style.color !== "") {
      e.target.value = hexColor;
      if (e.target.id === "bg-color") {
        document.getElementById("bgcolor-pick").value = hexColor;
      } else if (e.target.id === "fore-color") {
        document.getElementById("forecolor-pick").value = hexColor;
      }
      e.target.classList.remove("error");
      hideError();
    }
  } else {
    showError(e.target, err + "Invalid color");
  }
}

const wifiSecuritySelect = document.getElementById("wifi-security");
wifiSecuritySelect.addEventListener("change", () => {
  if (wifiSecuritySelect.value === "") {
    pass.value = "";
    pass.classList.remove("error");
    hideError();
  }
});

function resetCanvas() {
  fgColorInput.value = "#000000";
  bgColorInput.value = "#ffffff";
  document.querySelectorAll('input[type="text"]').forEach((input) => {
    input.value = null;
    input.classList.remove("error");
  });
  hideError();
  qrImage.src = "./images/qr-default.svg";
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
      generateBtn.classList.remove("buzz");
    },
    { once: true }
  );
}
