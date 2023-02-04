//Update Textfeld anhand von Sliderstellung
function updateText1(val) {
  document.getElementById("textPv").value = val;
  updateMax();
  pPv = parseInt(val);
}

//Update Textfeld anhand von Sliderstellung
function updateText2(val) {
  document.getElementById("textWindC").value = val;
  updateMax();
  pWindC = parseInt(val);
}

//Update Textfeld anhand von Sliderstellung
function updateText3(val) {
  document.getElementById("textWindO").value = val;
  updateMax();
  pWindO = parseInt(val);
}

//Update Textfeld anhand von Sliderstellung
function updateText4(val) {
  document.getElementById("textPem").value = val;
  pPem = parseInt(val);
}

//update Slider PEM als maximal Summe aller Generatorleistungen
function updateMax() {
  const maxUse = 0.8;
  var max = parseInt(document.getElementById("sl1").value) + parseInt(document.getElementById("sl2").value) + parseInt(document.getElementById("sl3").value);
  document.getElementById("sl4").max = max * maxUse;
}



