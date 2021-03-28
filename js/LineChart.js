class LineChart {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      disasterCategories: _config.disasterCategories,
      containerWidth: 700,
      containerHeight: 800,
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
   

    vis.svg = d3.select(vis.config.parentElement)
    .attr('width', vis.config.containerWidth)
    .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);


  
    vis.svg.append('text')
    .attr('class', 'axis-title')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', '.71em')
    .text('Trails');

    const dataSet = this.data;
    const timeConv = d3.timeParse("%d-%b-%Y");
    var slices = dataSet.columns.slice(1).map(function(id) {
      return {
          id: id,
          values: dataSet.map(function(d){
              return {
                  date: timeConv(d.date),
                  measurement: +d[id]
              };
          })
      };
    });

    
    //----------------------------SCALES----------------------------//
    const xScale = d3.scaleTime().range([0,vis.width]);
    const yScale = d3.scaleLinear().rangeRound([vis.height/2, 0]);
    xScale.domain(d3.extent(dataSet, function(d){
        return timeConv(d.date)}));
    yScale.domain([(0), d3.max(slices, function(c) {
        return d3.max(c.values, function(d) {
            return d.measurement + 4; });
            })
        ]);

    //-----------------------------AXES-----------------------------//
    const yaxis = d3.axisLeft()
        .ticks((slices[0].values).length)
        .scale(yScale);

    const xaxis = d3.axisBottom()
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat('%b %d'))
        .scale(xScale);


    //----------------------------LINES-----------------------------//
    const line = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.measurement); }); 

    const line2 = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.measurement)+ vis.height/2; }); 

    let id = 0;
    const ids = function () {
    return "line line-"+id++;
    }  

    //-------------------------2. DRAWING---------------------------//
    //-----------------------------AXES-----------------------------//
    vis.chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + vis.height/2 + ")")
    .call(xaxis);

    vis.chart.append("g")
    .attr("class", "axis")
    .call(yaxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", 6)
    .style("text-anchor", "end")
    .text("Frequency");

    vis.chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + vis.height/2 + ")")
    .call(yaxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", 6)
    .style("text-anchor", "end")
    .text("Frequency");

    //----------------------------LINES-----------------------------//
    const lines =  vis.chart.selectAll("lines")
        .data(slices)
        .enter()
        .append("g");

        lines.append("path")
        .attr("class", ids)
        .attr("d", function(d) { return line(d.values); });

    const linest =  vis.chart.selectAll("lines")
    .data(slices)
    .enter()
    .append("g");

    linest.append("path")
    .attr("class", ids)
    .attr("d", function(d) { return line2(d.values); });

        // lines.append("text")
        // .attr("class","serie_label")
        // .datum(function(d) {
        //     return {
        //         id: d.id,
        //         value: d.values[d.values.length - 1]}; })
        // .attr("transform", function(d) {
        //         return "translate(" + (xScale(d.value.date)-40)  
        //         + "," + (yScale(d.value.measurement) + 5 ) + ")"; })
        // .attr("x", 5)
        // .text(function(d) { return ("Serie ") + d.id; });
















  //....
  var mouseG = vis.chart.append("g")
  .attr("class", "mouse-over-effects");

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");
    
  var lineS = document.getElementsByClassName('line');

  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(slices)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line")


  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
      return "red"
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', vis.width) // can't catch mouse events on a g element
    .attr('height', vis.height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
  .on('mouseover', function() { // on mouse in show line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function(event) { // mouse moving over canvas
    
    var mouse = [];
    mouse[0]= event.pageX - 415;
    mouse[1]=event.pageY;
    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + vis.height;
        d += " " + mouse[0] + "," + 0;
      
        return d;
      });
    
    d3.selectAll(".mouse-per-line")
      .attr("transform", function(d, i) {
      
        
        
        var beginning = 0,
            end = lineS[i].getTotalLength(),
            target = null;

        while (true){
          target = Math.floor((beginning + end) / 2);
          var pos = lineS[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
          }
          if (pos.x > mouse[0])      end = target;
          else if (pos.x < mouse[0]) beginning = target;
          else break; //position found
        }
        
        d3.select(this).select('text')
          .text(yScale.invert(pos.y).toFixed(2));
        
        return "translate(" + mouse[0]+ "," + (pos.y)+")";
      });


      //dddd


      


  })




  

}

  

  updateVis() {
    // Prepare data and scales
    let vis = this;

    

    vis.renderVis();
  }

  renderVis() {
    // Bind data to visual elements, update axes
    let vis = this;
    
  }
}