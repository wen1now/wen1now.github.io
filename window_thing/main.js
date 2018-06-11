// target elements with the "draggable" class
y = interact('.drag')
y.draggable({
    // keep the element within the area of it's parent
    restrict: {
      endOnly: true
    },

    // call this function on every dragmove event
    onmove:  dragMoveListener,

    onstart: startMoveListener//	,
    //onend:   endMoveListener
});

y.styleCursor(false);

zindexcounter = 0; //so hacky
var t;

function startMoveListener (event) {
	var target = event.target;
	/*``````````Change the top area size thing here``````````*/
	if (event.pageY - target.getBoundingClientRect().top < 30){
		target.heldByTop = true;
	} else {target.heldByTop = false}
}

function totop (target) {
	target.style.zIndex = String(++zindexcounter);
}
function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    //console.log(event.pageY,event.y0,event.clientY0,event,event.interactable.getRect().top);
    if (target.heldByTop){
	    // translate the element
	    target.style.webkitTransform =
	    target.style.transform =
	      'translate(' + x + 'px, ' + y + 'px)';

	    // update the posiion attributes
	    target.setAttribute('data-x', x);
	    target.setAttribute('data-y', y);
	}
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;