var pPv = 50;
var pWindC = 50;
var pWindO = 50;
var pPem = 50;
var vlh = 0;

var pPvGen = [];
var pWindCGen = [];
var pWindOGen = [];

//DIE FUNKTION MUSS ÜBERDACHT WERDEN !!!!
function updateResults() {
  
  
  var PvScale = [];
  var WindCScale = [];
  var WindOScale = [];
  var GenGes = [];
  let arrays;

  fetch('erzeugung.json')
    .then(response => response.json())
    .then(data => {
      Object.entries(data).forEach(([key, value]) => {
        arrays[key] = Array.isArray(value) ? value : [value];
      });

    console.log(arrays);
  });

    
  
  
  
  
  console.log(arrays)

  

  console.log(pPvGen);
  console.log(pWindCGen);
  console.log(pWindOGen);
  console.log(pPv);
  console.log(pWindC);
  console.log(pWindO);
  console.log(PvScale);
  console.log(WindCScale);
  console.log(WindOScale);
}

//Update Textfeld anhand von Sliderstellung
function updateText1(val) {
  document.getElementById("textPv").value = val;
  updateMax();
  pPv = parseInt(val);
  console.log(typeof pPv);
}

//Update Textfeld anhand von Sliderstellung
function updateText2(val) {
  document.getElementById("textWindC").value = val;
  updateMax();
  pWindC = parseInt(val);
  console.log(pWindC);
}

//Update Textfeld anhand von Sliderstellung
function updateText3(val) {
  document.getElementById("textWindO").value = val;
  updateMax();
  pWindO = parseInt(val);
  console.log(pWindO);
}

//Update Textfeld anhand von Sliderstellung
function updateText4(val) {
  document.getElementById("textPem").value = val;
  pPem = parseInt(val);
  console.log(pPem);
}

//update Slider PEM als maximal Summe aller Generatorleistungen
function updateMax() {
  var max = parseInt(document.getElementById("sl1").value) + parseInt(document.getElementById("sl2").value) + parseInt(document.getElementById("sl3").value);
  document.getElementById("sl4").max = max;
}

//multipliziere ein array mit scalar
function scalarMultiply(arr, multiplier) {
  var new_arr = new Array();
  for (var i = 0; i < arr.length; i++)
  {
     new_arr[i] = multiplier * arr[i];
  }
  return new_arr;
}


