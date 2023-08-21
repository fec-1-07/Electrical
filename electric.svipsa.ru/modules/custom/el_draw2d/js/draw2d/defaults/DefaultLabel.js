let defaultLabel = draw2d.shape.basic.Label.extend({

  NAME: "defaultLabel",

  getLabelEditor: function () {
    return new draw2d.ui.LabelEditor({
      onCommit: $.proxy(function (value) {
        this.recalculateBox();
      }, this)
    });
  },

  init: function (attr, setter, getter) {
    let padding = { top: -1, right: 1, bottom: -3, left: 1 };
    if (attr && attr.hasOwnProperty('angle') && (attr.angle === 270 || attr.angle === 90)) {
      padding = { top: 0, right: 1, bottom: -5, left: 1 };
    }

    this._super($.extend({
      text: "Текст",
      fontColor: "rgba(0,0,0,1)",
      editor: this.getLabelEditor(),
      bold: false,
      resizeable: true,
      padding,
      color: "rgb(0,0,0,0)",
    }, attr), setter, getter);

    if (attr && attr.hasOwnProperty('angle') && (attr.angle === 270 || attr.angle === 90)) {
      this.setUserData({
        verticalText: true
      });
    }

    this.on("added", function (figure, canvas) {
      figure.recalculateBox();
    });
  },


  recalculateBox: function () {
    try {
      this.cachedWidth = this.cachedMinWidth;
      this.width = this.cachedMinWidth;

      this.uninstallEditPolicy(draw2d.policy.figure.AntSelectionFeedbackPolicy)
      this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
      this.repaint();
    } catch (e) {
      console.error('recalculateBox', e);
    }
  },


  onContextMenu: function (x, y) {

    let items = { "clone": { name: "Клонировать" } }
    items.delete = { name: "Удалить" };
    items.sep1 = "---------";
    items.toFront = { name: "Переместить вперед" };
    items.toBack = { name: "Переместить назад" };
    items.sep2 = "---------";

    items.bold = { name: "Жирный" };
    items.normal = { name: "Не жирный" };
    items.sep3 = "---------";

    items.color = {
      name: "Цвет теста",
      items: {}
    }

    for (let key in electricLabelColors) {
      items.color.items[`labelColor_${key}`] = { name: electricLabelColors[key].name }
    }

    items.border = {
      name: "Цвет окантовки",
      items: {}
    }
    for (let key in electricLabelBorderColors) {
      items.border.items[`borderColor_${key}`] = { name: electricLabelBorderColors[key].name }
    }

    items.fontSize = {
      name: "Размер шрифта",
      items: {}
    }
    for (let key in electricLabelFontSize) {
      items.fontSize.items[`labelFontSize_${key}`] = { name: electricLabelFontSize[key].name }
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
        if (key.indexOf('labelColor_') != -1) {
          key = key.replace('labelColor_', '');
          if (electricLabelColors.hasOwnProperty(key)) {
            this.setFontColor(electricLabelColors[key].color);
          }
        } else if (key.indexOf('borderColor_') != -1) {
          key = key.replace('borderColor_', '');
          if (electricLabelBorderColors.hasOwnProperty(key)) {
            this.setColor(electricLabelBorderColors[key].color);
          }
        } else if (key.indexOf('labelFontSize_') != -1) {
          key = key.replace('labelFontSize_', '');
          if (electricLabelFontSize.hasOwnProperty(key)) {
            this.setFontSize(key);
            this.recalculateBox();
          }
        } else {
          switch (key) {
            case "bold":
              this.setBold(true);
              this.recalculateBox();
              break;
            case "normal":
              this.setBold(false);
              this.recalculateBox();
              break;
            case "clone":
              const view = this.getCanvas();
              const clone = eval("new " + this.NAME + "();");
              const attrs = this.getPersistentAttributes();
              attrs.id = draw2d.util.UUID.create()
              clone.setPersistentAttributes(attrs);
              clone.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
              const newX = (this.getRotationAngle() == 270 || this.getRotationAngle() == 90) ? this.getPosition().x + this.getHeight() : this.getPosition().x + this.getWidth();
              const command = new draw2d.command.CommandAdd(view, clone, newX, this.getPosition().y);
              view.getCommandStack().execute(command);
              clone.recalculateBox();

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
        }

      },
      x: x,
      y: y,
      items: items
    })
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
    memento.additionalAttr = {
      bold: this.bold,
    };

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
    // if (memento && memento.hasOwnProperty('userData') && memento.userData && memento.userData.hasOwnProperty('verticalText') && memento.userData.verticalText) {
    //   // Fix vertical position.
    //   debugger;
    //   memento.x = memento.x - 3;
    // }
    this._super(memento);
    $.each(memento.additionalAttr, $.proxy(function (key, value) {
      this[key] = value;
    }, this));
    this.installEditor(this.getLabelEditor());
  },
});
