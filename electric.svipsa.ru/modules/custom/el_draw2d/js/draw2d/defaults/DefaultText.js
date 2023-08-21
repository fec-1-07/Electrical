let defaultText = draw2d.shape.basic.Text.extend({

  NAME: "defaultText",

  init: function (attr, setter, getter) {
    this._super($.extend({
      text: "Текст",
      fontColor: "rgba(0,0,0,1)",
      color: null,
      editor: new draw2d.ui.LabelInplaceEditor(),
      bold: false,
      resizeable: true,
      padding: { top: 1, right: 2, bottom: 1, left: 2 },
    }, attr), setter, getter);
  },

  onContextMenu: function ( x, y) {

    let items = {"clone": {name: "Клонировать"}}
    items.delete = {name: "Удалить"};
    items.sep1 = "---------";
    items.toFront = {name: "Переместить вперед"};
    items.toBack = {name: "Переместить назад"};

    items.sep2 = "---------";

    items.bold = {name: "Жирный"};
    items.normal = {name: "Не жирный"};
    items.sep3 = "---------";

    items.color = {
      name: "Цвет теста",
      items: {}
    }

    for (let key in electricLabelColors) {
      items.color.items[`labelColor_${key}`] = {name: electricLabelColors[key].name}
    }

    items.border = {
      name: "Цвет окантовки",
      items: {}
    }
    for (let key in electricLabelBorderColors) {
      items.border.items[`borderColor_${key}`] = {name: electricLabelBorderColors[key].name}
    }

    items.fontSize = {
      name: "Размер шрифта",
      items: {}
    }
    for (let key in electricLabelFontSize) {
      items.fontSize.items[`labelFontSize_${key}`] = {name: electricLabelFontSize[key].name}
    }

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
          }
        } else {
          switch (key) {
            case "bold":
              this.setBold(true);
              break;
            case "normal":
              this.setBold(false);
              break;
            case "clone":
              const view = this.getCanvas();
              const clone = eval("new " + this.NAME + "();");
              const attrs = this.getPersistentAttributes();
              attrs.id = draw2d.util.UUID.create()
              clone.setPersistentAttributes(attrs);
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
    this._super(memento);
    $.each(memento.additionalAttr, $.proxy(function (key, value) {
      this[key] = value;
    }, this));
  },
});
