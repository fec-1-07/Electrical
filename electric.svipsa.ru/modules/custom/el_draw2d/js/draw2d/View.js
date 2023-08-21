(function ($) {
  electric.View = draw2d.Canvas.extend({

    init: function (id, w, h) {
      this._super(id, w, h);

      this.setScrollArea("#" + id);

      //this.initTop = document.body.getBoundingClientRect().top;
      this.initTopBody = document.body.getBoundingClientRect().top;
      this.initTopCanvas = document.getElementById('canvas').getBoundingClientRect().top;
      // this.initLeft = document.getElementById('canvas').getBoundingClientRect().left;
    },

    getScrollTop() {
      return document.body.getBoundingClientRect().top;
    },

    getScrollLeft() {
      return document.body.getBoundingClientRect().left;
    },


    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onDrop: function (droppedDomNode, x, y, shiftKey, ctrlKey) {

      const type = $(droppedDomNode).data("shape");
      const attr = $(droppedDomNode).data("attr");
      let figure = null;
      if (attr) {
        figure = eval("new " + type + "(attr);");
      } else {
        figure = eval("new " + type + "();");
      }

      //y = y - 50;
      // create a command for the undo/redo support
      const command = new draw2d.command.CommandAdd(this, figure, x, y);
      this.getCommandStack().execute(command);
    },


    /**
     * @method
     * Transforms a document coordinate to canvas coordinate.
     *
     * @param {Number} x the x coordinate relative to the window
     * @param {Number} y the y coordinate relative to the window
     *
     * @returns {draw2d.geo.Point} The coordinate in relation to the canvas [0,0] position
     */
    fromDocumentToCanvasCoordinate: function (x, y) {
      return new draw2d.geo.Point(
        (x - this.getAbsoluteX() - this.getScrollLeft()) * this.zoomFactor,
        (y - this.getAbsoluteY() - this.getScrollTop()) * this.zoomFactor)
    },

    /**
     * @method
     * Transforms a canvas coordinate to document coordinate.
     *
     * @param {Number} x the x coordinate in the canvas
     * @param {Number} y the y coordinate in the canvas
     *
     * @returns {draw2d.geo.Point} the coordinate in relation to the document [0,0] position
     */
    fromCanvasToDocumentCoordinate: function (x, y) {
      return new draw2d.geo.Point(
        ((x * (1 / this.zoomFactor)) + this.getAbsoluteX()),
        ((y * (1 / this.zoomFactor)) + this.getAbsoluteY()))
    }
  });

}(jQuery));
