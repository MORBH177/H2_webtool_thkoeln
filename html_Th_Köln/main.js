
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
    }
  
   init(){
    // pv slider + inputfeld
    const tmpPvSlider = document.querySelector('#PV-Eingabe')
    if(tmpPvSlider != null && tmpPvSlider != undefined ){
      this.pvSlider = tmpPvSlider;
      this.pvSlider.value = 50;
    }
  
    const tmpPvInput = document.querySelector('#output_eingabe_PV')
    if(tmpPvInput != null && tmpPvInput != undefined ){
      this.pvInput = tmpPvInput;
      this.pvInput.value = 50;

    }

    // Wind Onshore slider + inputfeld
    const tmpWindCSlider = document.querySelector('#WKA_OnShore-Eingabe')
    if(tmpWindCSlider != null && tmpWindCSlider != undefined ){
      this.windCSlider = tmpWindCSlider;
      this.windCSlider.value = 50;
    }
  
    const tmpWindCInput = document.querySelector('#output_eingabe_WKA_OnShore')
    if(tmpWindCInput != null && tmpWindCInput != undefined ){
      this.windCInput = tmpWindCInput;
      this.windCInput.value = 50;
    }

    // Wind Offshore slider + inputfeld
    const tmpWindOSlider = document.querySelector('#WKA_OffShore-Eingabe')
    if(tmpWindOSlider != null && tmpWindOSlider != undefined ){
      this.windOSlider = tmpWindOSlider;
      this.windOSlider.value = 50;
    }
  
    const tmpWindOInput = document.querySelector('#output_eingabe_WKA_OffShore')
    if(tmpWindOInput != null && tmpWindOInput != undefined ){
      this.windOInput = tmpWindOInput;
      this.windOInput.value = 50;
    }

    // pem slider + inputfeld
    const tmpPemSlider = document.querySelector('#Elektrolyseur-Eingabe')
    if(tmpPemSlider != null && tmpPemSlider != undefined ){
      this.pemSlider = tmpPemSlider;
      this.pemSlider.value = 50;
    }
  
    const tmpPemInput = document.querySelector('#output_eingabe_Elektrolyse')
    if(tmpPemInput != null && tmpPemInput != undefined ){
      this.pemInput = tmpPemInput;
      this.pemInput.value = 50;
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
    
    // Stackwärme
    const tmpOutStackHeat = document.querySelector('#output_Abwärme')
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

    // wind onshore slider + inputfeld
    if(this.windCSlider != null && this.windCSlider != undefined ){
      this.windCSlider.oninput = () => {
        this.windC = this.windCSlider.value;
        this.windCInput.value = this.windCSlider.value;
      };
    }
    if(this.windCInput != null && this.windCInput != undefined ){
      this.windCInput.oninput = () => {
        if (this.windCInput.value > 100) {
          this.windCInput.value = 100;
        } else if (this.windCInput.value < 0) {
          this.windCInput.value = 0;
        }
        this.windC = this.windCInput.value;
        this.windCSlider.value = this.windC;
        //all other functions
      };
    }

    // wind offshore slider + inputfeld
    if(this.windOSlider != null && this.windOSlider != undefined ){
      this.windOSlider.oninput = () => {
        this.windO = this.windOSlider.value;
        this.windOInput.value = this.windOSlider.value;
      };
    }
    if(this.windOInput != null && this.windOInput != undefined ){
      this.windOInput.oninput = () => {
        if (this.windOInput.value > 100) {
          this.windOInput.value = 100;
        } else if (this.windOInput.value < 0) {
          this.windOInput.value = 0;
        }
        this.windO = this.windOInput.value;
        this.windOSlider.value = this.windO;
        //all other functions
      };
    }

    // pem slider + inputfeld
    if(this.pemSlider != null && this.pemSlider != undefined ){
      this.pemSlider.oninput = () => {
        this.pem = this.pemSlider.value;
        this.pemInput.value = this.pemSlider.value;
      };
    }
    if(this.pemInput != null && this.pemInput != undefined ){
      this.pemInput.oninput = () => {
        if (this.pemInput.value > 100) {
          this.pemInput.value = 100;
        } else if (this.pemInput.value <= 0) {
          this.pemInput.value = 1;
        }
        this.pem = this.pemInput.value;
        this.pemSlider.value = this.pem;
        //all other functions
      };
    }


  
   } //end addEvents
  
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