
const DefaultDropInterceptorPolicy = draw2d.policy.canvas.DropInterceptorPolicy.extend({

  NAME: 'DefaultDropInterceptorPolicy',

  init: function init(attr, setter, getter) {
    this._super(attr, setter, getter);
  },

  /**
   *
   * Called if the user want connect a port with any kind draw2d.Figure.<br>
   * Return a non <b>null</b> value if the interceptor accept the connect event.<br>
   * <br>
   * It is possible to delegate the drop event to another figure if the policy
   * returns another figure. This is useful if a figure want to accept a port
   * drop event and delegates this drop event to another port.<br>
   *
   *
   * @param {draw2d.Figure} connectInquirer the figure who wants connect
   * @param {draw2d.Figure} connectIntent the potential connect target
   *
   * @returns {draw2d.Figure} the calculated connect intent or <b>null</b> if the interceptor uses the veto right
   */
  delegateTarget: function delegateTarget(connectInquirer, connectIntent) {
    // a composite accept any kind of figures exceptional ports
    //
    if (!(connectInquirer instanceof draw2d.Port) && connectIntent instanceof draw2d.shape.composite.StrongComposite) {
      return connectIntent;
    }

    // Ports accepts only Ports from the same semanticGroup as DropTarget
    //
    if (connectIntent instanceof draw2d.Port && connectInquirer instanceof draw2d.Port) {
      if (connectIntent.getSemanticGroup() !== connectInquirer.getSemanticGroup()) {
        return null;
      }
    }

    // Ports accepts only Ports as DropTarget
    //
    if (!(connectIntent instanceof draw2d.Port) || !(connectInquirer instanceof draw2d.Port)) {
      return null;
    }

    // consider the max possible connections for this port
    //
    if (connectIntent.getConnections().getSize() >= connectIntent.getMaxFanOut()) {
      return null;
    }

    // It is not allowed to connect two output ports
    if (connectInquirer instanceof draw2d.OutputPort && connectIntent instanceof draw2d.OutputPort) {
      return null;
    }

    // It is not allowed to connect two input ports
    if (connectInquirer instanceof draw2d.InputPort && connectIntent instanceof draw2d.InputPort) {
      return null;
    }

    // It is not possible to create a loop back connection at the moment.
    // Reason: no connection router implemented for this case
    if (connectInquirer instanceof draw2d.Port && connectIntent instanceof draw2d.Port) {
      if (connectInquirer.getParent() === connectIntent.getParent()) {
        //return null; //svipsa
      }
    }

    // redirect the dragEnter handling to the hybrid port
    //
    if (connectInquirer instanceof draw2d.Port && connectIntent instanceof draw2d.shape.node.Hub) {
      return connectIntent.getHybridPort(0);
    }

    // return the connectTarget determined by the framework or delegate it to another
    // figure.
    return connectIntent;
  }
});
