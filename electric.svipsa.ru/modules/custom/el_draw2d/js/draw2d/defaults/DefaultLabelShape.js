let defaultLabelShape = draw2d.shape.node.VerticalBus.extend({

  NAME: "defaultLabelShape",

  init: function (attr, setter, getter) {
    this._super($.extend({
      width: 33,
      height: 146,
      text:  '',
      editor: new draw2d.ui.LabelEditor(),
      bgColor: "rgba(255,0,0,1)",
      color: "rgba(255,0,0,1)",
    }, attr), setter, getter);

    this.setConnectionDirStrategy(0);
    this.installEditPolicy(new draw2d.policy.figure.VBusSelectionFeedbackPolicy());

    this.on("added", function (figure, canvas) {
      try {
        figure.hybridPorts.data[0].setVisible(false);
      } catch (e) {
        console.error(e);
      }
    });

  },

  repaint: function repaint(attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return;
    }

    attributes = attributes || {};

    // set some good defaults if the parent didn't
    if (typeof attributes.fill === "undefined") {
      if (this.bgColor !== null) {
        //attributes.fill = "90-" + this.bgColor.hash() + ":5-" + this.bgColor.lighter(0.3).hash() + ":95";
        // Remove gradient
        attributes.fill = this.bgColor.lighter(0.2).rgba();
      } else {
        attributes.fill = "none";
      }
    }

    this._super(attributes);
  },

  onContextMenu: function ( x, y) {

    let items = {"clone": {name: "Клонировать"}}
    items.delete = {name: "Удалить"};
    items.sep1 = "---------";
    items.toFront = {name: "Переместить вперед"};
    items.toBack = {name: "Переместить назад"};
    items.sep2 = "---------";

    $.contextMenu({
      selector: 'body',
      position: function(opt, x, y){
        opt.$menu.css({top: y, left: x + 10});
      },
      events:
        {
          hide: function () {
            $.contextMenu('destroy')
          }
        },
      callback: (key, options) => {
          switch (key) {
            case "clone":
              const view = this.getCanvas();
              const clone = eval("new " + this.NAME + "();");
              clone.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
              const command = new draw2d.command.CommandAdd(view, clone, this.getPosition().x + this.getWidth(), this.getPosition().y);
              view.getCommandStack().execute(command);

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
            default:
              break
          }

      },
      x: x,
      y: y,
      items: items
    })
  },


  setLabel: function setLabel(labelString) {
    var mustAdjustTheAngel = this.label === null;

    this._super(labelString);

    if (mustAdjustTheAngel === true && this.label !== null) {
      this.label.setRotationAngle(270);
    }
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
      let locator = eval("new " + json.locatorData.NAME + "("+ JSON.stringify(json.locatorData.params) +")");

      // add the new figure as child to this figure
      this.add(figure, locator);
    }, this));
  },

});
