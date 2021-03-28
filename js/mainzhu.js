/**
 * Load data from CSV file asynchronously and render charts
 */
 let pieChart,lineChart,geoChart;
 let originalHoursData;
 let originalWagesData;

 // date range selector init
const
    range = document.getElementById('range'),
    rangeV = document.getElementById('rangeV'),
    setValue = ()=>{
        const
            newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) ),
            newPosition = 10 - (newValue * 0.2);
        rangeV.innerHTML = `<span>${dateRangeTransfer(range.value)}</span>`;
        rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
    };
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);

// loading data from CSV
Promise.all([
    d3.csv("data/HoursCSV.csv"),
    d3.csv("data/WagesCSV.csv"),
]).then(function(files) {
    // files[0] will contain HoursCSV.csv
    originalHoursData = files[0];
    // files[1] will contain WagesCSV.csv
    originalWagesData = files[1];
    // parse string to number
    originalHoursData.forEach(function(d){ d['Amount'] = +d['Amount']; });
    originalWagesData.forEach(function(d){ d['Amount'] = +d['Amount']; });

    // console.log(originalHoursData);
    // console.log(originalWagesData);

    // initialize views
    lineChart = new PieChart({
        parentElement: '#LineChart',
    }, originalHoursData);
}).catch(function(err) {
    console.error(err, err.stack);
})

// listen to radio button changes
d3.selectAll("input.pieInput").on("change", function(){
    console.log(this.value)
    // filter data

    // update pie chart view

});

// listen to date range changes
d3.selectAll("input#range").on("change", function(){
    let selectedDate = dateRangeTransfer(this.value)
    console.log(selectedDate)

    // filter data

    // update pie chart view

});

// date range transfer helper method
const dateRangeTransfer = function(value) {
    let months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    let year = 19;
    if (value > 12) {
        value = value - 12
        year = 20
    }
    return months[value-1] + "-"+ year
}

