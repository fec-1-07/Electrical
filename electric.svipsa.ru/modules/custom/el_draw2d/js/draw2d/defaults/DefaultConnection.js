
const DefaultConnection = draw2d.Connection.extend({

  NAME: 'DefaultConnection',

  init: function (attr, setter, getter) {
    this._super(attr, setter, getter);

    this.setRouter(new draw2d.layout.connection.InteractiveManhattanConnectionRouter());
    // this.setOutlineStroke(1);
    // this.setOutlineColor("#303030");
    // this.setStroke(2);
    // this.setColor('#00A8F0');
    this.setRadius(5);

  },

  onContextMenu: function ( x, y) {
    let segment = this.hitSegment(x, y)
    if (segment === null) {
      return
    }

    let items = {"split": {name: "Добавить сегмент"}}

    if (this.getRouter().canRemoveSegmentAt(this, segment.index)) {
      items.remove = {name: "Удалить сегмент"}
    }

    items.sep1 = "---------";

    items.color = {
      name: "Цвет провода",
      items: {}
    }

    for (let key in electricLineColors) {
      items.color.items[`color_${key}`] = {name: electricLineColors[key].name}
    }

    items.stroke = {
      name: "Толщина провода",
      items: {}
    }

    for (let key in electricLineStrokes) {
      items.stroke.items[`stroke_${key}`] = {name: electricLineStrokes[key].name}
    }

    items.sep3 = "---------";
    items.delete = {name: "Удалить"};

    items.sep4 = "---------";
    items.toFront = {name: "Переместить вперед"};
    items.toBack = {name: "Переместить назад"};


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
        if (key.indexOf('color_') != -1) {
          key = key.replace('color_', '');
          if (electricLineColors.hasOwnProperty(key)) {
            this.setColor(electricLineColors[key].color);

            if (electricLineColors[key].color2) {
              this.setOutlineColor(electricLineColors[key].color2);
              const stroke = this.getStroke();
              if (this.getOutlineStroke() <= 0) {
                this.setStroke(stroke / 3);
                this.setOutlineStroke(stroke * 1.1);
                this.outlineVisible = true;
              }
            } else {
              if (this.getOutlineStroke() > 0) {
                this.setOutlineStroke(0);
                this.setStroke(this.getStroke() * 3);
                this.outlineVisible = false;
              }
            }
          }
        } else if (key.indexOf('stroke_') != -1) {
          key = key.replace('stroke_', '');
          const stroke = electricLineStrokes[key].value;
          if (this.getOutlineStroke() > 0) {
            this.setStroke(stroke / 3);
            this.setOutlineStroke(stroke * 1.1);
          } else {
            this.setStroke(stroke);
          }
        } else {
          switch (key) {
            case "remove": {
              // deep copy of the vertices of the connection for the command stack to avoid side effects
              let originalVertices = this.getVertices().clone(true)
              this.removeSegment(this, segment.index)
              let newVertices = this.getVertices().clone(true)
              this.getCanvas().getCommandStack().execute(new draw2d.command.CommandReplaceVertices(this, originalVertices, newVertices))
            }
              break
            case "split": {
              // deep copy of the vertices of the connection for the command stack to avoid side effects
              let originalVertices = this.getVertices().clone(true)
              this.splitSegment(this, segment.index, x, y)
              let newVertices = this.getVertices().clone(true)
              this.getCanvas().getCommandStack().execute(new draw2d.command.CommandReplaceVertices(this, originalVertices, newVertices))
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
   *
   * split the segment with the given index and insert a new segment.
   *
   * @param conn
   * @param segmentIndex
   */
  splitSegment: function (conn, segmentIndex, x, y) {
    let segmentCount = conn.getVertices().getSize() - 1
    let p1 = conn.getVertex(segmentIndex)
    let p2 = conn.getVertex(segmentIndex + 1)
    let length = 40

    // the selected segment is vertical
    //
    if (p1.x === p2.x) {
      conn._routingMetaData.routedByUserInteraction = true
      // edge case of an ManhattanRouter: One segment. This happens if the source/target on the same x - coordinate
      //
      if (segmentCount === 1) {
        //     + p1
        //     |
        // np1 +-----+ np2
        //           |
        //           |
        // np3 +-----+ np3
        //     |
        //     |
        //     + p2
        //
        let newSegLength = (p1.getDistance(p2) / 4) / 2
        let np1 = new draw2d.geo.Point(p1.x, y - newSegLength)
        let np2 = new draw2d.geo.Point(p2.x + length, y - newSegLength)
        let np3 = new draw2d.geo.Point(p2.x + length, y + newSegLength)
        let np4 = new draw2d.geo.Point(p2.x, y + newSegLength)

        conn.insertVertexAt(segmentIndex + 1, np1)
        conn.insertVertexAt(segmentIndex + 2, np2)
        conn.insertVertexAt(segmentIndex + 3, np3)
        conn.insertVertexAt(segmentIndex + 4, np4)
      }
      else {
        let np1 = new draw2d.geo.Point(0, 0)
        let np2 = new draw2d.geo.Point(0, 0)
        //       p2 +
        //          .
        // np1 +----+ np2
        //     .
        //     .
        //     + p1
        // p1 ist der Startpunkt und darf somit nicht verschoben werden
        //
        if (segmentIndex === 0) {
          np1.y = y
          np1.x = p1.x
          np2.y = y
          np2.x = p2.x + length
          conn.setVertex(segmentIndex + 1, new draw2d.geo.Point(np2.x, p2.y))
        }
          // p2 ist der Schlusspunkt und darf somit nicht veaendert werden
        //
        else if (segmentIndex === segmentCount - 1) {
          np1.y = y
          np1.x = p1.x - length
          np2.y = y
          np2.x = p2.x
          conn.setVertex(segmentIndex, new draw2d.geo.Point(np1.x, p1.y))
        }
        else {
          np1.y = y
          np1.x = p1.x - (length / 2)
          np2.y = y
          np2.x = p2.x + (length / 2)
          conn.setVertex(segmentIndex, new draw2d.geo.Point(np1.x, p1.y))
          conn.setVertex(segmentIndex + 1, new draw2d.geo.Point(np2.x, p2.y))
        }

        conn.insertVertexAt(segmentIndex + 1, np1)
        conn.insertVertexAt(segmentIndex + 2, np2)
      }
    }
      // the selected segment is horizontal
    //
    else if (p1.y == p2.y) {
      conn._routingMetaData.routedByUserInteraction = true
      // edge case of an ManhattanRouter: One segment. This happens if the source/target on the same y - coordinate
      //
      if (segmentCount === 1) {
        //     np2 +---------+ np3
        //         |         |
        // --------+np1   np4+--------
        //
        let newSegLength = (p1.getDistance(p2) / 4) / 2
        let np1 = new draw2d.geo.Point(x - newSegLength, p1.y)
        let np2 = new draw2d.geo.Point(x - newSegLength, p1.y - length)
        let np3 = new draw2d.geo.Point(x + newSegLength, p1.y - length)
        let np4 = new draw2d.geo.Point(x + newSegLength, p1.y)

        conn.insertVertexAt(segmentIndex + 1, np1)
        conn.insertVertexAt(segmentIndex + 2, np2)
        conn.insertVertexAt(segmentIndex + 3, np3)
        conn.insertVertexAt(segmentIndex + 4, np4)
      }
      else {
        //     p1        np1
        //   +.........+
        //             |
        //             |
        //             | np2       p2
        //             +.........+
        let np1 = new draw2d.geo.Point(0, 0)
        let np2 = new draw2d.geo.Point(0, 0)

        // p1 ist der Startpunkt und darf somit nicht verschoben werden
        //
        if (segmentIndex === 0) {
          np1.x = x
          np1.y = p1.y
          np2.x = x
          np2.y = p2.y + length
          conn.setVertex(segmentIndex + 1, new draw2d.geo.Point(p2.x, np2.y))
        }
          // p2 ist der Schlusspunkt und darf somit nicht veaendert werden
        //
        else if (segmentIndex === segmentCount - 1) {
          np1.x = x
          np1.y = p1.y - length
          np2.x = x
          np2.y = p2.y
          conn.setVertex(segmentIndex, new draw2d.geo.Point(p1.x, np1.y))
        }
        else {
          np1.x = x
          np1.y = p1.y - (length / 2)
          np2.x = x
          np2.y = p2.y + (length / 2)
          conn.setVertex(segmentIndex, new draw2d.geo.Point(p1.x, np1.y))
          conn.setVertex(segmentIndex + 1, new draw2d.geo.Point(p2.x, np2.y))
        }
        conn.insertVertexAt(segmentIndex + 1, np1)
        conn.insertVertexAt(segmentIndex + 2, np2)
      }
    }
  },

  /**
   *
   * remove the segment with the given index.
   * You must check if it possible to remove the segment before. The method didn'T do any consistency checks.
   *
   * @param conn
   * @param segmentIndex
   */
  removeSegment: function (conn, segmentIndex) {
    let PADDING = 10

    let segmentCount = conn.getVertices().getSize() - 1

    let fromPt = conn.getStartPoint()
    let fromDir = conn.getSource().getConnectionDirection(conn.getTarget())

    let toPt = conn.getEndPoint()
    let toDir = conn.getTarget().getConnectionDirection(conn.getSource())

    let p0 = conn.getVertex(segmentIndex - 1)
    let p1 = conn.getVertex(segmentIndex)
    let p2 = conn.getVertex(segmentIndex + 1)
    let p3 = conn.getVertex(segmentIndex + 2)

    //                                             p0 .
    // Es wird ein Horizontales Segment               .
    // geloescht. Es muessen somit die Punkte         .
    // p0 und p3 neu gesetzt werden.               p1 +------*-----+ p2
    // Ihre neue X-Koordinate ist somit in der               ^     .
    // Mitte des geloeschten Segmentes                      newX   .
    //                                                             . p3
    //
    if (p1.y === p2.y) {
      let newX = (p1.x + p2.x) / 2
      // Die neue X-Koordinate muss auf jeden Falls zwischen p-1 und p4 liegen
      //
      if (segmentIndex === 1) {
        switch (fromDir) {
          case draw2d.geo.Rectangle.DIRECTION_RIGHT:
            newX = Math.max(newX, fromPt.x + PADDING)
            break
          case draw2d.geo.Rectangle.DIRECTION_LEFT:
            newX = Math.min(newX, fromPt.x - PADDING)
            break
          case draw2d.geo.Rectangle.DIRECTION_UP:
            newX = fromPt.x
            break
          case draw2d.geo.Rectangle.DIRECTION_DOWN:
            newX = fromPt.x
            break
        }
      }

      if (segmentIndex === segmentCount - 2) {
        switch (fromDir) {
          case draw2d.geo.Rectangle.DIRECTION_RIGHT:
            newX = Math.max(newX, toPt.x + PADDING)
            break
          case draw2d.geo.Rectangle.DIRECTION_LEFT:
            newX = Math.min(newX, toPt.x - PADDING)
            break
          case draw2d.geo.Rectangle.DIRECTION_UP:
            newX = toPt.x
            break
          case draw2d.geo.Rectangle.DIRECTION_DOWN:
            newX = toPt.x
            break
        }
      }

      conn.setVertex(segmentIndex - 1, new draw2d.geo.Point(newX, p0.y))
      conn.setVertex(segmentIndex + 2, new draw2d.geo.Point(newX, p3.y))

      conn.removeVertexAt(segmentIndex)
      conn.removeVertexAt(segmentIndex)
      conn._routingMetaData.routedByUserInteraction = true
    }

      //                                                         p2       p3
      // Es wird ein vertikales Segment                        +..........+
      // geloescht. Es muessen somit die Punkte                |
      // p0 und p3 neu gesetzt werden.                         |
      // Ihre neue Y-Koordinate ist somit in der               |
      // Mitte des geloeschten Segmentes              p0       | p1
      //                                              +........+
    //
    else if (p1.x === p2.x) {
      let newY = (p1.y + p2.y) / 2
      // Die neue Y-Koordinate muss auf jeden Falls zwischen p-1 und p4 liegen
      //
      if (segmentIndex === 1) {
        switch (fromDir) {
          case draw2d.geo.Rectangle.DIRECTION_RIGHT:
          case draw2d.geo.Rectangle.DIRECTION_LEFT:
            newY = fromPt.y
            break
          case draw2d.geo.Rectangle.DIRECTION_UP:
          case draw2d.geo.Rectangle.DIRECTION_DOWN:
            debugger // newX is newer read....why did I calculate them?!
            newX = fromPt.x
            break
        }
      }
      if (segmentIndex === segmentCount - 2) {
        switch (toDir) {
          case draw2d.geo.Rectangle.DIRECTION_RIGHT:
          case draw2d.geo.Rectangle.DIRECTION_LEFT:
            newY = toPt.y
            break
          case draw2d.geo.Rectangle.DIRECTION_UP:
          case draw2d.geo.Rectangle.DIRECTION_DOWN:
            debugger // newX is newer read....why did I calculate them?!
            newX = toPt.x
            break
        }
      }

      conn.setVertex(segmentIndex - 1, new draw2d.geo.Point(p0.x, newY))
      conn.setVertex(segmentIndex + 2, new draw2d.geo.Point(p3.x, newY))

      conn.removeVertexAt(segmentIndex)
      conn.removeVertexAt(segmentIndex)
      conn._routingMetaData.routedByUserInteraction = true
    }
  },
});
