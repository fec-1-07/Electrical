const Utils = {

  sizeCoef: 1.72,

  defaultRadius: 5,

  // createPort(figure, attr) {
  //   const port = figure.createPort('hybrid', new draw2d.layout.locator.XYAbsPortLocator(attr.locatorAttr || {
  //     x: 0,
  //     y: 0
  //   }));
  //   port.setWidth(attr.width || 10);
  //   port.setHeight(attr.height || 10);
  //   port.setBackgroundColor(attr.bgColor || "rgba(79,104,112,1)");
  //   port.setColor(attr.color || "rgba(27,27,27,1)");
  //   port.setMaxFanOut(attr.maxFanOut || 9007199254740991);
  //   if (attr.hasOwnProperty('direction')) {
  //     port.setConnectionDirection(attr.direction);
  //   }
  // },

  createPort(figure, attr) {
    const port = figure.createPort('hybrid', new defaultPortLocator(attr.locatorAttr || {
      x: 0,
      y: 0
    }));

    port.setWidth(attr.width || 10);
    port.setHeight(attr.height || 10);
    port.setBackgroundColor(attr.bgColor || "rgba(79,104,112,1)");
    port.setColor(attr.color || "rgba(27,27,27,1)");
    port.setMaxFanOut(attr.maxFanOut || 9007199254740991);
    if (attr.hasOwnProperty('direction')) {
      port.setConnectionDirection(attr.direction);
    }
  },

  createLabel(figure, attr) {
    const label = new defaultLabel(attr);

    this.params = $.extend({
      x: 0,
      y: 0,
    }, attr);

    figure.add(label, new defaultLabelLocator({ x: this.params.x, y: this.params.y }));
  },

  /**
   * Create set of ports for figure.
   * @param setY
   * @param realWidth
   * @param realHeight
   * @param direction (0 - top, 2 - bottom)
   */
  createSetOfPorts(figure, setY, realWidth, realHeight, direction) {
    const x = (direction === 0) ? 0 : realWidth * Utils.sizeCoef;
    const height = realHeight * Utils.sizeCoef;

    Object.keys(setY).forEach(function (key) {
      const radius = (this[key].hasOwnProperty('radius')) ? this[key].radius * Utils.sizeCoef : Utils.defaultRadius * Utils.sizeCoef;
      Utils.createPort(figure, {
        locatorAttr: { x, y: height * this[key].value / 100 },
        direction,
        width: radius,
        height: radius
      });
    }, setY);
  },

  createSetOfPortsCustomX(figure, setY, x, realWidth, realHeight, direction) {
    const height = realHeight * Utils.sizeCoef;

    Object.keys(setY).forEach(function (key) {
      const radius = (this[key].hasOwnProperty('radius')) ? this[key].radius * Utils.sizeCoef : Utils.defaultRadius * Utils.sizeCoef;
      Utils.createPort(figure, {
        locatorAttr: { x, y: height * this[key].value / 100 },
        direction,
        width: radius,
        height: radius
      });
    }, setY);
  },

  updateConnectionCreatePolicy(view, options) {
    function createConnection() {
      return new DefaultConnection(options);
    }

    view.uninstallEditPolicy(draw2d.policy.connection.DragConnectionCreatePolicy);
    // const policyClick = new draw2d.policy.connection.ClickConnectionCreatePolicy({ createConnection });
    // const policyDrag = new draw2d.policy.connection.DragConnectionCreatePolicy({ createConnection });
    // const policyConnection = new draw2d.policy.connection.ComposedConnectionCreatePolicy([policyClick, policyDrag]);

    const policyDrag = new draw2d.policy.connection.DragConnectionCreatePolicy({ createConnection });
    view.installEditPolicy(policyDrag);
  },

  /**
   * For COPY elements
   */

  /**
   * Prepare list of old->new IDs mapping.
   * @param figures
   * @return {{}}
   */
  prepareNewElementsID: function (figures) {
    let newIds = {};
    for (let n in figures) {
      let attrs = figures[n];
      newIds[attrs.id] = draw2d.util.UUID.create();
      // groups
      try {
        let assignedFigures = figures[n].getAssignedFigures().data;
        if (assignedFigures) {
          newIds = { ...newIds, ...this.prepareNewElementsID(assignedFigures) }
        }
      } catch (e) {
        //no groups found.
      }
    }
    return newIds;
  },

  /**
   * Replace elements ID, group relations and connection relations.
   * @param figures
   * @return {*}
   */
  replaceIds: function (figures) {
    const newElementsIDs = this.prepareNewElementsID(figures);
    const newFigures = figures.map(figure => {
      return { ...figure }
    })
    return newFigures.map((attrs) => {
      attrs.id = newElementsIDs[attrs.id];

      if (attrs.hasOwnProperty('composite')) {
        // Replace group relations.
        attrs.composite = newElementsIDs[attrs.composite];
      }

      if (attrs.type === 'DefaultConnection') {
        // Update connections
        for (let oldId in newElementsIDs) {
          if (attrs.source.node === oldId) {
            attrs.source.node = newElementsIDs[oldId];
          }
          if (attrs.target.node === oldId) {
            attrs.target.node = newElementsIDs[oldId];
          }
        }
      }
      return attrs;
    });
  },


  // Get figures and connections for copy
  getFiguresAndConnections: function (figures) {
    const result = [];
    for (let n in figures) {
      let attrs = figures[n].getPersistentAttributes();
      if (attrs.type !== 'draw2d.shape.composite.Group') {
        if (attrs.hasOwnProperty('x')) {
          attrs.x = attrs.x + 100;
        }
        result.push(attrs);
      }
    }

    return result;
  },

  // Get grouped figures for copy
  getGroupedFiguresAndConnections: function (groupedFigures) {
    let groupResult = [];
    const _self = this;


    for (let n in groupedFigures) {
      let attrs = groupedFigures[n].getPersistentAttributes();

      if (attrs.type == 'draw2d.shape.composite.Group') {
        let assignedFigures = groupedFigures[n].getAssignedFigures().data;
        let result = _self.getFiguresAndConnections(assignedFigures);
        groupResult = [...result, ...groupResult];
        groupResult.push(attrs);

        const hasChildrenGroups = assignedFigures.find(function (item) {
          return item.hasOwnProperty('assignedFigures');
        });

        if (hasChildrenGroups) {
          let resultGrouped = _self.getGroupedFiguresAndConnections(assignedFigures);
          groupResult = [...groupResult, ...resultGrouped];
        }
      }
    }

    return groupResult;
  },

  getSelectedElements: function (view) {
    const data = view.getSelection().getAll().data;
    let result = this.getFiguresAndConnections(data);
    let resultGrouped = this.getGroupedFiguresAndConnections(data);
    return [...result, ...resultGrouped];
  },

  pastSelectedElements: function (view, elements) {
    try {
      elements.sort(function (a, b) {
        return (a.type !== 'DefaultConnection') ? -1 : 1;
      });
      elements.sort(function (a) {
        return (a.type !== 'draw2d.shape.composite.Group') ? 1 : -1;
      });
      elements = this.replaceIds(elements);
      const reader = new draw2d.io.json.Reader();
      reader.unmarshal(view, elements);
    } catch (e) {
      console.error(e);
    }
  },

  remove_selected_elements(view, figures, element = null) {
    const commandStack = view.getCommandStack();
    let commands = [];
    const _self = this;
    if (figures.hasOwnProperty('data') && figures.data.length < 1 && element) {
      commands.push(new draw2d.command.CommandDelete(element));
    } else {
      figures.each(function (i, figure) {
        if (figure instanceof draw2d.shape.composite.Group) {
          const groupFigures = figure.getAssignedFigures();
          if (groupFigures) {
            _self.remove_selected_elements(view, groupFigures);
          }
        }
        commands.push(new draw2d.command.CommandDelete(figure));
      });
    }
    commands.map((command) => (command) ? commandStack.execute(command) : '');
  }


}
