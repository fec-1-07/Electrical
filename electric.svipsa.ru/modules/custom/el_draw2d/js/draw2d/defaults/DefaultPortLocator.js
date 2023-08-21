let defaultPortLocator = draw2d.layout.locator.XYAbsPortLocator.extend({

  NAME: "defaultPortLocator",

  /**
   * Constructs a ManhattanMidpointLocator with associated Connection c.
   *
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter);
  },

  relocate: function (index, figure) {
    let x = figure.locator.x;
    let y = figure.locator.y;
    const p = figure.getParent();
    const parentWidth = p.getWidth();
    const parentHeight = p.getHeight();

    const coefY = parentHeight / y;
    y = parentWidth - (parentWidth / coefY);

    const coefX = parentWidth / x;
    x = parentHeight / coefX;

    this.applyConsiderRotation(figure, y, x);

  }
});
