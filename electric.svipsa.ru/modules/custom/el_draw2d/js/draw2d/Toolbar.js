electric.Toolbar = Class.extend({

  init: function (elementId, app, view) {
    this.html = $("#" + elementId);
    this.view = view;
    this.app = app;
    const _self = this;

    view.getCommandStack().addEventListener(this);
    view.on("select", $.proxy(this.onSelectionChanged, this));

    for (let key in menuItems) {
      const icon = menuItems[key].hasOwnProperty('iconClass') ? `<i class="fa ${menuItems[key].iconClass} fa-lg" aria-hidden="true"></i>` : '';
      const id = menuItems[key].hasOwnProperty('id') ? `id="${menuItems[key].id}"` : '';
      const cssClass = menuItems[key].hasOwnProperty('cssClass') ? menuItems[key].cssClass : '';
      const disabled = menuItems[key].hasOwnProperty('disabled');
      const title = menuItems[key].hasOwnProperty('title') ? `title="${menuItems[key].title}"` : '';
      const action = menuItems[key].hasOwnProperty('action') ? `data-action="${menuItems[key].action}"` : '';
      let item = `<button ${id} class="${cssClass} toolbar-btn toolbar-btn-new button-${key}" data-key="${key}" ${action} ${title}>${icon}</button>`;
      if (menuItems[key].hasOwnProperty('sep')) {
        item += '<span class="toolbar_delimiter">&nbsp;</span>';
      }

      const el = $(item);
      this.html.append(el);

      if (disabled) {
        this.disableButton(el, true);
      }
    }

    this.boxMenu = $(`<nav id="main-nav"><ul id="box-menu" class="sm sm-rtr sm-clean"> ${Boxes.buildBoxMenu(boxMenuItems)} </ul></nav>`);
    this.html.append(this.boxMenu);
    Boxes.initBoxMenu(this.view);

    this.handleKeyboard(_self);


    $("#el-search").on('focus', function() {
      // Unselect all elements while searching
      try {
        _self.view.getSelection().getAll().each(function(i, figure) { figure.unselect()});
      } catch (e) {
        console.error(e);
      }
    });
  },

  /**
   * Keyboard functions.
   */
  handleKeyboard: function (_self) {
    // $('html').keyup(function (e) {
    //   if (e.key == 'Backspace' || e.key == 'Delete') {
    //     const node = _self.view.getPrimarySelection();
    //     if (node) {
    //       _self.removeElement(node);
    //     }
    //   }
    // });


    $('html').keydown(function (e) {
      try {
        if (e.shiftKey && (e.key == 'ArrowLeft' || e.key == 'ArrowRight' || e.key == 'ArrowUp' || e.key == 'ArrowDown')) {
          const node = _self.view.getPrimarySelection();
          if (node) {
            if ((node instanceof DefaultConnection)) {
            //  _self.moveConnection(node, e.key);
            }
            else if (node.hasOwnProperty('getEndPoint')) {
              // connection
              //@todo: svipsa:  not working.
              //_self.moveConnection(node, e.key);
            } else {
              // figure
              _self.moveElements(node, e.key);
            }
          }
        }

        // @todo: select figures in arraws.
        // if (e.key == 'ArrowLeft' || e.key == 'ArrowRight' ) {
        //   const node = _self.view.getPrimarySelection();
        //   if (node) {
        //     const selectedId = node.getId();
        //     const figures = _self.view.getFigures().data;
        //     let found = false;
        //     for (let n in figures) {
        //       const figure = figures[n];
        //       if (figure.getId() === selectedId) {
        //         found = true;
        //         continue
        //       }
        //       if (found) {
        //         figure.select();
        //         node.unselect();
        //         _self.view.setCurrentSelection(figure);
        //         break;
        //       }
        //     }
        //     // debugger;
        //   }
        // }

        if (e.ctrlKey) {
          switch (e.key) {
            case "c":
            case "с":
              const elements = Utils.getSelectedElements(_self.view);
              localStorage.setItem('electric2dClipBoard', JSON.stringify(elements));
              break;
            case "v":
            case "м":
              const clipboardData = localStorage.getItem('electric2dClipBoard');
              try {
                let elements = JSON.parse(clipboardData);
                if (elements) {
                  Utils.pastSelectedElements(_self.view, elements);
                }
              } catch (e) {
                console.error(e);
              }
              break;
            case "z":
            case "я":
              _self.view.getCommandStack().undo();
              break;
            case "+":
              _self.view.setZoom(_self.view.getZoom() * 0.7, true);
              break;
            case "-":
              _self.view.setZoom(_self.view.getZoom() * 1.3, true);
              break;
            case "1":
              _self.view.setZoom(1.0, true);
              break;

          }
        }

        if (e.keyCode == 8 || e.keyCode == 46 ) {
          // backspace or forward backspace or delete
           Utils.remove_selected_elements(_self.view, _self.view.getSelection().getAll());
        }
      } catch (e) {
        console.error('keydown', e);
      }
    });
  },

  /**
   * Move elements by keyboard.
   * @param figure
   * @param key
   */
  moveElements: function (figure, key) {
    const _view = this.view;
    const selection = _view.getSelection().getAll().data;
    const koef = 1;

    const commands = selection.map((figure) => {

      if (!(figure instanceof DefaultConnection)) {
        let x = figure.getX();
        let y = figure.getY();
        const command =  new draw2d.command.CommandMove(figure, x, y);
        switch (key) {
          case "ArrowUp":
            y = y - koef;
            break;
          case "ArrowDown":
            y = y + koef;
            break;
          case "ArrowLeft":
            x = x - koef;
            break;
          case "ArrowRight":
            x = x + koef;
            break;
        }

        command.setPosition(x, y);
        return command;
      } else {
        //const command =  new draw2d.command.Command(figure, x, y);
      }
      return null;
    })

    //const command = new draw2d.command.CommandMove(selection, x, y);
    commands.map((command) => (command) ? _view.getCommandStack().execute(command) : '');
  },

  // moveConnection: function (connection, key) {
  //   const _view = this.view;
  //   const koef = Utils.sizeCoef;
  //   const command = new draw2d.command.CommandMove(connection);
  //
  //   let x = 0;
  //   let y = 0;
  //   switch (key) {
  //     case "ArrowUp":
  //       y = y - koef;
  //       break;
  //     case "ArrowDown":
  //       y = y + koef;
  //       break;
  //     case "ArrowLeft":
  //       x = x - koef;
  //       break;
  //     case "ArrowRight":
  //       x = x + koef;
  //       break;
  //   }
  //
  //   // connection.router.onDrag(this, x, y, x, y);
  //   // connection.command.updateVertices(connection.getVertices().clone());
  //   //debugger;
  //   // console.log(x,y);
  //   // command.setTranslation(x, y);
  //   command.setPosition(x, y);
  //   _view.getCommandStack().execute(command);
  // },

  // removeElement: function (node) {
  //   let command;
  //   const _view = this.view;
  //
  //   if (node && node.assignedFigures && node.assignedFigures.data) {
  //     for (let n in node.assignedFigures.data) {
  //       this.removeElement(node.assignedFigures.data[n])
  //     }
  //   }
  //
  //   _view.getSelection().getAll().each(function (i, figure) {
  //     command = new draw2d.command.CommandDelete(figure);
  //     _view.getCommandStack().execute(command);
  //   });
  //
  //   command = new draw2d.command.CommandDelete(node);
  //   _view.getCommandStack().execute(command);
  // },

  /**
   * @method
   * Called if the selection in the cnavas has been changed. You must register this
   * class on the canvas to receive this event.
   *
   * @param {draw2d.Canvas} emitter
   * @param {Object} event
   * @param {draw2d.Figure} event.figure
   */
  onSelectionChanged: function (emitter, event) {
    this.disableButton($('.button-remove'), event.figure === null);
    this.disableButton($('.button-ungroup'), !(event.figure instanceof draw2d.shape.composite.Group));
    this.disableButton($('.button-group'), !(this.view.getSelection().getSize() >= 2));

  },

  /**
   * @method
   * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail()
   * can be used to identify the type of event which has occurred.
   *
   * @template
   *
   * @param {draw2d.command.CommandStackEvent} event
   **/
  stackChanged: function (event) {
    this.disableButton($('.button-undo'), !event.getStack().canUndo());
    this.disableButton($('.button-redo'), !event.getStack().canRedo());
  },

  disableButton: function (button, flag) {
    button.prop("disabled", flag);
    if (flag) {
      button.addClass("disabled");
    } else {
      button.removeClass("disabled");
    }
  },


});
