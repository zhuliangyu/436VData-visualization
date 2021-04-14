class GeoChart {
  constructor(_config, data) {
    this.parentElement = _config.parentElement;
    this.width = 1200;
    this.height = 750;
    this.initSvg();
  }

  // initialize the SVG
  async initSvg() {
    this.svg = d3
      .select(this.parentElement)
      .attr("width", this.width)
      .attr("height", this.height);
    this.totalCanadaG = this.svg
      .append("g")
      .attr("transform", "translate(50,100)");
    this.totalCanadaG
      .append("text")
      .text("Canada")
      .attr("font-size", 20)
      .attr("class", "Canada");
    this.totalCanadaG
      .append("circle")
      .attr("class", "total")
      .attr("r", 25)
      .attr("cx", 120)
      .attr("cy", -10);

    //create and append the legend
    this.legendG = this.svg.append("g");
    this.legendG.attr("transform", `translate(${this.width - 400},100)`);
    this.svg
      .append("g")
      .attr("transform", `translate(${this.width - 400},90)`)
      .append("text")
      .text("Count of todal cases of Covid-19");

    //append the text
    this.totalCanadaG
      .append("text")
      .attr("class", "totalText")
      .attr("x", 120)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", 12);

    //add the slider bar(month)
    d3.select("#slider")
      .append("input")
      .attr("class", "monthSlider")
      .attr("type", "range")
      .attr("min", 1)
      .attr("max", 12)
      .attr("step", 1)
      .attr("value", 2);

    d3.select("#slider").append("span").attr("class", "monthText");
    d3.select(".monthText").html(`2020-${2}`);

    await this.initData();
    this.silderEvent();
    this.initMap();
  }

  //change with the selected month
  silderEvent() {
    d3.select(".monthSlider").on("change", (e) => {
      let month = e.target.value;
      this.currentDate = new Date(`2020-${month}-1`);
      this.updateCurrentData();
      this.initMap();
      d3.select(".monthText").html(`2020-${month}`);
    });
  }
  async initData() {
      //load data
    this.covid = await d3.csv("./data/covid19-download.csv");
    this.map = await d3.json("./data/canada.geojson");
    //init date
    this.currentDate = new Date("2020-02-20");
    this.updateCurrentData();
    console.log(this.currentData, this.map);
  }
  //update data with date
  updateCurrentData() {
    this.currentData = this.covid.filter(
      (d) => d3.timeMonth.count(new Date(d.date), this.currentDate) === 0
    );
    //data processing, aggregate the daily cases into monthly cases
    this.covidCountByState = d3.rollups(
      this.currentData,
      (d) => d3.sum(d, (v) => +v.numactive),
      (d) => d.prname
    );

    //province
    this.map.features.forEach((d) => {
      let value = this.covidCountByState.find(
        (v) => v[0] === d.properties.name
      );
      d.count = value ? value[1] : 0;
      d.name = d.properties.name;
    });
  }

  //init map
  initMap() {
    this.color = d3
      .scaleSqrt()
      .domain([0, d3.max(this.covidCountByState, (d) => +d[1])])
      .range(["#eaecf8", "#053361"]);

    const projection = d3
      .geoMercator()
      .fitSize([this.width, this.height], this.map)
      .scale(500);
    this.geopath = d3.geoPath().projection(projection);
    let path = this.svg.selectAll("path").data(this.map.features).join("path");
    path
      .attr("stroke", "gray")
      .attr("fill", (d) => this.color(d.count))
      .attr("d", this.geopath);

    this.addCircles();
    this.addLegend();
  }

  //append circle and info on each province
  addCircles() {
    d3.select(".totalText").text(d3.sum(this.covidCountByState, (d) => d[1]));
    let circle = this.svg
      .selectAll(".numbercircle")
      .data(this.map.features)
      .join("circle");
    circle
      .attr("class", "numbercircle")
      .attr("cx", (d) => this.geopath.centroid(d)[0])
      .attr("cy", (d) => this.geopath.centroid(d)[1])
      .attr("r", 25)
      .attr("fill", "#363636");
    let text = this.svg
      .selectAll(".numbertext")
      .data(this.map.features)
      .join("text");
    text
      .attr("class", "numbertext")
      .attr("x", (d) => this.geopath.centroid(d)[0])
      .attr("y", (d) => this.geopath.centroid(d)[1])
      .attr("fill", "white")
      .text((d) => d.count)
      .attr("font-size", 9)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle");
  }

  //legend
  addLegend() {
    this.legendG
      .selectAll("rect")
      .data(d3.range(6))
      .join("rect")
      .attr("x", 50)
      .attr("y", (d) => (6 - d) * 20)
      .attr("width", (d) => d * 20)
      .attr("height", 16)
      .attr("fill", (d) => this.color((this.color.domain()[1] / 6) * d));

    this.legendG
      .selectAll("text")
      .data(d3.range(6))
      .join("text")
      .attr("x", 0)
      .attr("y", (d) => (6 - d) * 20)
      .text((d) => d3.format(".1r")((this.color.domain()[1] / 6) * d))
      .attr("font-size", 10)
      .attr("dominant-baseline", "hanging")
      .attr("text-anchor", "start");
  }
}