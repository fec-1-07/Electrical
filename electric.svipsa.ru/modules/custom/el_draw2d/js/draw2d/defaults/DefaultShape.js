let defaultShape = draw2d.shape.basic.Image.extend({

  NAME: "defaultShape",

  init: function (attr, setter, getter) {
    if (attr && attr.hasOwnProperty('realWidth')) {
      attr.width = attr.realWidth * Utils.sizeCoef;
    }
    if (attr && attr.hasOwnProperty('realHeight')) {
      attr.height = attr.realHeight * Utils.sizeCoef;
    }

    this._super($.extend({
      path: "icon.png",
      width: 33,
      height: 146,
      angle: 0,
      selectable: true,
      resizeable: false,
    }, attr), setter, getter);


    if (attr.hasOwnProperty('resizeable') && attr.resizeable == true) {

    } else {
      this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
    }

    // if (attr.hasOwnProperty('noSnap') && attr.noSnap == true) {
    //   // this.uninstallEditPolicy(draw2d.policy.canvas.ShowGridEditPolicy);
    //   // this.uninstallEditPolicy(draw2d.policy.canvas.SnapToGeometryEditPolicy);
    //   // this.uninstallEditPolicy(draw2d.policy.canvas.SnapToInBetweenEditPolicy);
    //   // this.uninstallEditPolicy(draw2d.policy.canvas.SnapToCenterEditPolicy);
    // }

  },

  recalculateBox: function () {
    try {
      const calculatedWidth = this.svgNodes.getBBox(true).width + this.padding.left + this.padding.right + 2 * this.getStroke();
      const diff = this.width - calculatedWidth;
      this.cachedWidth = calculatedWidth;
      this.width = calculatedWidth;
      if (this.getRotationAngle() === 90 || this.getRotationAngle() === 270) {
        this.setX(this.getX() + diff / 2);
      }
      this.repaint({});

      this.uninstallEditPolicy(draw2d.policy.figure.AntSelectionFeedbackPolicy)
      this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
    } catch (e) {
      console.error('recalculateBox', e);
    }
  },


  applyAlpha: function () {
  },

  layerGet: function (name, attributes) {
    if (this.svgNodes === null) return null;

    let result = null;
    this.svgNodes.some(function (shape) {
      if (shape.data("name") === name) {
        result = shape;
      }
      return result !== null;
    });

    return result;
  },

  layerAttr: function (name, attributes) {
    if (this.svgNodes === null) return;

    this.svgNodes.forEach(function (shape) {
      if (shape.data("name") === name) {
        shape.attr(attributes);
      }
    });
  },

  layerShow: function (name, flag, duration) {
    if (this.svgNodes === null) return;

    if (duration) {
      this.svgNodes.forEach(function (node) {
        if (node.data("name") === name) {
          if (flag) {
            node.attr({ opacity: 0 }).show().animate({ opacity: 1 }, duration);
          } else {
            node.animate({ opacity: 0 }, duration, function () {
              this.hide()
            });
          }
        }
      });
    } else {
      this.svgNodes.forEach(function (node) {
        if (node.data("name") === name) {
          if (flag) {
            node.show();
          } else {
            node.hide();
          }
        }
      });
    }
  },

  calculate: function () {
  },

  onStart: function () {

  },

  onStop: function () {

  },

  getParameterSettings: function () {
    return [];
  },

  /**
   * @method
   * Return an objects with all important attributes for XML or JSON serialization
   *
   * @returns {Object}
   */
  getPersistentAttributes: function () {
    let memento = this._super();

    // add all decorations to the memento
    memento.labels = [];
    this.children.each(function (i, e) {
      let labelJSON = e.figure.getPersistentAttributes();
      labelJSON.locatorData = {
        NAME: e.locator.NAME,
        params: e.locator.params
      };
      memento.labels.push(labelJSON);
    });

    return memento;
  },

  /**
   * @method
   * Read all attributes from the serialized properties and transfer them into the shape.
   *
   * @param {Object} memento
   * @returns
   */
  setPersistentAttributes: function (memento) {
    this._super(memento);
    // remove all decorations created in the constructor of this element
    //
    this.resetChildren();
    // and add all children of the JSON document.
    //
    $.each(memento.labels, $.proxy(function (i, json) {
      // create the figure stored in the JSON
      let figure = eval("new " + json.type + "()");

      // apply all attributes
      figure.attr(json);

      // instantiate the locator
      let locator = eval("new " + json.locatorData.NAME + "(" + JSON.stringify(json.locatorData.params) + ")");

      // add the new figure as child to this figure
      this.add(figure, locator);
    }, this));
  },

  onContextMenu: function (x, y) {
    const view = this.getCanvas();
    let items = {};

    items.toFront = { name: "Переместить вперед" };
    items.toBack = { name: "Переместить назад" };
    items.sep2 = "---------";
    // items.rotateRight = {name: "Повернуть на 90° вправо"};
    // items.rotateLeft = {name: "Повернуть на 90° влево"};
    // items.sep3 = "---------";
    items.clone = { name: "Клонировать" };
    items.sep4 = "---------";
    items.delete = { name: "Удалить" };

    if (this.hasOwnProperty('composite') && this.composite instanceof draw2d.shape.composite.Group) {
      items.sep5 = "---------";
      items.ungroup = { name: "Разгруппировать" };
    }

    if (view.getSelection().getAll().data.length > 1) {
      items.sep5 = "---------";
      items.group = { name: "Группировать" };
    }


    $.contextMenu({
      selector: 'body',
      position: function (opt, x, y) {
        opt.$menu.css({ top: y, left: x + 10 });
      },
      events:
        {
          hide: function () {
            $.contextMenu('destroy')
          }
        },
      callback: (key, options) => {
        let cmd;
        const view = this.getCanvas();
        let command;
        switch (key) {
          case "clone":
            if (this.hasOwnProperty('composite') && this.composite instanceof draw2d.shape.composite.Group) {
              // Copy group.
              this.unselect();
              this.composite.select();
              const elements = Utils.getSelectedElements(view);
              Utils.pastSelectedElements(view, elements);
            } else if (view.getSelection().getAll().data.length > 1) {
              const elements = Utils.getSelectedElements(view);
              Utils.pastSelectedElements(view, elements);
            } else {
              const clone = eval("new " + this.NAME + "();");
              const attrs = this.getPersistentAttributes();
              attrs.id = draw2d.util.UUID.create()
              clone.setPersistentAttributes(attrs);
              clone.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
              const cloneWidth = (this.hasOwnProperty('cloneWidth')) ? this.cloneWidth * Utils.sizeCoef : this.width;
              command = new draw2d.command.CommandAdd(view, clone, this.getPosition().x + cloneWidth, this.getPosition().y);
              view.getCommandStack().execute(command);
            }

            break
          case "delete":
            Utils.remove_selected_elements(this.getCanvas(), this.getCanvas().getSelection().getAll(), this);
            break;
          case "toFront":
            this.toFront();
            break;
          case "toBack":
            this.toBack();
            break;
          // case "rotateRight":
          //   angle = this.getRotationAngle();
          //   cmd = new draw2d.command.CommandRotate(this, angle+90);
          //   this.getCanvas().getCommandStack().execute(cmd);
          //   break;
          // case "rotateLeft":
          //   angle = this.getRotationAngle();
          //   cmd = new draw2d.command.CommandRotate(this, angle-90);
          //   this.getCanvas().getCommandStack().execute(cmd);
          //   break;
          case "group":
            command = new draw2d.command.CommandGroup(view, view.getSelection().getAll());
            view.getCommandStack().execute(command);
            break;
          case "ungroup":
            command = new draw2d.command.CommandUngroup(view, this.composite);
            view.getCommandStack().execute(command);
            break;
          default:
            break
        }

      },
      x: x,
      y: y,
      items: items
    })
  },
});
