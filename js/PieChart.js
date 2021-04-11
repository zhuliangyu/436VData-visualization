class PieChart {

  /**
   * Class constructor with initial configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config,_data, _year) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 900,
      containerHeight: 500,
      margin: {top: 15, right: 15, bottom: 20, left: 25},
      tooltipPadding: _config.tooltipPadding || 15
    }
    this.data = _data;
    this.year = _year;
    this.initVis();
    this.toggle = true;
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
    var arc_0_outerArc = d3.arc()
          .innerRadius(vis.radius_0 * 0.9)
          .outerRadius(vis.radius_0 * 0.9)

    var arc_1 = d3.arc()
        .innerRadius(vis.radius_1 * 0.6) // This is the size of the donut hole
        .outerRadius(vis.radius_1 * 1)
    var arc_1_outerArc = d3.arc()
          .innerRadius(vis.radius_1 * 0.9)
          .outerRadius(vis.radius_1 * 0.9)

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

        // .attr("stroke", "grey")
        // .style("stroke-width", "3px")
        // .style("box-shadow", "10px 5px 5px red")

        .style("cursor", "pointer")


          .style("opacity", 0.7)
        .on("mouseover", function(e, d) {
          // console.log("inside circle " + d.data.key + d.data.value);
          generateLabel("Wages", -40);
          generateLabel(d.data.key, 0);
          generateLabel(d.data.value, 40)
          // d3.event.stopPropagation();

        })
        .on("mouseleave", function (event, d) {
          deleteLabel()
        })
        .on("click", function (event, d) {
            updateLineChartbyWageTime(vis.year);
            changeSelected();
            // d3.select(this)
            //     .attr("stroke", "black")
            //     .style("stroke-width", "2px")

        })

      const changeSelected = function (){
        if (vis.toggle) {
            d3.selectAll('path.pieOut')
                .attr("stroke", "black")
                .style("stroke-width", "2px")
            vis.toggle = false;

        } else {
            d3.selectAll('path.pieOut')
                .attr("stroke", "white")
                .style("stroke-width", "2px")
            vis.toggle = true;
        }

      }


        // outside label
      vis.svg
          .selectAll('allPolylines.pieOut')
          .data(data_ready_0)
          .enter()
          .append('polyline')
          .attr("stroke", "black")
          .attr('class', 'pieOut')
          .style("fill", "none")
          .attr("stroke-width", 1)
          .attr('points', function (d) {
              if (d.index === 0){
              // if (d.index === data_ready.length - 1){
              //     console.log(d)
                  var posA = arc_0.centroid(d) // line insertion in the slice
                  var posB = arc_0_outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                  var posC = arc_0_outerArc.centroid(d); // Label position = almost the same as posB
                  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                  posC[0] = vis.radius_0 * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                  return [posA, posB, posC]
              }

          })
      vis.svg
          .selectAll('allLabels.pieOut')
          .data(data_ready_0)
          .enter()
          .append('text')
          .attr('class', 'pieOut')
          .text(function (d) {
              if (d.index === 0) {
              // if (d.index === data_ready.length - 1){
                  // return d.data.key
                  return "Wages in different industries"
              }
          })
          .attr('transform', function (d) {
              if (d.index === 0) {
              // if (d.index === data_ready.length - 1){
                  var pos = arc_0_outerArc.centroid(d);

                  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2

                  pos[0] = vis.radius_0 * 0.99 * (midangle < Math.PI ? 1 : -1);

                  return 'translate(' + pos + ')';
              }

          })
          .style('text-anchor', function (d) {
              // if (d.index === 0) {
              if (d.index === data_ready_0.length - 1){
                  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                  return (midangle < Math.PI ? 'start' : 'end')
              }
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
          //   updateLineChartbyWageTime(vis.year);

        })
        .on("mouseleave", function (event, d) {
          deleteLabel()
        })

      // inside label
      vis.svg
          .selectAll('allPolylines.pieIn')
          .data(data_ready_1)
          .enter()
          .append('polyline')
          .attr("stroke", "black")
          .attr('class', 'pieIn')
          .style("fill", "none")
          .attr("stroke-width", 1)
          .attr('points', function (d) {
              // if (d.index === 0){
                  if (d.index === data_ready_1.length - 1){
                  //     console.log(d)
                  var posA = arc_1.centroid(d) // line insertion in the slice
                  var posB = arc_1_outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                  var posC = arc_1_outerArc.centroid(d); // Label position = almost the same as posB
                  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                  posC[0] = vis.radius_0 * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                  return [posA, posB, posC]
              }

          })
      vis.svg
          .selectAll('allLabels.pieIn')
          .data(data_ready_1)
          .enter()
          .append('text')
          .attr('class', 'pieIn')
          .text(function (d) {
              // if (d.index === 0) {
                  if (d.index === data_ready_1.length - 1){
                  // return d.data.key
                  return "Working Hours in different industries"
              }
          })
          .attr('transform', function (d) {
              // if (d.index === 0) {
                  if (d.index === data_ready_1.length - 1){
                  var pos = arc_1_outerArc.centroid(d);

                  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2

                  pos[0] = vis.radius_1 * 0.99 * (midangle < Math.PI ? 1 : -1) - 70;

                  return 'translate(' + pos + ')';
              }

          })
          .style('text-anchor', function (d) {
              // if (d.index === 0) {
              if (d.index === data_ready_1.length - 1){
                  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                  return (midangle < Math.PI ? 'start' : 'end')
              }
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
