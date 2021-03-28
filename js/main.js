/**
 * Load data from CSV file asynchronously and render charts
 */
 let pieChart,lineChart,geoChart;

 d3.csv('data/data.csv').then(data => {
  
  // Convert columns to numerical values
  data.forEach(d => {
    Object.keys(d).forEach(attr => {
    
    });
  });

  // pieChart = new PieChart({ 
  //   parentElement: '#PieChart',
  // }, data);


  lineChart = new LineChart({
    parentElement: '#LineChart',
  }, data);

  // geoChart = new GeoChart({
  //   parentElement: '#GeoChart',
  // }, data);



}).catch(error => console.error(error));

/*
 * Todo:
 * - initialize views
 * - filter data
 * - listen to events and update views
 */
