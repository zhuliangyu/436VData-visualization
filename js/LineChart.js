class LineChart {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      disasterCategories: _config.disasterCategories,
      containerWidth: 200,
      containerHeight: 400,
      tooltipPadding: 15,
      margin: {top: 40, right: 20, bottom: 20, left: 45},
      legendWidth: 170,
      legendHeight: 8,
      legendRadius: 5
    }
    this.data = _data;
    this.selectedCategories = new Set();
    this.initVis();

  }
  
  initVis() {
  
    // Create SVG area, initialize scales and axes
    let vis = this;
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom - 20;
  
    // Initialize scales
    vis.colorScale = d3.scaleOrdinal()
    .range(['#d3eecd', '#7bc77e']) // light green to dark green
    .domain(['Male','Female']);

    vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.2);

    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(['Male', 'Female'])
        .tickSizeOuter(0);

    vis.yScale = d3.scaleLinear()
    .range([vis.height, 0]) 

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSizeOuter(0)

    vis.svg = d3.select(vis.config.parentElement)
    .attr('width', vis.config.containerWidth)
    .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group 
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');
    
    vis.svg.append('text')
    .attr('class', 'axis-title')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', '.71em')
    .text('Trails');

    
   
  }

  updateVis() {
    // Prepare data and scales
    let vis = this;

    let updatedData = this.data.filter(d => {
      return d.pcgdp !== null && d[this.country] == 1;
      
    });
    const aggregatedDataMap = d3.rollups(updatedData, v => v.length, d => d.gender);
    vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));

    const orderedKeys = ['Male', 'Female'];
    vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
      return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
    });

    // Specificy accessor functions
    vis.colorValue = d => d.key;
    vis.xValue = d => d.key;
    vis.yValue = d => d.count;


    vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
    vis.yScale.domain([0, 200]);
    // Set the scale input domains
   

    vis.renderVis();
  }

  renderVis() {
    // Bind data to visual elements, update axes
    let vis = this;
    console.log(vis.aggregatedData)
    // Add rectangles
    const bars = vis.chart.selectAll('.bar')
        .data(vis.aggregatedData, d => d.id)
      .join('rect')
        .attr('class', 'bar')
        .attr('x', d => vis.xScale(vis.xValue(d)))
        .attr('width', vis.xScale.bandwidth())
        .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
        .attr('y', d => vis.yScale(vis.yValue(d)))
        .attr('fill', d => vis.colorScale(vis.colorValue(d)));

    bars.on('click', (event, d) => {
      const selectedGender = d.key;
      scatterplot.selectedGender = !scatterplot.selectedGender?  d.key : (scatterplot.selectedGender == d.key ? null : d.key);
      lexischart.selectedGender = !lexischart.selectedGender?  d.key : (lexischart.selectedGender == d.key ? null : d.key);
      console.log(scatterplot.selectedGender);

      scatterplot.updateVis();
      lexischart.updateVis();

    })

    // Update axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}