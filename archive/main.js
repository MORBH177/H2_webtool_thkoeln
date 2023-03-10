
class H2tool{
    pvSlider = null;
    windCSlider = null;
    windOSlider = null;
    pemSlider = null;
    pvInput = null;
    windCInput = null;
    windOInput = null;
    pemInput = null;

    OutVLH = null;
    OutH2 = null;
    OutO2 = null;
    OutH2O = null;
    OutStackHeat = null;
    OutH2Heat = null;

    pv = 50;
    windC = 50;
    windO = 50;
    pem = 50;

    vlh = 0;
    m_h2 = 0;
    m_o2 = 0;
    v_h2o = 0;
    q_stack = 0;
    q_h2 = 0;

  
    constructor(){
      this.init();
      this.addEvents();
      console.log('H2tool initialized');
      console.log(typeof this.pvSlider);
    }
  
   init(){
    // pv slider + inputfeld
    const tmpPvSlider = document.querySelector('#PV-Eingabe')
    console.log(tmpPvSlider);
    console.log(typeof tmpPvSlider);
    if(tmpPvSlider != null && tmpPvSlider != undefined ){
      this.pvSlider = tmpPvSlider;
      console.log(typeof this.pvSlider);
    }
  
    const tmpPvInput = document.querySelector('#output_eingabe_PV')
    if(tmpPvInput != null && tmpPvInput != undefined ){
      this.pvInput = tmpPvInput;
    }

    // Wind Onshore slider + inputfeld
    const tmpWindCSlider = document.querySelector('#WKA_OnShore-Eingabe')
    if(tmpWindCSlider != null && tmpWindCSlider != undefined ){
      this.windCSlider = tmpWindCInput;
    }
  
    const tmpWindCInput = document.querySelector('#output_eingabe_WKA_OnShore')
    if(tmpWindCInput != null && tmpWindCInput != undefined ){
      this.windCInput = tmpWindCInput;
    }

    // Wind Offshore slider + inputfeld
    const tmpWindOSlider = document.querySelector('#WKA_OffShore-Eingabe')
    if(tmpWindOSlider != null && tmpWindOSlider != undefined ){
      this.windOSlider = tmpWindOInput;
    }
  
    const tmpWindOInput = document.querySelector('#output_eingabe_WKA_OffShore')
    if(tmpWindOInput != null && tmpWindOInput != undefined ){
      this.pvInput = tmpPvInput;
    }

    // pem slider + inputfeld
    const tmpPemSlider = document.querySelector('#Elektrolyseur-Eingabe')
    if(tmpPemSlider != null && tmpPemSlider != undefined ){
      this.pvSlider = tmpPvSlider;
    }
  
    const tmpPemInput = document.querySelector('#output_eingabe_Elektrolyse')
    if(tmpPemInput != null && tmpPemInput != undefined ){
      this.pemInput = tmpPemInput;
    }

    // ouptutfelder
    // VLH
    const tmpOutVLH = document.querySelector('#ouput_volllaststunden')
    if(tmpOutVLH != null && tmpOutVLH != undefined ){
      this.OutVLH = tmpOutVLH;
    }

    // H2
    const tmpOutH2 = document.querySelector('#output_Wasserstoff')
    if(tmpOutH2 != null && tmpOutH2 != undefined ){
      this.OutH2 = tmpOutH2;
    }

    // O2
    const tmpOutO2 = document.querySelector('#output_Sauerstoff')
    if(tmpOutO2 != null && tmpOutO2 != undefined ){
      this.OutO2 = tmpOutO2;
    }

    // H2O
    const tmpOutH2O = document.querySelector('#output_Wasser')
    if(tmpOutH2O != null && tmpOutH2O != undefined ){
      this.OutH2O = tmpOutH2O;
    }
    
    // Stackw??rme
    const tmpOutStackHeat = document.querySelector('#output_Abw??rme')
    if(tmpOutStackHeat != null && tmpOutStackHeat != undefined ){
      this.OutStackHeat = tmpOutStackHeat;
    }


   }
   
  
   addEvents(){
    
    // pv slider + inputfeld
    if(this.pvSlider != null && this.pvSlider != undefined ){
      this.pvSlider.oninput = () => {
        this.pv = this.pvSlider.value;
        this.pvInput.value = this.pvSlider.value;
      };
    }
    if(this.pvInput != null && this.pvInput != undefined ){
      this.pvInput.oninput = () => {
        if (this.pvInput.value > 100) {
          this.pvInput.value = 100;
        } else if (this.pvInput.value < 0) {
          this.pvInput.value = 0;
        }
        this.pv = this.pvInput.value;
        this.pvSlider.value = this.pv;
        //all other functions
      };
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