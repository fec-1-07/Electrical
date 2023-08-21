let defaultLabelLocator = draw2d.layout.locator.Locator.extend({

  NAME: "defaultLabelLocator",

  /**
   * Constructs a ManhattanMidpointLocator with associated Connection c.
   *
   */
  init: function init(attr, setter, getter) {
    this._super(attr, setter, getter);
    this.params = $.extend({
      x: 0,
      y: 0,
    }, attr);
  },

  /**
   *
   * Relocates the given Figure.
   *
   * @param {Number} index child index of the target
   * @param {draw2d.Figure} target The figure to relocate
   **/
  relocate: function relocate(index, target) {
    const parent = target.getParent();
    const boundingBox = parent.getBoundingBox();

    // I made a wrong decision in the port handling: anchor point
    // is in the center and not topLeft. Now I must correct this flaw here, and there, and...
    // shit happens.
    const offset = parent instanceof draw2d.Port ? boundingBox.w / 2 : 0;

    const targetBoundingBox = target.getBoundingBox();
    if (target instanceof draw2d.Port) {
      target.setPosition(boundingBox.w / 2 - offset, 0);
    } else {
      target.setPosition((boundingBox.w / 2 - targetBoundingBox.w / 2 - offset) + this.params.x, -(targetBoundingBox.h + 2) + this.params.y);
    }
  },
});
