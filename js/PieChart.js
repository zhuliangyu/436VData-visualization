class PieChart {

  /**
   * Class constructor with initial configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config,_data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 1000,
      containerHeight: 380,
      margin: {top: 15, right: 15, bottom: 20, left: 25},
      tooltipPadding: _config.tooltipPadding || 15
    }
    this.initVis();
  }
  
  /**
   * Create scales, axes, and append static elements
   */
  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  }


  updateVis() {
    let vis = this;
  
    vis.renderVis();
  }


  renderVis() {
    let vis = this;
 
    
  }

 
}