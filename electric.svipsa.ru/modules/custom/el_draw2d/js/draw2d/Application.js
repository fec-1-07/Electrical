// declare the namespace for this example
const electric = {};


electric.Application = Class.extend(
  {
    NAME: "electric.Application",

    /**
     * @constructor
     *
     * @param {String} canvasId the id of the DOM element to use as paint container
     */
    init: function (w, h) {
      this.view = new electric.View("canvas", w, h);
      this.toolbar = new electric.Toolbar("el_draw2d_designer_block_toolbar", this, this.view);
    },

  });
