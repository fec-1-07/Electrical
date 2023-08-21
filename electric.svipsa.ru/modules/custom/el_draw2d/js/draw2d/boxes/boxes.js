class Boxes {

  static getBoxMeta(id, root = null) {
    if (!root) {
      root = boxMenuItems;
    }

    let result = null;
    for (let n in root) {
      const item = root[n];

      if (item.hasOwnProperty('id') && item.id === id) {
        return (item.hasOwnProperty('meta')) ? item.meta : null;
      }

      if (item.hasOwnProperty('child')) {
        result = Boxes.getBoxMeta(id, item.child);
        if (result) {
          return result;
        }
      }
    }
    return result;
  }

  static isPaidUser() {
    return (
      drupalSettings &&
      drupalSettings.hasOwnProperty('el_pay') &&
      drupalSettings.el_pay &&
      drupalSettings.el_pay.hasOwnProperty('isPaid') &&
      drupalSettings.el_pay.isPaid)
  }

  static buildBoxMenu(items, isPaid = false) {
    let output = '';
    const _self = this;
    items.forEach(function (item) {

      const itemId = item.hasOwnProperty('id') ? item.id : '';
      const itemPaid = item.hasOwnProperty('paid') ? item.paid : false;

      if (!isPaid && itemPaid) {
        isPaid = true;
      }

      let paidClass, paidIcon = '';
      if (isPaid && !Boxes.isPaidUser()) {
        paidClass = 'boxes-paid-deny';
        paidIcon = '<span class="boxes-paid-deny-desc">подписка</span>';
      }

      output += '<li>';
      if (isPaid) {
        output += `<a href="#" class="box-menu-item boxes-paid ${paidClass}" data-id="${itemId}">${item.title} ${paidIcon}</a>`;
      } else {
        output += `<a href="#" class="box-menu-item" data-id="${itemId}">${item.title}</a>`;
      }

      if (item.hasOwnProperty('child')) {
        output += '<ul>';
        output += _self.buildBoxMenu(item.child, isPaid);
        output += '</ul>';
      }
      output += '</li>';
    });
    return output;
  }

  static buildBox(view, figures, x, y, w, h) {
    const cmdStack = view.getCommandStack();
    let command, line;

    const lineOptions = {
      stroke: 1,
      color: "#a1a1a4",
      selectable: false,
      resizeable: false,
      editable: false,
      draggable: false,
      dasharray: "--..",
    }

    const boxLines = [
      { startX: x, startY: y, endX: x + w, endY: y },  // top
      { startX: x, startY: y, endX: x, endY: y + h }, // left
      { startX: x + w, startY: y, endX: x + w, endY: y + h }, // right
      { startX: x, startY: y + h, endX: x + w, endY: y + h }, // bottom
    ]

    for (let n in boxLines) {
      line = new draw2d.shape.basic.Line({
        ...boxLines[n],
        ...lineOptions
      });

      command = new draw2d.command.CommandAdd(view, line, boxLines[n].startX, boxLines[n].startY);
      cmdStack.execute(command);
      figures.add(line)
    }
    return figures;
  }

  static buildRails(view, figures, boxMeta, boxX, boxY, boxW, boxH) {
    const cmdStack = view.getCommandStack();
    let command;

    const railMetaDin = boxMeta.hasOwnProperty('railDin') ? boxMeta.railDin : 12;
    const railMetaHeight = boxMeta.hasOwnProperty('railHeight') ? boxMeta.railDin : 35;
    const railMetaYMargin = boxMeta.hasOwnProperty('yMargin') ? boxMeta.yMargin : 125;
    const railMetaXMargin = boxMeta.hasOwnProperty('xMargin') ? boxMeta.xMargin : 50;

    const railWidth = railMetaDin * 17.5 * Utils.sizeCoef;
    const railHeight = railMetaHeight * Utils.sizeCoef;
    const yMargin = railMetaYMargin * Utils.sizeCoef;
    let xMargin = railMetaXMargin * Utils.sizeCoef;

    const cols = boxMeta.hasOwnProperty('cols') ? boxMeta.cols : 1;
    const rows = boxMeta.hasOwnProperty('rows') ? boxMeta.rows : 1;

    const paddingTop = boxMeta.hasOwnProperty('paddingTop') ? boxMeta.paddingTop : (boxH - (rows * railHeight) - ((rows - 1) * yMargin)) / (2 * Utils.sizeCoef);
    const paddingLeft = boxMeta.hasOwnProperty('paddingLeft') ? boxMeta.paddingLeft : (boxW - (cols * railWidth) - ((cols - 1) * xMargin)) / (2 * Utils.sizeCoef);

    const elementX0 = paddingLeft * Utils.sizeCoef + boxX;
    const elementY0 = paddingTop * Utils.sizeCoef + boxY;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {

        const elementX = elementX0 + ((railWidth + xMargin) * x);
        const elementY = elementY0 + ((railHeight + yMargin) * y);
        const railFunction = `other__din_rail__${railMetaDin}p`;

        const rail = eval(`new ${railFunction}({ x: elementX, y: elementY });`);

        command = new draw2d.command.CommandAdd(view, rail, elementX, elementY);
        cmdStack.execute(command);
        figures.add(rail);
      }
    }
    return figures;
  }

  static buildBoxWithRails(view, boxMeta) {
    // Add rect
    const boxX = 10;
    const boxY = 10;
    const boxW = boxMeta.width * Utils.sizeCoef;
    const boxH = boxMeta.height * Utils.sizeCoef;
    let figures = new draw2d.util.ArrayList();

    // Add box using lines
    figures = Boxes.buildBox(view, figures, boxX, boxY, boxW, boxH);

    // Add rails
    figures = Boxes.buildRails(view, figures, boxMeta, boxX, boxY, boxW, boxH);

    // Group
    view.getCommandStack().execute(new draw2d.command.CommandGroup(view, figures))
    figures.each(function (i, figure) {
      figure.toFront();
    });
  }

  static initBoxMenu(view) {
    let w, h, cols, rows, railDin, paddingTop, paddingLeft, xMargin;

    $('.box-menu-item').on('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      const paidBox = $(this).hasClass('boxes-paid');

      if (paidBox && !Boxes.isPaidUser()) {
        alert("Оплатите подписку чтобы использовать платные боксы")

        // const frontpageModal = Drupal.dialog('<div>Оплатите подписку чтобы использовать платные боксы</div>', {
        //   title: 'Оплатите подписку чтобы использовать платные боксы',
        //   dialogClass: 'front-modal',
        //   width: 600,
        //   height: 200,
        //   autoResize: true,
        //   close: function (event) {
        //     $(event.target).remove();
        //   }
        // });
        // frontpageModal.show();

        return;
      }

      const boxId = $(this).data('id');
      const boxMeta = Boxes.getBoxMeta(boxId);

      if (boxId && boxId.length > 0) {
        Boxes.clearView(view); // @todo: remove it???
        Boxes.buildBoxWithRails(view, boxMeta)
      }
    });
  }


  static clearView(view) {
    // Clear
    const cmdStack = view.getCommandStack();
    const figuresToDelete = [];
    const linesToDelete = []

    view.getLines().each(function (i, line) {
      linesToDelete.push(line);
    })
    linesToDelete.forEach(function (line) {
      const command = new draw2d.command.CommandDelete(line);
      cmdStack.execute(command);
    });

    view.getFigures().each(function (i, figure) {
      figuresToDelete.push(figure);
    });
    figuresToDelete.forEach(function (figure) {
      const command = new draw2d.command.CommandDelete(figure);
      cmdStack.execute(command);
    });
  }
}
