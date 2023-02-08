const ctx = document.getElementById('plot');

var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['cars', 'busses', 'houses from wasteheat', 'houses from H2heat', 't iron'],
        datasets: [{
        label: '# of Votes',
        data: [0, 0, 0, 0, 0],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: true
        }
        }
    }
});

// factors for graphic 
const consumption_car = 1.2;  // kg H2 / 100km
const consumption_bus = 6; // kg H2 / 100 km  
const consumption_house = 15 * 120; // kWh pro haus (KfW40 Haus 15kWh/m² Annahme: 120m²)



function updatePlot() {
    // get relevant values
    var m_h2 = parseFloat(document.getElementById("h2").value);
    var heat_stack = parseFloat(document.getElementById("heatSTACK").value);
    var h2_hhv = parsePloat(document.getElementById("h2_hhv").value);

    // amounts supplied
    // mass Roheisen
    var m_fe = parseInt(m_h2 * 28); // t
    // cars
    var amt_cars = parseInt((m_h2 * 1000) / consumption_car);
    // busses
    var amt_busses = parseInt((m_h2 * 1000) / consumption_bus);
    // amount house heating by wasteheat
    var amt_wasteheat = parseInt((heat_stack * 1000) / consumption_house);
    // amount house heating by heat from H2
    var amt_h2heat = parseInt((h2_hhv * 1000) / consumption_house);
    // [m_fe, amt_cars, amt_busses, amt_wasteheat, amt_h2heat]


    chart.config.data.datasets[1].data[1] = amt_cars;
    chart.update();
}





