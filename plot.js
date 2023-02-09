const ctx = document.getElementById('plot');

var config = {
    type: 'bar',
    data: {
        labels: ['cars', 'busses', 'houses from wasteheat', 'houses from H2heat', 't iron'],
        datasets: [{
        data: [49933, 99866, 35792, 131197, 167776],
        backgroundColor: ["red", "blue", "green", "yellow", "gray"]
        }]
    },
    options: {
        //responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                    display: false
                },
            y: {
                display: false,
                max: 420000,
                ticks: {
                    beginAtZero: true
                },
                }
        },
    }
};

var resultPlot = new Chart(ctx, config);

// factors for graphic 
const consumption_car = 1.2;  // kg H2 / 100km
const consumption_bus = 6; // kg H2 / 100 km  
const consumption_house = 15 * 120; // kWh pro haus (KfW40 Haus 15kWh/m² Annahme: 120m²)



function updatePlot() {
    // get relevant values
    var m_h2 = parseFloat(document.getElementById("h2").value);
    var heat_stack = parseFloat(document.getElementById("heatSTACK").value);
    var h2_hhv = parseFloat(document.getElementById("h2_hhv").value);
    console.log(m_h2);
    console.log(heat_stack);
    console.log(h2_hhv);

    // amounts supplied
    // mass Roheisen
    var m_fe = parseInt(m_h2 * 28); // t
    // cars
    var amt_cars = parseInt(((m_h2 * 1000) / consumption_car) / 100); // 100x cars
    // busses
    var amt_busses = parseInt(((m_h2 * 1000) / consumption_bus)/ 10); // 10x busses
    // amount house heating by wasteheat
    var amt_wasteheat = parseInt((heat_stack * 1000) / consumption_house); 
    // amount house heating by heat from H2
    var amt_h2heat = parseInt((h2_hhv * 1000) / consumption_house);
    // [m_fe, amt_cars, amt_busses, amt_wasteheat, amt_h2heat]


    console.log(amt_cars);
    console.log(amt_busses);
    console.log(amt_wasteheat);
    console.log(amt_h2heat);
    console.log(m_fe);

    resultPlot.data.datasets[0].data[0] = amt_cars;
    resultPlot.data.datasets[0].data[1] = amt_busses;
    resultPlot.data.datasets[0].data[2] = amt_wasteheat;
    resultPlot.data.datasets[0].data[3] = amt_h2heat;
    resultPlot.data.datasets[0].data[4] = m_fe;

    resultPlot.update();
}





