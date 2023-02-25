
const filePath_gen = "gen_data.json";
const filePath_eta = "eta_data.json";

// setup plots
var chartConfig_car = {
  type: 'bar',
  data: {
      labels: ['Betrieb von x Brennstoffzellen-Autos für 100 km'],
      datasets: [{
      data: [240833],
      backgroundColor: ['rgba(207, 24, 32, 1.0)'],
      borderRadius: 25,
      borderWidth: 5,
      inflateAmount: 5
      }]
  },
  options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
          legend: {
              display: false,
              }
      },
      scales: {
          x: {
              display: false,
              max: 821000,
              ticks: {
                beginAtZero: true,
                tickWidth: 1,
              },
              },
          y: {
              display: false,
              }
      },
  }
};

var chartConfig_bus = {
  type: 'bar',
  data: {
      labels: ['Betrieb von x Brennstoffzellen-Bussen für 100 km'],
      datasets: [{
      data: [48116],
      backgroundColor: ['rgba(236, 101, 37, 1.0)'],
      borderRadius: 25,
      borderWidth: 5,
      inflateAmount: 5
      }]
  },
  options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
          legend: {
              display: false
          }
      },
      scales: {
          x: {
              display: false,
              max: 400000,
              ticks: {
                beginAtZero: true,
                tickWidth: 1,
              },
              },
          y: {
              display: false,
              }
      },
  }
};

var chartConfig_house = {
  type: 'bar',
  data: {labels: ['Wärmeversorgung von x Wohngebäuden (kfW 40) mit 120 m²'],
      datasets: [{
      label: 'Versorgung mit Abwärme',
      data: [21166],
      backgroundColor: ['rgba(255, 255, 255, 1.0)'],
      borderRadius: 25,
      borderWidth: 5,
      inflateAmount: 5,      
      },
      {
      label: 'Heizen mit H2',
      data: [6327],
      backgroundColor: ['rgba(140, 140, 140, 1.0)'],
      borderRadius: 25,
      borderWidth: 5,
      inflateAmount: 5,
      },]
  },
  options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
          legend: {
              display: false
          }
      },
      scales: {
          x: {
              display: false,
              max: 305000,
              stacked: true,
              ticks: {
                beginAtZero: true,
                tickWidth: 1,
              },
              },
          y: {
              display: false,
              stacked: true
              }
      },
  }
};

var chartConfig_steel = {
  type: 'bar',
  data: {
      labels: ['Herstellung von x Tonnen Stahl'],
      datasets: [{
      data: [8092],
      backgroundColor: ['rgba(175, 54, 140, 1.0)'],
      borderRadius: 25,
      borderWidth: 5,
      inflateAmount: 5
      }]
  },
  options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
          legend: {
              display: false
          }
      },
      scales: {
          x: {
              display: false,
              max: 30000,
              ticks: {
                beginAtZero: true,
                tickWidth: 1,
              },
              },
          y: {
              display: false,
              }
      },
  }
};

class H2tool{
    pvSlider = null;
    windCSlider = null;
    windOSlider = null;
    pemSlider = null;
    pvInput = null;
    windCInput = null;
    windOInput = null;
    pemInput = null;

    plotField_car = null;
    plotField_bus = null;
    plotField_house = null;
    plotField_steel = null;
    resultPlot_car = null;
    resultPlot_bus = null;
    resultPlot_house = null;
    resultPlot_steel = null;

    OutVLH = null;
    OutH2 = null;
    OutH2Energy = null;
    OutO2 = null;
    OutH2O = null;
    OutStackHeat = null;
    OutH2Heat = null;
    OutConsumption = null;

    OutCar = null;
    OutBus = null;
    OutHouse = null;
    OutSteel = null;

    //  default values
    outCar = 240833;
    outBus = 48116;
    outHouse = 21166;
    outSteel = 8092;

    //  default values
    pv = 30;
    windC = 30;
    windO = 30;
    pem = 30;

    // result variables
    vlh = 0;
    m_h2 = 0;
    m_o2 = 0;
    v_h2o = 0;
    q_stack = 0;
    h2_lhv = 0;
    h2_hhv = 0;
    used_energy = 0;

    //  data arrays
    basedata = null;
    etadata = null;

    //  constants for calculation
    hu_h2 = 33.33; // MWh/t H2
    ho_h2 = 39.41; // MWh/t H2
    n_pem_heat = 0.75; // PEM-mit Wärmeausbeute gesamt
    rho_h2o = 997; // kg/m³

    constructor(basedata, etadata, chartConfig_car, chartConfig_bus, chartConfig_house, chartConfig_steel){
      this.basedata = basedata;
      this.etadata = etadata;
      this.chartConfig_car = chartConfig_car;
      this.chartConfig_bus = chartConfig_bus;
      this.chartConfig_house = chartConfig_house;
      this.chartConfig_steel = chartConfig_steel;
      console.log('data loaded');
      this.init();
      console.log('H2tool initialized');
      this.addEvents();
      console.log('Events added');
      this.updateMax();
      console.log('Max updated');
      this.resultPlot_car = new Chart(this.plotField_car, this.chartConfig_car);
      this.resultPlot_bus = new Chart(this.plotField_bus, this.chartConfig_bus);
      this.resultPlot_house = new Chart(this.plotField_house, this.chartConfig_house);
      this.resultPlot_steel = new Chart(this.plotField_steel, this.chartConfig_steel);
      console.log('Charts initialized');
      this.calcResults();
      console.log('initial Results calculated');
    } // end constructor
  
    init(){
      // pv slider + inputfeld
      const tmpPvSlider = document.querySelector('#PV-Eingabe')
      if(tmpPvSlider != null && tmpPvSlider != undefined ){
        this.pvSlider = tmpPvSlider;
        this.pvSlider.value = 30;
      }
    
      const tmpPvInput = document.querySelector('#output_eingabe_PV')
      if(tmpPvInput != null && tmpPvInput != undefined ){
        this.pvInput = tmpPvInput;
        this.pvInput.value = 30;
      }

      // Wind Onshore slider + inputfeld
      const tmpWindCSlider = document.querySelector('#WKA_OnShore-Eingabe')
      if(tmpWindCSlider != null && tmpWindCSlider != undefined ){
        this.windCSlider = tmpWindCSlider;
        this.windCSlider.value = 30;
      }
    
      const tmpWindCInput = document.querySelector('#output_eingabe_WKA_OnShore')
      if(tmpWindCInput != null && tmpWindCInput != undefined ){
        this.windCInput = tmpWindCInput;
        this.windCInput.value = 30;
      }

      // Wind Offshore slider + inputfeld
      const tmpWindOSlider = document.querySelector('#WKA_OffShore-Eingabe')
      if(tmpWindOSlider != null && tmpWindOSlider != undefined ){
        this.windOSlider = tmpWindOSlider;
        this.windOSlider.value = 30;
      }
    
      const tmpWindOInput = document.querySelector('#output_eingabe_WKA_OffShore')
      if(tmpWindOInput != null && tmpWindOInput != undefined ){
        this.windOInput = tmpWindOInput;
        this.windOInput.value = 30;
      }

      // pem slider + inputfeld
      const tmpPemSlider = document.querySelector('#Elektrolyseur-Eingabe')
      if(tmpPemSlider != null && tmpPemSlider != undefined ){
        this.pemSlider = tmpPemSlider;
        this.pemSlider.value = 30;
      }
    
      const tmpPemInput = document.querySelector('#output_eingabe_Elektrolyse')
      if(tmpPemInput != null && tmpPemInput != undefined ){
        this.pemInput = tmpPemInput;
        this.pemInput.value = 30;
      }

      // ouptutfelder
      // VLH
      const tmpOutVLH = document.querySelector('#output_volllaststunden')
      if(tmpOutVLH != null && tmpOutVLH != undefined ){
        this.OutVLH = tmpOutVLH;

      }

      // used energy
      const tmpOutEnergyConsumption = document.querySelector('#output_genutzte_Energie')
      if(tmpOutEnergyConsumption != null && tmpOutEnergyConsumption!= undefined ){
        this.OutConsumption = tmpOutEnergyConsumption;
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

      // H2 Energy
      const tmpOutH2Energy = document.querySelector('#output_Wasserstoff_energy')
      if(tmpOutH2Energy != null && tmpOutH2Energy != undefined ){
        this.OutH2Energy = tmpOutH2Energy;
      }


      // Plotoutputs
      const tmpOutPlotCar = document.querySelector('#output-car')
      if(tmpOutPlotCar != null && tmpOutPlotCar != undefined ){
        this.OutCar = tmpOutPlotCar;
        this.OutCar.value = this.outCar;
      }

      const tmpOutPlotBus = document.querySelector('#output-bus')
      if(tmpOutPlotBus != null && tmpOutPlotBus != undefined ){
        this.OutBus = tmpOutPlotBus;
        this.OutBus.value = this.outBus;
      }

      const tmpOutPlotHouse = document.querySelector('#output-house')
      if(tmpOutPlotHouse != null && tmpOutPlotHouse != undefined ){
        this.OutHouse = tmpOutPlotHouse;
        this.OutHouse.value = this.outHouse;
      }

      const tmpOutPlotSteel = document.querySelector('#output-steel')
      if(tmpOutPlotSteel != null && tmpOutPlotSteel != undefined ){
        this.OutSteel = tmpOutPlotSteel;
        this.OutSteel.value = this.outSteel;
      }
      
      // Plotfelder
      const tmpPlotFieldCar = document.querySelector('#plot-car')
      if(tmpPlotFieldCar != null && tmpPlotFieldCar != undefined ){
        this.plotField_car = tmpPlotFieldCar;
      }

      const tmpPlotFieldBus = document.querySelector('#plot-bus')
      if(tmpPlotFieldBus != null && tmpPlotFieldBus != undefined ){
        this.plotField_bus = tmpPlotFieldBus;
      }

      const tmpPlotFieldHouse = document.querySelector('#plot-house')
      if(tmpPlotFieldHouse != null && tmpPlotFieldHouse != undefined ){
        this.plotField_house = tmpPlotFieldHouse;
      }

      const tmpPlotFieldSteel = document.querySelector('#plot-steel')
      if(tmpPlotFieldSteel != null && tmpPlotFieldSteel != undefined ){
        this.plotField_steel = tmpPlotFieldSteel;
      }

    } //end init
  
    addEvents(){
    
      // pv slider + inputfeld
      if(this.pvSlider != null && this.pvSlider != undefined ){
        this.pvSlider.oninput = () => {
          this.pv = this.pvSlider.value;
          this.pvInput.value = this.pvSlider.value;
          this.updateMax();
          this.calcResults();
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
          this.updateMax();
          this.calcResults();
          //all other functions
        };
        this.pvInput.onchange = () => {
          if (isNaN(this.pvInput.value)) {
            this.pvInput.value = this.pvSlider.value;
          }
        };
      }

      // wind onshore slider + inputfeld
      if(this.windCSlider != null && this.windCSlider != undefined ){
        this.windCSlider.oninput = () => {
          this.windC = this.windCSlider.value;
          this.windCInput.value = this.windCSlider.value;
          this.updateMax();
          this.calcResults();
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
          this.updateMax();
          this.calcResults();
          //all other functions
        };
        this.windCInput.onchange = () => {
          if (isNaN(this.windCInput.value)) {
            this.windCInput.value = this.windCSlider.value;
          }
        };
      }

      // wind offshore slider + inputfeld
      if(this.windOSlider != null && this.windOSlider != undefined ){
        this.windOSlider.oninput = () => {
          this.windO = this.windOSlider.value;
          this.windOInput.value = this.windOSlider.value;
          this.updateMax();
          this.calcResults();
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
          this.updateMax();
          this.calcResults();
          //all other functions
        };
        this.windOInput.onchange = () => {
          if (isNaN(this.windOInput.value)) {
            this.windOInput.value = this.windOSlider.value;
          }
        };
      }

      // pem slider + inputfeld
      if(this.pemSlider != null && this.pemSlider != undefined ){
        this.pemSlider.oninput = () => {
          this.pem = this.pemSlider.value;
          this.pemInput.value = this.pemSlider.value;
          this.calcResults();
        };
      }
      if(this.pemInput != null && this.pemInput != undefined ){
        this.pemInput.oninput = () => {
          const maxUse = 0.9;
          var max = parseInt(this.pv) + parseInt(this.windC) + parseInt(this.windO);
          if (this.pemInput.value > parseInt(max * maxUse)) {
            this.pemInput.value = parseInt(max * maxUse);
          }
          this.pem = this.pemInput.value;
          this.pemSlider.value = this.pem;
          this.calcResults();
          //all other functions
        };
        this.pemInput.onchange = () => {
          if (isNaN(this.pemInput.value)) {
            this.pemInput.value = this.pemSlider.value;
          } else if (this.pemInput.value <= 0) {
            this.pemInput.value = 1;
          }
        };
      }  
    } //end addEvents
  
    updateMax() {
      const maxUse = 0.9;
      var max = parseInt(this.pv) + parseInt(this.windC) + parseInt(this.windO);
      if (max < 1) {
        max = 1 / maxUse;
        this.pemSlider.value = 1;
        this.pemInput.value = 1;
      } else {
        this.pemSlider.max = parseInt(max * maxUse);
        this.pemInput.max = parseInt(max * maxUse);
      }
    } //end updateMax

    calcResults() {
      let data_scaled = [[], [], []];
      let p_combined = [];
      let pem_operation = [];
      let pem_production = [];
      let pem_production_heat = [];

      for (let i = 0; i < this.basedata[0].length; i++) {
        // data_scaled = [pv, windC, windO]
        // scale gen profiles and combine the generation power
        data_scaled[0].push(this.basedata[0][i] * this.pv);
        data_scaled[1].push(this.basedata[1][i] * this.windC);
        data_scaled[2].push(this.basedata[2][i] * this.windO);
        p_combined.push(data_scaled[0][i] + data_scaled[1][i] + data_scaled[2][i]);

        // calculate the used power for PEM
        if (p_combined[i] >= this.pem) {
          pem_operation.push(parseFloat(this.pem));
        } else if (p_combined[i] < this.pem && p_combined[i] >= (this.pem * 0.1)) {
          pem_operation.push(p_combined[i]);
        } else { 
          pem_operation.push(0.0); 
        } 
        // etadata = [pem, eta]
        // calculate the produced energy in H2
        var pem_last = pem_operation[i] / this.pem;
        for (let j = 0; j < this.etadata[0].length; j++) {
          if (this.etadata[0][j] >= pem_last) {
            pem_production.push(this.etadata[1][j] * pem_operation[i]);
            break;
          }
        }
        for (let j = 0; j < this.etadata[0].length; j++) {
          if (this.etadata[0][j] >= pem_last) {
            pem_production_heat.push((this.n_pem_heat - this.etadata[1][j]) * pem_operation[i]);
            break;
          }
        }
        
      }
      
      // calculate the used Energy amount
      this.used_energy = parseInt(pem_operation.reduce((a, b) => a + b, 0));

      // calculate Volllaststunden
      this.vlh = parseInt(this.used_energy / this.pem); // h
      
      // calculate the produced H2 amount
      this.h2_lhv = parseInt(pem_production.reduce((a, b) => a + b, 0)); // MWh
      this.m_h2 = parseInt(this.h2_lhv / this.hu_h2); // t
      this.h2_hhv = parseInt(this.m_h2 * this.ho_h2); // MWh

      // calculate the stack heat
      this.q_stack = parseInt(pem_production_heat.reduce((a, b) => a + b, 0)); // MWh
      
      // calculate water and oxygen amount
      this.v_h2o = parseInt(((this.m_h2 * 16) * 1000) / this.rho_h2o); // m³
      this.m_o2 = parseInt(this.m_h2 * 8); // t

      this.updateDOM();
      this.updateChart();

    } //end calculateResults

    updateDOM() {
      this.OutConsumption.value = this.used_energy;
      this.OutVLH.value = this.vlh;
      this.OutH2O.value = this.v_h2o;
      this.OutH2.value = this.m_h2;
      this.OutO2.value = this.m_o2;
      this.OutStackHeat.value = this.q_stack;
      this.OutH2Energy.value = this.h2_lhv;
    } //end updateDOM

    updateChart() {
      // factors for graphic 
      let consumption_car = 1.2;  // kg H2 / 100km
      let consumption_bus = 6; // kg H2 / 100 km  
      let consumption_house = 15 * 120; // kWh pro haus (KfW40 Haus 15kWh/m² Annahme: 120m²)

      // mass steel
      let m_fe = parseInt(parseFloat(this.m_h2) * 28); // t
      // cars
      let amt_cars = parseInt(((parseFloat(this.m_h2) * 1000) / consumption_car));
      // busses
      let amt_busses = parseInt(((parseFloat(this.m_h2) * 1000) / consumption_bus));
      // amount house heating by wasteheat
      let amt_wasteheat = parseInt((parseFloat(this.q_stack) * 1000) / consumption_house); 
      // amount house heating by heat from H2
      let amt_h2heat = parseInt(((parseFloat(this.h2_hhv)) * 1000) / consumption_house);
      // [m_fe, amt_cars, amt_busses, amt_wasteheat, amt_h2heat]
      //console.log(m_fe, amt_cars, amt_busses, amt_wasteheat, amt_h2heat);
      this.resultPlot_car.data.datasets[0].data[0] = amt_cars;
      this.resultPlot_bus.data.datasets[0].data[0] = amt_busses;
      this.resultPlot_house.data.datasets[0].data[0] = amt_wasteheat;
      this.resultPlot_house.data.datasets[1].data[0] = amt_h2heat;
      this.resultPlot_steel.data.datasets[0].data[0] = m_fe;

      this.resultPlot_car.update();
      this.resultPlot_bus.update();
      this.resultPlot_house.update();
      this.resultPlot_steel.update();

      this.OutCar.value = amt_cars;
      this.OutBus.value = amt_busses;
      this.OutHouse.value = amt_wasteheat + amt_h2heat;
      this.OutSteel.value = m_fe;

    } //end updateChart

  } //end class
  
  async function loadJSONFile(filePath) {
    try {
      const response = await fetch(filePath); // Use fetch API to get the file data
      const data = await response.json(); // Parse the JSON data
  
      return data; // Return the parsed data
    } catch (error) {
      console.error(error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    let basedata = [[], [], []];
    let eta_data = [[], []];

    // load generator data
    loadJSONFile(filePath_gen).then(data => {
      for (let i = 0; i < data.length; i++) {
        basedata[0].push(data[i][0]); //pv data
        basedata[1].push(data[i][1]); //windC data
        basedata[2].push(data[i][3]); //windO data
      }
      console.log('basedata loaded properly');
    }).catch(error => {
      console.error(error);
    });

    // load efficiency data
    loadJSONFile(filePath_eta).then(data => {
      for (let i = 0; i < data.length; i++) {
        eta_data[0].push(data[i][0]); //lastanteil data
        eta_data[1].push(data[i][1]); //eta data
      }
      console.log('etadata loaded properly');
    }).catch(error => {
      console.error(error);
    });

    setTimeout(() => {
    const h2tool = new H2tool(basedata, eta_data, chartConfig_car, chartConfig_bus, chartConfig_house, chartConfig_steel);
    }, 500);

  });