class PieChart {

  /**
   * Class constructor with initial configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config,_data, _year) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 500,
      containerHeight: 500,
      margin: {top: 15, right: 15, bottom: 20, left: 25},
      tooltipPadding: _config.tooltipPadding || 15
    }
    this.data = _data;
    this.year = _year;
    this.initVis();
  }

  /**
   * Create scales, axes, and append static elements
   */
  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.radius_0 = Math.min(vis.width, vis.height) / 2 - vis.config.margin.left;
    vis.radius_1 = vis.radius_0 * 0.65;

    vis.svg = d3.select("#pieChartNoLabel")
        .append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .append("g")
        .attr("transform", "translate("
            + vis.width / 2
            + ","
            + vis.height / 2
            + ")");

    // background image for debugging only
    // d3.select("#pieChartNoLabel svg").select("g")
    //     .append("rect")
    //     .attr("width", vis.width)
    //     .attr("height", vis.height)
    //     .attr("fill", "pink")
    //     // .attr("transform", "translate(-250, -200)")
    //     .attr("transform", "translate("
    //         + ( - vis.width / 2)
    //         + ","
    //         + ( - vis.height / 2)
    //         + ")");

    vis.color = d3.scaleOrdinal()
        // .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
        // .domain(dataKeys)
        .range(d3.schemeDark2);

    vis.pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function (d) {
          return d.value;
        });

    vis.updateVis()

  }


  updateVis(updatedData, updatePieChartYearSelected) {
    let vis = this;
    if (updatedData !== null && updatedData !== undefined) {
      vis.data = updatedData;
    }

    if (updatePieChartYearSelected !== null && updatePieChartYearSelected !== undefined) {
        vis.year = updatePieChartYearSelected;
    }

    d3.selectAll(".pieOut").remove()
    d3.selectAll(".pieIn").remove()

    vis.renderVis();
  }


  renderVis() {
    let vis = this;

    const after_0 = Object.entries(vis.data[0]).map(([a, b]) => (
            {
              key: a,
              value: b
            })
        // { key:   a
        //   value: 9
        // }
    )
    var data_ready_0 = vis.pie(after_0)

    const after_1 = Object.entries(vis.data[1]).map(([a, b]) => (
            {
              key: a,
              value: b
            })
        // { key:   a
        //   value: 9
        // }
    )
    var data_ready_1 = vis.pie(after_1)
    // [{"key":"GeeksforGeeks","value":0},
    //  {"key":"Geeks","value":2},
    //  {"key":"Geek","value":3},
    //  {"key":"gfg","value":4}]

    var arc_0 = d3.arc()
        .innerRadius(vis.radius_0 * 0.7) // This is the size of the donut hole
        .outerRadius(vis.radius_0 * 1)

    var arc_1 = d3.arc()
        .innerRadius(vis.radius_1 * 0.6) // This is the size of the donut hole
        .outerRadius(vis.radius_1 * 1)

    // outside circle
    vis.svg
        .selectAll('allSlices.pieOut')
        .data(data_ready_0)
        // .enter()
        // .append('path')
        .join('path')
        .attr('class', 'pieOut')
        .attr('d', arc_0)
        .attr('fill', function (d) {
          return (vis.color(d.data.key))
        })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", function(e, d) {
          // console.log("inside circle " + d.data.key + d.data.value);
          generateLabel("Wages", -40);
          generateLabel(d.data.key, 0);
          generateLabel(d.data.value, 40)
          // d3.event.stopPropagation();
            updateLineChartbyWageTime(vis.year);

        })
        .on("mouseleave", function (event, d) {
          deleteLabel()
        })

    // inside circle
    vis.svg
        .selectAll('allSlices.pieIn')
        .data(data_ready_1)
        // .enter()
        // .append('path')
        .join('path')
        .attr('class', 'pieIn')
        .attr('d', arc_1)
        .attr('fill', function (d) {
          // console.log(d)
          return (vis.color(d.data.key))
        })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", function(e, d) {
          // console.log("inside circle " + d.data.key + d.data.value);
          generateLabel("Hours", -40);
          generateLabel(d.data.key, 0)
          generateLabel(d.data.value, 40)
          // d3.event.stopPropagation();
            updateLineChartbyWageTime(vis.year);

        })
        .on("mouseleave", function (event, d) {
          deleteLabel()
        })

    // inside text label
    let generateLabel = function (inputText, yOffset){
      vis.svg.append("text")
          .attr("class", "piechartLabel")
          .attr("text-anchor", "middle")
          .attr('font-size', '1.5em')
          .attr("x", 0)
          .attr("y", yOffset)
          // .attr("dy", ".35em")
          // .text(function(d) { return d; });
          .text(inputText);
    }

    let deleteLabel = function (){
      d3.selectAll(".piechartLabel").remove()
    }





  }


}
