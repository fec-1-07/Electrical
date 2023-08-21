class ToolbarActions {

  view = null;
  writer = null;
  writerPng = null;
  wrapper = null;

  constructor(view) {
    this.view = view;
    this.writer = new draw2d.io.json.Writer();
    this.writerPng = new draw2d.io.png.Writer();
  }

  init() {
    const self = this;
    this.wrapper = $(".el_draw2d-designer-wrapper");

    $('.toolbar-btn-new').on('click', function () {
      const action = $(this).data('action');
      if (action) {
        if (action in self) {
          self[action]();
        } else {
          console.error(`Action "${action}" doesn't exists`);
        }
      }
    });

    const pallete = [];
    for (let key in electricLineColors) {
      let color = electricLineColors[key].color;
      if (electricLineColors[key].hasOwnProperty('color2')) {
        color += '|' + electricLineColors[key].color2;
      }
      pallete.push(color);
    }

    $(".toolbarColorPicker").colorPick({
      'initialColor': self.getUserLineColor(),
      'sizes': false,
      'palette': pallete,
      'paletteLabel': 'Цвет проводов:',
      'allowRecent': false,
      'onColorSelected': function () {
        const colors = this.color.split("|");
        if (colors.length > 1) {
          const bg = `linear-gradient(to right, ${colors[0]} 50%, ${colors[1]} 0%)`;
          this.element.css({ 'background': bg, 'color': colors[0] });
        } else {
          this.element.css({ 'background': colors[0], 'color': colors[0] });
        }
        self._action_color(this.color);
      }
    });


    const palleteSizes = [];
    for (let key in electricLineStrokes) {
      palleteSizes.push(`${electricLineStrokes[key].value}`);
    }

    $(".toolbarWidthPicker").colorPick({
      'initialColor': self.getUserLineStroke(),
      'palette': palleteSizes,
      'sizes': true,
      'textColor': '#F1C40F',
      'paletteLabel': 'Толщина проводов:',
      'allowRecent': false,
      'onColorSelected': function () {
        this.element.text(this.color);
        self._action_width(this.color);
      }
    });


    // show help first time
    const electric2dHelpFirstTime = localStorage.getItem('electric2dHelpFirstTime');
    if (!electric2dHelpFirstTime) {
      this.action_help();
      localStorage.setItem('electric2dHelpFirstTime', "1");
    }
  }

  _check_duplicates(json) {
    const ids = [];
    let duplicatesFound = 0;
    for (let n in json) {
      const item = json[n];
      if (ids.indexOf(item.id) !== -1) {
        duplicatesFound++;
      } else {
        ids.push(item.id);
      }
    }
    return duplicatesFound;
  }

  _fix_duplicates(json) {
    const ids = [];
    for (let n in json) {
      const item = json[n];
      if (ids.indexOf(item.id) !== -1) {
        item.id = draw2d.util.UUID.create();
      } else {
        ids.push(item.id);
      }
    }
    return json;
  }


  action_save() {
    const _self = this;
    //show preloader
    _self.showPreloader();

    this.writer.marshal(_self.view, function (json) {
      let reloadPage = false;
      const duplicates = _self._check_duplicates(json)
      if (duplicates) {
        const result = confirm("В вашем проекте обнаружены дубликаты. Дубликаты могли появиться в результате копирования элементов. Мы уже исправили эту проблему. Все новые операции в конструкторе не создают дубликаты, но в вашем проекте остались уже сохраненные дубликаты. Мы можем исправить их автоматически. Исправляем? После сохранения проект будет перезагружен.");
        if (result) {
          json = _self._fix_duplicates(json);
          reloadPage = true;
        }
      }

      _self.preparePreview(_self.writerPng, _self.view, function (png) {
        _self.hidePreloader();
        _self.showPreloader('Сохранение, не перезагружайте страницу до окончания процесса');

        const dataToSave = btoa(unescape(encodeURIComponent(JSON.stringify(json))));

        const ajaxSettings = {
          url: drupalSettings.path.baseUrl + 'el_draw2d/save/' + drupalSettings.el_draw2d.current_nid,
          element: '.el-designer-new-save-btn',
          submit: {
            'data': dataToSave,
            'img': png,
          }
        };

        const myAjaxObject = Drupal.ajax(ajaxSettings);
        // Programmatically trigger the Ajax request.
        myAjaxObject.execute().then(function () {
          if (reloadPage) {
            window.location.reload();
          }
          _self.hidePreloader()
        }).catch(function (e) {
          _self.hidePreloader();
          console.error(e);
        });
      });
    });
  }

  action_download() {
    const _self = this;
    //show preloader
    _self.showPreloader();

    _self.preparePreview(this.writerPng, this.view, function (png) {
      const fileName = (drupalSettings.el_draw2d.hasOwnProperty('projectName') && drupalSettings.el_draw2d.projectName.length) ? `${drupalSettings.el_draw2d.projectName}.png` : 'Export.png';
      const a = document.createElement("a");
      a.href = png;
      a.download = fileName;
      a.click();
      a.remove();
      _self.hidePreloader();
    });
  }

  action_redo() {
    this.view.getCommandStack().redo();
  }

  action_undo() {
    this.view.getCommandStack().undo();
  }

  action_delete() {
    const node = this.view.getPrimarySelection();
    const view = this.view;
    if (node) {
      Utils.remove_selected_elements(view, view.getSelection().getAll());
    }
  }


  action_zoomIn() {
    this.view.setZoom(this.view.getZoom() * 0.7, true);
  }

  action_zoomReset() {
    this.view.setZoom(1.0, true);
  }

  action_zoomOut() {
    this.view.setZoom(this.view.getZoom() * 1.3, true);
  }

  action_scrollLeft() {
    const diff = this.wrapper.scrollLeft() - 100;
    this.wrapper.stop().animate({ scrollLeft: diff }, 800);
  }

  action_scrollRight() {
    const diff = this.wrapper.scrollLeft() + 100;
    this.wrapper.stop().animate({ scrollLeft: diff }, 800);
  }

  action_scrollUp() {
    const diff = this.wrapper.scrollTop() - 100;
    this.wrapper.stop().animate({ scrollTop: diff }, 800);
  }

  action_scrollDown() {
    const diff = this.wrapper.scrollTop() + 100;
    this.wrapper.stop().animate({ scrollTop: diff }, 800);
  }

  action_group() {
    this.view.getCommandStack().execute(new draw2d.command.CommandGroup(this.view, this.view.getSelection()));
    this.view.getSelection().getAll().each(function (i, figure) {
      figure.toFront();
    });
  }

  action_help() {

    $('#electric-help-modal').remove();
    let content = '';
    let keyboardContent = '';
    let elementsContent = '';
    for (let key in menuItems) {
      const icon = menuItems[key].hasOwnProperty('iconClass') ? `<i class="fa ${menuItems[key].iconClass} fa-lg" aria-hidden="true"></i>` : '';
      const title = menuItems[key].hasOwnProperty('title') ? `title="${menuItems[key].title}"` : '';
      const help = menuItems[key].hasOwnProperty('help') ? menuItems[key].help.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
      let item = `<div class="electric-help-item"><button class="help-button-${key}" ${title}>${icon}</button> ${help}</div>`;

      content += item;
    }

    for (let key in keyboardHelp) {
      const title = keyboardHelp[key].hasOwnProperty('title') ? keyboardHelp[key].title.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
      const help = keyboardHelp[key].hasOwnProperty('help') ? keyboardHelp[key].help.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
      let item = `<div class="electric-help-item"><span class="keyboard-help keyboard-help-${key}">${title}</span> ${help}</div>`;

      keyboardContent += item;
    }

    for (let key in elementsHelp) {
      const title = elementsHelp[key].hasOwnProperty('title') ? elementsHelp[key].title.replace(/</g, "&lt;").replace(/>/g, "&gt;") : null;
      const icon = elementsHelp[key].hasOwnProperty('iconClass') ? `<i class="fa ${elementsHelp[key].iconClass} fa-lg" aria-hidden="true"></i>` : '';
      const cssStyle = elementsHelp[key].hasOwnProperty('cssStyle') ? elementsHelp[key].cssStyle : '';
      const help = elementsHelp[key].hasOwnProperty('help') ? elementsHelp[key].help.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';

      let item = '';
      if (title) {
        item = `<div class="electric-help-item"><span class="elements-help elements-help-${key}"  style="${cssStyle}">${title}</span> ${help}</div>`;
      } else {
        item = `<div class="electric-help-item"><button class="elements-help-${key}" style="${cssStyle}">${icon}</button> ${help}</div>`;
      }

      elementsContent += item;
    }

    const modal = $('<div class="modal fade" id="electric-help-modal" role="dialog">\n' +
      '    <div class="modal-dialog">\n' +
      '    \n' +
      '      <!-- Modal content-->\n' +
      '      <div class="modal-content">\n' +
      '        <div class="modal-header">\n' +
      '          <button type="button" class="close" data-dismiss="modal">&times;</button>\n' +
      '          <h4 class="modal-title">Помощь</h4>\n' +
      '        </div>\n' +
      '        <div class="modal-body">\n' +
      '           <div class="row">' +
      '             <div class="col-sm-6"><h6>Кнопки панели управления</h6>' +
      '             </div>' +
      '             <div class="col-sm-6"><h6>Клавиатурные сокращения</h6>' +
      '             </div>' +
      '          </div>' +
      '          <div class="row">' +
      '             <div class="col-sm-6">' +
      content +
      '             </div>' +
      '             <div class="col-sm-6">' +
      keyboardContent +
      '             <h6 class="p-top-40">Работа с элементами</h6>' +
      elementsContent +
      '             </div>' +
      '          </div>' +
      '        </div>\n' +
      '        <div class="modal-footer">\n' +
      '          <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '      \n' +
      '    </div>\n' +
      '  </div>')
    $('body').append(modal);
    $('#electric-help-modal').modal('show');
  }

  action_ungroup() {
    this.view.getCommandStack().execute(new draw2d.command.CommandUngroup(this.view, this.view.getSelection()));
  }

  _action_color(color) {
    const colors = color.split("|");
    const stroke = this.getUserLineStroke();

    const options = {
      color: colors[0],
      stroke,
    };
    if (colors[1]) {
      options.stroke = stroke / 3;
      options.outlineStroke = stroke * 1.1;
      options.outlineColor = colors[1];
      options.outlineVisible = true;
    }
    Utils.updateConnectionCreatePolicy(this.view, options)
    this.saveUserLineColor(color);
  }

  _action_width(stroke) {
    const color = this.getUserLineColor();
    const colors = color.split("|");

    const options = {
      color: colors[0],
      stroke,
    };
    if (colors[1]) {
      options.stroke = stroke / 3;
      options.outlineStroke = stroke * 1.1;
      options.outlineColor = colors[1];
      options.outlineVisible = true;
    }

    Utils.updateConnectionCreatePolicy(this.view, options)
    this.saveUserLineStroke(stroke);
  }


  showPreloader(text = 'Подготовка к сохранению...') {
    $('body').append('<div style="width: 100%; height: 100%; position: absolute; top:0; left:0; opacity: 0.9; background-color: black; z-index: 9999;" class="el-draw2d-loading">' +
      '<span style="margin-top: 300px; color: white;font-size: 20px; font-weight: bold; text-align: center; width: 100%; position: absolute">' + text + '</span>' +
      '</div>')
  }

  hidePreloader() {
    //hide preloader
    $('.el-draw2d-loading').remove();
  }

  preparePreview(writer, view, callback) {
    const xCoords = [];
    const yCoords = [];
    const _self = this;

    view.getFigures().each(function (i, f) {
      const b = f.getBoundingBox();
      xCoords.push(b.x, b.x + b.w);
      yCoords.push(b.y, b.y + b.h);

      f.getConnections().each(function (i, c) {
        const b = c.getBoundingBox();
        xCoords.push(b.x, b.x + b.w);
        yCoords.push(b.y, b.y + b.h);
      })
    });

    const minX = Math.min.apply(Math, xCoords);
    const minY = Math.min.apply(Math, yCoords);
    const width = Math.max.apply(Math, xCoords) - minX;
    const height = Math.max.apply(Math, yCoords) - minY;

    const cropBoundingBox = {
      x: minX * 4,
      y: minY * 4,
      w: width * 4,
      h: height * 4,
    };

    // Fix exporting cut.
    cropBoundingBox.w += 200;
    cropBoundingBox.h += 200;

    writer.marshal(view, function (png) {
      _self.convertImage(png, function (convertedPng) {
        callback(convertedPng)
      })
    }, cropBoundingBox);
  }

  convertImage(png, cb) {
    if (png === 'data:,') {
      // empty image. Return white rect.
      return cb('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRF////p8QbyAAAABxJREFUeJztwYEAAAAAw6D5U1/hAFUBAAAAAHwGFFAAAdqgEPkAAAAASUVORK5CYII=');
    }

    // create fake image to calculate height / width
    const img = document.createElement("img");
    img.src = png;
    img.style.visibility = "hidden";
    document.body.appendChild(img);
    img.onload = function () {
      const canvas = document.createElement("canvas");
      let src_w = img.naturalWidth;
      let src_h = img.naturalHeight;

      // Add margins.
      let marginW = src_w * 20 / 100;
      let marginH = src_h * 20 / 100;
      if (marginW > 200) marginW = 200;
      if (marginH > 200) marginH = 200;
      src_w += marginW;
      src_h += marginH;
      const x = marginW / 2;
      const y = marginH / 2;

      // let dW, dH, koef;
      // if (src_w > src_h) {
      //   dW = 250;
      //   koef = (src_w / dW);
      //   dH = src_h / koef;
      // } else {
      //   dH = 250;
      //   koef = (src_h / dH);
      //   dW = src_w / koef;
      // }
      // const dX = x / koef;
      // const dY = y / koef;
      //
      // canvas.width = dW;
      // canvas.height = dH;

      canvas.width = src_w;
      canvas.height = src_h;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //ctx.drawImage(img, 0, 0, src_w, src_h, dX, dY, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, canvas.width, canvas.height);

      // remove image
      img.parentNode.removeChild(img);

      const dataUrl = canvas.toDataURL("image/png");
      // remove canvas
      canvas.remove();
      return cb(dataUrl);
    }
  }

  removeElement(node) {
    let command;
    const _view = this.view;

    if (node && node.assignedFigures && node.assignedFigures.data) {
      for (let n in node.assignedFigures.data) {
        this.removeElement(node.assignedFigures.data[n])
      }
    }

    _view.getSelection().getAll().each(function (i, figure) {
      command = new draw2d.command.CommandDelete(figure);
      _view.getCommandStack().execute(command);
    });

    command = new draw2d.command.CommandDelete(node);
    _view.getCommandStack().execute(command);
  }

  saveUserLineColor(color) {
    localStorage.setItem('electricLineColorNew', color);
  }

  saveUserLineStroke(stroke) {
    localStorage.setItem('electricLineStrokeNew', stroke);
  }

  getUserLineColor() {
    return localStorage.getItem('electricLineColorNew') || electricDefaultLineColor;
  }

  getUserLineStroke() {
    return localStorage.getItem('electricLineStrokeNew') || electricDefaultLineStroke;
  }
}
