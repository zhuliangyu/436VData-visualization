/**
 * Load data from CSV file asynchronously and render charts
 */

let pieChart,lineChart,geoChart;
let originalHoursData;
let originalWagesData;
// default selection
let dateSelected = "Jan-19";
let sectorSelected = "Goods-producing sector";
let doublePieDateAfterProcessing;
let pieChartYearSelected = 2019;
let selectedProvinceGlobal = "all";
let selectedYearGlobal;
// date range selector init
const
    range = document.getElementById('range'),
    rangeV = document.getElementById('rangeV'),
    setValue = ()=>{
        const
            newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) ),
            newPosition = 10 - (newValue * 0.2);
        rangeV.innerHTML = `<span class="pie">${dateRangeTransfer(range.value)}</span>`;
        rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
    };
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);

// loading data from CSV
Promise.all([
    d3.csv("data/HoursCSV.csv"),
    d3.csv("data/WagesCSV.csv"),
    d3.csv("data/data.csv"),
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
    doublePieDateAfterProcessing = generateDoublePieData(sectorSelected, dateSelected);

    pieChart = new PieChart({
        parentElement: '#PieChart',
    }, doublePieDateAfterProcessing, pieChartYearSelected);

    lineChart = new LineChart({
        parentElement: '#LineChart',
    }, files[2]);

    geoChart = new GeoChart(
        {
            parentElement: "#GeoChart",
        },
        files[2]
    );

}).catch(function(err) {
    console.error(err, err.stack);
})

// listen to sector radio button changes
d3.selectAll("input.pieInput").on("change", function(){
    sectorSelected = this.value;
    // console.log(sectorSelected);

    // filter and generate pie data
    doublePieDateAfterProcessing = generateDoublePieData(sectorSelected, dateSelected);

    // update pie chart view
    pieChart.updateVis(doublePieDateAfterProcessing);

});

// listen to date range changes
d3.selectAll("input#range").on("change", function(){
    dateSelected = dateRangeTransfer(this.value)
    // console.log(dateSelected)

    // filter and generate pie data
    doublePieDateAfterProcessing = generateDoublePieData(sectorSelected, dateSelected);

    // update pie chart view
    pieChart.updateVis(doublePieDateAfterProcessing, pieChartYearSelected);
});

// date range transfer helper method
// eg. 13 => Jan-20; 7 => Jul-19
const dateRangeTransfer = function(value) {
    let months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    let year = 19;
    pieChartYearSelected = 2019
    if (value > 12) {
        value = value - 12
        year = 20
        pieChartYearSelected = 2020
    }
    return months[value-1] + "-"+ year
}

// filter is an attribute name
// selected is the value should be filter
const dataFilter = function (data, filter, selected) {
    return data.filter(function(data){
        return data[filter] === selected;
    })

}

// flat array into one obj
// eg. generate {Agriculture: 1022923, Mining oil and gas: 2495575,...}
const generatePieData = function (arr) {
    let obj = {};
    arr.forEach(function(entry) {
        obj[entry.Key] = entry.Amount;
    });
    // console.log(obj);
    return obj;

}

const generateDoublePieData = function (sectorSelected, dateSelected) {
    // wage
    // filter
    let wagesDataAfterFilter = dataFilter(originalWagesData, "Sector", sectorSelected);
    wagesDataAfterFilter = dataFilter(wagesDataAfterFilter, "Date", dateSelected);
    // flat
    wagesDataAfterFilter = generatePieData(wagesDataAfterFilter);

    // hour
    // filter
    let hoursDataAfterFilter = dataFilter(originalHoursData, "Sector", sectorSelected);
    hoursDataAfterFilter = dataFilter(hoursDataAfterFilter, "Date", dateSelected);
    // flat
    hoursDataAfterFilter = generatePieData(hoursDataAfterFilter);

    // combine double
    // console.log([wagesDataAfterFilter, hoursDataAfterFilter])
    return [wagesDataAfterFilter, hoursDataAfterFilter]
}

const updateLineChartbyProvince = (selectedProvince = "all") => {
    selectedProvinceGlobal = selectedProvince;
    lineChart.updateVis(selectedProvince, selectedYearGlobal);
}

const updateLineChartbyWageTime = (selectedYear) => {
    selectedYearGlobal = selectedYear;
    lineChart.updateVis(selectedProvinceGlobal, selectedYear);
}

// smooth scrolling to target point
// Select all links with hashes
$('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
            &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function() {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });


// stick to header
// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("myHeader");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}
