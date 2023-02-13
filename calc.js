
class H2tool{
  pvSlider = null;
  pvInput = null;
  pv = 50;

  constructor(){
    this.init();
    this.addEvents();
  }

 init(){
  const tmpPvSlider = document.querySelector('#sl1')
  if(tmpPvSlider != null && tmpPvSlider != undefined ){
    this.pvSlider = tmpPvSlider;
  }

  const tmpPvInput = document.querySelector('#textPv')
  if(tmpPvInput != null && tmpPvInput != undefined ){
    this.pvInput = tmpPvInput;
  }
 }

 addEvents(){
  if(this.pvInput != null && this.pvInput != undefined ){
    this.pvInput.addEventListener('input' , (e) => {
      this.pv = this.pvInput.value;
      this.pvSlider.value = this.pv;
      //all other functions
    });
    this.pvInput.addEventListener('change' , (e) => {
      
    });
  }

  if(this.pvSlider != null && this.pvSlider != undefined ){
    this.pvSlider = addEventListener('input' , (e) => {
      this.pvInput.value = this.pvSlider.value;
      this.pvInput.dispatchEvent(new Event('change',{}));
    });
  }
 }

  updateMax() {
    const maxUse = 0.9;
    var max = parseInt(this.pv) + parseInt(document.getElementById("sl2").value) + parseInt(document.getElementById("sl3").value);
    if (max < 1) {
      max = 1 / maxUse;
      updateText4(max * maxUse);
    }

    document.getElementById("sl4").max = max * maxUse;
  }
}

document.addEventListener('DOMContentLoaded',() => {
  const h2tool = new H2tool();
});

//Update Textfeld anhand von Sliderstellung
function updateText1(val) {
  document.getElementById("textPv").value = val;
  updateMax();
}

//Update Textfeld anhand von Sliderstellung
function updateText2(val) {
  document.getElementById("textWindC").value = val;
  updateMax();
}

//Update Textfeld anhand von Sliderstellung
function updateText3(val) {
  document.getElementById("textWindO").value = val;
  updateMax();
}

//Update Textfeld anhand von Sliderstellung
function updateText4(val) {
  document.getElementById("textPem").value = val;
}

//update Slider PEM als maximal Summe aller Generatorleistungen
function updateMax() {
  const maxUse = 0.9;
  var max = parseInt(document.getElementById("sl1").value) + parseInt(document.getElementById("sl2").value) + parseInt(document.getElementById("sl3").value);
  if (max < 1) {
    max = 1 / maxUse;
    updateText4(max * maxUse);
  }
  document.getElementById("sl4").max = max * maxUse;
}


function updateSlider1(val){
  if (val < 0) {
    document.getElementById("sl1").value = 0;
    document.getElementById("textPv").value = 0;
  } else if (val > 100) {
    document.getElementById("sl1").value = 100;
    document.getElementById("textPv").value = 100;
  } else {
    document.getElementById("sl1").value = val;
  }
  updateMax();
}

function updateSlider2(val){
  if (val < 0) {
    document.getElementById("sl2").value = 0;
    document.getElementById("textWindC").value = 0;
  } else if (val > 100) {
    document.getElementById("sl2").value = 100;
    document.getElementById("textWindC").value = 100;
  } else {
    document.getElementById("sl2").value = val;
  }
  updateMax();
}

function updateSlider3(val){
  if (val < 0) {
    document.getElementById("sl3").value = 0;
    document.getElementById("textWindO").value = 0;
  } else if (val > 100) {
    document.getElementById("sl3").value = 100;
    document.getElementById("textWindO").value = 100;
  } else {
    document.getElementById("sl3").value = val;
  }
  updateMax();
}

function updateSlider4(val){
  const maxUse = 0.9;
  var max = parseInt(document.getElementById("sl1").value) + parseInt(document.getElementById("sl2").value) + parseInt(document.getElementById("sl3").value);
  if (max < 1) {
    max = 1 / maxUse;
  }
  updateMax();
  if (val < 1) {
    document.getElementById("sl4").value = 1;
    document.getElementById("textPem").value = 1;
  } else if (val > max * maxUse) {
    document.getElementById("sl4").value = parseInt(max * maxUse);
    document.getElementById("textPem").value = parseInt(max * maxUse);
  } else {
    document.getElementById("sl4").value = val;
  }
}

function main() {

}